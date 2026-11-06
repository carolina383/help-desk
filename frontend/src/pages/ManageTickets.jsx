import { useState, useEffect } from "react";
import { api } from "../api";

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets from MySQL: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Update status or priority directly in MySQL
  const handleUpdate = async (id, field, value) => {
    try {
      setMessage(null);
      setError(null);
      await api.updateTicket(id, { [field]: value });
      setMessage(`Ticket #${id} updated successfully!`);
      // Update local state without full reload
      setTickets(tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    } catch (err) {
      setError("Update failed: " + err.message);
    }
  };

  // Delete ticket after user confirmation
  const handleDelete = async (id, ticketId) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete Ticket ${ticketId}?`);
    if (!confirmDelete) return;

    try {
      setMessage(null);
      setError(null);
      await api.deleteTicket(id);
      setMessage(`Ticket ${ticketId} deleted successfully from MySQL.`);
      setTickets(tickets.filter((t) => t.id !== id));
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  // Filter and search logic
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.issue_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Manage IT Support Tickets</h2>
          <p className="page-subtitle">Admin portal to monitor, update, and resolve support requests</p>
        </div>
        <button className="btn btn-secondary" onClick={loadTickets} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: "20px", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px" }}>
          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>Search Tickets</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by ID, name, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>Category</label>
            <select className="form-control" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Email">Email</option>
              <option value="Printer">Printer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>Priority</label>
            <select className="form-control" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: "0.8rem" }}>Status</label>
            <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">Loading tickets from MySQL...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state">No tickets match your filters.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Employee</th>
                <th>Issue Title</th>
                <th>Category</th>
                <th>Priority (Editable)</th>
                <th>Status (Editable)</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.ticket_id}</strong></td>
                  <td>{t.employee_name}</td>
                  <td title={t.description} style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.issue_title}
                  </td>
                  <td><span className="badge badge-category">{t.category}</span></td>
                  <td>
                    <select
                      className="table-select"
                      value={t.priority}
                      onChange={(e) => handleUpdate(t.id, "priority", e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={t.status}
                      onChange={(e) => handleUpdate(t.id, "status", e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      onClick={() => handleDelete(t.id, t.ticket_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
