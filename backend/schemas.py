from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

# Schema for creating a ticket (data coming from employee submission form)
class TicketCreate(BaseModel):
    employee_name: str
    issue_title: str
    description: str
    category: str
    priority: str

# Schema for updating a ticket (admin can change status and priority)
class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None

# Schema for returning ticket data in API responses
class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: str
    employee_name: str
    issue_title: str
    description: str
    category: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

# Schema for dashboard statistics
class StatsResponse(BaseModel):
    total: int
    open: int
    in_progress: int
    resolved: int
