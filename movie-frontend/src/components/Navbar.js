// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">🎬 MovieHub</span>
      <div className="navbar-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/liked">Favorites</Link>
        {!isLoggedIn && <Link className="nav-link" to="/login">Login</Link>}
        {!isLoggedIn && <Link className="nav-link" to="/register">Register</Link>}
        {isLoggedIn && (
          <button
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
