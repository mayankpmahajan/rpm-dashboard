'use client';

import React, { useState } from 'react';
import HomePage from './homepage';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/db/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.token)
        
        localStorage.setItem('token', data.token); // Store the JWT token
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        setIsAuthenticated(true);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (isAuthenticated) {
    // If authenticated, render the HomePage
    return <HomePage />;
  }

  // Login form for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
