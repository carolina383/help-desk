# HelpDesk Project – Beginner Viva & Interview Preparation Guide
## 35 Essential Questions & Confident Answers

---

### Section 1: Python Questions

#### Q1: What is Python, and why is it suitable for backend development?
> **Answer:** Python is a high-level, interpreted programming language known for its clear, readable syntax. It is ideal for backend development because of its rich ecosystem of modern web frameworks (like FastAPI), powerful database libraries (like SQLAlchemy), and rapid development speed.

#### Q2: What is a Python function?
> **Answer:** A function is a reusable block of code that performs a specific task. In our backend, `generate_ticket_id(db)` and `get_db()` are examples of functions that accept parameters, execute logic, and return values.

#### Q3: What is a Python module and an import?
> **Answer:** A module is a Python file (`.py`) containing code, classes, or functions. An `import` statement allows one Python file to use code written in another module. For example, `from models import Ticket` in `main.py` brings in the database table definition.

#### Q4: What is a Python class and object?
> **Answer:** A class is a blueprint or template, while an object is a specific instance created from that blueprint. In our code, `class Ticket(Base)` is the blueprint, and every individual support ticket created in MySQL is an object of that class.

#### Q5: What is an Exception in Python, and how is it handled?
> **Answer:** An exception is an error that occurs during program execution. We handle exceptions using `try...except...finally` blocks. For example, in `database.py`, `get_db()` uses `try...finally` to ensure the database session is closed even if an error occurs.

#### Q6: What is a virtual environment in Python?
> **Answer:** A virtual environment is an isolated directory containing its own Python interpreter and installed packages. It prevents version conflicts between different projects on the same computer.

---

### Section 2: React Questions

#### Q7: What is React?
> **Answer:** React is an open-source JavaScript library developed by Meta for building dynamic user interfaces out of reusable components.

#### Q8: What is a Component in React?
> **Answer:** A component is an independent, reusable JavaScript function that returns UI elements using JSX. For example, `SubmitTicket.jsx` and `Dashboard.jsx` are React components.

#### Q9: What is JSX?
> **Answer:** JSX stands for JavaScript XML. It is a syntax extension that lets us write HTML-like markup directly inside our JavaScript code. Vite compiles JSX into standard JavaScript for the browser.

#### Q10: What are Props in React?
> **Answer:** Props (short for properties) are read-only inputs passed from a parent component to a child component. In `App.jsx`, we pass `setActivePage` as a prop to `Dashboard` and `SubmitTicket` so they can trigger navigation.

#### Q11: What is State in React?
> **Answer:** State is internal data managed within a component that can change over time. When state changes, React automatically re-renders the component to display the new data.

#### Q12: What is the `useState` hook?
> **Answer:** `useState` is a built-in React hook that declares a state variable and a setter function. For example, `const [activePage, setActivePage] = useState("dashboard")` stores the current page and lets us switch views.

#### Q13: What is the `useEffect` hook?
> **Answer:** `useEffect` is a React hook used to perform side effects, such as fetching data from an API when a component first loads. In `Dashboard.jsx`, we use `useEffect` to fetch metrics from `/stats` on page load.

#### Q14: What is Conditional Rendering in React?
> **Answer:** Conditional rendering means displaying different UI components based on conditions. For example, `{activePage === "track" && <TrackTicket />}` displays the tracking page only when `activePage` equals `"track"`.

#### Q15: What is the Fetch API?
> **Answer:** The Fetch API is the browser's built-in JavaScript method for making asynchronous HTTP network requests (`GET`, `POST`, `PUT`, `DELETE`) without requiring external libraries like Axios.

---

### Section 3: FastAPI Questions

#### Q16: What is FastAPI?
> **Answer:** FastAPI is a modern, high-performance web framework for building APIs with Python based on standard Python type hints.

#### Q17: What is an API and an Endpoint?
> **Answer:** An API (Application Programming Interface) allows two software systems to communicate. An endpoint is a specific URL location on the server (like `http://127.0.0.1:8000/tickets`) where clients send requests to perform specific actions.

#### Q18: What is JSON?
> **Answer:** JSON (JavaScript Object Notation) is a lightweight, human-readable data format used to transmit structured data between the frontend and backend over HTTP.

#### Q19: What is Pydantic?
> **Answer:** Pydantic is a data validation library used by FastAPI. It automatically inspects incoming JSON payloads against defined types (e.g. `TicketCreate`) and returns clean 422 errors if required fields are missing or wrong.

