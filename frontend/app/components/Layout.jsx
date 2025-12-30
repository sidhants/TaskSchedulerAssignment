"use client";

import { usePathname } from "next/navigation";

export function Layout({ children }) {
  const pathname = usePathname();

  return (
    <div className="page">
      <header className="layout-header">
        <div className="layout-header-inner">
          <div className="layout-title">Mini LLM Orchestrator</div>

          <nav className="layout-nav">
            <a
              href="/"
              className={pathname === "/" ? "active" : ""}
            >
              Home
            </a>

            <a
              href="/tasks/new"
              className={pathname === "/tasks/new" ? "active" : ""}
            >
              Create Task
            </a>

            <a
              href="/tasks"
              className={pathname === "/tasks" ? "active" : ""}
            >
              View Tasks
            </a>
          </nav>
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}