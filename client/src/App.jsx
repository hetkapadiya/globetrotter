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

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("globetrotter_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      section: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "trips", label: "My Trips", icon: Map },
        { id: "create", label: "Plan New Trip", icon: Plus },
        { id: "calendar", label: "Calendar", icon: CalendarDays },
      ],
    },
    {
      section: "EXPLORE",
      items: [
        { id: "discover", label: "Discover", icon: Compass },
        { id: "community", label: "Community", icon: Users },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { id: "profile", label: "Profile", icon: UserCircle },
        { id: "settings", label: "Settings", icon: Settings },
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
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("globetrotter_token");

    localStorage.removeItem("globetrotter_user");

    setUser(null);
    setActivePage("dashboard");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
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

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">H</div>

            <div>
              <strong>Het Kapadiya</strong>
              <span>Traveler</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={() => alert("Logout will be connected to authentication.")}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div>
            <p className="breadcrumb">GlobeTrotter</p>
            <h2>{pageTitles[activePage]}</h2>
          </div>

          <div className="topbar-right">
            <button className="icon-button">
              <Sparkles size={19} />
            </button>

            <div className="top-avatar">H</div>
          </div>
        </header>

        <div className="content">
          {activePage === "dashboard" && (
            <Dashboard onNavigate={handleNavigation} />
          )}

          {activePage === "discover" && (
            <Discover onNavigate={handleNavigation} />
          )}

          {activePage === "create" && (
            <CreateTrip onNavigate={handleNavigation} />
          )}

          {activePage !== "dashboard" &&
            activePage !== "discover" &&
            activePage !== "create" && (
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

function Dashboard({ onNavigate }) {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

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
  return (
    <>
      {/* Welcome */}
      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR TRAVEL SPACE</p>

          <h1>
            Welcome back, <span>Het!</span> 👋
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

      {/* Stats */}
      <section className="stats-grid">
        <StatCard
          icon={<Map size={21} />}
          value="3"
          label="Total Trips"
          detail="2 upcoming"
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

      {/* Upcoming trip */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UP NEXT</p>
            <h2>Your upcoming adventure</h2>
          </div>

          <button className="text-button" onClick={() => onNavigate("trips")}>
            View all <ArrowRight size={16} />
          </button>
        </div>

        <div className="upcoming-card">
          <div className="trip-cover">
            <div className="cover-gradient" />

            <div className="cover-content">
              <span className="trip-status">UPCOMING</span>

              <h2>Goa Escape</h2>

              <p>
                <CalendarDays size={15} />
                10 Sep — 15 Sep 2026
              </p>
            </div>
          </div>

          <div className="trip-summary">
            <div className="route">
              <div className="route-point">
                <span className="route-dot" />
                <div>
                  <strong>Mumbai</strong>
                  <span>2 days</span>
                </div>
              </div>

              <div className="route-line" />

              <div className="route-point">
                <span className="route-dot destination" />
                <div>
                  <strong>Goa</strong>
                  <span>3 days</span>
                </div>
              </div>
            </div>

            <div className="trip-info">
              <div>
                <span>Estimated budget</span>
                <strong>₹18,000</strong>
              </div>

              <div>
                <span>Activities</span>
                <strong>8 planned</strong>
              </div>

              <button
                className="outline-button"
                onClick={() => onNavigate("trips")}
              >
                View Trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
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

      {/* Recommended */}
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
            Explore <ArrowRight size={16} />
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

function getCityEmoji(city) {
  const emojis = {
    Mumbai: "🌆",
    Goa: "🌴",
    Delhi: "🏛️",
    Jaipur: "🏰",
    Udaipur: "🏞️",
    Dubai: "🏙️",
    Bali: "🌺",
    Paris: "🗼",
    Tokyo: "🗾",
    London: "🎡",
  };

  return emojis[city] || "🌍";
}

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
