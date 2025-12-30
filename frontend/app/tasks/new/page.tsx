"use client";

import { useState } from "react";
import { Layout } from "@/components/Layout";

export default function NewTaskPage() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);  

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);

    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Owner-Id": "test"
      },
      body: JSON.stringify({ name, prompt: input })
    });

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setName("");
    setInput("");
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

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {submitted && (
            <div className="submitted-message">
              Task submitted successfully.
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}