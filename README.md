# HelpDesk – IT Support Ticket Management System

A beginner-friendly, minimal-code full-stack web application built using **React**, **FastAPI**, and **MySQL**.

---

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Plain CSS, Fetch API
- **Backend:** Python 3.13, FastAPI, Pydantic, SQLAlchemy ORM, Uvicorn
- **Database:** MySQL Server 8.0 with PyMySQL driver

---

## 🚀 How to Run the Application

### 1. Start the FastAPI Backend
Open a PowerShell terminal in the project directory:
```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
- **Backend API URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

---

### 2. Start the React Frontend
Open a **second** PowerShell terminal in the project directory:
```powershell
cd frontend
npm run dev
```
- **Frontend Web Application URL:** `http://localhost:5173`

Open your web browser and navigate to `http://localhost:5173` to explore the HelpDesk system!

---

## 📁 Project Architecture & Structure

```
helpdesk-project/
│
├── backend/                  # Python FastAPI Backend (~180 lines total)
│   ├── database.py           # MySQL connection pool & SQLAlchemy session
│   ├── models.py             # SQLAlchemy ORM Ticket table mapping
│   ├── schemas.py            # Pydantic validation schemas
│   ├── main.py               # REST endpoints, CORS, & ticket ID generator
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # MySQL credentials (secure)
│   └── .env.example          # Template for credentials
│
├── frontend/                 # React Frontend (~280 lines React + ~270 lines CSS)
│   ├── src/
│   │   ├── api.js            # Centralized native Fetch API service
│   │   ├── App.jsx           # Sidebar navigation & view switcher
│   │   ├── index.css         # Plain corporate Navy Blue theme
│   │   ├── main.jsx          # React DOM mounting
│   │   └── pages/
│   │       ├── Dashboard.jsx     # Live metric cards & recent tickets
│   │       ├── SubmitTicket.jsx  # Employee submission form & ID generator
│   │       ├── TrackTicket.jsx   # Ticket ID search & badge details
│   │       └── ManageTickets.jsx # Admin management table with filters & delete
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
│
├── docs/                     # Project Documentation
│   ├── PROJECT_REPORT.md     # Full 9-chapter technical project report
│   ├── VIVA_PREPARATION_GUIDE.md # 35 beginner-friendly Q&As
│   └── MENTOR_PRESENTATION_SCRIPT.md # Pitch, demo walkthrough, and Q&A
│
└── README.md
```

---

## 🧪 Documentation & Presentation References
- Full Technical Report: [`docs/PROJECT_REPORT.md`](file:///c:/Users/Sindhiya/OneDrive/Desktop/placement%20tracker/helpdesk-project/docs/PROJECT_REPORT.md)
- Viva & Interview Questions: [`docs/VIVA_PREPARATION_GUIDE.md`](file:///c:/Users/Sindhiya/OneDrive/Desktop/placement%20tracker/helpdesk-project/docs/VIVA_PREPARATION_GUIDE.md)
- Mentor Presentation Script: [`docs/MENTOR_PRESENTATION_SCRIPT.md`](file:///c:/Users/Sindhiya/OneDrive/Desktop/placement%20tracker/helpdesk-project/docs/MENTOR_PRESENTATION_SCRIPT.md)
