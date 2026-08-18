import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieRow from "./components/MovieRow";
import Modal from "./components/Modal";
import { fetchMovieDetails, fetchMovieList } from "./api/tmdb";

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function readRatings() {
  try {
    return JSON.parse(localStorage.getItem("ratings") || "{}");
  } catch {
    return {};
  }
}

export default function App() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [latest, setLatest] = useState([]);
  const [modalMovieId, setModalMovieId] = useState(null);

  const [watchlistIds, setWatchlistIds] = useState(() => readList("watchlist"));
  const [favoriteIds, setFavoriteIds] = useState(() => readList("favorites"));
  const [ratings, setRatings] = useState(() => readRatings());

  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Load the three home rows once on mount
  useEffect(() => {
    fetchMovieList("/movie/popular").then(setPopular);
    fetchMovieList("/movie/top_rated").then(setTopRated);
    fetchMovieList("/movie/now_playing").then(setLatest);
  }, []);

  // Whenever the id lists change, resolve them to full movie objects
  useEffect(() => {
    Promise.all(watchlistIds.map((id) => fetchMovieDetails(id))).then(setWatchlistMovies);
  }, [watchlistIds]);

  useEffect(() => {
    Promise.all(favoriteIds.map((id) => fetchMovieDetails(id))).then(setFavoriteMovies);
  }, [favoriteIds]);

  const addToWatchlist = (id) => {
    if (watchlistIds.includes(id)) return;
    const next = [...watchlistIds, id];
    setWatchlistIds(next);
    localStorage.setItem("watchlist", JSON.stringify(next));
    alert("Added to watchlist");
  };

  const removeFromWatchlist = (id) => {
    const next = watchlistIds.filter((item) => item !== id);
    setWatchlistIds(next);
    localStorage.setItem("watchlist", JSON.stringify(next));
  };

  const addToFavorites = (id) => {
    if (favoriteIds.includes(id)) return;
    const next = [...favoriteIds, id];
    setFavoriteIds(next);
    localStorage.setItem("favorites", JSON.stringify(next));
    alert("Added to favorites");
  };

  const removeFromFavorites = (id) => {
    const next = favoriteIds.filter((item) => item !== id);
    setFavoriteIds(next);
    localStorage.setItem("favorites", JSON.stringify(next));
  };

  const rateMovie = (id, value) => {
    const next = { ...ratings, [id]: value };
    setRatings(next);
    localStorage.setItem("ratings", JSON.stringify(next));
  };

  const openModal = (id) => setModalMovieId(id);
  const closeModal = () => setModalMovieId(null);

  return (
    <div>
      <Header />

      <SearchBar onSelectMovie={openModal} />

      <MovieRow title="Popular Movies" movies={popular} ratings={ratings} onOpenMovie={openModal} />
      <MovieRow title="Top Rated Movies" movies={topRated} ratings={ratings} onOpenMovie={openModal} />
      <MovieRow title="Latest Movies" movies={latest} ratings={ratings} onOpenMovie={openModal} />

      <MovieRow
        title="My Watchlist"
        movies={watchlistMovies}
        ratings={ratings}
        onOpenMovie={openModal}
        onRemove={removeFromWatchlist}
      />

      <MovieRow
        title="My Favorites"
        movies={favoriteMovies}
        ratings={ratings}
        onOpenMovie={openModal}
        onRemove={removeFromFavorites}
      />

      <Modal
        movieId={modalMovieId}
        onClose={closeModal}
        onFavorite={addToFavorites}
        onWatchlist={addToWatchlist}
        onRate={rateMovie}
      />

      <div className="TMDB">
        <img src="/assets/tmdb-logo.svg" alt="TMDB logo" />
      </div>
    </div>
  );
}
