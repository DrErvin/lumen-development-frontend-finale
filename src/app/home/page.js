"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import SearchForm from "../../components/SearchForm.js";
import ResultsList from "../../components/ResultsList.js";
import ErrorMessage from "../../components/ErrorMessage.js";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import IntroSection from "../../components/IntroSection.js";
import FeaturedOpportunities from "../../components/FeaturedOpportunities.js";
import Pagination from "../../components/Pagination.js";
import LoginModal from "../../components/LoginModal.js";
import LogoutModal from "../../components/LogoutModal.js";
import SignupModal from "../../components/SignupModal.js";
import ApplyModal from "../../components/ApplyModal.js";
import OpportunityDetails from "../../components/OpportunityDetails.js";
import PublishModal from "../../components/PublishModal.js";
import AdminDashboard from "../../components/AdminDashboard.js";
import SuccessMessage from "../../components/SuccessMessage.js";
import * as model from "../../utils/model.js";
import { scrollToTop } from "../../utils/helpers.js";
import { RES_PER_PAGE, MODAL_CLOSE_SEC } from "../../utils/config.js";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [mustLogin, setMustLogin] = useState(false);
  const [mustSignUp, setMustSignUp] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("role");
    const fromStorage = window.localStorage.getItem("browseAs");
    setRole(fromUrl ?? fromStorage ?? "");

    if (fromUrl === "company") {
      setMustLogin(true);
      setMustSignUp(true);
    }
  }, [searchParams]);

  // console.log("Current role saved: ", role);

  // const role =
  //   searchParams.get("role") ||
  //   window.localStorage.getItem("browseAs");
  // console.log(role);

  // Mounted state to ensure client-only rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Search Form
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // New state

  // New state for featured opportunities
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(RES_PER_PAGE); // default value

  // Login/Logout states
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Signup modal
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSuccessOverlayOpen, setIsSuccessOverlayOpen] =
    useState(false);
  const [successOverlayMessage, setSuccessOverlayMessage] =
    useState("");

  // Opportunity Details
  const [selectedOpportunity, setSelectedOpportunity] =
    useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Apply now modal form
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Publish Opportunity
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Admin Dashboard
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);
  const [adminSmartSearchResults, setAdminSmartSearchResults] =
    useState([]);
  const [adminSmartSearchLoading, setAdminSmartSearchLoading] =
    useState(false);
  const [adminSmartSearchError, setAdminSmartSearchError] =
    useState(null);

  useEffect(() => {
    const onUserLoggedIn = () => {
      const stored = localStorage.getItem("loggedInUser");
      if (stored) setUser(JSON.parse(stored));

      setSuccessOverlayMessage(
        "You have been successfully signed in"
      );
      setIsSuccessOverlayOpen(true);
      setMustLogin(false);

      setTimeout(
        () => setIsSuccessOverlayOpen(false),
        MODAL_CLOSE_SEC * 1000
      );
    };
    window.addEventListener("user-logged-in", onUserLoggedIn);
    return () =>
      window.removeEventListener("user-logged-in", onUserLoggedIn);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (mustLogin && !user) {
      setIsLoginModalOpen(true);

      router.replace("/home", { shallow: true });
    }
    // if (!user && role === "student") {
    //   setIsSignUpModalOpen(true);
    // }
  }, [mustLogin, user, mounted, router]);

  // --- Persistence on mount ---
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Opportunity details
  useEffect(() => {
    async function handleHashChange() {
      const id = window.location.hash.slice(1);

      // Exclude these two ids from the opportunity details behavior.
      if (id === "featured-section" || id === "newsletter-section") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      if (!/^[0-9]/.test(id)) {
        return;
      }

      scrollToTop();

      if (id) {
        setDetailsLoading(true);
        try {
          const storedOpportunity =
            localStorage.getItem("opportunity");
          if (storedOpportunity) {
            setSelectedOpportunity(JSON.parse(storedOpportunity));
          }

          await model.loadOpportunity(id);
          const loadedOpportunity = model.state.opportunity;
          setSelectedOpportunity(loadedOpportunity);

          localStorage.setItem(
            "opportunity",
            JSON.stringify(loadedOpportunity)
          );
        } catch (err) {
          console.error(err);
        } finally {
          setDetailsLoading(false);
        }
      } else {
        setSelectedOpportunity(null);
        localStorage.removeItem("opportunity");
      }
    }
    window.addEventListener("hashchange", handleHashChange);
    // Check on mount in case there is already a hash
    handleHashChange();
    return () =>
      window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handler function to process search queries
  const handleSearch = async (query) => {
    try {
      scrollToTop();
      setLoading(true);
      setError(null);
      setHasSearched(true); // Mark that a search was performed
      setSearchQuery(query);
      window.location.hash = "";

      // Use your model's function to load search results
      await model.loadSearchResults(query);
      const searchState = model.state.search;

      if (
        searchState &&
        searchState.results &&
        searchState.results.length > 0
      ) {
        setTotalResults(searchState.results.length);
        setResultsPerPage(searchState.resultsPerPage);
        setCurrentPage(1);
        setResults(model.getSearchResultsPage(1));
      } else {
        // No results found: clear results and set total to 0
        setTotalResults(0);
        setResultsPerPage(10);
        setCurrentPage(1);
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination clicks: update current page and results
  const handlePageChange = (page) => {
    scrollToTop();
    setCurrentPage(page);
    setResults(model.getSearchResultsPage(page));
  };

  // Load featured opportunities on component mount
  useEffect(() => {
    async function loadFeatured() {
      try {
        setFeaturedLoading(true);
        const data = await model.fetchFeatured();
        setFeatured(data);
      } catch (err) {
        console.error(err);
        setFeaturedError(
          "No featured opportunities found. Please try again later!"
        );
      } finally {
        setFeaturedLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // // Login handler
  const handleLogin = async ({ email, password }) => {
    const account = await model.verifyLogin({ email, password });
    if (!account) {
      throw new Error("Invalid email or password");
    }
    // model.state.user is updated after verification.
    const loggedInUser = model.state.user;
    setUser(loggedInUser);

    setMustLogin(false);

    // Save only one key ("user") in localStorage and remove any extra key.
    // localStorage.setItem("user", JSON.stringify(loggedInUser));
    // localStorage.removeItem("loggedInUser");
  };

  // Login
  // const handleLogin = async ({ email, password }) => {
  //   try {
  //     const { error, session } = await model.loginUser({
  //       email,
  //       password,
  //     });
  //     if (error) throw new Error(error);

  //     const loggedInUser = model.state.user;
  //     setUser(loggedInUser);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  const handleLogout = async () => {
    // Call your model functions to clear global state and local storage
    model.clearState();
    model.clearLocalStorage();
    setUser(null);

    setMustLogin(false);
  };

  useEffect(() => {
    async function preloadDomains() {
      if (
        isSignUpModalOpen &&
        !model.areUniversitiesCached() &&
        role === "student"
      ) {
        await model.preloadUniversityDomains();
      }
    }
    preloadDomains();
  }, [isSignUpModalOpen, role]);

  // const handleSignUp = async (newAccount) => {
  //   // This calls model.uploadAccount, similar to controlSignup in your controller.js :contentReference[oaicite:1]{index=1}
  //   await model.uploadAccount(newAccount);
  //   // Optionally update the user state after sign up:
  //   const loggedInUser = model.state.user;
  //   setUser(loggedInUser);
  // };

  // Signup
  const handleSignUp = async ({
    nameAndSurname,
    email,
    password,
    companyName,
  }) => {
    try {
      const { error, message } = await model.signupUser({
        nameAndSurname,
        email,
        password,
        companyName,
      });
      if (error) throw new Error(error);
      alert(message); // “Check your email…”

      setMustSignUp(false);
      // const loggedInUser = model.state.user;
      // setUser(loggedInUser);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleApply = async (formData) => {
    // Guard clauses
    if (!user || user.accountType !== "student") {
      throw new Error("You must be logged in as a student to apply.");
    }

    if (!selectedOpportunity) {
      throw new Error("No opportunity selected.");
    }

    formData.append("userId", user.id);
    formData.append("opportunityId", selectedOpportunity.id);

    // Submit the application to your backend
    await model.submitApplication(formData);
  };

  // Admin Dashboard
  useEffect(() => {
    if (isAdminView && user && user.accountType === "company") {
      async function fetchAdminStats() {
        setAdminLoading(true);
        try {
          const opportunities = await model.fetchAllOpportunities();
          const applications = await model.fetchAllApplications();
          const applicantsData = await model.fetchAllApplicantsData();

          const activeOpportunities = opportunities.filter(
            (opp) => new Date(opp.endingDate) >= new Date()
          ).length;
          const applicationsCount = applications.length;

          const applicantsByCountry = applicantsData.reduce(
            (acc, applicant) => {
              const country =
                applicant.university_location || "Unknown";
              if (!acc[country]) acc[country] = new Set();
              acc[country].add(applicant.id);
              return acc;
            },
            {}
          );

          const labels = Object.keys(applicantsByCountry).map(
            (country) =>
              `${country} (${applicantsByCountry[country].size})`
          );
          const values = Object.values(applicantsByCountry).map(
            (set) => set.size
          );

          setAdminStats({
            opportunitiesCount: activeOpportunities,
            applicationsCount,
            chartData: { labels, values },
          });
        } catch (err) {
          setAdminError(err.message);
        } finally {
          setAdminLoading(false);
        }
      }
      fetchAdminStats();
    }
  }, [isAdminView, user]);

  // Handler for admin smart search
  const handleAdminSmartSearch = async (query) => {
    setAdminSmartSearchLoading(true);
    setAdminSmartSearchError(null);
    try {
      const results = await model.performSmartSearch(query);
      setAdminSmartSearchResults(results);

      if (!results || results.length === 0) {
        setAdminSmartSearchError(
          "No search results found for your query."
        );
      }
    } catch (err) {
      console.error(err);
      setAdminSmartSearchError(err.message);
    } finally {
      setAdminSmartSearchLoading(false);
    }
  };

  const showAdminDashboard = () => {
    if (!user || user.accountType !== "company") {
      alert(
        "You must be logged in as a Company user to access the Admin Dashboard."
      );
      return;
    }
    setIsAdminView(true);
  };

  const hideAdminDashboard = () => {
    setIsAdminView(false);
  };

  return (
    <>
      {!mounted ? (
        <LoadingSpinner />
      ) : (
        <main>
          {/* Header Section */}
          <header className="main-header">
            <nav className="nav">
              <Image
                src="/img/logo.webp"
                alt="Company logo"
                className="nav__logo"
                id="logo"
                width={130}
                height={90}
              />
              <ul className="nav__links">
                <li className="nav__item">
                  <Link
                    href="/home"
                    className="nav__link"
                    id="homeBtn"
                    onClick={() => {
                      window.location.hash = "";
                      setHasSearched(false);
                      setSearchQuery(null);
                      setResults([]);
                      setError(null);
                      hideAdminDashboard();
                    }}
                  >
                    Home
                  </Link>
                </li>
                {user?.accountType === "company" && (
                  <li className="nav__item">
                    <a
                      className="nav__link"
                      id="admin-btn"
                      href="#"
                      onClick={showAdminDashboard}
                    >
                      Admin Dashboard
                    </a>
                  </li>
                )}
                <li className="nav__item">
                  <a className="nav__link" href="#featured-section">
                    Featured
                  </a>
                </li>
                <li className="nav__item">
                  <a className="nav__link" href="#newsletter-section">
                    Newsletter
                  </a>
                </li>
              </ul>
              <div className="nav__buttons">
                {user?.accountType === "company" && (
                  <button
                    className="nav__button"
                    id="publishOpportunities"
                    onClick={() => setIsPublishModalOpen(true)}
                  >
                    Publish Opportunity
                  </button>
                )}
                <button
                  className="nav__button"
                  id="logInSignUp"
                  onClick={() => {
                    if (user) {
                      // If already logged in, open the logout modal
                      setIsLogoutModalOpen(true);
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                >
                  {user ? "Log Out" : "Log In/Sign Up"}
                </button>
              </div>
            </nav>
          </header>

          {isSuccessOverlayOpen && (
            <div className="signup-modal">
              <div
                className="overlay overlay--signup"
                onClick={() => setIsSuccessOverlayOpen(false)}
              ></div>
              <div className="signup-form-window fade-in">
                <button
                  className="btn--close-modal signup-btn--close-modal"
                  onClick={() => setIsSuccessOverlayOpen(false)}
                >
                  &times;
                </button>

                <SuccessMessage text={successOverlayMessage} />
              </div>
            </div>
          )}

          {/* Login Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
            onShowSignUp={() => setIsSignUpModalOpen(true)}
            role={role}
            mustLogin={mustLogin}
          />

          {/* Logout Modal */}
          {isLogoutModalOpen && (
            <LogoutModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              onLogout={handleLogout}
              user={user}
            />
          )}

          {/* Signup Modal */}
          {isSignUpModalOpen && (
            <SignupModal
              isOpen={isSignUpModalOpen}
              onClose={() => setIsSignUpModalOpen(false)}
              onSignUp={handleSignUp}
              onValidateEmail={
                role === "student" ? model.validateEmail : undefined
              }
              role={role}
              mustSignUp={mustSignUp}
            />
          )}

          <ApplyModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            onApply={handleApply}
          />

          <PublishModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            onPublish={async (data) => {
              // Call your model function to upload the opportunity.
              await model.uploadOpportunity(data);
              // After successful publishing, update the opportunity details view.
              setSelectedOpportunity(model.state.opportunity);
              // Update the URL hash (optional)
              window.history.pushState(
                null,
                "",
                `#${model.state.opportunity.id}`
              );
            }}
          />

          {/* Conditional content: Admin Dashboard, Opportunity Details and Main/Home content */}
          {isAdminView ? (
            <AdminDashboard
              isCompanyUser={user && user.accountType === "company"}
              stats={adminStats}
              loadingStats={adminLoading}
              error={adminError}
              onSmartSearch={handleAdminSmartSearch}
              smartSearchResults={adminSmartSearchResults}
              loadingSmartSearch={adminSmartSearchLoading}
              smartSearchError={adminSmartSearchError}
            />
          ) : typeof window !== "undefined" &&
            window.location.hash ? (
            detailsLoading || !selectedOpportunity ? (
              <LoadingSpinner />
            ) : (
              <OpportunityDetails
                opportunity={selectedOpportunity}
                onClose={() => {
                  window.location.hash = "";
                  setSelectedOpportunity(null);
                }}
                user={user}
                onApply={() => {
                  if (!user || user.accountType !== "student") {
                    alert(
                      "You must be logged in as a student to apply."
                    );
                    return;
                  }

                  setIsApplyModalOpen(true);
                }}
              />
            )
          ) : (
            // {/* Main Content */}
            // {/* Intro Section */}
            <div id="main-content" className="">
              <section className="intro-section">
                {hasSearched && searchQuery ? (
                  <IntroSection query={searchQuery} />
                ) : (
                  <div className="container">
                    <h1 className="intro-title">
                      Headstart your career with the best companies
                    </h1>
                    <p className="intro-text">
                      Search from thousands of student opportunities
                      in multiple sectors and locations.
                    </p>
                  </div>
                )}
              </section>

              {/* Search Form Section */}
              <section className="search-section">
                <div className="container search-container">
                  <SearchForm onSearch={handleSearch} />
                </div>
              </section>

              {/* Loading and error messages */}
              {loading && <LoadingSpinner />}
              {error && <ErrorMessage text={error} />}

              {/* Results List & Pagination */}
              {hasSearched &&
                !loading &&
                !error &&
                (results.length > 0 ? (
                  <section className="opportunities-list">
                    <div className="container">
                      <h2>Available Opportunities</h2>
                      <ResultsList results={results} />
                      <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </section>
                ) : (
                  <ErrorMessage text="No opportunities found for your query! Please try again." />
                ))}

              {/* Featured Opportunities Section */}
              {!hasSearched && (
                <section
                  id="featured-section"
                  className="featured-opportunity"
                >
                  <div className="container">
                    <h2>Featured Opportunities</h2>
                    <FeaturedOpportunities
                      data={featured}
                      loading={featuredLoading}
                      error={featuredError}
                    />
                  </div>
                </section>
              )}

              {/* Opportunities List Section */}
              <section className="opportunities-list hidden">
                <div className="container">
                  <h2>Available Opportunities</h2>
                  <div className="container-opp-list"></div>
                  <div className="pagination"></div>
                </div>
              </section>
            </div>
          )}

          {/* Newsletter Subscription Section */}
          <section id="newsletter-section" className="newsletter">
            <h2>
              Top career and research opportunities in your inbox
            </h2>
            <p>
              Subscribe to the Student-Company Platform newsletter to
              recieve latest opportunities once a week.
            </p>
            <form action="#">
              <div className="select-field">
                <select
                  name="field-of-interest"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a field...
                  </option>
                  <option value="Architecture">Architecture</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="Computer Sciences and Engineering">
                    Computer Sciences and Engineering
                  </option>
                  <option value="Artificial Intelligence and Data Engineering">
                    Artificial Intelligence and Data Engineering
                  </option>
                  <option value="Genetics and Bioengineering">
                    Genetics and Bioengineering
                  </option>
                  <option value="Electrical and Electronics Engineering">
                    Electrical and Electronics Engineering
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Visual Arts and Visual Communications Design">
                    Visual Arts and Visual Communications Design
                  </option>
                  <option value="Media and Communication">
                    Media and Communication
                  </option>
                </select>
              </div>
              <input
                type="email"
                placeholder="Your email address..."
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </section>

          {/* Footer Section */}
          <footer className="main-footer">
            <div className="container">
              <p>
                &copy; 2025 Student-Company Platfrom. All Rights
                Reserved.
              </p>
            </div>
          </footer>
        </main>
      )}
    </>
  );
}
