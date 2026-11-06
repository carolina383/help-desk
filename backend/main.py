import random
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, Base
from models import Ticket
from schemas import TicketCreate, TicketUpdate, TicketResponse, StatsResponse

# Create tables in MySQL if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HelpDesk IT Ticket Management API", version="1.0.0")

# Enable CORS so our React frontend (running on port 5173) can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to generate a human-friendly unique ticket ID like 'HD-4821'
def generate_ticket_id(db: Session) -> str:
    while True:
        candidate_id = f"HD-{random.randint(1000, 9999)}"
        existing = db.query(Ticket).filter(Ticket.ticket_id == candidate_id).first()
        if not existing:
            return candidate_id

# 1. Health check endpoint
@app.get("/", tags=["Health"])
def root():
    return {"message": "HelpDesk API is running successfully!"}

# 2. CREATE a new ticket
@app.post("/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED, tags=["Tickets"])
def create_ticket(ticket_data: TicketCreate, db: Session = Depends(get_db)):
    new_ticket_id = generate_ticket_id(db)
    new_ticket = Ticket(
        ticket_id=new_ticket_id,
        employee_name=ticket_data.employee_name,
        issue_title=ticket_data.issue_title,
        description=ticket_data.description,
        category=ticket_data.category,
        priority=ticket_data.priority,
        status="Open"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

# 3. GET all tickets
@app.get("/tickets", response_model=List[TicketResponse], tags=["Tickets"])
def get_all_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

# 4. GET ticket by internal database ID
@app.get("/tickets/{id}", response_model=TicketResponse, tags=["Tickets"])
def get_ticket_by_id(id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

# 5. TRACK ticket by unique public ticket ID (e.g., HD-1234)
@app.get("/tickets/track/{ticket_id}", response_model=TicketResponse, tags=["Tickets"])
def track_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id.strip()).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="No ticket found with this Ticket ID")
    return ticket

# 6. UPDATE ticket status or priority
@app.put("/tickets/{id}", response_model=TicketResponse, tags=["Tickets"])
def update_ticket(id: int, ticket_data: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket_data.status is not None:
        ticket.status = ticket_data.status
    if ticket_data.priority is not None:
        ticket.priority = ticket_data.priority
    db.commit()
    db.refresh(ticket)
    return ticket

# 7. DELETE a ticket
@app.delete("/tickets/{id}", tags=["Tickets"])
def delete_ticket(id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}

# 8. GET live dashboard statistics directly from MySQL
@app.get("/stats", response_model=StatsResponse, tags=["Dashboard"])
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Ticket.id)).scalar() or 0
    open_count = db.query(func.count(Ticket.id)).filter(Ticket.status == "Open").scalar() or 0
    in_progress = db.query(func.count(Ticket.id)).filter(Ticket.status == "In Progress").scalar() or 0
    resolved = db.query(func.count(Ticket.id)).filter(Ticket.status == "Resolved").scalar() or 0
    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved
    }
