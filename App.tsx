import React, { useState, useEffect, useCallback } from 'react';
import type { User } from './types';
import { supabase } from './services/supabaseClient';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(true);
      if (event === 'SIGNED_IN' && session) {
        const profile = session.user.user_metadata;
        setUser({
          id: session.user.id,
          username: profile.full_name || 'User',
          avatar: profile.avatar_url,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
             const profile = session.user.user_metadata;
             setUser({
                id: session.user.id,
                username: profile.full_name || 'User',
                avatar: profile.avatar_url,
             });
        }
        setIsLoading(false);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        scopes: 'identify guilds email',
      },
    });
    if (error) {
      console.error('Error logging in:', error.message);
      setError('Failed to log in. Please try again.');
    }
  };

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Login onLogin={handleLogin} error={error} />
        </div>
      )}
    </div>
  );
};

export default App;