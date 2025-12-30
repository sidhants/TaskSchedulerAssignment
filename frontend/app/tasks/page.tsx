"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

interface Task {
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:8000/tasks", {
        headers: { "X-Owner-Id": "test" }
      });
      const data = await res.json();
      setTasks(data);
    }
    load();
  }, []);

  function formatDate(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",   // ← add this
      timeZoneName: "short"
    });
  }

  return (
    <Layout>
      <div className="tasks-container">
        <h1 className="tasks-title">All Tasks</h1>

        <table className="tasks-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Scheduled</th>
              <th>Started</th>
              <th>Finished</th>
              <th>Status</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{formatDate(task.created_at)}</td>
                <td>{formatDate(task.scheduled_at)}</td>
                <td>{formatDate(task.started_at)}</td>
                <td>{formatDate(task.finished_at)}</td>
                <td><span className={`task-status status-${task.status}`}>{task.status}</span></td>
                <td className="output-cell">{task.output ? task.output : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}