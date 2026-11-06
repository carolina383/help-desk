# HelpDesk – IT Support Ticket Management System
## Comprehensive Technical Project Report

**Author:** B.E. Computer and Communication Engineering Student  
**Technologies:** React, Vite, Python, FastAPI, SQLAlchemy, MySQL, Uvicorn  
**Project Repository:** `helpdesk-project`  

---

## Chapter 1 – Introduction

### 1.1 Project Title
**HelpDesk – Centralized IT Support Ticket Management System**

### 1.2 Abstract
In enterprise environments, technical support issues regarding hardware, software, networking, email, and peripherals are routinely communicated via unorganized channels such as phone calls, personal chats, and emails. This leads to lost requests, delayed resolutions, lack of issue prioritization, and zero accountability. This project presents a full-stack, web-based HelpDesk system engineered using **React** for an intuitive user interface, **FastAPI (Python)** for a high-performance RESTful API backend, and **MySQL** for durable relational data persistence. The solution provides employee ticket submission with auto-generated unique tracking IDs, real-time ticket tracking, an IT administrator management table with multi-criteria filtering, and live dashboard metrics computed directly from database records.

### 1.3 Problem Statement
Without a centralized tracking system:
- Complaints are frequently misplaced or forgotten.
- Employees have no transparency into ticket resolution progress.
- IT administrators lack centralized visibility into pending, active, and resolved issues.
- Support teams struggle to prioritize urgent hardware failures over routine software inquiries.
- Organizations have no historical data to identify recurring IT equipment failures.

### 1.4 Existing System vs. Proposed System
| Aspect | Existing System | Proposed HelpDesk System |
|---|---|---|
| **Logging Channel** | Phone calls, emails, verbal requests | Unified web submission form |
| **Tracking** | Manual spreadsheets or memory | Unique public ticket ID (`HD-XXXX`) |
| **Status Transparency** | Zero visibility for employees | Real-time tracking portal with status badges |
| **Administration** | Scattered notes | Centralized admin table with inline status/priority editing |
| **Metrics** | Hardcoded or calculated manually | Live MySQL query aggregation (`/stats`) |
| **Data Durability** | Prone to human error and data loss | Relational MySQL storage with transaction safety |

### 1.5 Objectives
1. Provide a single-portal interface for employees to submit technical grievances.
2. Automatically assign unique, human-readable ticket identifiers (`HD-XXXX`).
3. Allow employees to track resolution progress in real time.
4. Equip IT administrators with search, category/priority/status filters, and inline status updates.
5. Aggregate live statistics directly from MySQL database records.
6. Guarantee complete database persistence across server restarts with zero data loss.

### 1.6 Hardware and Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux
- **Processor:** Intel Core i3 or equivalent (minimum)
- **RAM:** 4 GB minimum (8 GB recommended)
- **Storage:** 500 MB free space
- **Software Stack:**
  - Python 3.13+
  - Node.js v22+ & npm 10+
  - MySQL Server 8.0+
  - Modern Web Browser (Chrome, Edge, Firefox)

---

## Chapter 2 – System Architecture

### 2.1 Overall System Architecture
The application implements a decoupled, 3-tier client-server architecture:

```
[ Tier 1: Client Tier ]         [ Tier 2: Application Tier ]       [ Tier 3: Database Tier ]
 ┌──────────────────────┐        ┌──────────────────────────┐       ┌──────────────────────┐
 │    React Frontend    │        │     FastAPI Backend      │       │     MySQL Server     │
 │      (Port 5173)     │ ◄────► │       (Port 8000)        │ ◄───► │     (Port 3306)      │
 │  Vite + Plain CSS    │  JSON  │  Pydantic + SQLAlchemy   │  TCP  │     helpdesk_db      │
 └──────────────────────┘  HTTP  └──────────────────────────┘  SQL  └──────────────────────┘
```

### 2.2 Client-Backend Communication (React to FastAPI)
- React communicates with FastAPI asynchronously over HTTP using the native browser **Fetch API**.
- Data is transmitted using JSON format (`application/json`).
- Cross-Origin Resource Sharing (**CORS**) is enabled on FastAPI via `CORSMiddleware` to allow requests originating from `http://localhost:5173`.

### 2.3 Backend-Database Communication (FastAPI to MySQL)
- FastAPI connects to MySQL over port 3306 using **SQLAlchemy ORM** backed by the **PyMySQL** database driver.
- The connection string is safely constructed using SQLAlchemy's `URL.create()`, avoiding parsing errors caused by special characters (such as `@`) in database passwords.
- Every API endpoint utilizes the `get_db()` dependency generator, which instantiates a dedicated database session for the request and closes it immediately upon completion in a `finally` block to prevent connection leakage.

