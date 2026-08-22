import { useEffect, useState } from "react";
import { Search, MapPin, Star, ArrowRight } from "lucide-react";

import { getCities } from "./api";

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

export default function Discover({ onNavigate }) {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const result = await getCities(search);

        setCities(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="discover-page">
      <div className="discover-header">
        <div>
          <p className="eyebrow">EXPLORE THE WORLD</p>

          <h1>Discover your next destination</h1>

          <p>
            Search cities, compare travel costs and find experiences
            for your next adventure.
          </p>
        </div>
      </div>

      <div className="city-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search cities or countries..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {search && (
          <button onClick={() => setSearch("")}>
            Clear
          </button>
        )}
      </div>

      <div className="discover-results-header">
        <div>
          <p className="eyebrow">DESTINATIONS</p>
          <h2>
            {search
              ? `Results for "${search}"`
              : "Popular destinations"}
          </h2>
        </div>

        <span>{cities.length} destinations</span>
      </div>

      {loading ? (
        <div className="discover-loading">
          Searching destinations...
        </div>
      ) : cities.length === 0 ? (
        <div className="discover-empty">
          <div>🌍</div>
          <h3>No destinations found</h3>
          <p>Try searching for another city or country.</p>
        </div>
      ) : (
        <div className="discover-grid">
          {cities.map((city) => (
            <article className="discover-card" key={city.id}>
              <div className="discover-image">
                <span>{getCityEmoji(city.name)}</span>
              </div>

              <div className="discover-card-content">
                <div className="discover-card-title">
                  <div>
                    <h3>{city.name}</h3>

                    <p>
                      <MapPin size={13} />
                      {city.country}
                    </p>
                  </div>

                  <span className="popularity">
                    <Star size={13} />
                    {city.popularity}
                  </span>
                </div>

                <p className="city-description">
                  {city.description}
                </p>

                <div className="city-meta">
                  <div>
                    <span>Cost index</span>
                    <strong>{city.costIndex}/100</strong>
                  </div>

                  <div>
                    <span>Popularity</span>
                    <strong>{city.popularity}/100</strong>
                  </div>
                </div>

                <button
                  className="discover-button"
                  onClick={() => onNavigate("create")}
                >
                  Plan a trip here
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}