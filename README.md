## Mini LLM Task Orchestrator Service

GIT Repo - https://github.com/sidhants/TaskSchedulerAssignment 

Demo Video added to repo.

## Prerequisites

1. Follow instructions in README-BACKEND for postgresql, server setup.

2. Follow instructions in README-FRONTEND for npm setup.

--

## Running Mini LLM Task Orchestrator

### Run backend service (Refer README-BACKEND on how to run server)
uvicorn backend.app.main:app --reload

### Run frontend app
cd /TaskSchedulerAssignment/frontend

npm run dev

--

## Open url to try out service (ensure backend is running)
Open http://localhost:3000/

--

## DESIGN OVERVIEW

### APPROACH

The goal was to build a minimal but complete frontend and backend that satisfies the core requirements of creating, scheduling, and viewing tasks, while keeping the architecture clean, scalable, and easy to extend. The focus was on correctness, simplicity, and clarity to achieve the minimum viable product given the time constraints.

### WHY I CHOSE THIS APPROACH (Concise)

I chose this approach to keep the system simple and easy to review. A single‑page frontend makes the entire workflow visible without navigating through multiple screens. On the backend, using PostgreSQL row‑level locking and a scheduler/executor loop enables safe FIFO task execution and provides a clean path to future parallelism. The overall design is intentionally lightweight, easy to run locally, and structured so real LLM calls or additional orchestration features can be added without changing the core architecture.

### BACKEND WALKTHROUGH

Technolgies

• FastAPI — lightweight Python framework RESTFUL APIs
• PostgreSQL
• SQLAlchemy — ORM for models
• Uvicorn — ASGI server for running the backend

Walkthrough

• Implemented REST endpoints for creating and retrieving tasks, including time‑range filtering.

• Introduced resource‑based ownership, where each request includes an owner header. Only the owner can view their tasks. This pattern can easily extend to update/delete operations in the future.

• Designed and built a simple orchestrator service with two threads:
	◦ Scheduler — selects the next runnable task
	◦ Executor — runs the task and updates its status

• The scheduler uses a producer–consumer model with FIFO ordering. The design is intentionally simple but can be expanded to multi‑threaded or distributed execution.

• LLM calls are currently mocked, but the run_task method is structured so real LLM calls can be plugged in without changing the orchestration logic.

### FRONTEND WALKTHROUGH

Technolgies

• Next.js
• React
• TypeScript
• CSS3

Walkthrough

• Built a single interaction page where users can:
	◦ Create a new task
	◦ View all existing tasks

• Added real‑time filtering by time ranges (1 hour, 24 hours, 7 days, all time).

• Implemented a clean table UI showing task name, status, timestamps, prompt, and output, with action controls where applicable.

• Added success notifications and disabled button states for better user feedback.

• Task Chaining is supported via separate buttons in the table for completed tasks (uses previous output as new prompt).

• Kept the UI minimal and readable, with API calls isolated from UI components for separation of concerns.

### FUTURE IMPROVEMENTS (~1 day)

• Add support for canceling in‑flight or pending tasks.  
• Introduce priority‑based scheduling to influence task ordering.  
• Enable parallel execution using thread pools or worker pools.  
• Improve chaining UX with a more dynamic, conversational interface.  
• Replace mock task execution with real LLM calls.