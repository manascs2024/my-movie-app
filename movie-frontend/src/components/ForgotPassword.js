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
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">Send Reset Link</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
