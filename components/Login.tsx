
import React from 'react';
import { DiscordLogoIcon } from './Icons';

interface LoginProps {
  onLogin: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-700 text-center">
      <div className="flex justify-center mb-6">
         <DiscordLogoIcon className="h-16 w-16 text-indigo-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Bot Dashboard</h1>
      <p className="text-gray-400 mb-8">Please log in with your Discord account to continue.</p>
      
      {error && <p className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md mb-6">{error}</p>}
      
      <button
        onClick={onLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        <DiscordLogoIcon className="h-6 w-6 mr-3" />
        Login with Discord
      </button>
    </div>
  );
};

export default Login;
