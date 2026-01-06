"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { getTasks, getTasksInRange, createTask, type Task } from "../lib/api";
import { formatDate } from "../lib/utils";

// Home page
export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");

  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [chainedNames, setChainedNames] = useState<Record<string, string>>({});

  // Helper methods
  async function load() {
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

      const startDate = start.toISOString();
      const endDate = now.toISOString();

      const data = await getTasksInRange(startDate, endDate);
      setTasks(data);
    } else {
      const data = await getTasks();
      setTasks(data);
    }
  }

  useEffect(() => {
    load();
  }, [timeFilter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);

    await createTask({ name, prompt: input });

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setName("");
    setInput("");
    load();
  }

  async function submitChainedTask(taskName: string, prompt: string, origTaskId: string) {
    setSubmitting(true);

    try {
      await createTask({ name: taskName, prompt });
      setChainedNames(prev => ({ ...prev, [origTaskId]: "" }));
      load();
    } catch (error) {
      console.error("Error submitting chained task", error);
    } finally {
      setSubmitting(false);
    }
  }

  function chainTask(taskId: string, prevOutput: string | null) {
    if (!prevOutput) {
      return;
    }

    const chainedTaskName = chainedNames[taskId];
    if (!chainedTaskName || chainedTaskName.trim() === "") {
      console.log("Please enter a task name for the chained task");
      return;
    }

    void submitChainedTask(chainedTaskName, prevOutput, taskId);
  }

  // Render
  return (
    <Layout>
      <div className="create-task-container">
        <h1 className="create-task-title">Create Task</h1>

        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="task-group">
            <label className="task-label">Task Name</label>
            <input
              className="task-input"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="text-limit">{name.length}/50</div>
          </div>

          <div className="prompt-group">
            <label className="prompt-label">Prompt</label>
            <textarea
              className="prompt-input"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
            <div className="text-limit">{input.length}/500</div>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {submitted && (
            <div className="submitted-message">Task submitted successfully.</div>
          )}
        </form>
      </div>

      <div className="tasks-container" style={{ marginTop: 48 }}>
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
              <th>Prompt</th>
              <th>Output</th>
              <th>Chain Task</th>
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
                  <span className={`task-status status-${task.status}`}>{task.status}</span>
                </td>
                <td className="prompt-cell">{task.prompt ? task.prompt : "—"}</td>
                <td className="output-cell">{task.output ? task.output : "—"}</td>
                <td className="chain-cell">
                  <div>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Task name"
                      value={chainedNames[task.id] || ""}
                      onChange={(e) => setChainedNames(prev => ({ ...prev, [task.id]: e.target.value }))}
                    />
                    <button
                      className="chain-button"
                      disabled={!task.output}
                      onClick={() => chainTask(task.id, task.output ?? null)}
                    >
                      Chain
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}