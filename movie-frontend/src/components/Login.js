import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const verified = params.get('verified');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location = '/';
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-title">Login</div>
      {verified === '1' && (
        <div className="success-msg" style={{ color: 'green', marginBottom: '1rem' }}>
          Your email is verified, please login.
        </div>
      )}
      {verified === '0' && (
        <div className="error-msg" style={{ color: 'red', marginBottom: '1rem' }}>
          Invalid or expired verification link.
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit">Login</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
