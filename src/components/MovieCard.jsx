import { posterUrl } from "../api/tmdb";

export default function MovieCard({ movie, userRating, onClick, onRemove }) {
  return (
    <div className="card" onClick={() => onClick(movie.id)}>
      <img
        src={posterUrl(movie.poster_path) || "https://via.placeholder.com/150x220?text=No+Image"}
        alt={movie.title}
      />
      <h4>{movie.title}</h4>

      {userRating ? (
        <div className="rating-row">
          <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          <span className="user-rating-badge">🎬 {userRating}/10</span>
        </div>
      ) : (
        <p>⭐ {movie.vote_average?.toFixed(1)}</p>
      )}

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(movie.id);
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
}
