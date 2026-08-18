// TMDB API helpers
// NOTE: this key was already public in the original script.js — for a real
// deployment you'd want to proxy these calls through your own backend so the
// key isn't shipped to the browser.
const API_KEY = "206e70331573072b79577f43efa23e96";
const BASE_URL = "https://api.themoviedb.org/3";

async function getJSON(path) {
  const separator = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}${path}${separator}api_key=${API_KEY}`);
  return res.json();
}

export async function fetchMovieList(endpoint) {
  try {
    const data = await getJSON(endpoint);
    return data.results || [];
  } catch (err) {
    console.log("Fetch error:", err);
    return [];
  }
}

export async function fetchMovieDetails(id) {
  return getJSON(`/movie/${id}`);
}

export async function fetchMovieCredits(id) {
  return getJSON(`/movie/${id}/credits`);
}

export async function searchMovies(query) {
  const data = await getJSON(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results || [];
}

export async function searchPeople(query) {
  const data = await getJSON(`/search/person?query=${encodeURIComponent(query)}`);
  return data.results || [];
}

export async function fetchPersonMovieCredits(personId) {
  const data = await getJSON(`/person/${personId}/movie_credits`);
  return data.cast || [];
}

export function posterUrl(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}
