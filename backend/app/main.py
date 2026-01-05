from uuid import UUID
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional
from backend.orchestrator.orchestrator import Orchestrator
from backend.app.database import Base, engine
from .database import get_db
from . import crud, schemas
from .schemas import TaskCreate, TaskRead
from .models import Task, TaskStatus
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine) # create tables

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

## Orchestrator lifecycle
orchestrator = Orchestrator(poll_interval=1)
@app.on_event("startup")
def start_orchestrator():
    orchestrator.start()
    print("[app] orchestrator started")

@app.on_event("shutdown")
def stop_orchestrator():
    orchestrator.stop()
    print("[app] orchestrator stopped")


# Helpers
# owner extraxted from header
async def get_owner(x_owner_id: str = Header(...)) -> str:
    return x_owner_id


## API endpoints

# POST /tasks
@router.post("/tasks", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    owner: str = Depends(get_owner),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    print("DEBUG: using UTC timestamp", now)

    db_task = Task(
        name=task.name,
        prompt=task.prompt,
        owner=owner,
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
def list_tasks(
    owner: str = Depends(get_owner),
    db: Session = Depends(get_db),
):
    return crud.list_tasks(db, owner)

# GET /tasks/range
# Optional: ?owner=xyz
# Example: /tasks/range?start=2025-01-01T00:00:00Z&end=2025-01-10T00:00:00Z
@router.get("/tasks/range", response_model=list[schemas.TaskRead])
def tasks_in_range(
    start: datetime,
    end: datetime,
    owner: str = Depends(get_owner),
    db: Session = Depends(get_db)
):
    if start >= end:
        raise HTTPException(status_code=400, detail="start must be before end")
    
    return crud.list_tasks_in_range(db, start, end, owner)

# GET /tasks/{task_id}
@router.get("/tasks/{task_id}", response_model=schemas.TaskRead)
def get_task(
    task_id: UUID,
    owner: str = Depends(get_owner),
    db: Session = Depends(get_db),
):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task id not found")

    if task.owner != owner:
        raise HTTPException(status_code=403, detail="Task access denied")

    return task

app.include_router(router)