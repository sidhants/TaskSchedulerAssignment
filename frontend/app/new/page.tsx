"use client";

import { useState } from "react";

export default function NewTaskPage() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Owner-Id": "test"
      },
      body: JSON.stringify({ name, prompt: input })
    });

    window.location.href = "/";
  }

  return (
    <div>
      <h1>Create Task</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label>Task Input</label>
          <br />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" style={{ marginTop: 16 }}>
          Submit
        </button>
      </form>
    </div>
  );
}