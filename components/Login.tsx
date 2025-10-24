import React from 'react';
import { DiscordLogoIcon } from './Icons';

interface LoginProps {
  onLogin: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-red-900/10 rounded-xl p-8 border border-slate-700/60 text-center animate-fade-in-up">
      <div className="flex justify-center mb-6">
         <DiscordLogoIcon className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-4xl font-black red-gradient-text mb-2">Bot Command</h1>
      <p className="text-slate-400 mb-8">Please log in with Discord to access the control panel.</p>
      
      {error && <p className="bg-red-900/50 text-red-300 border border-red-700/80 p-3 rounded-md mb-6">{error}</p>}
      
      <button
        onClick={onLogin}
        className="w-full red-gradient-bg text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg shadow-red-500/20"
      >
        <DiscordLogoIcon className="h-6 w-6 mr-3" />
        Login with Discord
      </button>
    </div>
  );
};

export default Login;