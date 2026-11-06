import { useState, useEffect } from "react";
import { api } from "../api";

export default function Dashboard({ setActivePage }) {
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [statsData, ticketsData] = await Promise.all([
          api.getStats(),
          api.getTickets(),
        ]);
        setStats(statsData);
        setRecentTickets(ticketsData.slice(0, 5)); // show latest 5
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard statistics...</div>;
  if (error) return <div className="alert alert-error">Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>IT Support Dashboard</h2>
        <p className="page-subtitle">Real-time statistics retrieved directly from MySQL</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card-total">
          <div className="stat-label">Total Tickets</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-desc">All time submitted</div>
        </div>

        <div className="stat-card card-open">
          <div className="stat-label">Open Tickets</div>
          <div className="stat-value">{stats.open}</div>
          <div className="stat-desc">Awaiting technician action</div>
        </div>

        <div className="stat-card card-progress">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{stats.in_progress}</div>
          <div className="stat-desc">Currently being resolved</div>
        </div>

        <div className="stat-card card-resolved">
          <div className="stat-label">Resolved Tickets</div>
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-desc">Successfully fixed</div>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3>Recent Support Tickets</h3>
          <button className="btn btn-secondary" onClick={() => setActivePage("manage")}>
            View All Tickets &rarr;
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="empty-state">No tickets found in the database.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Employee</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.ticket_id}</strong></td>
                  <td>{t.employee_name}</td>
                  <td>{t.issue_title}</td>
                  <td><span className="badge badge-category">{t.category}</span></td>
                  <td><span className={`badge badge-priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                  <td><span className={`badge badge-status-${t.status.toLowerCase().replace(" ", "-")}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
