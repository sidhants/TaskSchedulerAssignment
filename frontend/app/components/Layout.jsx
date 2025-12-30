export function Layout({ children }) {
  return (
    <div className="page">
      <header className="layout-header">
        <div className="layout-header-inner">
          <div className="layout-title">Mini LLM Orchestrator</div>

          <nav className="layout-nav">
            <a href="/">Home</a>
            <a href="/tasks/new">Create Task</a>
            <a href="/tasks">View Tasks</a>
          </nav>
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}