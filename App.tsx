
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from './types';
import { mockApiService } from './services/api';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    // In a real app, this would redirect to the backend's /login endpoint
    // window.location.href = 'http://localhost:4000/login';
    // For this mock, we simulate the callback process.
    setIsLoading(true);
    mockApiService.handleCallback()
      .then(setUser)
      .catch(err => {
        console.error(err);
        setError('Failed to log in. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogout = useCallback(() => {
    mockApiService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    // Check if the user is already logged in (e.g., from a previous session)
    const checkSession = async () => {
      try {
        const currentUser = await mockApiService.getUser();
        setUser(currentUser);
      } catch (e) {
        // No user in session, which is normal.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} error={error} />
      )}
    </div>
  );
};

export default App;
