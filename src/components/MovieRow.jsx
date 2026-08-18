import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies, ratings, onOpenMovie, onRemove }) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="movie-row">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            userRating={ratings?.[movie.id]}
            onClick={onOpenMovie}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
