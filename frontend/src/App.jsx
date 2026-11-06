import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import SubmitTicket from "./pages/SubmitTicket";
import TrackTicket from "./pages/TrackTicket";
import ManageTickets from "./pages/ManageTickets";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [trackIdToSearch, setTrackIdToSearch] = useState("");

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">🛠️</div>
          <div>
            <h1 className="brand-title">HelpDesk</h1>
            <span className="brand-subtitle">IT Ticket System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activePage === "submit" ? "active" : ""}`}
            onClick={() => setActivePage("submit")}
          >
            📝 Submit Ticket
          </button>
          <button
            className={`nav-item ${activePage === "track" ? "active" : ""}`}
            onClick={() => setActivePage("track")}
          >
            🔍 Track Ticket
          </button>
          <button
            className={`nav-item ${activePage === "manage" ? "active" : ""}`}
            onClick={() => setActivePage("manage")}
          >
            ⚙️ Manage Tickets
          </button>
        </nav>

        <div className="sidebar-footer">
          <div>Connected to: <strong>MySQL 8.0</strong></div>
          <div>Backend: <strong>FastAPI</strong></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === "dashboard" && <Dashboard setActivePage={setActivePage} />}
        {activePage === "submit" && (
          <SubmitTicket setActivePage={setActivePage} setTrackIdToSearch={setTrackIdToSearch} />
        )}
        {activePage === "track" && (
          <TrackTicket trackIdToSearch={trackIdToSearch} setTrackIdToSearch={setTrackIdToSearch} />
        )}
        {activePage === "manage" && <ManageTickets />}
      </main>
    </div>
  );
}
