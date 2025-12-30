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
  const [timeFilter, setTimeFilter] = useState("all");

  async function load() {
    let url = "http://localhost:8000/tasks";

    if (timeFilter !== "all") {
      const now = new Date();
      let start: Date;

      if (timeFilter === "1h") {
        start = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      } else if (timeFilter === "24h") {
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (timeFilter === "7d") {
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        start = new Date(0);
      }

      const startISO = start.toISOString();
      const endISO = now.toISOString();

      url = `http://localhost:8000/tasks/range?start=${startISO}&end=${endISO}`;
    }

    const res = await fetch(url, {
      headers: { "X-Owner-Id": "test" }
    });

    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    load();
  }, [timeFilter]);

  function formatDate(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    });
  }

  return (
    <Layout>
      <div className="tasks-container">

        <div className="tasks-header">
          <h1 className="tasks-title">Tasks</h1>

          <div className="tasks-filters">
            <select
              className="filter-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">Any Time</option>
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
            </select>
          </div>
        </div>

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
                <td>
                  <span className={`task-status status-${task.status}`}>
                    {task.status}
                  </span>
                </td>
                <td className="output-cell">
                  {task.output ? task.output : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}