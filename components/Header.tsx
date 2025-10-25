import React from 'react';
import { MenuIcon, ChevronDownIcon, LogoutIcon, SwitchUserIcon } from './Icons';
import type { User } from '@supabase/supabase-js';
import { Guild } from '../App';
import { supabase } from '../services/supabaseClient';


interface HeaderProps {
  user: User;
  guild: Guild;
  onMenuClick: () => void;
  onServerSelect: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, guild, onMenuClick, onServerSelect }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-20 px-4 sm:px-6 md:px-8 bg-base-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-gray-400 hover:text-white md:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>
        <div className="hidden md:flex items-center gap-4">
          <img src="https://media.discordapp.net/attachments/1409211763253051519/1409846946390081547/fd6563b98e631901ed195c73962b1aa0-removebg-preview.png?ex=68fdfdfc&is=68fca67c&hm=a1a2438675402472851a02b737159c4b2674b1e4f489f55e003c53c457f97576&=&format=webp&quality=lossless&width=450&height=450" alt="Chanel Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-white">Chanel</span>
           <button onClick={onServerSelect} className="flex items-center gap-2 bg-base-300/50 hover:bg-base-300 px-3 py-1.5 rounded-lg ml-4">
              <img src={guild.icon} alt={guild.name} className="w-6 h-6 rounded-full" />
              <span className="font-semibold text-white flex-1 text-left">{guild.name}</span>
              <ChevronDownIcon />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative group">
            <button className="flex items-center space-x-2">
                <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} className="w-9 h-9 rounded-full" />
                <span className="hidden sm:inline font-medium text-white">{user.user_metadata.full_name}</span>
                <div className="hidden sm:inline text-gray-400 group-hover:text-white transition-transform group-hover:rotate-180">
                  <ChevronDownIcon />
                </div>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-base-300 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-base-400/50">
                    <SwitchUserIcon />
                    <span className="ml-2">Switch Accounts</span>
                </a>
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-base-400/50">
                    <LogoutIcon />
                     <span className="ml-2">Logout</span>
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;