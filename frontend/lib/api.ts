const API_BASE_URL = "http://localhost:8000";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "X-Owner-Id": "test"
};

// Task definition
export interface Task {
  id: string;
  name: string;
  status: string;
  prompt: string;
  output?: string | null;
  error?: string | null;
  created_at: string;
  scheduled_at: string;
  started_at?: string | null;
  finished_at?: string | null;
}

// Get tasks API
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    headers: { "X-Owner-Id": "test" }
  });
  return res.json();
}

// Get tasks API with time range
export async function getTasksInRange(startISO: string, endISO: string): Promise<Task[]> {
  const res = await fetch(
    `${API_BASE_URL}/tasks/range?start=${startISO}&end=${endISO}`,
    { headers: { "X-Owner-Id": "test" } }
  );
  return res.json();
}

// Create task API
export async function createTask(payload: { name: string; prompt: string }): Promise<void> {
  await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload)
  });
}
