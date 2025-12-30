import "./globals.css";   // <-- THIS LINE IS REQUIRED

export const metadata = {
  title: "Mini LLM Orchestrator",
  description: "Task orchestration UI"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}