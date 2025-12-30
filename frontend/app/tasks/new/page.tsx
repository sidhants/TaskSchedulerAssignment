"use client";

import { useState } from "react";
import { Layout } from "@/components/Layout";

export default function NewTaskPage() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");

  async function handleSubmit(e) {
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
    <Layout>
      <div className="create-task-container">
        <h1 className="create-task-title">Create Task</h1>

        <form onSubmit={handleSubmit} className="create-task-form">
          
          {/* NAME FIELD */}
          <div className="form-group">
            <label className="form-label">Task Name</label>
            <input
              className="form-input"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="char-count">{name.length}/50</div>
          </div>

          {/* PROMPT FIELD */}
          <div className="form-group prompt-group">
            <label className="form-label">Prompt</label>
            <textarea
              className="form-textarea"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
            <div className="char-count">{input.length}/500</div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}