import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Wallet,
  Eye,
  Trash2,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

function MyTrips({ onNavigate, onOpenTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("globetrotter_token");

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch trips"
        );
      }

      setTrips(result.data || []);
    } catch (err) {
      console.error("My Trips error:", err);
      setError(
        err.message || "Unable to load your trips."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDays = (start, end) => {
    if (!start || !end) return 0;

    const difference =
      Math.ceil(
        (new Date(end) -
          new Date(start)) /
          (1000 * 60 * 60 * 24)
      );

    return Math.max(difference, 1);
  };

  const getStatus = (trip) => {
    const today = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (end < today) {
      return "Completed";
    }

    if (start <= today && end >= today) {
      return "Ongoing";
    }

    return "Upcoming";
  };

  const handleDelete = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete trip"
        );
      }

      setTrips((current) =>
        current.filter(
          (trip) => trip.id !== tripId
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Unable to delete this trip."
      );
    }
  };

  return (
    <div className="my-trips-page">

      {/* HEADER */}

      <section className="my-trips-header">

        <div>
          <p className="eyebrow">
            YOUR JOURNEYS
          </p>

          <h1>My Trips</h1>

          <p>
            All your adventures in one place.
            Plan, review and manage your journeys.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            onNavigate("create")
          }
        >
          <Plus size={18} />
          Plan New Trip
        </button>

      </section>

      {/* LOADING */}

      {loading && (
        <div className="trips-state">

          <Loader2
            size={30}
            className="spin"
          />

          <p>
            Loading your journeys...
          </p>

        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="trips-error">

          <AlertCircle size={20} />

          <div>
            <strong>
              Couldn't load your trips
            </strong>

            <p>{error}</p>
          </div>

          <button
            onClick={loadTrips}
          >
            Retry
          </button>

        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        trips.length === 0 && (
          <div className="empty-trips">

            <div className="empty-trip-icon">
              <MapPin size={34} />
            </div>

            <h2>
              No trips yet
            </h2>

            <p>
              Your next adventure is waiting.
              Start planning your first trip.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                onNavigate("create")
              }
            >
              <Plus size={18} />
              Create Your First Trip
            </button>

          </div>
        )}

      {/* TRIPS */}

      {!loading &&
        !error &&
        trips.length > 0 && (
          <section className="trip-list">

            {trips.map((trip) => {

              const status =
                getStatus(trip);

              const destinationCount =
                trip.stops?.length || 0;

              return (
                <article
                  className="my-trip-card"
                  key={trip.id}
                >

                  {/* COVER */}

                  <div className="trip-cover">

                    {trip.coverImage ? (
                      <img
                        src={trip.coverImage}
                        alt={trip.name}
                      />
                    ) : (
                      <div className="trip-cover-placeholder">
                        <MapPin size={42} />
                      </div>
                    )}

                    <div className="trip-cover-overlay">
                      <span
                        className={`trip-status-badge ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="trip-card-content">

                    <div className="trip-card-top">

                      <div>

                        <p className="trip-card-label">
                          TRIP
                        </p>

                        <h2>
                          {trip.name}
                        </h2>

                      </div>

                      <div className="trip-budget">
                        <Wallet size={16} />

                        <span>
                          ₹
                          {Number(
                            trip.budget || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                    </div>

                    {trip.description && (
                      <p className="trip-description">
                        {trip.description}
                      </p>
                    )}

                    {/* META */}

                    <div className="trip-meta">

                      <div>
                        <CalendarDays
                          size={16}
                        />

                        <span>
                          {formatDate(
                            trip.startDate
                          )}
                          {" – "}
                          {formatDate(
                            trip.endDate
                          )}
                        </span>
                      </div>

                      <div>
                        <MapPin size={16} />

                        <span>
                          {destinationCount}{" "}
                          destination
                          {destinationCount !==
                          1
                            ? "s"
                            : ""}
                        </span>
                      </div>

                      <div>
                        <span className="days-dot" />

                        <span>
                          {getDays(
                            trip.startDate,
                            trip.endDate
                          )}{" "}
                          days
                        </span>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="trip-card-actions">

                      <button
                        className="view-trip-button"
                        onClick={() =>
                          onOpenTrip(
                            trip.id
                          )
                        }
                      >
                        <Eye size={17} />

                        View Trip

                        <ArrowRight
                          size={16}
                        />
                      </button>

                      <button
                        className="delete-trip-button"
                        onClick={() =>
                          handleDelete(
                            trip.id
                          )
                        }
                        title="Delete trip"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>
        )}

    </div>
  );
}

export default MyTrips;