"use client";

export function Layout({ children }) {
  return (
    <div className="page">
      <header className="layout-header">
        <div className="layout-header-inner">
          <div className="layout-title">Mini LLM Orchestrator Service</div>
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}