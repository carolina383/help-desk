// Centralized API service using native Fetch API
const API_BASE = "http://127.0.0.1:8000";

export const api = {
  // 1. Fetch dashboard statistics
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },

  // 2. Fetch all tickets
  getTickets: async () => {
    const res = await fetch(`${API_BASE}/tickets`);
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  },

  // 3. Track single ticket by ticket ID (e.g. HD-1234)
  trackTicket: async (ticketId) => {
    const res = await fetch(`${API_BASE}/tickets/track/${ticketId}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Ticket not found");
    }
    return res.json();
  },

  // 4. Create a new ticket
  createTicket: async (ticketData) => {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    if (!res.ok) throw new Error("Failed to submit ticket");
    return res.json();
  },

  // 5. Update ticket status or priority
  updateTicket: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error("Failed to update ticket");
    return res.json();
  },

  // 6. Delete a ticket
  deleteTicket: async (id) => {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete ticket");
    return res.json();
  },
};
