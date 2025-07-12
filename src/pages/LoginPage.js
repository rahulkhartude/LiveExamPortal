import React from 'react';
export default function LoginPage() {
  const loginWithGoogle = () => window.location.href = 'http://localhost:5000/api/auth/google';
  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={loginWithGoogle}>Login</button>
    </div>
  );
}
