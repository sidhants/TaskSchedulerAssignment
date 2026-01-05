from sqlalchemy import Column, String, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from .database import Base

# TaskStatus enum
class TaskStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"

# Task model/definiton
class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=True)

    prompt = Column(Text, nullable=False) # input
    output = Column(Text, nullable=True) # output

    scheduled_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    created_at   = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    started_at   = Column(DateTime(timezone=True))
    finished_at  = Column(DateTime(timezone=True))

    status = Column(Enum(TaskStatus), default=TaskStatus.queued, nullable=False)
    error = Column(Text, nullable=True)