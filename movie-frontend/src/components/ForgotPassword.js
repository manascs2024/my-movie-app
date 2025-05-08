import React, { useState } from 'react';
import API from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Request failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-title">Forgot Password</div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button className="auth-button" type="submit">Send Reset Link</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
