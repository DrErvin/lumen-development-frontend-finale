"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleSelect = (role) => {
    localStorage.setItem("browseAs", role);
    router.push(`/home?role=${role}`);
  };

  return (
    <div className="container landing-main">
      <div className="landing-card">
        <h1 className="intro-title">Welcome to Lumen Development</h1>
        <p className="intro-text">Browse as:</p>
        <div className="landing-btn-group">
          <button
            className="landing-btn"
            onClick={() => handleSelect("student")}
          >
            Sign up as Student
          </button>
          <button
            className="landing-btn"
            onClick={() => handleSelect("company")}
          >
            Sign up as Company
          </button>
        </div>
      </div>
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="hiw-steps">
          <div className="hiw-step">
            {/* Profile SVG */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle cx="24" cy="24" r="24" fill="#E3F0FF" />
              <circle cx="24" cy="20" r="8" fill="#1976D2" />
              <ellipse
                cx="24"
                cy="36"
                rx="12"
                ry="7"
                fill="#1976D2"
                opacity="0.7"
              />
            </svg>
            <h3>Create Your Profile</h3>
            <p>
              Set up your personal or company profile to get started.
            </p>
          </div>
          <div className="hiw-step">
            {/* Search SVG */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle cx="24" cy="24" r="24" fill="#E3F0FF" />
              <circle
                cx="22"
                cy="22"
                r="10"
                stroke="#1976D2"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="32"
                y="32"
                width="8"
                height="3"
                rx="1.5"
                transform="rotate(45 32 32)"
                fill="#1976D2"
              />
            </svg>
            <h3>Explore Opportunities</h3>
            <p>
              Browse or post opportunities that match your interests.
            </p>
          </div>
          <div className="hiw-step">
            {/* Handshake SVG */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle cx="24" cy="24" r="24" fill="#E3F0FF" />
              <path
                d="M16 28l8 8 8-8"
                stroke="#1976D2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 20v8h16v-8"
                stroke="#1976D2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="20" r="2" fill="#1976D2" />
              <circle cx="28" cy="20" r="2" fill="#1976D2" />
            </svg>
            <h3>Connect &amp; Grow</h3>
            <p>
              Build relationships and grow together in the Lumen
              community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
