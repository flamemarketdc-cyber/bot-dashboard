import React from 'react';
import { DiscordLogoIcon } from './Icons';

interface LoginProps {
  onLogin: () => void;
  onPreview: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, onPreview, error }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur-md shadow-lg rounded-lg p-8 border border-zinc-800/80 text-center animate-fade-in-up">
      <div className="flex justify-center mb-6">
         <DiscordLogoIcon className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Bot Dashboard</h1>
      <p className="text-zinc-400 mb-8">Please log in with Discord to continue.</p>
      
      {error && <p className="bg-red-900/50 text-red-300 border border-red-700/80 p-3 rounded-md mb-6">{error}</p>}
      
      <button
        onClick={onLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        <DiscordLogoIcon className="h-6 w-6 mr-3" />
        Login with Discord
      </button>
      <button
        onClick={onPreview}
        className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
      >
        Preview Dashboard
      </button>
    </div>
  );
};

export default Login;