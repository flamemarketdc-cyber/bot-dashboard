import React, { useState, useEffect, useCallback } from 'react';
import type { User, Guild, Channel } from '../types';
import { apiService } from '../services/api';
import Header from './Header';
import Spinner from './Spinner';
import Select from './Select';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import GeneralSettings from './settings/GeneralSettings';
import TicketSettings from './settings/TicketSettings';
import AutoModSettings from './settings/AutoModSettings';
import ChatbotSettings from './settings/ChatbotSettings';
import GiveawaySettings from './settings/GiveawaySettings';
import ClaimTimeSettings from './settings/ClaimTimeSettings';
import CommandsSettings from './settings/CommandsSettings';
import { DiscordLogoIcon, ErrorIcon } from './Icons';

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
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/dashboard');
  const [error, setError] = useState<string | null>(null);
  
  // States for dashboard overview
  const [prefix, setPrefix] = useState<string>(',');
  const [ticketEnabled, setTicketEnabled] = useState<boolean>(false);
  const [autoModEnabled, setAutoModEnabled] = useState<boolean>(false);
  const [chatbotEnabled, setChatbotEnabled] = useState<boolean>(false);
  const [giveawaysConfigured, setGiveawaysConfigured] = useState<boolean>(false);
  const [claimTimeEnabled, setClaimTimeEnabled] = useState<boolean>(false);

  // Router effect
  useEffect(() => {
    const handleHashChange = () => {
        setCurrentPath(window.location.hash || '#/dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Set initial path
    handleHashChange();
    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    setError(null);
    setLoadingGuilds(true);
    if (!providerToken) {
        setError("Authentication error: Could not find Discord access token. Please try logging out and back in.");
        setLoadingGuilds(false);
        return;
    }

    apiService.getGuilds(providerToken)
      .then(fetchedGuilds => {
        setGuilds(fetchedGuilds);
        const savedGuildId = localStorage.getItem('selectedGuildId');
        if (savedGuildId) {
            const savedGuild = fetchedGuilds.find(g => g.id === savedGuildId);
            if (savedGuild) {
                setSelectedGuild(savedGuild);
            }
        }
      })
      .catch(err => {
        setError(err.message || "An unknown error occurred while fetching servers.");
      })
      .finally(() => {
        setLoadingGuilds(false);
      });
  }, [providerToken]);

  const fetchAllSettings = useCallback(async (guild: Guild) => {
    setLoadingData(true);
    setError(null);
    try {
        const results = await Promise.allSettled([
            apiService.getChannels(guild.id),
            apiService.getGeneralSettings(guild.id),
            apiService.getTicketSettings(guild.id),
            apiService.getAutoModSettings(guild.id),
            apiService.getChatbotSettings(guild.id),
            apiService.getGiveawaySettings(guild.id),
            apiService.getClaimTimeSettings(guild.id),
            apiService.getCommandSettings(guild.id), // Fetch new settings
        ]);

        const [chRes, genRes, tktRes, amRes, cbRes, gvRes, ctRes, cmdRes] = results;
        const failedModules: string[] = [];

        if (chRes.status === 'fulfilled') setChannels(chRes.value);
        else {
            console.error("Failed to fetch channels:", chRes.reason);
            setChannels([]);
        }

        if (genRes.status === 'fulfilled') setPrefix(genRes.value.prefix);
        else {
            failedModules.push('General Settings');
        }

        if (tktRes.status === 'fulfilled') setTicketEnabled(!!tktRes.value.panelChannelId);
        else {
            failedModules.push('Ticket System');
        }
        
        if (amRes.status === 'fulfilled') setAutoModEnabled(amRes.value.enabled);
        else {
            failedModules.push('Auto Moderation');
        }
        
        if (cbRes.status === 'fulfilled') setChatbotEnabled(cbRes.value.enabled);
        else {
            failedModules.push('Chatbot');
        }
        
        if (gvRes.status === 'fulfilled') setGiveawaysConfigured(gvRes.value.managerRoleIds.length > 0);
        else {
            failedModules.push('Giveaways');
        }
        
        if (ctRes.status === 'fulfilled') setClaimTimeEnabled(ctRes.value.enabled);
        else {
            failedModules.push('Giveaway Claim Time');
        }
        
        // Don't need to do anything with cmdRes for overview

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
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      setChannels([]);
      window.location.hash = '#/dashboard';
      fetchAllSettings(selectedGuild);
    }
  }, [selectedGuild, fetchAllSettings]);

  const handleGuildChange = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId) || null;
    if (guild) {
        localStorage.setItem('selectedGuildId', guild.id);
    } else {
        localStorage.removeItem('selectedGuildId');
    }
    setSelectedGuild(guild);
  };
  
  const renderContent = () => {
    if (loadingData) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    switch (currentPath) {
      case '#/general':
        return <GeneralSettings guild={selectedGuild!} channels={channels} />;
      case '#/commands':
        return <CommandsSettings guild={selectedGuild!} />;
      case '#/tickets':
        return <TicketSettings guild={selectedGuild!} channels={channels} />;
      case '#/automod':
        return <AutoModSettings guild={selectedGuild!} />;
      case '#/chatbot':
        return <ChatbotSettings guild={selectedGuild!} channels={channels} />;
      case '#/giveaways':
        return <GiveawaySettings guild={selectedGuild!} />;
      case '#/claimtime':
        return <ClaimTimeSettings guild={selectedGuild!} />;
      case '#/dashboard':
      default:
        return <DashboardOverview
            selectedGuild={selectedGuild!}
            prefix={prefix}
            ticketEnabled={ticketEnabled}
            autoModEnabled={autoModEnabled}
            chatbotEnabled={chatbotEnabled}
            giveawaysConfigured={giveawaysConfigured}
            claimTimeEnabled={claimTimeEnabled}
        />;
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
    <div className="w-screen h-screen flex bg-[#16191C]">
      <Sidebar onRefresh={() => fetchAllSettings(selectedGuild)} />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header 
            user={user} 
            onLogout={onLogout} 
            guilds={guilds}
            selectedGuild={selectedGuild}
            onGuildChange={handleGuildChange}
        />
        <main className="flex-grow overflow-y-auto bg-[#1E2124]">
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