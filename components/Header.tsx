import React, { useState, useEffect, useRef } from 'react';
import type { User, Guild } from '../types';
import { LogoutIcon, ChevronDownIcon, FlamingLogoIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  guilds?: Guild[];
  selectedGuild?: Guild | null;
  onGuildChange?: (guildId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, guilds, selectedGuild, onGuildChange }) => {
  const [isGuildDropdownOpen, setGuildDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const guildDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guildDropdownRef.current && !guildDropdownRef.current.contains(event.target as Node)) {
        setGuildDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="w-full h-12 px-4 flex justify-between items-center flex-shrink-0 bg-[#202225] border-b border-black/20 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <FlamingLogoIcon className="h-6 w-6" />
            <h1 className="text-lg font-bold text-white">Flaming</h1>
        </div>
        
        {selectedGuild && guilds && onGuildChange && (
            <div className="relative" ref={guildDropdownRef}>
              <button
                onClick={() => setGuildDropdownOpen(!isGuildDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md transition-colors hover:bg-zinc-700/50"
              >
                <img src={selectedGuild.icon} alt={selectedGuild.name} className="w-6 h-6 rounded-md flex-shrink-0" />
                <span className="text-sm font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{selectedGuild.name}</span>
                <ChevronDownIcon className={`transition-transform duration-200 flex-shrink-0 w-4 h-4 text-zinc-400 ${isGuildDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isGuildDropdownOpen && (
                 <div className="absolute top-full mt-2 w-64 bg-[#18191c] border border-black/50 rounded-lg shadow-2xl z-10 animate-fade-in-up" style={{animationDuration: '0.2s'}}>
                    <div className="p-1 max-h-80 overflow-y-auto">
                      {guilds.map(guild => (
                        <button
                          key={guild.id}
                          onClick={() => {
                            onGuildChange(guild.id);
                            setGuildDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${guild.id === selectedGuild.id ? 'bg-zinc-700/50' : 'hover:bg-zinc-700/50'}`}
                        >
                           <img src={guild.icon} alt={guild.name} className="w-8 h-8 rounded-md" />
                           <span className="text-sm font-medium text-zinc-200">{guild.name}</span>
                        </button>
                      ))}
                    </div>
                 </div>
              )}
            </div>
        )}
      </div>

      <div className="relative" ref={userDropdownRef}>
        <button 
            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md transition-colors hover:bg-zinc-700/50"
        >
            <img
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="w-7 h-7 rounded-full flex-shrink-0"
            />
            <span className="hidden sm:inline text-sm font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{user.username}</span>
            <ChevronDownIcon className={`transition-transform duration-200 flex-shrink-0 w-4 h-4 text-zinc-400 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isUserDropdownOpen && (
             <div className="absolute top-full mt-2 w-48 right-0 bg-[#18191c] border border-black/50 rounded-lg shadow-2xl z-10 animate-fade-in-up" style={{animationDuration: '0.2s'}}>
                <div className="p-1">
                     <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors text-red-400 hover:bg-red-500/10"
                        aria-label="Logout"
                    >
                        <LogoutIcon className="w-5 h-5"/>
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
             </div>
        )}
      </div>
    </header>
  );
};

export default Header;