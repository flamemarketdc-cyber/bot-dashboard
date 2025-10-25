import React from 'react';
import { supabase } from '../services/supabaseClient';
import { DiscordIcon } from '../components/Icons';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        // We need 'identify' for user metadata (name, avatar), and 'guilds' to list servers.
        // The 'email' scope is also a standard default for Supabase.
        scopes: 'identify email guilds',
      },
    });
    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-white">
      <div className="text-center p-8 max-w-md w-full">
        <img src="https://media.discordapp.net/attachments/1409211763253051519/1409846946390081547/fd6563b98e631901ed195c73962b1aa0-removebg-preview.png?ex=68fdfdfc&is=68fca67c&hm=a1a2438675402472851a02b737159c4b2674b1e4f489f55e003c53c457f97576&=&format=webp&quality=lossless&width=450&height=450" alt="Chanel Logo" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Chanel Dashboard</h1>
        <p className="text-gray-400 mb-8">Please login with your Discord account to continue.</p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
        >
          <DiscordIcon />
          <span>Login with Discord</span>
        </button>
      </div>
    </div>
  );
};

export default Login;