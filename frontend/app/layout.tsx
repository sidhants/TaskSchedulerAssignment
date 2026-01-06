import "./globals.css";

export const metadata = {
  title: "Mini LLM Orchestrator Service",
  description: "Task orchestration UI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}