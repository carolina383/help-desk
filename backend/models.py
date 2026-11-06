from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    # Columns matching the MySQL tickets table
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(20), unique=True, index=True, nullable=False)
    employee_name = Column(String(100), nullable=False)
    issue_title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(20), nullable=False)
    priority = Column(String(10), nullable=False)
    status = Column(String(20), default="Open", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
