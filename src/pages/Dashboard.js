import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Dashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/user', { withCredentials: true })
      .then(res => setUser(res.data));
  }, []);
  return (
    <div>
      <h2>Welcome {user?.name}</h2>
      <a href="/test/React">Start React Test</a>
    </div>
  );
}