---

## Chapter 3 – React Frontend Development

### 3.1 Frontend Folder Structure
```
frontend/src/
├── api.js                # Centralized Fetch API communication module
├── App.jsx               # Application root, sidebar navigation, view switcher
├── index.css             # Plain corporate CSS styling (Navy #0f172a / Blue #1d4ed8)
├── main.jsx              # React DOM mounting entry point
└── pages/
    ├── Dashboard.jsx     # Live metric cards & recent tickets table
    ├── SubmitTicket.jsx  # Employee ticket submission form with validation
    ├── TrackTicket.jsx   # Ticket tracking view by ID with colored badges
    └── ManageTickets.jsx # Admin management table with search, filters & inline editing
```

### 3.2 Component Details
1. **`App.jsx`**: Manages the top-level `activePage` state (`dashboard`, `submit`, `track`, `manage`) and passes navigation callback functions between views.
2. **`Dashboard.jsx`**: Invokes `api.getStats()` and `api.getTickets()` on initial mount via `useEffect()`. Displays 4 stat cards (Total, Open, In Progress, Resolved) and the 5 most recent tickets.
3. **`SubmitTicket.jsx`**: Maintains form state using `useState`. Performs client-side field validation and posts data to `/tickets`. On success, displays a green alert box showcasing the newly minted `ticket_id` with a quick link to track it.
4. **`TrackTicket.jsx`**: Provides a single-input search field. Queries `/tickets/track/{ticket_id}`. On success, displays a card containing employee name, issue title, full description, category badge, priority badge, and status badge. On 404, displays an error alert.
5. **`ManageTickets.jsx`**: Features a search bar and 3 filter dropdowns (Category, Priority, Status). Implements inline dropdowns on each table row allowing admins to update status (`Open` → `In Progress` → `Resolved`) or priority directly without leaving the table. Prompts the user with `window.confirm()` before calling the delete endpoint.

---

## Chapter 4 – Python and FastAPI Backend Development

### 4.1 Backend Architecture
The backend is maintained in under 180 total lines of code across 4 specialized files:
- **`database.py`**: Reads credentials from `.env` via `python-dotenv`. Configures SQLAlchemy `engine` using `URL.create(drivername="mysql+pymysql", ...)` and defines the session factory `SessionLocal` and dependency `get_db()`.
- **`models.py`**: Defines the `Ticket(Base)` class with mapped columns: `id`, `ticket_id`, `employee_name`, `issue_title`, `description`, `category`, `priority`, `status`, `created_at`, `updated_at`.
- **`schemas.py`**: Defines Pydantic validation models: `TicketCreate`, `TicketUpdate`, `TicketResponse`, and `StatsResponse`.
- **`main.py`**: Instantiates FastAPI, enables CORS, provides the ticket ID generator, and implements all 7 REST endpoints.

### 4.2 REST Endpoints Reference
| HTTP Method | Route | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API Healthcheck | `200 OK` |
| `POST` | `/tickets` | Create ticket (auto-assigns `HD-XXXX`) | `201 Created` |
| `GET` | `/tickets` | Retrieve all tickets (ordered newest first) | `200 OK` |
| `GET` | `/tickets/{id}` | Retrieve ticket by internal integer ID | `200 OK` / `404 Not Found` |
| `GET` | `/tickets/track/{ticket_id}` | Retrieve ticket by public ID | `200 OK` / `404 Not Found` |
| `PUT` | `/tickets/{id}` | Update status and/or priority | `200 OK` / `404 Not Found` |
| `DELETE` | `/tickets/{id}` | Permanently delete ticket from MySQL | `200 OK` / `404 Not Found` |
| `GET` | `/stats` | Live MySQL count metrics | `200 OK` |

---

## Chapter 5 – MySQL Database Development

### 5.1 Database Schema
- **Database:** `helpdesk_db`
- **Table:** `tickets`

