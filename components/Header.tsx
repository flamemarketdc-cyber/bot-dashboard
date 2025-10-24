import React from 'react';
import type { User, Guild } from '../types';
import { LogoutIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  selectedGuild?: Guild | null;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, selectedGuild }) => {
  return (
    <header className="w-full p-6 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        {selectedGuild ? (
            <div className="flex items-center gap-4">
                <img src={selectedGuild.icon} alt={selectedGuild.name} className="w-14 h-14 rounded-lg border-2 border-slate-700" />
                 <div>
                    <p className="text-slate-400 text-sm">Managing Server</p>
                    <h2 className="text-xl font-bold text-white">{selectedGuild.name}</h2>
                </div>
            </div>
        ) : (
            <h1 className="text-2xl font-bold red-gradient-text">Bot Command</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-md font-semibold text-white">{user.username}</p>
          <p className="text-xs text-slate-400">Logged in via Discord</p>
        </div>
        <img
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className="w-12 h-12 rounded-full border-2 border-slate-600"
        />
        <button
          onClick={onLogout}
          className="bg-slate-800/50 hover:bg-red-600/80 text-slate-300 hover:text-white font-semibold p-3 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
          aria-label="Logout"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;