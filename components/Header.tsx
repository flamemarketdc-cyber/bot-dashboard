
import React from 'react';
import type { User } from '../types';
import { LogoutIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="w-full mb-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className="w-14 h-14 rounded-full border-2 border-indigo-500"
        />
        <div>
          <p className="text-gray-400 text-sm">Logged in as</p>
          <h1 className="text-xl font-bold text-white">{user.username}</h1>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="bg-gray-700 hover:bg-red-600 text-gray-200 hover:text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
      >
        <LogoutIcon />
        <span className="ml-2 hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};

export default Header;
