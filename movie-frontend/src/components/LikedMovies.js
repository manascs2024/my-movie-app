import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function LikedMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/movies/liked', { headers: { 'x-auth-token': token } })
      .then(res => setMovies(res.data));
  }, []);

  const handleUnlike = async (movieId) => {
    const token = localStorage.getItem('token');
    await API.post(
      '/movies/unlike',
      { movieId },
      { headers: { 'x-auth-token': token } }
    );
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="home">
      <h2>Liked Movies</h2>
      <div className="movies-grid">
        {movies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">😢</div>
            <div>You have not liked any movies yet.</div>
            <Link to="/" className="auth-link" style={{ marginTop: '1.5rem', fontWeight: 500 }}>
              Explore Movies
            </Link>
          </div>
        ) : (
          movies.map(movie => (
            <div className="movie-card" key={movie.id}>
              <Link to={`/movie/${movie.id}`}>
                <div className="movie-poster">
                  <img
                    loading='lazy'
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
              <button
                className="favorite-btn active"
                title="Unlike"
                onClick={() => handleUnlike(movie.id)}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LikedMovies;
