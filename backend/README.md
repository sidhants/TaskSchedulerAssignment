## Instructions

## PostgreSQL Setup

### Install PostgreSQL
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

## Python Setup

### Create virtual environment inside project root directory
cd /TaskSchedulerAssignment

python3 -m venv venv

### Activate
source venv/bin/activate

### Install dependencies (if not already)
pip install -r backend/requirements.txt

--

## Running the Server

### Activate
source venv/bin/activate

### Run backend server
uvicorn backend.app.main:app --reload

--

## API Documentation
Open http://127.0.0.1:8000/docs

![APIs diagram](APIs.png)