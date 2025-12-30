from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.app.models import Task, TaskStatus

TASK_LIMIT = 1

def find_next_runnable_task(db: Session):

    now = datetime.now(timezone.utc)
    # select the next runnable task with skip lock setting
    query = (
        select(Task)
        .where(
            Task.status == TaskStatus.queued,
            Task.scheduled_at <= now,
        )
        .order_by(Task.scheduled_at.asc(), Task.created_at.asc())
        .with_for_update(skip_locked=True)
        .limit(TASK_LIMIT)
    )

    task = db.execute(query).scalars().first()
    if not task:
        return None

    # mark task as running
    task.status = TaskStatus.running
    task.started_at = now

    db.add(task)
    db.commit()
    db.refresh(task)

    return task