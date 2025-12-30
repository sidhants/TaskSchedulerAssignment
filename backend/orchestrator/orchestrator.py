import threading
import time
import random
from queue import Queue, Empty
from datetime import datetime, timezone
from backend.app.database import SessionLocal
from backend.app.models import Task, TaskStatus
from backend.scheduler.scheduler import find_next_runnable_task

class Orchestrator:
    def __init__(self, poll_interval=1):
        self.poll_interval = poll_interval
        self.queue = Queue()
        self._stop = threading.Event()
        self.scheduler_thread = None
        self.executor_thread = None

    def scheduler_loop(self):
        while not self._stop.is_set():
            db = SessionLocal()
            try:
                task = find_next_runnable_task(db)
                if task:
                    task.scheduled_at = datetime.now(timezone.utc)
                    task.status = TaskStatus.queued
                    db.add(task)
                    db.commit()
                    self.queue.put(task.id)
            finally:
                db.close()

            self._stop.wait(self.poll_interval)

    def executor_loop(self):
        while not self._stop.is_set():
            try:
                task_id = self.queue.get(timeout=0.5)
            except Empty:
                continue

            try:
                db = SessionLocal()
                try:
                    task = db.query(Task).filter(Task.id == task_id).one()

                    task.status = TaskStatus.running
                    task.started_at = datetime.now(timezone.utc)
                    db.add(task)
                    db.commit()

                    try:
                        result = self.run_task(task)
                        task.status = TaskStatus.completed
                        task.output = result["MockResponse"]
                        task.finished_at = datetime.now(timezone.utc)
                    except Exception as e:
                        task.status = TaskStatus.failed
                        task.error = str(e)
                        task.finished_at = datetime.now(timezone.utc)

                    db.add(task)
                    db.commit()
                finally:
                    db.close()
            finally:
                self.queue.task_done()

    def run_task(self, task):
        print(f"[orchestrator] started task {task.id} ({task.status})")
        delay = random.uniform(1, 3)
        time.sleep(delay)
        return {
            "MockResponse": "This is a mocked LLM response for query " + task.prompt
        }

    def start(self):
        if self.scheduler_thread and self.scheduler_thread.is_alive():
            return
        if self.executor_thread and self.executor_thread.is_alive():
            return

        self._stop.clear()

        self.scheduler_thread = threading.Thread(
            target=self.scheduler_loop,
            daemon=True,
            name="scheduler-thread"
        )
        self.executor_thread = threading.Thread(
            target=self.executor_loop,
            daemon=True,
            name="executor-thread"
        )

        self.scheduler_thread.start()
        self.executor_thread.start()

    def stop(self):
        self._stop.set()
        if self.scheduler_thread:
            self.scheduler_thread.join()
        if self.executor_thread:
            self.executor_thread.join()