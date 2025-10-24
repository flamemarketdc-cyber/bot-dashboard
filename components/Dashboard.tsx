import React, { useState, useEffect } from 'react';
import type { User, Guild, Channel } from '../types';
import { apiService } from '../services/api';
import Header from './Header';
import Spinner from './Spinner';
import Select from './Select';
import Sidebar from './Sidebar';
import GeneralSettings from './settings/GeneralSettings';
import TicketSettings from './settings/TicketSettings';
import AutoModSettings from './settings/AutoModSettings';
import ChatbotSettings from './settings/ChatbotSettings';
import GiveawaySettings from './settings/GiveawaySettings';
import ClaimTimeSettings from './settings/ClaimTimeSettings';
import { DiscordLogoIcon, ErrorIcon, CogIcon, TicketIcon, ShieldCheckIcon, ChatBubbleIcon } from './Icons';

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
  const [error, setError] = useState<string | null>(null);
  
  // States for dashboard overview
  const [prefix, setPrefix] = useState<string>(',');
  const [ticketChannel, setTicketChannel] = useState<string | null>(null);
  const [autoModEnabled, setAutoModEnabled] = useState<boolean>(false);
  const [chatbotEnabled, setChatbotEnabled] = useState<boolean>(false);

  useEffect(() => {
    setError(null);
    setLoadingGuilds(true);
    apiService.getGuilds()
      .then(setGuilds)
      .catch(err => {
        setError(err.message || "An unknown error occurred while fetching servers.");
      })
      .finally(() => {
        setLoadingGuilds(false);
      });
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      setLoadingChannels(true);
      setError(null);
      setChannels([]);
      setActiveModule('dashboard');
      
      const fetchAllSettings = async () => {
          try {
              const [ch, gen, tkt, am, cb] = await Promise.all([
                  apiService.getChannels(selectedGuild.id),
                  apiService.getGeneralSettings(selectedGuild.id),
                  apiService.getTicketSettings(selectedGuild.id),
                  apiService.getAutoModSettings(selectedGuild.id),
                  apiService.getChatbotSettings(selectedGuild.id),
              ]);
              setChannels(ch);
              setPrefix(gen.prefix);
              setTicketChannel(tkt.panelChannelId);
              setAutoModEnabled(am.enabled);
              setChatbotEnabled(cb.enabled);
          } catch (err: any) {
              console.warn(`Could not fetch all data for ${selectedGuild.name}. Some features may be limited.`, err);
              // Allow access even if some settings fail
              if(err.message.includes("channels")) {
                setError("Could not fetch channels. Settings pages will have empty channel selectors, but will still be functional.");
              }
          } finally {
              setLoadingChannels(false);
          }
      };
      
      fetchAllSettings();
    }
  }, [selectedGuild]);

  const handleGuildChange = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId) || null;
    setSelectedGuild(guild);
  };
  
  const OverviewCard: React.FC<{title: string; value: string; status?: boolean; icon: React.ReactNode}> = ({title, value, status, icon}) => (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 flex items-start gap-4">
        <div className="bg-gray-900 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-white text-lg font-bold">{value}</p>
        </div>
        {status !== undefined && (
            <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${status ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-300'}`}>
                {status ? 'Enabled' : 'Disabled'}
            </span>
        )}
      </div>
  );

  const renderContent = () => {
    if (loadingChannels) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>
    }

    if (error && activeModule !== 'dashboard') {
        return <div className="p-6 md:p-8 text-center text-red-300">
            <ErrorIcon className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold mb-2">An Error Occurred</h3>
            <p>{error}</p>
        </div>
    }

    switch (activeModule) {
      case 'dashboard':
        return <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
            <p className="text-gray-400 mb-6">A quick look at the bot's status in <span className="font-semibold text-indigo-400">{selectedGuild?.name}</span>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OverviewCard title="Bot Prefix" value={`'${prefix}'`} icon={<CogIcon />} />
                <OverviewCard title="Ticket System" value={ticketChannel ? `#${channels.find(c=>c.id === ticketChannel)?.name}` : "Not Set"} status={!!ticketChannel} icon={<TicketIcon />} />
                <OverviewCard title="Auto Moderation" value={autoModEnabled ? 'Active' : 'Inactive'} status={autoModEnabled} icon={<ShieldCheckIcon />} />
                <OverviewCard title="Chatbot" value={chatbotEnabled ? 'Active' : 'Inactive'} status={chatbotEnabled} icon={<ChatBubbleIcon />} />
            </div>
        </div>;
      case 'general':
        return <GeneralSettings guild={selectedGuild!} channels={channels} />;
      case 'tickets':
        return <TicketSettings guild={selectedGuild!} channels={channels} />;
      case 'automod':
        return <AutoModSettings guild={selectedGuild!} />;
      case 'chatbot':
        return <ChatbotSettings guild={selectedGuild!} channels={channels} />;
      case 'giveaways':
        return <GiveawaySettings guild={selectedGuild!} />;
      case 'claimtime':
        return <ClaimTimeSettings guild={selectedGuild!} />;
      default:
        return <div>Select a module</div>;
    }
  };
  
  if (error && !selectedGuild) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <Header user={user} onLogout={onLogout} />
        <div className="bg-gray-800 shadow-2xl rounded-xl p-8 border border-red-700/50 text-center">
            <ErrorIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">An Error Occurred</h2>
            <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedGuild) {
    return (
      <div className="w-full max-w-lg mx-auto">
          <Header user={user} onLogout={onLogout} />
           <div className="bg-gray-800 shadow-2xl rounded-xl p-8 border border-gray-700/50 text-center">
            <DiscordLogoIcon className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Select a Server</h2>
            <p className="text-gray-400 mb-6">
                {loadingGuilds
                    ? 'Fetching your servers...'
                    : guilds.length > 0
                        ? 'Choose a server to begin configuration.'
                        : 'No manageable servers found. Make sure the bot is in your server and you have "Manage Server" permissions.'
                }
            </p>
             <Select
                label=""
                value={''}
                onChange={(e) => handleGuildChange(e.target.value)}
                disabled={loadingGuilds || guilds.length === 0}
                loading={loadingGuilds}
                options={guilds.map(g => ({ value: g.id, label: g.name }))}
                placeholder={loadingGuilds ? "Loading servers..." : "Choose your server..."}
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