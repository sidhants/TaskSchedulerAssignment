import { api } from "@/lib/api";

export default async function TaskListPage() {
  const tasks = await api("/tasks");

  return (
    <div>
      <h1>Tasks</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <a href="/new">Create New Task</a>
        <a href="/">Refresh</a>
      </div>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      <ul style={{ marginTop: 24 }}>
        {tasks.map((t: any) => (
          <li key={t.id}>
            <a href={`/tasks/${t.id}`}>
              {t.name} — {t.status}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}