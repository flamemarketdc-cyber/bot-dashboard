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
import { DiscordLogoIcon, ErrorIcon, CogIcon, TicketIcon, ShieldCheckIcon, ChatBubbleIcon, GiftIcon, ClockIcon } from './Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  providerToken?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, providerToken }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [loadingGuilds, setLoadingGuilds] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [error, setError] = useState<string | null>(null);
  
  // States for dashboard overview
  const [prefix, setPrefix] = useState<string>(',');
  const [ticketEnabled, setTicketEnabled] = useState<boolean>(false);
  const [autoModEnabled, setAutoModEnabled] = useState<boolean>(false);
  const [chatbotEnabled, setChatbotEnabled] = useState<boolean>(false);
  const [giveawaysConfigured, setGiveawaysConfigured] = useState<boolean>(false);
  const [claimTimeEnabled, setClaimTimeEnabled] = useState<boolean>(false);

  useEffect(() => {
    setError(null);
    setLoadingGuilds(true);
    if (!providerToken) {
        setError("Authentication error: Could not find Discord access token. Please try logging out and back in.");
        setLoadingGuilds(false);
        return;
    }

    apiService.getGuilds(providerToken)
      .then(setGuilds)
      .catch(err => {
        setError(err.message || "An unknown error occurred while fetching servers.");
      })
      .finally(() => {
        setLoadingGuilds(false);
      });
  }, [providerToken]);

  useEffect(() => {
    if (selectedGuild) {
      setChannels([]);
      setActiveModule('dashboard');
      
      const fetchAllSettings = async () => {
          setLoadingData(true);
          setError(null);
          try {
              const results = await Promise.allSettled([
                  apiService.getChannels(selectedGuild.id),
                  apiService.getGeneralSettings(selectedGuild.id),
                  apiService.getTicketSettings(selectedGuild.id),
                  apiService.getAutoModSettings(selectedGuild.id),
                  apiService.getChatbotSettings(selectedGuild.id),
                  apiService.getGiveawaySettings(selectedGuild.id),
                  apiService.getClaimTimeSettings(selectedGuild.id),
              ]);

              const [chRes, genRes, tktRes, amRes, cbRes, gvRes, ctRes] = results;
              const failedModules: string[] = [];

              if (chRes.status === 'fulfilled') setChannels(chRes.value);
              else {
                  console.error("Failed to fetch channels:", chRes.reason);
                  setChannels([]);
              }

              if (genRes.status === 'fulfilled') setPrefix(genRes.value.prefix);
              else {
                  console.error("Failed to fetch general settings:", genRes.reason);
                  setPrefix(',');
                  failedModules.push('General Settings');
              }

              if (tktRes.status === 'fulfilled') setTicketEnabled(!!tktRes.value.panelChannelId);
              else {
                  console.error("Failed to fetch ticket settings:", tktRes.reason);
                  setTicketEnabled(false);
                  failedModules.push('Ticket System');
              }
              
              if (amRes.status === 'fulfilled') setAutoModEnabled(amRes.value.enabled);
              else {
                  console.error("Failed to fetch automod settings:", amRes.reason);
                  setAutoModEnabled(false);
                  failedModules.push('Auto Moderation');
              }
              
              if (cbRes.status === 'fulfilled') setChatbotEnabled(cbRes.value.enabled);
              else {
                  console.error("Failed to fetch chatbot settings:", cbRes.reason);
                  setChatbotEnabled(false);
                  failedModules.push('Chatbot');
              }
              
              if (gvRes.status === 'fulfilled') setGiveawaysConfigured(gvRes.value.managerRoleIds.length > 0);
              else {
                  console.error("Failed to fetch giveaway settings:", gvRes.reason);
                  setGiveawaysConfigured(false);
                  failedModules.push('Giveaways');
              }
              
              if (ctRes.status === 'fulfilled') setClaimTimeEnabled(ctRes.value.enabled);
              else {
                  console.error("Failed to fetch claim time settings:", ctRes.reason);
                  setClaimTimeEnabled(false);
                  failedModules.push('Giveaway Claim Time');
              }

              let finalError = '';
              if (chRes.status === 'rejected') {
                  const reason = chRes.reason?.message || 'The server returned an unknown error.';
                  finalError += `Failed to fetch server channels. ${reason}. Settings that require a channel list may be disabled.`;
              }
              if (failedModules.length > 0) {
                  finalError += ` Could not fetch settings for: ${failedModules.join(', ')}.`;
              }
              if(finalError) setError(finalError.trim());

          } catch (err: any) {
              setError("A critical error occurred while fetching server data.");
              console.error("Critical fetch error:", err);
          } finally {
              setLoadingData(false);
          }
      };
      
      fetchAllSettings();
    }
  }, [selectedGuild]);

  const handleGuildChange = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId) || null;
    setSelectedGuild(guild);
  };
  
  const StatCard: React.FC<{title: string; value: string; status?: boolean; icon: React.ReactNode}> = ({title, value, status, icon}) => (
      <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/60 flex items-start gap-4 transition-all duration-300 hover:bg-slate-800/60 hover:border-red-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/20">
        <div className="bg-slate-900 p-3 rounded-full border border-slate-700">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-slate-100 text-lg font-bold">{value}</p>
        </div>
        {status !== undefined && (
            <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${status ? 'bg-green-500/20 text-green-300' : 'bg-slate-600/50 text-slate-300'}`}>
                {status ? 'Enabled' : 'Disabled'}
            </span>
        )}
      </div>
  );

  const renderContent = () => {
    if (loadingData) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    switch (activeModule) {
      case 'dashboard':
        return <div className="p-6 md:p-8 animate-fade-in-up">
            <h2 className="text-4xl font-black red-gradient-text mb-2">Mission Control</h2>
            <p className="text-slate-400 mb-8">High-level overview of the bot's status in <span className="font-semibold text-red-400">{selectedGuild?.name}</span>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Bot Prefix" value={`'${prefix}'`} icon={<CogIcon />} />
                <StatCard title="Ticket System" value={ticketEnabled ? 'Active' : 'Not Set Up'} status={ticketEnabled} icon={<TicketIcon />} />
                <StatCard title="Auto Moderation" value={autoModEnabled ? 'Active' : 'Inactive'} status={autoModEnabled} icon={<ShieldCheckIcon />} />
                <StatCard title="Chatbot" value={chatbotEnabled ? 'Active' : 'Inactive'} status={chatbotEnabled} icon={<ChatBubbleIcon />} />
                <StatCard title="Giveaways" value={giveawaysConfigured ? 'Configured' : 'Not Set Up'} status={giveawaysConfigured} icon={<GiftIcon />} />
                <StatCard title="Giveaway Claim Time" value={claimTimeEnabled ? 'Active' : 'Inactive'} status={claimTimeEnabled} icon={<ClockIcon />} />
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
  
  if (error && guilds.length === 0) {
    return (
       <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <Header user={user} onLogout={onLogout} />
        <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-sm shadow-2xl rounded-xl p-8 border border-red-700/60 text-center">
            <ErrorIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Failed to Fetch Servers</h2>
            <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedGuild) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
          <Header user={user} onLogout={onLogout} />
           <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-sm shadow-2xl shadow-red-900/10 rounded-xl p-8 border border-slate-700/60 text-center animate-fade-in-up">
            <DiscordLogoIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Select a Server</h2>
            <p className="text-slate-400 mb-6">
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
    <div className="w-screen h-screen flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} selectedGuild={selectedGuild} />
        <main className="flex-grow overflow-y-auto">
          {error && !loadingData && (
             <div className="p-4 mx-6 md:mx-8 mt-6 md:mt-8 bg-red-900/50 border border-red-700/80 rounded-lg animate-fade-in-up">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <ErrorIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-md font-semibold text-red-300">There was an issue loading server data</h3>
                        <p className="text-sm text-slate-300 mt-1">{error}</p>
                    </div>
                </div>
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;