import { useState } from "react";
import { api } from "../api";

export default function SubmitTicket({ setActivePage, setTrackIdToSearch }) {
  const [formData, setFormData] = useState({
    employee_name: "",
    issue_title: "",
    description: "",
    category: "Hardware",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic form validation
    if (!formData.employee_name.trim() || !formData.issue_title.trim() || !formData.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const newTicket = await api.createTicket(formData);
      setCreatedTicket(newTicket);
      // Reset form
      setFormData({
        employee_name: "",
        issue_title: "",
        description: "",
        category: "Hardware",
        priority: "Medium",
      });
    } catch (err) {
      setError(err.message || "Could not submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="page-header">
        <h2>Submit Support Ticket</h2>
        <p className="page-subtitle">Report a technical problem to the IT HelpDesk team</p>
      </div>

      {createdTicket && (
        <div className="alert alert-success">
          <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "6px" }}>
            🎉 Ticket Submitted Successfully!
          </div>
          <div>Your Unique Ticket ID is: <strong style={{ fontSize: "1.2rem", color: "#1e3a8a" }}>{createdTicket.ticket_id}</strong></div>
          <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>
            Please save this Ticket ID to track your complaint status.
          </div>
          <div style={{ marginTop: "12px" }}>
            <button
              className="btn btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.9rem" }}
              onClick={() => {
                setTrackIdToSearch(createdTicket.ticket_id);
                setActivePage("track");
              }}
            >
              Track This Ticket Now &rarr;
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee Name *</label>
            <input
              type="text"
              name="employee_name"
              className="form-control"
              placeholder="e.g. Arun Kumar"
              value={formData.employee_name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input
              type="text"
              name="issue_title"
              className="form-control"
              placeholder="Brief summary (e.g. Laptop display flickering)"
              value={formData.issue_title}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Email">Email</option>
                <option value="Printer">Printer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Issue Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe the technical issue in detail..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Submitting to HelpDesk..." : "Submit Support Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
