import { Layout } from "@/components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="home-container">
        <img
          src="/home.png"
          alt="image"
          className="home-image"
        />

        <h1 className="home-title">Welcome</h1>
        <p className="home-subtitle">Try Our Awesome Service!</p>
      </div>
    </Layout>
  );
}