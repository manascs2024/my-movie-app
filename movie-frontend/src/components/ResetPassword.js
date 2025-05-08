import React, { useState } from 'react';
import API from '../api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/reset-password', { token, password });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Reset failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-title">Reset Password</div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button className="auth-button" type="submit">Reset Password</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
