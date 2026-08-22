import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Wallet,
  Plus,
  Clock3,
  Trash2,
  GripVertical,
  Sparkles,
  ChevronDown,
} from "lucide-react";

function TripDetails({ tripId, onNavigate }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("globetrotter_token");

  useEffect(() => {
    async function loadTrip() {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error("Authentication required.");
        }

        const response = await fetch(
          `http://localhost:5000/api/trips/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load trip"
          );
        }

        setTrip(result.data);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Unable to load trip."
        );
      } finally {
        setLoading(false);
      }
    }

    if (tripId) {
      loadTrip();
    }
  }, [tripId]);

  const stops = trip?.stops || [];

  const totalActivities = useMemo(() => {
    return stops.reduce(
      (total, stop) =>
        total + (stop.activities?.length || 0),
      0
    );
  }, [stops]);

  const totalActivityCost = useMemo(() => {
    return stops.reduce((total, stop) => {
      return (
        total +
        (stop.activities || []).reduce(
          (sum, activity) =>
            sum +
            Number(
              activity.customCost ??
                activity.activity?.estimatedCost ??
                0
            ),
          0
        )
      );
    }, 0);
  }, [stops]);

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatShortDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  if (loading) {
    return (
      <div className="trip-details-state">
        <div className="loading-spinner" />
        <p>Loading your itinerary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details-page">
        <button
          className="back-link"
          onClick={() => onNavigate("trips")}
        >
          <ArrowLeft size={16} />
          Back to My Trips
        </button>

        <div className="form-alert error">
          {error}
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="trip-details-page">

      {/* Back */}
      <button
        className="back-link"
        onClick={() => onNavigate("trips")}
      >
        <ArrowLeft size={16} />
        Back to My Trips
      </button>

      {/* Hero */}
      <section className="trip-details-hero">

        <div>
          <p className="eyebrow">
            YOUR JOURNEY
          </p>

          <h1>{trip.name}</h1>

          {trip.description && (
            <p className="trip-hero-description">
              {trip.description}
            </p>
          )}

          <div className="trip-hero-meta">

            <span>
              <CalendarDays size={16} />
              {formatDate(trip.startDate)}
              {" – "}
              {formatDate(trip.endDate)}
            </span>

            <span>
              <MapPin size={16} />
              {stops.length} destination
              {stops.length !== 1 ? "s" : ""}
            </span>

            <span>
              <Wallet size={16} />
              ₹
              {Number(
                trip.budget || 0
              ).toLocaleString("en-IN")}
            </span>

          </div>
        </div>

        <button className="secondary-action">
          <Sparkles size={17} />
          Smart Suggestions
        </button>

      </section>

      {/* Stats */}
      <section className="itinerary-stats">

        <div>
          <span>DESTINATIONS</span>
          <strong>{stops.length}</strong>
        </div>

        <div>
          <span>ACTIVITIES</span>
          <strong>{totalActivities}</strong>
        </div>

        <div>
          <span>ACTIVITY COST</span>
          <strong>
            ₹
            {totalActivityCost.toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <div>
          <span>TRIP BUDGET</span>
          <strong>
            ₹
            {Number(
              trip.budget || 0
            ).toLocaleString("en-IN")}
          </strong>
        </div>

      </section>

      {/* Main */}
      <div className="itinerary-layout">

        {/* Left */}
        <section className="itinerary-main">

          <div className="itinerary-heading">
            <div>
              <p className="eyebrow">
                DAY-BY-DAY
              </p>
              <h2>Your itinerary</h2>
            </div>

            <button className="outline-button">
              <Plus size={17} />
              Add Stop
            </button>
          </div>

          {stops.length === 0 ? (
            <div className="empty-itinerary">

              <MapPin size={32} />

              <h3>
                No destinations yet
              </h3>

              <p>
                Add your first destination
                to start building your journey.
              </p>

              <button className="primary-button">
                <Plus size={17} />
                Add Destination
              </button>

            </div>
          ) : (
            <div className="timeline">

              {stops.map((stop, index) => {

                const city =
                  stop.city || {};

                const activities =
                  stop.activities || [];

                return (
                  <article
                    className="stop-card"
                    key={stop.id}
                  >

                    {/* Timeline */}
                    <div className="timeline-marker">
                      <span>
                        {index + 1}
                      </span>
                    </div>

                    {/* Stop */}
                    <div className="stop-content">

                      <div className="stop-header">

                        <div>
                          <p className="stop-label">
                            STOP {index + 1}
                          </p>

                          <h3>
                            {city.name ||
                              "Destination"}
                          </h3>

                          <p className="stop-country">
                            {city.region
                              ? `${city.region}, `
                              : ""}
                            {city.country || ""}
                          </p>
                        </div>

                        <button
                          className="icon-danger"
                          title="Remove stop"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                      <div className="stop-date">

                        <CalendarDays size={15} />

                        {formatShortDate(
                          stop.startDate
                        )}

                        {" – "}

                        {formatShortDate(
                          stop.endDate
                        )}

                      </div>

                      {/* Activities */}
                      <div className="activities-section">

                        <div className="activities-heading">
                          <div>
                            <Clock3 size={16} />
                            <strong>
                              Activities
                            </strong>
                          </div>

                          <button className="small-add-button">
                            <Plus size={14} />
                            Add Activity
                          </button>
                        </div>

                        {activities.length === 0 ? (
                          <div className="no-activities">
                            No activities planned yet.
                          </div>
                        ) : (
                          <div className="activity-list">

                            {activities.map(
                              (item) => {

                                const activity =
                                  item.activity ||
                                  item;

                                const cost =
                                  Number(
                                    item.customCost ??
                                      activity.estimatedCost ??
                                      0
                                  );

                                return (
                                  <div
                                    className="activity-item"
                                    key={item.id}
                                  >

                                    <GripVertical
                                      size={17}
                                      className="drag-icon"
                                    />

                                    <div className="activity-info">

                                      <strong>
                                        {activity.name}
                                      </strong>

                                      <span>
                                        {activity.category ||
                                          "Experience"}
                                        {" • "}
                                        {activity.duration ||
                                          0}
                                        h
                                      </span>

                                    </div>

                                    <div className="activity-cost">
                                      ₹
                                      {cost.toLocaleString(
                                        "en-IN"
                                      )}
                                    </div>

                                    <button className="activity-menu">
                                      <ChevronDown
                                        size={16}
                                      />
                                    </button>

                                  </div>
                                );
                              }
                            )}

                          </div>
                        )}

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* Right */}
        <aside className="itinerary-sidebar">

          <div className="budget-card">

            <div className="budget-card-header">
              <div>
                <p>
                  TRIP BUDGET
                </p>

                <h3>
                  ₹
                  {Number(
                    trip.budget || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h3>
              </div>

              <Wallet size={22} />
            </div>

            <div className="budget-progress">
              <div
                style={{
                  width: `${Math.min(
                    trip.budget
                      ? (totalActivityCost /
                          trip.budget) *
                          100
                      : 0,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="budget-row">
              <span>
                Planned activities
              </span>

              <strong>
                ₹
                {totalActivityCost.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="budget-row">
              <span>
                Remaining
              </span>

              <strong>
                ₹
                {Math.max(
                  Number(
                    trip.budget || 0
                  ) -
                    totalActivityCost,
                  0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          <div className="smart-card">

            <Sparkles size={20} />

            <h3>
              Make your trip smarter
            </h3>

            <p>
              Get activity suggestions
              based on your destination,
              time and budget.
            </p>

            <button>
              Explore suggestions
            </button>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default TripDetails;