import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MovieList() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read the query from the URL (for back navigation)
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState([]);

  // If there's a query in the URL, auto-search on mount
  useEffect(() => {
    if (initialQuery) {
      searchMovies(initialQuery);
    }
    // eslint-disable-next-line
  }, []);

  const searchMovies = async (q) => {
    const searchTerm = q !== undefined ? q : query;
    if (!searchTerm) {
      setMovies([]);
      return;
    }
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchTerm}`
    );
    setMovies(res.data.results);
    // Update the URL with the query
    navigate(`/?q=${encodeURIComponent(searchTerm)}`, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies();
  };

  return (
    <div className="home">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button className="search-button" type="submit">Search</button>
      </form>
      <div className="movies-grid">
        {movies.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-emoji">🎬</span>
            <div>No movies found. Try searching for something!</div>
          </div>
        )}
        {movies.map(movie => (
          <div className="movie-card" key={movie.id}>
            <Link
              to={`/movie/${movie.id}`}
              state={{ fromSearch: true, query }} // Pass info for back navigation
            >
              <div className="movie-poster">
                <img
                  loading="lazy"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                  }
                  alt={movie.title}
                />
              </div>
            </Link>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.release_date}</p>
              <span className="user-rating">⭐ {movie.vote_average}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
