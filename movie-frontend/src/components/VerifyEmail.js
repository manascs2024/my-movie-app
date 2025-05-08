import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyEmail() {
  const [msg, setMsg] = useState('Verifying...');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    axios.get(`/api/auth/verify-email?token=${token}`)
      .then(res => setMsg(res.data || res))
      .catch(() => setMsg('Invalid or expired token'));
  }, []);
  return <div>{msg}</div>;
}
