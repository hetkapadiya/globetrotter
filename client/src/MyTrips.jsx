import { useEffect, useState } from "react";
import {
  Map,
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

function MyTrips({ onNavigate }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("globetrotter_token");

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/trips",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load trips"
        );
      }

      setTrips(result.data || []);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError(err.message || "Unable to load your trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const difference =
      Math.ceil(
        (endDate - startDate) /
          (1000 * 60 * 60 * 24)
      );

    return Math.max(difference, 1);
  };

  const getDestinations = (trip) => {
    if (Array.isArray(trip.stops)) {
      return trip.stops.length;
    }

    return 0;
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

      setTrips((currentTrips) =>
        currentTrips.filter(
          (trip) => trip.id !== tripId
        )
      );
    } catch (err) {
      console.error("Delete trip failed:", err);

      alert(
        err.message ||
          "Unable to delete this trip."
      );
    }
  };

  return (
    <div className="my-trips-page">

      {/* Header */}
      <section className="my-trips-header">
        <div>
          <p className="eyebrow">YOUR JOURNEYS</p>

          <h1>My Trips</h1>

          <p>
            All your adventures in one place.
            Plan, review and manage your journeys.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => onNavigate("create")}
        >
          <Plus size={18} />
          Plan New Trip
        </button>
      </section>

      {/* Loading */}
      {loading && (
        <div className="trips-state">
          <Loader2
            size={28}
            className="spin"
          />

          <p>Loading your journeys...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="trips-error">
          <AlertCircle size={20} />

          <div>
            <strong>
              Couldn't load your trips
            </strong>

            <p>{error}</p>
          </div>

          <button onClick={loadTrips}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        trips.length === 0 && (
          <div className="empty-trips">
            <div className="empty-trip-icon">
              <Map size={34} />
            </div>

            <h2>No trips yet</h2>

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

      {/* Trip cards */}
      {!loading &&
        !error &&
        trips.length > 0 && (
          <section className="trip-list">

            {trips.map((trip) => (
              <article
                className="my-trip-card"
                key={trip.id}
              >

                {/* Cover */}
                <div className="trip-cover">

                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                    />
                  ) : (
                    <div className="trip-cover-placeholder">
                      <Map size={42} />
                    </div>
                  )}

                  <div className="trip-cover-overlay">
                    <span>
                      {trip.isPublic
                        ? "PUBLIC"
                        : "PRIVATE"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="trip-card-content">

                  <div className="trip-card-top">

                    <div>
                      <p className="trip-card-label">
                        TRIP
                      </p>

                      <h2>{trip.name}</h2>
                    </div>

                    <div className="trip-budget">
                      <Wallet size={16} />

                      <span>
                        ₹
                        {Number(
                          trip.budget || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>

                  </div>

                  {trip.description && (
                    <p className="trip-description">
                      {trip.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="trip-meta">

                    <div>
                      <CalendarDays size={16} />

                      <span>
                        {formatDate(
                          trip.startDate
                        )}{" "}
                        –{" "}
                        {formatDate(
                          trip.endDate
                        )}
                      </span>
                    </div>

                    <div>
                      <MapPin size={16} />

                      <span>
                        {getDestinations(
                          trip
                        )}{" "}
                        destination
                        {getDestinations(
                          trip
                        ) !== 1
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

                  {/* Actions */}
                  <div className="trip-card-actions">

                    <button
                      className="view-trip-button"
                      onClick={() =>
                        alert(
                          "Trip details screen coming next!"
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
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </section>
        )}
    </div>
  );
}

export default MyTrips;