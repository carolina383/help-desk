# HelpDesk Project – Mentor Presentation & Live Demo Script

---

## 1. Two-Minute Project Introduction (Elevator Pitch)

> *"Good morning, Sir/Ma'am.*
>
> *Today I am presenting my full-stack software application: **HelpDesk – IT Support Ticket Management System**.*
>
> *In any organization, employees face daily IT challenges with hardware, Wi-Fi, software licenses, or printers. When these issues are reported informally over phone calls or emails, complaints get misplaced, employees have zero visibility into their status, and IT administrators have no centralized way to prioritize and track requests.*
>
> *To solve this, I designed and built a 3-tier web application using **React and Vite** for the frontend, **Python with FastAPI** for the backend REST APIs, and **MySQL** with **SQLAlchemy** for persistent relational storage.*
>
> *The application allows employees to log tickets with auto-generated tracking codes like `HD-9926`, check status updates in real time, and gives administrators a live dashboard with interactive metrics and an admin table with live search, filters, inline status updating, and deletion confirmation.*
>
> *The entire application was built using minimal, clean code without unnecessary external libraries, verified with unit and integration tests, and proven to retain 100% of data across complete server restarts."*

---

## 2. Five-Minute Live Project Demonstration Script

### Step 1: Show the IT Dashboard (1 minute)
- **What to do:** Open `http://localhost:5173` on the Dashboard tab.
- **What to say:** 
  > *"Here is the IT Dashboard. These four statistic cards — Total Tickets, Open Tickets, In Progress, and Resolved — are not hardcoded numbers. They are dynamically aggregated from our MySQL database using our `/stats` FastAPI endpoint. Below the cards, you can see the latest 5 submitted tickets."*

### Step 2: Submit a Ticket as an Employee (1 minute)
- **What to do:** Click on **"📝 Submit Ticket"**. Enter:
  - Name: `Divya Sharma`
  - Issue Title: `Dual Monitor not detecting HDMI input`
  - Category: `Hardware`
  - Priority: `High`
  - Description: `External Dell monitor displays 'No Signal' after system reboot.`
- Click **"Submit Support Ticket"**.
- **What to say:** 
  > *"When I click submit, React uses the Fetch API to send a JSON POST request to FastAPI. Pydantic validates the input, FastAPI generates a unique ticket ID — here it generated `HD-XXXX` — and SQLAlchemy inserts the row into MySQL. The green banner gives the employee their unique ticket ID with a direct button to track it."*

### Step 3: Track the Ticket (1 minute)
- **What to do:** Click **"Track This Ticket Now"** or navigate to **"🔍 Track Ticket"**.
- Click **"Track Status"**.
- **What to say:** 
  > *"Here on the tracking page, any employee can enter their ticket ID to see real-time updates. It displays the issue details, reporting timestamp, and color-coded badges for Category, Priority, and Status. Notice the status is currently 'Open'."*

### Step 4: Admin Management & Inline Status Update (1.5 minutes)
- **What to do:** Click on **"⚙️ Manage Tickets"**.
  1. Show live search by typing `Divya`.
  2. Show category filter selecting `Hardware`.
  3. Show inline status update: change Divya's status from **Open** to **In Progress**, then **Resolved**.
  4. Navigate back to **"📊 Dashboard"**.
- **What to say:** 
  > *"As an administrator, I can search tickets across all fields or filter by Category, Priority, and Status. I can update any ticket's status directly from this table without navigating away. I just changed Divya's ticket to 'Resolved'. If we switch back to the Dashboard, notice the 'Resolved' count has incremented by 1 instantly, re-queried directly from MySQL."*

### Step 5: Deletion & Error Handling (30 seconds)
- **What to do:** In Manage Tickets, click **Delete** on a test ticket. Show the native browser confirmation prompt, click OK. In Track Ticket, enter `HD-0000` to show the clean 404 error alert.
- **What to say:** 
  > *"We built safe deletion with confirmation prompts to prevent accidental data loss. We also handle negative cases gracefully: searching for an invalid ID returns a clean 404 alert rather than a blank screen or crash."*

---

## 3. Tough Questions Your Mentor Might Ask (And Winning Answers)

### Question 1: "Why did you use FastAPI instead of Django or Flask?"
> **Your Answer:** *"Django is a heavy, monolithic framework that includes many components we didn't need for a clean REST API. Flask, while lightweight, lacks built-in data validation and asynchronous performance. FastAPI provides the best of both worlds: it is fast, has automatic Pydantic request validation, generates interactive Swagger docs automatically, and uses standard Python type hints with minimal code."*

### Question 2: "What is the difference between your Pydantic schemas and SQLAlchemy models?"
> **Your Answer:** *"They serve two completely different layers. SQLAlchemy models in `models.py` define the database structure — how tables, columns, and constraints exist inside MySQL. Pydantic schemas in `schemas.py` define the network structure — how JSON requests and responses are validated and formatted over HTTP."*

### Question 3: "Why did you use plain CSS instead of Bootstrap or Tailwind?"
> **Your Answer:** *"Since this is my first full-stack application, I wanted to understand how layout, flexbox, CSS grid, and responsive styling work fundamentally rather than relying on black-box utility classes. Plain CSS kept our project lightweight and zero-dependency."*

### Question 4: "What happens if someone enters an SQL Injection in the ticket description?"
> **Your Answer:** *"Our application is completely protected against SQL Injection because we use SQLAlchemy ORM. SQLAlchemy uses parameterized queries where user input is treated strictly as data values, never as executable SQL code."*

### Question 5: "What was the most challenging technical bug you encountered during this project, and how did you resolve it?"
> **Your Answer:** *"The most interesting issue was database connection parsing. Our MySQL root password contains the `@` symbol (`caro@1318`). When passed inside a standard connection URL string, SQLAlchemy parsed `@1318` as part of the hostname, causing a DNS resolution failure. I solved it professionally by using SQLAlchemy's `URL.create()` helper, which automatically and securely escapes special characters in database credentials."*
