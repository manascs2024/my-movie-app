import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/auth/reset-password', { token, password });
    setMsg(res.data.msg);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" required />
      <button type="submit">Reset Password</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