```sql
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL UNIQUE,
    employee_name VARCHAR(100) NOT NULL,
    issue_title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Open',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.2 Key Column Explanations
- **`id` (INT, PRIMARY KEY, AUTO_INCREMENT):** Internal, non-business identifier used for ultra-fast index joins and foreign key references.
- **`ticket_id` (VARCHAR(20), UNIQUE):** Human-facing identifier (e.g. `HD-9926`). The `UNIQUE` constraint guarantees no two tickets ever share an ID.
- **`description` (TEXT):** Allows detailed descriptions of technical issues without artificial length restrictions.
- **`status` (VARCHAR(20), DEFAULT 'Open'):** Automatically flags any newly submitted ticket as 'Open'.
- **`created_at` / `updated_at` (DATETIME):** Managed automatically by MySQL, ensuring reliable audit trails.

---

## Chapter 6 – Feature-by-Feature Implementation

### 1. Submit Ticket Flow
1. User enters data in `SubmitTicket.jsx`.
2. Form submits JSON payload to `POST /tickets`.
3. Pydantic validates required string inputs.
4. FastAPI invokes `generate_ticket_id()`, ensuring a unique ID like `HD-9926`.
5. SQLAlchemy performs `db.add(new_ticket)` and `db.commit()`.
6. MySQL saves row to `tickets` table.
7. Backend returns HTTP 201 with created object.
8. React renders success confirmation with clickable tracking link.

### 2. Track Ticket Flow
1. User enters `HD-9926` in `TrackTicket.jsx`.
2. React dispatches `GET /tickets/track/HD-9926`.
3. FastAPI executes `db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()`.
4. If found, returns HTTP 200 with ticket data; if missing, raises HTTP 404.
5. React renders detailed status card with color-coded badges.

### 3. Dashboard Statistics Flow
1. User navigates to Dashboard.
2. React dispatches `GET /stats`.
3. FastAPI executes aggregate queries:
   - `SELECT COUNT(id) FROM tickets`
   - `SELECT COUNT(id) FROM tickets WHERE status = 'Open'`
   - `SELECT COUNT(id) FROM tickets WHERE status = 'In Progress'`
   - `SELECT COUNT(id) FROM tickets WHERE status = 'Resolved'`
4. Backend returns typed `StatsResponse`.
5. React displays 4 metric cards matching database reality.

### 4. Manage Tickets & Inline Updates
1. Admin loads `ManageTickets.jsx`.
2. Table lists tickets with live text search and dropdown filters.
3. Admin selects "Resolved" from status dropdown.
4. React dispatches `PUT /tickets/{id}` with `{"status": "Resolved"}`.
5. FastAPI executes `db.commit()` and returns updated ticket.
6. React state updates locally, reflecting the new green badge immediately.

### 5. Ticket Deletion Flow
1. Admin clicks "Delete" on a row.
2. Browser displays confirmation modal: *"Are you sure you want to permanently delete Ticket HD-XXXX?"*
3. On confirmation, React dispatches `DELETE /tickets/{id}`.
4. FastAPI executes `db.delete(ticket)` and `db.commit()`.
5. Row is erased from MySQL. React removes row from table.

---

## Chapter 7 – Testing and Verification

### 7.1 Test Summary
All 10 API unit tests and 7 End-to-End integration tests passed with a **100% success rate**.

| Test Type | Test Scenarios | Result |
|---|---|---|
| **API Endpoints** | Ticket creation, retrieval, track by ID, update, delete, stats calculation | ✅ PASSED (10/10) |
| **Negative Tests** | Tracking non-existent `HD-0000` (404), submitting empty form (422) | ✅ PASSED (2/2) |
| **Persistence Test** | Killing server process, restarting fresh instance, querying tickets | ✅ PASSED (100% data retention) |
| **Frontend Build** | Vite compilation (`npm run build`) | ✅ PASSED (0 errors, 457ms) |

---

## Chapter 8 – Limitations and Future Scope

### 8.1 Current Limitations
- Single administrative view without role-based access control (RBAC).
- Tickets do not yet include file/screenshot attachments.
- Status updates are visible on the tracking page but do not trigger automated email alerts.

### 8.2 Proposed Future Enhancements
1. **Authentication & Authorization:** JWT-based login for employees and role-based access for IT support staff.
2. **File Attachments:** AWS S3 or local disk storage for attaching screenshot logs and crash reports.
3. **Email Notifications:** Automated alerts via SMTP (e.g. SendGrid) when a ticket is opened or resolved.
4. **Technician Assignment:** Assigning individual tickets to specific IT support engineers.
5. **Comments & Discussion Thread:** Real-time chat on tickets between the reporting employee and assigned technician.

---

## Chapter 9 – Conclusion

The HelpDesk IT Support Ticket Management System demonstrates a modern, robust, and production-grade software engineering architecture. By pairing **FastAPI** with **React** and **MySQL**, the application achieves sub-second response times, complete transactional safety, and an intuitive user experience. 

Through this project, I gained practical full-stack expertise in:
- Structuring decoupled REST APIs with FastAPI and Pydantic.
- Managing relational database schemas, transactions, and connection pools with SQLAlchemy and MySQL.
- Building reactive, state-driven interfaces using React and the native Fetch API.
- Enforcing database persistence, error handling, and clean code principles.