#### Q20: What is Uvicorn?
> **Answer:** Uvicorn is an ultra-fast ASGI (Asynchronous Server Gateway Interface) web server implementation for Python that runs our FastAPI application.

#### Q21: What are the main HTTP methods used in our application?
> **Answer:**
> - `POST`: Create a new ticket (`/tickets`).
> - `GET`: Read tickets or stats (`/tickets`, `/tickets/{id}`, `/stats`).
> - `PUT`: Update existing ticket priority or status (`/tickets/{id}`).
> - `DELETE`: Remove a ticket from the database (`/tickets/{id}`).

#### Q22: What is CORS, and why is it needed?
> **Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism. Since our React frontend runs on port 5173 and FastAPI runs on port 8000, the browser blocks requests between them unless FastAPI explicitly permits it via `CORSMiddleware`.

#### Q23: What is Swagger UI?
> **Answer:** Swagger UI is an interactive, auto-generated web documentation interface provided by FastAPI at `/docs`. It allows developers to test all API endpoints directly in the browser without writing frontend code.

---

### Section 4: MySQL Questions

#### Q24: What is MySQL?
> **Answer:** MySQL is an open-source relational database management system (RDBMS) that stores data permanently in structured tables composed of rows and columns.

#### Q25: What is a Table, Row, and Column?
> **Answer:** A table is a collection of related data (like our `tickets` table). A column defines a specific attribute (e.g. `employee_name`), and a row represents a single complete ticket record.

#### Q26: What is a Primary Key?
> **Answer:** A primary key is a column (or combination of columns) that uniquely identifies each row in a table. In our `tickets` table, `id INT AUTO_INCREMENT` is the primary key.

#### Q27: What is a UNIQUE constraint?
> **Answer:** A UNIQUE constraint ensures all values in a column are distinct. We applied a UNIQUE constraint to `ticket_id` so that no two tickets can ever share the same code (e.g. `HD-9926`).

#### Q28: What is CRUD?
> **Answer:** CRUD stands for Create, Read, Update, and Delete — the four fundamental data operations supported by any persistent storage application.

#### Q29: What is an ORM and SQLAlchemy?
> **Answer:** An ORM (Object-Relational Mapper) translates between relational database tables and object-oriented programming code. SQLAlchemy is the Python ORM that allows us to query and manipulate MySQL tables using Python classes (`Ticket`) instead of raw SQL strings.

#### Q30: What is Database Persistence?
> **Answer:** Database persistence means data is saved permanently to disk and survives process terminations, server crashes, and machine reboots. We verified this in Phase 7 by shutting down the server and confirming all tickets remained intact.

---

### Section 5: Overall Project Questions

#### Q31: How would you summarize your HelpDesk application in 2 sentences?
> **Answer:** "Our HelpDesk application is a full-stack IT issue tracking system built with React, FastAPI, and MySQL. It empowers employees to log and track technical problems with auto-generated ticket IDs, while giving IT administrators a live dashboard and management table to resolve issues efficiently."

#### Q32: Why did you choose React for the frontend?
> **Answer:** React's component-based architecture makes it easy to maintain modular code, and its reactive state management allows instant UI updates (like live filtering and inline status changes) without full page reloads.

#### Q33: Why did you choose FastAPI over Flask or Django?
> **Answer:** FastAPI is significantly faster than Flask, includes automatic Pydantic data validation, generates interactive Swagger documentation automatically, and has built-in asynchronous support with minimal boilerplate code.

#### Q34: What happens under the hood when an employee submits a ticket?
> **Answer:** 
> 1. React gathers form data and sends a JSON `POST` request to `/tickets`.
> 2. FastAPI receives the request and Pydantic validates the fields.
> 3. FastAPI generates a unique `HD-XXXX` ID.
> 4. SQLAlchemy executes an `INSERT` statement into MySQL.
> 5. MySQL saves the row permanently.
> 6. FastAPI sends back HTTP 201 with the created ticket JSON.
> 7. React displays a confirmation banner with the new ticket ID.

#### Q35: How did you handle special characters in the database password?
> **Answer:** Because our MySQL root password contains the `@` symbol, standard URL string formatting failed with a hostname resolution error. We resolved this professionally using SQLAlchemy's `URL.create()` helper, which automatically escapes all special characters safely.
