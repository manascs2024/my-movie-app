import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/auth/forgot-password', { email });
    setMsg(res.data.msg);
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
