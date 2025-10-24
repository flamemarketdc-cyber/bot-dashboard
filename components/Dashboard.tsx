import React, { useState, useEffect } from 'react';
import type { User, Guild, Channel } from '../types';
import { mockApiService } from '../services/api';
import Header from './Header';
import Spinner from './Spinner';
import Select from './Select';
import Sidebar from './Sidebar';
import GeneralSettings from './settings/GeneralSettings';
import TicketSettings from './settings/TicketSettings';
import { DiscordLogoIcon } from './Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [loadingGuilds, setLoadingGuilds] = useState<boolean>(true);
  const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  useEffect(() => {
    mockApiService.getGuilds()
      .then(setGuilds)
      .catch(err => console.error("Failed to fetch guilds", err))
      .finally(() => setLoadingGuilds(false));
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      setLoadingChannels(true);
      setChannels([]);
      setActiveModule('dashboard'); // Reset to dashboard page on server change
      mockApiService.getChannels(selectedGuild.id)
        .then(setChannels)
        .catch(err => console.error("Failed to fetch channels", err))
        .finally(() => setLoadingChannels(false));
    }
  }, [selectedGuild]);

  const handleGuildChange = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId) || null;
    setSelectedGuild(guild);
  };

  const renderContent = () => {
    if (loadingChannels) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>
    }

    switch (activeModule) {
      case 'dashboard':
        return <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to your Dashboard!</h2>
            <p className="text-gray-300">You are managing <span className="font-semibold text-indigo-400">{selectedGuild?.name}</span>.</p>
            <p className="text-gray-400 mt-2">Select a module from the sidebar to the left to configure your bot.</p>
        </div>;
      case 'general':
        return <GeneralSettings guild={selectedGuild!} channels={channels} />;
      case 'tickets':
        return <TicketSettings guild={selectedGuild!} channels={channels} />;
      default:
        return <div>Select a module</div>;
    }
  };
  
  if (loadingGuilds) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <Spinner size="lg" />
          </div>
      );
  }

  if (!selectedGuild) {
    return (
      <div className="w-full max-w-lg mx-auto">
          <Header user={user} onLogout={onLogout} />
           <div className="bg-gray-800 shadow-2xl rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="flex justify-center mb-6">
                <DiscordLogoIcon className="h-16 w-16 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Select a Server</h2>
            <p className="text-gray-400 mb-6">Choose a server to configure your bot.</p>
             <Select
                label=""
                value={''}
                onChange={(e) => handleGuildChange(e.target.value)}
                disabled={guilds.length === 0}
                options={guilds.map(g => ({ value: g.id, label: g.name }))}
                placeholder="Choose your server..."
            />
           </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-screen p-4">
      <Header user={user} onLogout={onLogout} selectedGuild={selectedGuild} />
      <div className="flex-grow flex gap-6 overflow-hidden">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <main className="flex-grow bg-gray-800 shadow-2xl rounded-xl border border-gray-700/50 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
