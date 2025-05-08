import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../api";

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [liked, setLiked] = useState(false);

  // Check login status
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // For back navigation
  const fromSearch = location.state?.fromSearch;
  const searchQuery = location.state?.query;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
      .then((res) => setMovie(res.data));

    if (isLoggedIn) {
      API.get("/movies/liked", { headers: { "x-auth-token": token } }).then(
        (res) => {
          setLiked(res.data.some((m) => String(m.id) === String(id)));
        }
      );
    } else {
      setLiked(false);
    }
  }, [id, isLoggedIn, token]);

  const toggleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!liked) {
      await API.post(
        "/movies/like",
        { movie },
        { headers: { "x-auth-token": token } }
      );
      setLiked(true);
    } else {
      await API.post(
        "/movies/unlike",
        { movieId: movie.id },
        { headers: { "x-auth-token": token } }
      );
      setLiked(false);
    }
  };

  // Back button handler
  const handleBack = () => {
    if (fromSearch && searchQuery) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(-1);
    }
  };

  if (!movie)
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#eee" }}>
        Loading...
      </div>
    );

  return (
    <>
      <div className="movie-details-fullpage">
        <div className="movie-details-poster-full">
          <img
            loading="lazy"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
          />
        </div>
        <div className="movie-details-info-full">
          <h1 className="movie-details-title-full">{movie.title}</h1>
          <div className="movie-details-meta-full">
            {movie.release_date} &middot; ⭐ {movie.vote_average}
          </div>
          <p className="movie-details-overview-full">{movie.overview}</p>
          <div className="movie-details-actions-full">
            <button className="back-button" onClick={handleBack}>
              ← Back
            </button>
            {isLoggedIn ? (
              <button
                className={`like-toggle-btn${liked ? " liked" : ""}`}
                onClick={toggleLike}
              >
                {liked ? "❤️ Liked" : "🤍 Like"}
              </button>
            ) : (
              <button
                className="like-toggle-btn"
                onClick={() => navigate("/login")}
                title="Login to like movies"
              >
                🤍 Like (Login required)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
