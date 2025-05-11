"use client";

import { useRouter } from "next/navigation";
import { FaHandshake } from "react-icons/fa";

export default function LandingPage() {
  const router = useRouter();

  const handleSelect = (role) => {
    localStorage.setItem("browseAs", role);
    router.push(`/home?role=${role}`);
  };

  return (
    <div className="container landing-main">
      <div className="landing-card">
        <h1 className="intro-title">
          Welcome to Student Company Platfrom
        </h1>
        <p className="intro-text">Browse as:</p>
        <div className="landing-btn-group">
          <button
            className="landing-btn"
            onClick={() => handleSelect("student")}
          >
            Student/Guest
          </button>
          <button
            className="landing-btn"
            onClick={() => handleSelect("company")}
          >
            Company
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
              Complete a personal or company profile to unlock the
              ecosystem’s full potential.
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
            <FaHandshake
              size={33}
              style={{
                backgroundColor: "#E3F0FF",
                color: "#1976D2",
                padding: "8px",
                borderRadius: "9999px",
              }}
            />
            <h3>Connect &amp; Grow</h3>
            <p>
              Collaborate with leading universities and companies to
              advance together.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
