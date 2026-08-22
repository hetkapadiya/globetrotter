import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Wallet,
  Clock3,
  ArrowRight,
  Loader2,
  Plane,
} from "lucide-react";

import { API_URL } from "./config";

function Calendar({ onNavigate, onOpenTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const token =
    localStorage.getItem(
      "globetrotter_token"
    );

  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Authentication required."
          );
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/trips`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load trips"
          );
        }

        setTrips(
          result.data || []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load calendar."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  /* =====================================================
     MONTH HELPERS
     ===================================================== */

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const monthName =
    currentMonth.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const calendarDays = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const previousMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToday = () => {
    setCurrentMonth(
      new Date()
    );
  };

  /* =====================================================
     DATE UTILITIES
     ===================================================== */

  const toDateKey = (date) => {
    const d =
      new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const isTripOnDay = (
    trip,
    day
  ) => {
    const date =
      new Date(
        year,
        month,
        day
      );

    const start =
      new Date(
        trip.startDate
      );

    const end =
      new Date(
        trip.endDate
      );

    date.setHours(
      0,
      0,
      0,
      0
    );

    start.setHours(
      0,
      0,
      0,
      0
    );

    end.setHours(
      0,
      0,
      0,
      0
    );

    return (
      date >= start &&
      date <= end
    );
  };

  const isToday = (
    day
  ) => {
    const today =
      new Date();

    return (
      today.getFullYear() ===
        year &&
      today.getMonth() ===
        month &&
      today.getDate() ===
        day
    );
  };

  const getTripCities = (
    trip
  ) => {
    if (
      !trip.stops ||
      trip.stops.length === 0
    ) {
      return "Trip";
    }

    return trip.stops
      .map(
        (stop) =>
          stop.city?.name
      )
      .filter(Boolean)
      .slice(0, 3)
      .join(" → ");
  };

  /* =====================================================
     UPCOMING TRIPS
     ===================================================== */

  const upcomingTrips =
    useMemo(() => {
      const now =
        new Date();

      return [...trips]
        .filter(
          (trip) =>
            new Date(
              trip.endDate
            ) >= now
        )
        .sort(
          (a, b) =>
            new Date(
              a.startDate
            ) -
            new Date(
              b.startDate
            )
        )
        .slice(0, 3);
    }, [trips]);

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="calendar-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <section className="calendar-header">

        <div>

          <p className="eyebrow">
            YOUR TRAVEL TIMELINE
          </p>

          <h1>
            Travel Calendar
          </h1>

          <p>
            See all your journeys,
            destinations and travel
            days at a glance.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() =>
            onNavigate("create")
          }
        >
          <Plane size={18} />

          Plan New Trip
        </button>

      </section>

      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div className="form-alert error">
          {error}
        </div>
      )}

      {/* =================================================
          MAIN LAYOUT
          ================================================= */}

      <div className="calendar-layout">

        {/* ===============================================
            CALENDAR
            =============================================== */}

        <section className="calendar-card">

          <div className="calendar-toolbar">

            <div className="month-navigation">

              <button
                className="calendar-arrow"
                onClick={
                  previousMonth
                }
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <h2>
                {monthName}
              </h2>

              <button
                className="calendar-arrow"
                onClick={
                  nextMonth
                }
              >
                <ChevronRight
                  size={18}
                />
              </button>

            </div>

            <button
              className="today-button"
              onClick={goToday}
            >
              Today
            </button>

          </div>

          {/* WEEK DAYS */}

          <div className="calendar-weekdays">

            {[
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
            ].map(
              (day) => (
                <div
                  key={day}
                >
                  {day}
                </div>
              )
            )}

          </div>

          {/* DAYS */}

          {loading ? (
            <div className="calendar-loading">

              <Loader2
                size={28}
                className="spin"
              />

              <p>
                Loading your
                travel calendar...
              </p>

            </div>
          ) : (
            <div className="calendar-grid">

              {calendarDays.map(
                (
                  day,
                  index
                ) => {

                  if (!day) {
                    return (
                      <div
                        key={
                          `empty-${index}`
                        }
                        className="calendar-day empty"
                      />
                    );
                  }

                  const dayTrips =
                    trips.filter(
                      (trip) =>
                        isTripOnDay(
                          trip,
                          day
                        )
                    );

                  return (
                    <div
                      key={day}
                      className={`calendar-day ${
                        isToday(day)
                          ? "today"
                          : ""
                      }`}
                    >

                      <div className="day-number">
                        {day}
                      </div>

                      <div className="day-trips">

                        {dayTrips
                          .slice(
                            0,
                            2
                          )
                          .map(
                            (trip) => (
                              <button
                                key={
                                  trip.id
                                }
                                className="calendar-trip"
                                onClick={() =>
                                  onOpenTrip(
                                    trip.id
                                  )
                                }
                                title={
                                  trip.name
                                }
                              >

                                <span />

                                {trip.name}

                              </button>
                            )
                          )}

                        {dayTrips.length >
                          2 && (
                          <small>
                            +
                            {dayTrips.length -
                              2}{" "}
                            more
                          </small>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ===============================================
            SIDEBAR
            =============================================== */}

        <aside className="calendar-sidebar">

          {/* UPCOMING */}

          <section className="calendar-side-card">

            <div className="side-card-heading">

              <div>
                <p className="eyebrow">
                  UP NEXT
                </p>

                <h3>
                  Upcoming journeys
                </h3>
              </div>

              <CalendarDays
                size={20}
              />

            </div>

            {upcomingTrips.length ===
            0 ? (
              <div className="calendar-empty">

                <CalendarDays
                  size={26}
                />

                <p>
                  No upcoming trips.
                </p>

                <button
                  onClick={() =>
                    onNavigate(
                      "create"
                    )
                  }
                >
                  Plan a trip
                </button>

              </div>
            ) : (
              <div className="upcoming-list">

                {upcomingTrips.map(
                  (trip) => (
                    <button
                      key={
                        trip.id
                      }
                      className="upcoming-item"
                      onClick={() =>
                        onOpenTrip(
                          trip.id
                        )
                      }
                    >

                      <div className="upcoming-date">

                        <strong>
                          {new Date(
                            trip.startDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                            }
                          )}
                        </strong>

                        <span>
                          {new Date(
                            trip.startDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              month:
                                "short",
                            }
                          )}
                        </span>

                      </div>

                      <div className="upcoming-info">

                        <strong>
                          {trip.name}
                        </strong>

                        <span>
                          <MapPin
                            size={12}
                          />

                          {getTripCities(
                            trip
                          )}
                        </span>

                        <small>
                          {new Date(
                            trip.startDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day:
                                "2-digit",
                              month:
                                "short",
                            }
                          )}
                          {" – "}
                          {new Date(
                            trip.endDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day:
                                "2-digit",
                              month:
                                "short",
                            }
                          )}
                        </small>

                      </div>

                      <ArrowRight
                        size={16}
                      />

                    </button>
                  )
                )}

              </div>
            )}

          </section>

          {/* TRAVEL SUMMARY */}

          <section className="calendar-side-card">

            <div className="side-card-heading">

              <div>
                <p className="eyebrow">
                  TRAVEL SUMMARY
                </p>

                <h3>
                  This year
                </h3>
              </div>

              <Wallet size={20} />

            </div>

            <div className="calendar-summary-grid">

              <div>
                <strong>
                  {trips.length}
                </strong>

                <span>
                  Trips
                </span>
              </div>

              <div>
                <strong>
                  {trips.reduce(
                    (
                      total,
                      trip
                    ) => {
                      const start =
                        new Date(
                          trip.startDate
                        );

                      const end =
                        new Date(
                          trip.endDate
                        );

                      return (
                        total +
                        Math.max(
                          1,
                          Math.ceil(
                            (end -
                              start) /
                              (1000 *
                                60 *
                                60 *
                                24)
                          )
                        )
                      );
                    },
                    0
                  )}
                </strong>

                <span>
                  Travel days
                </span>
              </div>

              <div>
                <strong>
                  ₹
                  {trips
                    .reduce(
                      (
                        total,
                        trip
                      ) =>
                        total +
                        Number(
                          trip.budget ||
                            0
                        ),
                      0
                    )
                    .toLocaleString(
                      "en-IN"
                    )}
                </strong>

                <span>
                  Planned budget
                </span>
              </div>

              <div>
                <strong>
                  {trips.reduce(
                    (
                      total,
                      trip
                    ) =>
                      total +
                      (trip.stops
                        ?.length ||
                        0),
                    0
                  )}
                </strong>

                <span>
                  Destinations
                </span>
              </div>

            </div>

          </section>

          {/* SMART FEATURE */}

          <section className="calendar-smart-card">

            <Clock3 size={21} />

            <h3>
              Smart travel timeline
            </h3>

            <p>
              Your trips are automatically
              organized by date so you can
              instantly see when and where
              you're travelling.
            </p>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default Calendar;