const API_URL = "https://globetrotter-back.onrender.com/api";

export async function getCities(search = "") {
  const url = search
    ? `${API_URL}/cities?search=${encodeURIComponent(search)}`
    : `${API_URL}/cities`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  return response.json();
}

export async function getCityActivities(cityId, filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.maxCost) {
    params.append("maxCost", filters.maxCost);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/cities/${cityId}/activities${query ? `?${query}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  return response.json();
}