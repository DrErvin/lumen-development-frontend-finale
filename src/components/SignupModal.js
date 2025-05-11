"use client";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { MODAL_CLOSE_SEC } from "../utils/config";

export default function SignupModal({
  isOpen,
  onClose,
  onSignUp,
  onValidateEmail,
  role,
  mustSignUp = false,
}) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Validate email when it changes
  useEffect(() => {
    if (!isOpen || !onValidateEmail) return;

    let cancelled = false;
    async function validate() {
      // Skip validation if email is empty
      if (email.trim() === "") {
        setEmailValid(true);
        return;
      }
      if (onValidateEmail) {
        const valid = await onValidateEmail(email);
        if (!cancelled) setEmailValid(valid);
      }
    }
    validate();
    return () => {
      cancelled = true;
    };
  }, [email, onValidateEmail, isOpen]);

  if (!isOpen) return null;

  const heading =
    role === "company" ? "Company Sign Up" : "Student Sign Up";
  const emailNote =
    role === "company"
      ? "please use your company email address"
      : "please use your university email address";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent submission if email domain is invalid
    if (onValidateEmail && !emailValid) {
      setError(
        "Invalid email domain. Please use your University email."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // onSignUp should upload the new account (e.g. using model.uploadAccount)
      await onSignUp({
        nameAndSurname: name,
        email,
        password,
        ...(role === "company" && { companyName }),
      });
      setSuccess("Confirmation Email has been sent!");
      // Clear fields
      setName("");
      setEmail("");
      setPassword("");
      // After delay, clear success and close modal
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-modal">
      <div
        className="overlay overlay--signup"
        onClick={mustSignUp ? undefined : onClose}
      ></div>
      <div className="signup-form-window fade-in">
        {!mustSignUp && (
          <button
            className="btn--close-modal signup-btn--close-modal"
            onClick={onClose}
          >
            &times;
          </button>
        )}

        {success ? (
          <div className="message">
            <svg>
              <use href="img/icons.svg#icon-smile" />
            </svg>
            <p>{success}</p>
          </div>
        ) : loading ? (
          <div className="spinner">
            <svg>
              <use href="img/icons.svg#icon-loading" />
            </svg>
          </div>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup__column">
              <h3 className="signup__heading">{heading}</h3>

              {role === "student" && (
                <div className="disclaimer">
                  <p>
                    We use the data to enhance your user journey on
                    our platform by simplifying the application
                    process.
                  </p>
                </div>
              )}

              {role === "company" && (
                <>
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </>
              )}

              {/* <div className="disclaimer">
                <p>
                  We use the data to enhance your user journey on our
                  platform by simplifying the application process.
                </p>
              </div> */}
              <label htmlFor="name">Name and Surname</label>
              <input
                id="name"
                name="nameAndSurname"
                type="text"
                placeholder="Enter your name and surname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="signUpEmail">
                Email <span className="note">{emailNote}</span>
              </label>
              <input
                id="signUpEmail"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {!emailValid && (
                <p className="signup__emailError">
                  *Invalid email domain. Please use your University or
                  Company email.
                </p>
              )}
              <label htmlFor="signUpPassword">Password</label>
              <input
                id="signUpPassword"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <ErrorMessage text={error} />}
              <button className="btn signup__btn" type="submit">
                <svg>
                  <use href="img/icons.svg#icon-signup" />
                </svg>
                <span>Sign Up</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
