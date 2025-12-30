from uuid import UUID
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional
from backend.orchestrator.orchestrator import Orchestrator

from .database import get_db
from . import crud, schemas
from .schemas import TaskCreate, TaskRead
from .models import Task, TaskStatus

from backend.app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()
router = APIRouter()

## orchestrator lifecycle
orchestrator = Orchestrator(poll_interval=1)

@app.on_event("startup")
def start_orchestrator():
    orchestrator.start()
    print("[app] orchestrator started")

@app.on_event("shutdown")
def stop_orchestrator():
    orchestrator.stop()
    print("[app] orchestrator stopped")


## API endpoints
# POST /tasks
@router.post("/tasks", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    print("DEBUG: using UTC timestamp", now)

    db_task = Task(
        name=task.name,
        prompt=task.prompt,
        owner="test", # currently hardcoded
        status=TaskStatus.queued,
        created_at=now,
        scheduled_at=now
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# GET /tasks
# Optional: ?owner=xyz
@router.get("/tasks", response_model=list[schemas.TaskRead])
def list_tasks(owner: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.list_tasks(db, owner)

# GET /tasks/status
# Optional: ?owner=xyz
@router.get("/tasks/status", response_model=list[schemas.TaskRead])
def tasks_by_status(
    status: TaskStatus,
    owner: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.list_tasks_by_status(db, status, owner)

# GET /tasks/range
# Optional: ?owner=xyz
# Example: /tasks/range?start=2025-01-01T00:00:00Z&end=2025-01-10T00:00:00Z
@router.get("/tasks/range", response_model=list[schemas.TaskRead])
def tasks_in_range(
    start: datetime,
    end: datetime,
    owner: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if start >= end:
        raise HTTPException(status_code=400, detail="start must be before end")
    
    return crud.list_tasks_in_range(db, start, end, owner)

# GET /tasks/{task_id}
@router.get("/tasks/{task_id}", response_model=schemas.TaskRead)
def get_task(task_id: UUID, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

app.include_router(router)