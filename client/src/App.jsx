import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Map,
  Plus,
  CalendarDays,
  Compass,
  Users,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Plane,
  MapPin,
  Wallet,
  Clock3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { getCities } from "./api";
import Discover from "./Discover";
import CreateTrip from "./CreateTrip";
import Auth from "./Auth";
import TripDetails from "./TripDetails";
import MyTrips from "./MyTrips";
import Calendar from "./Calendar";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [selectedTripId, setSelectedTripId] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("globetrotter_user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("globetrotter_user");
      return null;
    }
  });

  const [authChecking, setAuthChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================================
     VERIFY AUTHENTICATION
     ========================================================= */

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem("globetrotter_token");

      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const response = await fetch("`${import.meta.env.VITE_API_URL}/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const result = await response.json();

        const currentUser = result?.data?.user || result?.data || result?.user;

        if (!currentUser) {
          throw new Error("User information not returned");
        }

        setUser(currentUser);

        localStorage.setItem("globetrotter_user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("globetrotter_token");

        localStorage.removeItem("globetrotter_user");

        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAuthentication();
  }, []);

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const navigation = [
    {
      section: "MAIN",

      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },

        {
          id: "trips",
          label: "My Trips",
          icon: Map,
        },

        {
          id: "create",
          label: "Plan New Trip",
          icon: Plus,
        },

        {
          id: "calendar",
          label: "Calendar",
          icon: CalendarDays,
        },
      ],
    },

    {
      section: "EXPLORE",

      items: [
        {
          id: "discover",
          label: "Discover",
          icon: Compass,
        },

        {
          id: "community",
          label: "Community",
          icon: Users,
        },
      ],
    },

    {
      section: "ACCOUNT",

      items: [
        {
          id: "profile",
          label: "Profile",
          icon: UserCircle,
        },

        {
          id: "settings",
          label: "Settings",
          icon: Settings,
        },
      ],
    },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    trips: "My Trips",
    create: "Plan New Trip",
    calendar: "Travel Calendar",
    discover: "Discover",
    community: "Community",
    profile: "Profile",
    settings: "Settings",
    "trip-details": "Trip Details",
  };

  /* =========================================================
     AUTH HANDLERS
     ========================================================= */

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    setSelectedTripId(null);

    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("globetrotter_token");

    localStorage.removeItem("globetrotter_user");

    setUser(null);

    setSelectedTripId(null);

    setActivePage("dashboard");
  };

  /* =========================================================
     NORMAL NAVIGATION
     ========================================================= */

  const handleNavigation = (page) => {
    setActivePage(page);

    setSidebarOpen(false);

    /*
      When leaving Trip Details we keep selectedTripId.
      This makes it possible to return to the same trip.
    */
  };

  /* =========================================================
     OPEN TRIP DETAILS
     ========================================================= */

  const handleOpenTrip = (tripId) => {
    if (!tripId) {
      console.error("Cannot open trip: trip ID missing");

      return;
    }

    console.log("Opening trip:", tripId);

    setSelectedTripId(tripId);

    setActivePage("trip-details");

    setSidebarOpen(false);
  };

  /* =========================================================
     AUTH LOADING
     ========================================================= */

  if (authChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f6",
          color: "#73516c",
          fontSize: "14px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        Loading your journey...
      </div>
    );
  }

  /* =========================================================
     AUTH SCREEN
     ========================================================= */

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  /* =========================================================
     MAIN APP
     ========================================================= */

  return (
    <div className="app">
      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* BRAND */}

        <div className="brand">
          <div className="brand-icon">
            <img src="/globetrotter.svg" alt="GlobeTrotter logo" />
          </div>

          <div>
            <h1>GlobeTrotter</h1>

            <span>Plan smarter • Travel better</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.section}>
              <p className="nav-section">{group.section}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    className={`nav-item ${
                      activePage === item.id ? "active" : ""
                    }`}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <Icon size={19} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">{getInitials(user.name || user.email)}</div>

            <div>
              <strong>{user.name || "Traveler"}</strong>

              <span>Traveler</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="main">
        {/* TOPBAR */}

        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div>
            <p className="breadcrumb">GlobeTrotter</p>

            <h2>{pageTitles[activePage] || "GlobeTrotter"}</h2>
          </div>

          <div className="topbar-right">
            <button className="icon-button">
              <Sparkles size={19} />
            </button>

            <div className="top-avatar">
              {getInitials(user.name || user.email)}
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
            ================================================= */}

        <div className="content">
          {/* DASHBOARD */}

          {activePage === "dashboard" && (
            <Dashboard
              onNavigate={handleNavigation}
              onOpenTrip={handleOpenTrip}
              user={user}
            />
          )}

          {activePage === "trips" && (
            <MyTrips
              onNavigate={handleNavigation}
              onOpenTrip={handleOpenTrip}
            />
          )}

          {/* DISCOVER */}

          {activePage === "discover" && (
            <Discover onNavigate={handleNavigation} />
          )}

          {activePage === "calendar" && (
            <Calendar
              onNavigate={handleNavigation}
              onOpenTrip={handleOpenTrip}
            />
          )}

          {/* CREATE TRIP */}

          {activePage === "create" && (
            <CreateTrip onNavigate={handleNavigation} />
          )}

          {/* TRIP DETAILS */}

          {activePage === "trip-details" && selectedTripId && (
            <TripDetails
              tripId={selectedTripId}
              onNavigate={handleNavigation}
            />
          )}

          {/* OTHER PAGES */}

          {activePage !== "dashboard" &&
            activePage !== "discover" &&
            activePage !== "create" &&
            activePage !== "calendar" &&
            activePage !== "trip-details" && (
              <PlaceholderPage
                title={pageTitles[activePage]}
                onNavigate={handleNavigation}
              />
            )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getFirstName(name) {
  if (!name) return "";

  return name.trim().split(/\s+/)[0];
}

function getInitials(value) {
  if (!value) return "T";

  const parts = String(value).trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return parts[0].slice(0, 2).toUpperCase();
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({ onNavigate, onOpenTrip, user }) {
  const [cities, setCities] = useState([]);

  const [loadingCities, setLoadingCities] = useState(true);

  const [trips, setTrips] = useState([]);

  const [loadingTrips, setLoadingTrips] = useState(true);

  /* =======================================================
     LOAD TRIPS
     ======================================================= */

  useEffect(() => {
    async function loadTrips() {
      const token = localStorage.getItem("globetrotter_token");

      if (!token) {
        setLoadingTrips(false);
        return;
      }

      try {
        const response = await fetch("`${import.meta.env.VITE_API_URL}/api/trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load trips");
        }

        setTrips(result.data || []);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoadingTrips(false);
      }
    }

    loadTrips();
  }, []);

  /* =======================================================
     LOAD CITIES
     ======================================================= */

  useEffect(() => {
    async function loadCities() {
      try {
        const result = await getCities();

        setCities(result.data || []);
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, []);

  /* =======================================================
     UPCOMING TRIP
     ======================================================= */

  const upcomingTrip = [...trips]
    .filter((trip) => new Date(trip.endDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  return (
    <>
      {/* ===================================================
          WELCOME
          =================================================== */}

      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR TRAVEL SPACE</p>

          <h1>
            Welcome back,{" "}
            <span>{user?.name?.split(" ")[0] || "Traveler"}!</span> 👋
          </h1>

          <p className="welcome-text">
            Plan your next adventure, organize your itinerary and travel without
            the stress.
          </p>
        </div>

        <button className="primary-button" onClick={() => onNavigate("create")}>
          <Plus size={19} />
          Plan New Trip
        </button>
      </section>

      {/* ===================================================
          STATS
          =================================================== */}

      <section className="stats-grid">
        <StatCard
          icon={<Map size={21} />}
          value={trips.length}
          label="Total Trips"
          detail={`${
            trips.filter((trip) => new Date(trip.startDate) >= new Date())
              .length
          } upcoming`}
        />

        <StatCard
          icon={<MapPin size={21} />}
          value="8"
          label="Cities Visited"
          detail="+2 this year"
        />

        <StatCard
          icon={<Wallet size={21} />}
          value="₹42K"
          label="Trip Spending"
          detail="Across all trips"
        />

        <StatCard
          icon={<Clock3 size={21} />}
          value="18"
          label="Travel Days"
          detail="This year"
        />
      </section>

      {/* ===================================================
          UPCOMING TRIP
          =================================================== */}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UP NEXT</p>

            <h2>Your upcoming adventure</h2>
          </div>

          <button className="text-button" onClick={() => onNavigate("trips")}>
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {loadingTrips ? (
          <div className="loading-message">Loading your trips...</div>
        ) : !upcomingTrip ? (
          <div className="upcoming-card empty-trip-card">
            <div>
              <p className="eyebrow">READY TO EXPLORE?</p>

              <h2>Your next adventure starts here.</h2>

              <p>Create your first trip and start building your itinerary.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => onNavigate("create")}
            >
              <Plus size={19} />
              Plan New Trip
            </button>
          </div>
        ) : (
          <div className="upcoming-card">
            <div className="trip-cover">
              <div className="cover-gradient" />

              <div className="cover-content">
                <span className="trip-status">UPCOMING</span>

                <h2>{upcomingTrip.name}</h2>

                <p>
                  <CalendarDays size={15} />

                  {new Date(upcomingTrip.startDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}

                  {" — "}

                  {new Date(upcomingTrip.endDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="trip-summary">
              <div className="route">
                {upcomingTrip.stops?.map((stop, index) => (
                  <div key={stop.id}>
                    <div className="route-point">
                      <span
                        className={`route-dot ${
                          index === upcomingTrip.stops.length - 1
                            ? "destination"
                            : ""
                        }`}
                      />

                      <div>
                        <strong>{stop.city?.name || "Unknown city"}</strong>

                        <span>
                          {Math.max(
                            1,
                            Math.ceil(
                              (new Date(stop.endDate) -
                                new Date(stop.startDate)) /
                                (1000 * 60 * 60 * 24),
                            ),
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>

                    {index < upcomingTrip.stops.length - 1 && (
                      <div className="route-line" />
                    )}
                  </div>
                ))}
              </div>

              <div className="trip-info">
                <div>
                  <span>Estimated budget</span>

                  <strong>
                    {upcomingTrip.budget
                      ? `₹${Number(upcomingTrip.budget).toLocaleString(
                          "en-IN",
                        )}`
                      : "Not set"}
                  </strong>
                </div>

                <div>
                  <span>Activities</span>

                  <strong>
                    {upcomingTrip.activities?.length || 0} planned
                  </strong>
                </div>

                <button
                  className="outline-button"
                  onClick={() => onOpenTrip(upcomingTrip.id)}
                >
                  View Trip
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================================================
          QUICK ACTIONS
          =================================================== */}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">QUICK ACTIONS</p>

            <h2>What would you like to do?</h2>
          </div>
        </div>

        <div className="quick-grid">
          <QuickAction
            icon={<Plus />}
            title="Create a Trip"
            description="Build a personalized multi-city itinerary."
            onClick={() => onNavigate("create")}
          />

          <QuickAction
            icon={<Compass />}
            title="Discover Places"
            description="Find cities and activities for your next trip."
            onClick={() => onNavigate("discover")}
          />

          <QuickAction
            icon={<CalendarDays />}
            title="View Calendar"
            description="See your complete travel timeline."
            onClick={() => onNavigate("calendar")}
          />

          <QuickAction
            icon={<Users />}
            title="Community"
            description="Get inspiration from other travelers."
            onClick={() => onNavigate("community")}
          />
        </div>
      </section>

      {/* ===================================================
          RECOMMENDED DESTINATIONS
          =================================================== */}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TRAVEL INSPIRATION</p>

            <h2>Popular destinations</h2>
          </div>

          <button
            className="text-button"
            onClick={() => onNavigate("discover")}
          >
            Explore
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="destination-grid">
          {loadingCities ? (
            <div className="loading-message">Loading destinations...</div>
          ) : (
            cities
              .slice(0, 4)
              .map((city) => (
                <DestinationCard
                  key={city.id}
                  city={city.name}
                  country={city.country}
                  price={`Cost index ${city.costIndex}`}
                  emoji={getCityEmoji(city.name)}
                />
              ))
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({ icon, value, label, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <strong>{value}</strong>

        <span>{label}</span>

        <small>{detail}</small>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
   ========================================================= */

function QuickAction({ icon, title, description, onClick }) {
  return (
    <button className="quick-card" onClick={onClick}>
      <div className="quick-icon">{icon}</div>

      <div>
        <strong>{title}</strong>

        <p>{description}</p>
      </div>

      <ArrowRight className="quick-arrow" size={18} />
    </button>
  );
}

/* =========================================================
   CITY EMOJI
   ========================================================= */

function getCityEmoji(city) {
  const emojis = {
    Mumbai: "🌆",
    Goa: "🌴",
    Delhi: "🏛️",
    Jaipur: "🏰",
    Udaipur: "🏞️",
    Ahmedabad: "🕌",
    Dubai: "🏙️",
    Bali: "🌺",
    Paris: "🗼",
    Tokyo: "🗾",
    London: "🎡",
  };

  return emojis[city] || "🌍";
}

/* =========================================================
   DESTINATION CARD
   ========================================================= */

function DestinationCard({ city, country, price, emoji }) {
  return (
    <div className="destination-card">
      <div className="destination-image">
        <span>{emoji}</span>
      </div>

      <div className="destination-content">
        <div>
          <strong>{city}</strong>

          <span>{country}</span>
        </div>

        <small>{price}</small>
      </div>
    </div>
  );
}

/* =========================================================
   PLACEHOLDER
   ========================================================= */

function PlaceholderPage({ title, onNavigate }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <Sparkles size={30} />
      </div>

      <p className="eyebrow">COMING NEXT</p>

      <h1>{title}</h1>

      <p>
        This section is part of the GlobeTrotter journey. We're connecting it to
        the backend step-by-step.
      </p>

      <button
        className="primary-button"
        onClick={() => onNavigate("dashboard")}
      >
        <ArrowRight size={18} />
        Back to Dashboard
      </button>
    </div>
  );
}

export default App;
