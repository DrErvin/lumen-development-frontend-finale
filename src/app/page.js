"use client";

import { useRouter } from "next/navigation";
// import "./styles/_landing.css";

export default function LandingPage() {
  const router = useRouter();

  const handleSelect = (role) => {
    // optional: persist choice
    localStorage.setItem("browseAs", role);
    // push to the real home, passing role as a query param
    router.push(`/home?role=${role}`);
  };

  return (
    <main className="landing-container">
      <h1>Welcome to Lumen Development</h1>
      <p>Browse as:</p>
      <div className="landing-buttons">
        <button onClick={() => handleSelect("student")}>
          I’m a Student
        </button>
        <button onClick={() => handleSelect("company")}>
          I’m a Company
        </button>
      </div>
    </main>
  );
}
