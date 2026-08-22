import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  Plus,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";

import { getCities } from "./api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const cityEmoji = {
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

function getEmoji(name) {
  return cityEmoji[name] || "🌍";
}

function getDateDifference(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const difference = Math.ceil(
    (endDate - startDate) /
      (1000 * 60 * 60 * 24)
  );

  return difference > 0 ? difference : 0;
}

export default function CreateTrip({ onNavigate }) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [startDate, setStartDate] =
    useState("");
  const [endDate, setEndDate] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [cities, setCities] =
    useState([]);

  const [selectedCities, setSelectedCities] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loadingCities, setLoadingCities] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const days = useMemo(
    () =>
      getDateDifference(
        startDate,
        endDate
      ),
    [startDate, endDate]
  );

  /*
   * ========================================
   * LOAD CITIES
   * ========================================
   */

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoadingCities(true);

        const result =
          await getCities(search);

        setCities(result.data || []);
      } catch (err) {
        console.error(
          "Failed to load cities:",
          err
        );
      } finally {
        setLoadingCities(false);
      }
    }, 250);

    return () =>
      clearTimeout(timer);
  }, [search]);

  /*
   * ========================================
   * CITY MANAGEMENT
   * ========================================
   */

  const addCity = (city) => {
    if (
      selectedCities.some(
        (item) => item.id === city.id
      )
    ) {
      return;
    }

    setSelectedCities(
      (current) => [
        ...current,
        city,
      ]
    );
  };

  const removeCity = (cityId) => {
    setSelectedCities(
      (current) =>
        current.filter(
          (city) =>
            city.id !== cityId
        )
    );
  };

  const moveCity = (
    index,
    direction
  ) => {
    const newCities = [
      ...selectedCities,
    ];

    const newIndex =
      index + direction;

    if (
      newIndex < 0 ||
      newIndex >=
        newCities.length
    ) {
      return;
    }

    [
      newCities[index],
      newCities[newIndex],
    ] = [
      newCities[newIndex],
      newCities[index],
    ];

    setSelectedCities(
      newCities
    );
  };

  /*
   * ========================================
   * CREATE TRIP
   * ========================================
   */

  const createTrip = async () => {
    setError("");
    setSuccess("");

    /*
     * Validate
     */

    if (!name.trim()) {
      setError(
        "Please enter a trip name."
      );
      return;
    }

    if (
      !startDate ||
      !endDate
    ) {
      setError(
        "Please select your travel dates."
      );
      return;
    }

    if (
      new Date(endDate) <=
      new Date(startDate)
    ) {
      setError(
        "End date must be after start date."
      );
      return;
    }

    if (
      selectedCities.length === 0
    ) {
      setError(
        "Add at least one destination."
      );
      return;
    }

    if (
      !budget ||
      Number(budget) <= 0
    ) {
      setError(
        "Please enter a valid budget."
      );
      return;
    }

    /*
     * Authentication
     */

    const token =
  localStorage.getItem("globetrotter_token") ||
  localStorage.getItem("token");

    if (!token) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    try {
      setCreating(true);

      /*
       * Build stops
       */

      const stops =
        selectedCities.map(
          (city, index) => {
            const totalDays =
              days ||
              selectedCities.length;

            const tripStart =
              new Date(startDate);

            const stopStart =
              new Date(tripStart);

            /*
             * Distribute destinations
             * across the trip.
             */

            const baseDays = Math.max(
              1,
              Math.floor(
                totalDays /
                  selectedCities.length
              )
            );

            const remainder =
              totalDays %
              selectedCities.length;

            let offset = 0;

            for (
              let i = 0;
              i < index;
              i++
            ) {
              offset +=
                baseDays +
                (i < remainder
                  ? 1
                  : 0);
            }

            stopStart.setDate(
              stopStart.getDate() +
                offset
            );

            const duration =
              baseDays +
              (index < remainder
                ? 1
                : 0);

            const stopEnd =
              new Date(
                stopStart
              );

            stopEnd.setDate(
              stopEnd.getDate() +
                duration
            );

            /*
             * Last destination ends
             * exactly on trip end date.
             */

            if (
              index ===
              selectedCities.length -
                1
            ) {
              stopEnd.setTime(
                new Date(
                  endDate
                ).getTime()
              );
            }

            return {
              cityId: city.id,

              startDate:
                stopStart
                  .toISOString()
                  .split("T")[0],

              endDate:
                stopEnd
                  .toISOString()
                  .split("T")[0],
            };
          }
        );

      /*
       * ====================================
       * API REQUEST
       * ====================================
       *
       * IMPORTANT:
       *
       * We DO NOT send userId anymore.
       *
       * Backend gets the user from JWT.
       */

      const token = localStorage.getItem("globetrotter_token");

if (!token) {
  setError("Authentication required. Please log in again.");
  return;
}

const response = await fetch("http://localhost:5000/api/trips", {
  method: "POST",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },

  body: JSON.stringify({
    name: name.trim(),
    description: description.trim() || null,
    startDate,
    endDate,
    budget: Number(budget),
    stops,
  }),
});

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create trip"
        );
      }

      /*
       * Success
       */

      setSuccess(
        `Trip "${result.data.name}" created successfully!`
      );

      /*
       * Go to trips after
       * a short success message.
       */

      setTimeout(() => {
        onNavigate("trips");
      }, 1000);

    } catch (err) {
      console.error(
        "Create trip error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while creating the trip."
      );
    } finally {
      setCreating(false);
    }
  };

  /*
   * ========================================
   * UI
   * ========================================
   */

  return (
    <div className="create-trip-page">

      <button
        className="back-link"
        onClick={() =>
          onNavigate("dashboard")
        }
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="create-trip-header">
        <div>
          <p className="eyebrow">
            NEW ADVENTURE
          </p>

          <h1>
            Plan your next trip
          </h1>

          <p>
            Build your itinerary,
            choose your destinations
            and set your travel
            budget.
          </p>
        </div>
      </div>

      {error && (
        <div className="form-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-alert success">
          <Check size={17} />
          {success}
        </div>
      )}

      <div className="create-trip-layout">

        {/* ==================================
            LEFT
        ================================== */}

        <div className="create-trip-main">

          {/* TRIP DETAILS */}

          <section className="form-card">

            <div className="form-card-heading">

              <div className="step-number">
                01
              </div>

              <div>
                <h2>
                  Trip details
                </h2>

                <p>
                  Give your adventure
                  a name and choose
                  your dates.
                </p>
              </div>

            </div>

            <div className="form-group">

              <label>
                Trip name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. Goa Escape"
              />

            </div>

            <div className="form-group">

              <label>
                Description{" "}
                <span>
                  Optional
                </span>
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="What kind of adventure are you planning?"
                rows={3}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>
                  Start date
                </label>

                <div
                  className="input-with-icon date-picker-wrapper"
                  onClick={(event) => {
                    const input =
                      event.currentTarget.querySelector(
                        "input"
                      );

                    if (
                      input?.showPicker
                    ) {
                      input.showPicker();
                    } else {
                      input?.focus();
                    }
                  }}
                >

                  <CalendarDays
                    size={17}
                  />

                  <input
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(event) =>
                      setStartDate(
                        event.target.value
                      )
                    }
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  End date
                </label>

                <div className="input-with-icon">

                  <CalendarDays
                    size={17}
                  />

                  <input
                    type="date"
                    value={
                      endDate
                    }
                    min={
                      startDate ||
                      undefined
                    }
                    onChange={(event) =>
                      setEndDate(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

            {days > 0 && (
              <div className="trip-duration">
                <CalendarDays
                  size={15}
                />

                {days} day
                {days !== 1
                  ? "s"
                  : ""}{" "}
                of travel
              </div>
            )}

            <div className="form-group">

              <label>
                Trip budget
              </label>

              <div className="input-with-icon">

                <Wallet size={17} />

                <input
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(event) =>
                    setBudget(
                      event.target.value
                    )
                  }
                  placeholder="18000"
                />

                <span className="currency">
                  INR
                </span>

              </div>

            </div>

          </section>


          {/* DESTINATIONS */}

          <section className="form-card">

            <div className="form-card-heading">

              <div className="step-number">
                02
              </div>

              <div>
                <h2>
                  Choose destinations
                </h2>

                <p>
                  Add cities in the
                  order you want to
                  visit them.
                </p>
              </div>

            </div>

            <div className="trip-city-search">

              <Search size={18} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search cities..."
              />

            </div>

            <div className="city-picker">

              {loadingCities ? (

                <div className="picker-message">
                  Finding destinations...
                </div>

              ) : cities.length === 0 ? (

                <div className="picker-message">
                  No destinations found.
                </div>

              ) : (

                cities.map((city) => {

                  const alreadyAdded =
                    selectedCities.some(
                      (item) =>
                        item.id ===
                        city.id
                    );

                  return (
                    <div
                      className={`picker-city ${
                        alreadyAdded
                          ? "already-added"
                          : ""
                      }`}
                      key={city.id}
                    >

                      <div className="picker-city-emoji">
                        {getEmoji(
                          city.name
                        )}
                      </div>

                      <div className="picker-city-info">

                        <strong>
                          {city.name}
                        </strong>

                        <span>
                          {city.country}
                        </span>

                      </div>

                      <div className="picker-city-cost">
                        Cost{" "}
                        {city.costIndex}
                      </div>

                      <button
                        type="button"
                        disabled={
                          alreadyAdded
                        }
                        onClick={() =>
                          addCity(city)
                        }
                      >
                        {alreadyAdded ? (
                          <Check
                            size={16}
                          />
                        ) : (
                          <Plus
                            size={16}
                          />
                        )}
                      </button>

                    </div>
                  );
                })
              )}

            </div>

          </section>

        </div>


        {/* ==================================
            RIGHT SIDEBAR
        ================================== */}

        <aside className="create-trip-sidebar">

          <section className="summary-card">

            <div className="summary-heading">

              <div>

                <p className="eyebrow">
                  YOUR ITINERARY
                </p>

                <h2>
                  {name ||
                    "Untitled Trip"}
                </h2>

              </div>

            </div>

            <div className="summary-dates">

              <CalendarDays
                size={15}
              />

              <span>
                {startDate ||
                  "Start"}{" "}
                →{" "}
                {endDate ||
                  "End"}
              </span>

            </div>

            <div className="summary-budget">

              <span>
                Budget
              </span>

              <strong>
                ₹
                {Number(
                  budget || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="summary-divider" />

            <div className="selected-heading">

              <span>
                Destinations
              </span>

              <strong>
                {selectedCities.length}
              </strong>

            </div>

            {selectedCities.length ===
            0 ? (

              <div className="empty-itinerary">

                <MapPin size={22} />

                <p>
                  Add destinations
                  to build your
                  itinerary.
                </p>

              </div>

            ) : (

              <div className="selected-cities">

                {selectedCities.map(
                  (city, index) => (

                    <div
                      className="selected-city"
                      key={city.id}
                    >

                      <div className="selected-number">
                        {index + 1}
                      </div>

                      <div className="selected-city-info">

                        <strong>
                          {getEmoji(
                            city.name
                          )}{" "}
                          {city.name}
                        </strong>

                        <span>
                          {city.country}
                        </span>

                      </div>

                      <div className="selected-controls">

                        <button
                          type="button"
                          disabled={
                            index === 0
                          }
                          onClick={() =>
                            moveCity(
                              index,
                              -1
                            )
                          }
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            selectedCities.length -
                              1
                          }
                          onClick={() =>
                            moveCity(
                              index,
                              1
                            )
                          }
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            removeCity(
                              city.id
                            )
                          }
                        >
                          <Trash2
                            size={14}
                          />
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            <button
              type="button"
              className="create-trip-button"
              disabled={creating}
              onClick={
                createTrip
              }
            >

              {creating
                ? "Creating Trip..."
                : "Create Trip"}

              {!creating && (
                <ArrowRight
                  size={18}
                />
              )}

            </button>

          </section>

        </aside>

      </div>

    </div>
  );
}