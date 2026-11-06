import { useState, useEffect } from "react";
import { api } from "../api";

export default function TrackTicket({ trackIdToSearch, setTrackIdToSearch }) {
  const [ticketIdInput, setTicketIdInput] = useState(trackIdToSearch || "");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!ticketIdInput.trim()) {
      setError("Please enter a Ticket ID (e.g. HD-1234)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTicket(null);
      const data = await api.trackTicket(ticketIdInput.trim());
      setTicket(data);
    } catch (err) {
      setError(err.message || "Ticket not found. Please verify the Ticket ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackIdToSearch) {
      setTicketIdInput(trackIdToSearch);
      handleSearch();
      setTrackIdToSearch(""); // Clear after initial search
    }
  }, [trackIdToSearch]);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div className="page-header">
        <h2>Track Your Support Ticket</h2>
        <p className="page-subtitle">Check real-time complaint status and resolution updates</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Ticket ID (e.g. HD-8287)"
            value={ticketIdInput}
            onChange={(e) => setTicketIdInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: "nowrap" }}>
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {ticket && (
        <div className="card ticket-detail-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>TICKET ID</span>
              <h3 style={{ margin: "2px 0 0 0", color: "#1e3a8a", fontSize: "1.4rem" }}>{ticket.ticket_id}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className={`badge badge-status-${ticket.status.toLowerCase().replace(" ", "-")}`} style={{ fontSize: "0.95rem", padding: "6px 14px" }}>
                ● {ticket.status}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "1.1rem" }}>{ticket.issue_title}</h4>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.5", background: "#f8fafc", padding: "12px", borderRadius: "6px" }}>
              {ticket.description}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.9rem" }}>
            <div>
              <span style={{ color: "#64748b" }}>Reported By:</span> <strong>{ticket.employee_name}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Category:</span> <span className="badge badge-category">{ticket.category}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Priority:</span> <span className={`badge badge-priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Submitted At:</span> <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
