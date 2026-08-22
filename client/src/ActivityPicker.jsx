import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  X,
  Clock3,
  Wallet,
  Loader2,
} from "lucide-react";

function ActivityPicker({
  tripId,
  stop,
  onClose,
  onAdded,
}) {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [addingId, setAddingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const token =
    localStorage.getItem(
      "globetrotter_token"
    );

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);

        const response =
          await fetch(
            ``${import.meta.env.VITE_API_URL}/api/activities?cityId=${stop.cityId}`,
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
              "Failed to load activities"
          );
        }

        setActivities(
          result.data || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [stop.cityId]);

  const categories = [
    "All",
    ...new Set(
      activities
        .map(
          (activity) =>
            activity.category
        )
        .filter(Boolean)
    ),
  ];

  const filteredActivities =
    activities.filter(
      (activity) => {
        const matchesSearch =
          activity.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          activity.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          activity.category ===
            category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  const addActivity =
    async (activity) => {
      try {
        setAddingId(
          activity.id
        );

        const response =
          await fetch(
            "`${import.meta.env.VITE_API_URL}/api/activities/trip",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body: JSON.stringify({
                tripId,
                tripStopId:
                  stop.id,
                activityId:
                  activity.id,
                date:
                  stop.startDate,
                customCost:
                  activity.estimatedCost,
              }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to add activity"
          );
        }

        onAdded(
          result.data
        );

      } catch (error) {
        console.error(error);

        alert(
          error.message ||
            "Unable to add activity."
        );
      } finally {
        setAddingId(null);
      }
    };

  return (
    <div className="activity-modal-overlay">

      <div className="activity-modal">

        <div className="activity-modal-header">

          <div>
            <p className="eyebrow">
              ADD EXPERIENCE
            </p>

            <h2>
              Activities in{" "}
              {stop.city?.name ||
                "this destination"}
            </h2>

            <p>
              Choose experiences for
              this stop.
            </p>
          </div>

          <button
            className="activity-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        <div className="activity-search">

          <Search size={17} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search activities..."
          />

        </div>

        <div className="activity-categories">

          {categories.map(
            (item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setCategory(
                    item
                  )
                }
              >
                {item}
              </button>
            )
          )}

        </div>

        <div className="activity-results">

          {loading ? (
            <div className="activity-loading">

              <Loader2
                size={28}
                className="spin"
              />

              Loading activities...

            </div>
          ) : filteredActivities.length ===
            0 ? (
            <div className="activity-empty">
              No activities found.
            </div>
          ) : (
            filteredActivities.map(
              (activity) => (
                <div
                  className="activity-option"
                  key={
                    activity.id
                  }
                >

                  <div className="activity-option-info">

                    <div className="activity-option-title">

                      <h3>
                        {activity.name}
                      </h3>

                      <span>
                        {activity.category ||
                          "Experience"}
                      </span>

                    </div>

                    {activity.description && (
                      <p>
                        {
                          activity.description
                        }
                      </p>
                    )}

                    <div className="activity-option-meta">

                      <span>
                        <Clock3
                          size={13}
                        />

                        {
                          activity.duration
                        }{" "}
                        hrs
                      </span>

                      <span>
                        <Wallet
                          size={13}
                        />

                        ₹
                        {Number(
                          activity.estimatedCost ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>

                  <button
                    className="add-activity-button"
                    disabled={
                      addingId ===
                      activity.id
                    }
                    onClick={() =>
                      addActivity(
                        activity
                      )
                    }
                  >

                    {addingId ===
                    activity.id ? (
                      <Loader2
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <Plus
                        size={16}
                      />
                    )}

                    Add

                  </button>

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default ActivityPicker;