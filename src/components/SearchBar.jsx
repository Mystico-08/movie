import { useEffect, useRef, useState } from "react";
import { fetchPersonMovieCredits, posterUrl, searchMovies, searchPeople } from "../api/tmdb";

export default function SearchBar({ onSelectMovie }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dropdown-open", open);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const [movieResults, peopleResults] = await Promise.all([
        searchMovies(trimmed),
        searchPeople(trimmed),
      ]);

      const actorMovieLists = await Promise.all(
        peopleResults.slice(0, 3).map((person) => fetchPersonMovieCredits(person.id))
      );
      const actorMovies = actorMovieLists.flat();

      const allMovies = [...movieResults, ...actorMovies];
      const unique = [];
      allMovies.forEach((movie) => {
        if (!unique.some((m) => m.id === movie.id)) unique.push(movie);
      });

      if (!cancelled) {
        setResults(unique.slice(0, 6));
        setOpen(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSelect = (movie) => {
    onSelectMovie(movie.id);
    setOpen(false);
    setQuery(movie.title);
  };

  return (
    <div className="search-container" ref={containerRef}>
      <input
        id="searchInput"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className={`dropdown ${open ? "" : "hidden"}`}>
        {results.map((movie) => (
          <div key={movie.id} className="dropdown-card" onClick={() => handleSelect(movie)}>
            <img
              src={posterUrl(movie.poster_path) || "https://via.placeholder.com/50x75?text=No+Image"}
              alt={movie.title}
            />
            <div className="dropdown-info">
              <div className="dropdown-title">{movie.title}</div>
              <div className="dropdown-rating">⭐ {movie.vote_average}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
