from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime
from typing import Optional


## POST operations
# create a new task
def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        name=task.name,
        owner=task.owner,
        prompt=task.prompt,
        scheduled_at=task.scheduled_at,
        parent_task_id=task.parent_task_id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

## GET operations
# get task by id
def get_task(db: Session, task_id):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

# list all tasks with optional owner
def list_tasks(db: Session, owner: Optional[str] = None):
    query = db.query(models.Task)
    query = apply_owner_filter(query, owner)
    return query.order_by(models.Task.created_at.desc()).all()

# list tasks by status with optional owner
def list_tasks_by_status(db: Session, status: models.TaskStatus, owner: Optional[str] = None):
    query = db.query(models.Task).filter(models.Task.status == status)
    query = apply_owner_filter(query, owner)
    return query.order_by(models.Task.created_at.desc()).all()

# list tasks created within a date range with optional owner
def list_tasks_in_range(db: Session, start: datetime, end: datetime, owner: Optional[str] = None):
    query = (
        db.query(models.Task)
        .filter(models.Task.created_at >= start)
        .filter(models.Task.created_at <= end)
    )
    query = apply_owner_filter(query, owner)
    return query.order_by(models.Task.created_at.asc()).all()

# helper function to apply owner filter
def apply_owner_filter(query, owner: Optional[str] = None):

    if owner:
        return query.filter(models.Task.owner == owner)
    return query