import React, { useState, useEffect, useCallback } from 'react';
import type { User } from './types';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabaseClient';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

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
    setSession(null);
  }, []);
  
  const user: User | null = session ? {
      id: session.user.id,
      username: session.user.user_metadata.full_name || 'User',
      avatar: session.user.user_metadata.avatar_url,
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {session && user ? (
        <Dashboard user={user} onLogout={handleLogout} providerToken={session.provider_token} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Login onLogin={handleLogin} error={error} />
        </div>
      )}
    </div>
  );
};

export default App;