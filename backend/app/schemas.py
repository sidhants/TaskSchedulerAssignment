from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class TaskCreate(BaseModel):
    name: str
    prompt: str

class TaskRead(BaseModel):
    id: UUID
    name: str
    prompt: str
    owner: str
    status: str
    created_at: datetime
    scheduled_at: datetime
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    output: Optional[str]
    error: Optional[str]
    parent_task_id: Optional[UUID]

    model_config = {"from_attributes": True}