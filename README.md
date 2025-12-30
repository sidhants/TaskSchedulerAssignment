## Setup Instructions

## Python Environment Setup
### Create a virtual environment inside project root directory location
cd /TaskSchedulerAssignment
python3 -m venv venv

### Activate the virtual environment
source venv/bin/activate

### Install backend dependencies
pip install -r backend/requirements.txt

--

## PostgreSQL Setup (Manual DB Creation)
brew install postgresql

### Start PostgreSQL
brew services start postgresql

### Create the database user 'test' (if not already created)
createuser test --superuser

### Create a new database called 'orchestrator_db'
dropdb orchestrator_db
createdb orchestrator_db

### Verify the database exists
psql postgresql://test:test@localhost:5432/orchestrator_db -c "\dt"

--

## Running the Server
uvicorn backend.app.main:app --reload

--

## API Documentation
Open http://127.0.0.1:8000/docs

--

## Quick Test (Create a Task)
Submit a task:
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"task_type": "dummy", "payload": {"value": 123}}'