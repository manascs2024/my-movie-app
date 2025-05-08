import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/register', { email, password });
    setMsg(res.data.msg);
  };

  return (
    <div className="auth-container">
      <div className="auth-title">Register</div>
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
        <button className="auth-button" type="submit">Register</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
