import { useEffect, useState } from "react";
import { fetchMovieCredits, fetchMovieDetails } from "../api/tmdb";
import RatingPopup from "./RatingPopup";

export default function Modal({ movieId, onClose, onFavorite, onWatchlist, onRate }) {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [ratePopupOpen, setRatePopupOpen] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    let cancelled = false;

    (async () => {
      const [movieData, creditsData] = await Promise.all([
        fetchMovieDetails(movieId),
        fetchMovieCredits(movieId),
      ]);
      if (cancelled) return;
      setMovie(movieData);
      setCast((creditsData.cast || []).slice(0, 5));
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [movieId]);

  if (!movieId || !movie) return null;

  const genreText = (movie.genres || []).map((g) => g.name).join(", ");

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <h2>{movie.title}</h2>
        <p>
          <b>Genres:</b> {genreText}
        </p>
        <p>{movie.overview}</p>
        <h4>Cast:</h4>
        <ul>
          {cast.map((actor) => (
            <li key={actor.id}>{actor.name}</li>
          ))}
        </ul>

        <button onClick={() => onFavorite(movieId)}>Favorite</button>
        <button onClick={() => onWatchlist(movieId)}>Watchlist</button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRatePopupOpen(true);
          }}
        >
          Rate
        </button>
        <button onClick={onClose}>Close</button>

        <RatingPopup
          visible={ratePopupOpen}
          onSubmit={(value) => onRate(movieId, value)}
          onCancel={() => setRatePopupOpen(false)}
        />
      </div>
    </div>
  );
}