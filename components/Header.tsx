import React, { useState, useEffect, useRef } from 'react';
import type { User, Guild } from '../types';
import { LogoutIcon, ChevronDownIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  guilds?: Guild[];
  selectedGuild?: Guild | null;
  onGuildChange?: (guildId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, guilds, selectedGuild, onGuildChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="w-full p-4 px-8 flex justify-between items-center flex-shrink-0 bg-[#16191C] border-b border-slate-700/40">
      <div className="flex items-center gap-4">
        {selectedGuild ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg transition-colors bg-slate-800/50 hover:bg-slate-700/70"
              >
                <img src={selectedGuild.icon} alt={selectedGuild.name} className="w-10 h-10 rounded-md" />
                <span className="text-md font-semibold text-white">{selectedGuild.name}</span>
                <ChevronDownIcon className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && guilds && onGuildChange && (
                 <div className="absolute top-full mt-2 w-72 bg-[#282b30] border border-slate-700 rounded-lg shadow-2xl z-10 animate-fade-in-up" style={{animationDuration: '0.2s'}}>
                    <div className="p-2">
                      {guilds.filter(g => g.id !== selectedGuild.id).map(guild => (
                        <button
                          key={guild.id}
                          onClick={() => {
                            onGuildChange(guild.id);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors hover:bg-slate-700/50"
                        >
                           <img src={guild.icon} alt={guild.name} className="w-9 h-9 rounded-md" />
                           <span className="text-sm font-medium text-slate-200">{guild.name}</span>
                        </button>
                      ))}
                    </div>
                 </div>
              )}
            </div>
        ) : (
            <h1 className="text-2xl font-bold red-gradient-text">Bot Command</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-md font-semibold text-white">{user.username}</p>
        </div>
        <img
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className="w-11 h-11 rounded-full border-2 border-slate-600"
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