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
import MessagesSettings from './settings/MessagesSettings';
import BrandingSettings from './settings/BrandingSettings';
import LoggingSettings from './settings/LoggingSettings';
import ReactionRoleSettings from './settings/ReactionRoleSettings';
import CustomCommands from './settings/CustomCommands';
import DefaultCommands from './settings/DefaultCommands';
import JoinRolesSettings from './settings/JoinRolesSettings';
import WelcomeMessagesSettings from './settings/WelcomeMessagesSettings';

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
  
  // States for dashboard overview & sidebar toggles
  const [moduleStatus, setModuleStatus] = useState({
    autoMod: false,
    joinRoles: false,
    reactionRoles: false,
    welcomeMessages: false,
    logging: false,
    tickets: false,
    chatbot: false,
    giveaways: false,
    claimTime: false,
  });
  const [prefix, setPrefix] = useState<string>(',');


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
        } else if (fetchedGuilds.length > 0) {
            // Select the first guild by default if none is saved
            setSelectedGuild(fetchedGuilds[0]);
            localStorage.setItem('selectedGuildId', fetchedGuilds[0].id);
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
            apiService.getJoinRolesSettings(guild.id),
            apiService.getWelcomeMessagesSettings(guild.id),
            apiService.getLoggingSettings(guild.id),
            apiService.getReactionRolesSettings(guild.id),
        ]);

        const [chRes, genRes, tktRes, amRes, cbRes, gvRes, ctRes, jrRes, wmRes, logRes, rrRes] = results;
        
        const newModuleStatus = { ...moduleStatus };
        const failedModules: string[] = [];

        if (chRes.status === 'fulfilled') setChannels(chRes.value);
        else console.error("Failed to fetch channels:", chRes.reason);
        
        if (genRes.status === 'fulfilled') setPrefix(genRes.value.prefix);
        else failedModules.push('General');

        const checkStatus = (res: PromiseSettledResult<any>, key: keyof typeof moduleStatus, name: string) => {
            if (res.status === 'fulfilled') {
                if (key === 'giveaways') newModuleStatus[key] = res.value.managerRoleIds.length > 0;
                else if (key === 'tickets') newModuleStatus[key] = !!res.value.panelChannelId;
                else newModuleStatus[key] = res.value.enabled;
            } else failedModules.push(name);
        };
        
        checkStatus(tktRes, 'tickets', 'Tickets');
        checkStatus(amRes, 'autoMod', 'Auto Moderation');
        checkStatus(cbRes, 'chatbot', 'Chatbot');
        checkStatus(gvRes, 'giveaways', 'Giveaways');
        checkStatus(ctRes, 'claimTime', 'Claim Time');
        checkStatus(jrRes, 'joinRoles', 'Join Roles');
        checkStatus(wmRes, 'welcomeMessages', 'Welcome Messages');
        checkStatus(logRes, 'logging', 'Logging');
        checkStatus(rrRes, 'reactionRoles', 'Reaction Roles');

        setModuleStatus(newModuleStatus);
        
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
      case '#/commands/custom':
        return <CustomCommands />;
      case '#/commands/default':
        return <DefaultCommands />;
      case '#/messages':
        return <MessagesSettings guild={selectedGuild!} channels={channels} />;
      case '#/branding':
        return <BrandingSettings />;
      case '#/auto-moderation':
        return <AutoModSettings guild={selectedGuild!} />;
      case '#/join-roles':
        return <JoinRolesSettings />;
      case '#/reaction-roles':
        return <ReactionRoleSettings />;
      case '#/welcome-messages':
        return <WelcomeMessagesSettings />;
      case '#/logging':
        // FIX: Pass required 'guild' and 'channels' props to LoggingSettings.
        return <LoggingSettings guild={selectedGuild!} channels={channels} />;
      case '#/tickets':
        return <TicketSettings guild={selectedGuild!} channels={channels} />;
      case '#/giveaways':
        return <GiveawaySettings guild={selectedGuild!} />;
      case '#/claimtime':
        return <ClaimTimeSettings guild={selectedGuild!} />;
      case '#/chatbot':
        return <ChatbotSettings guild={selectedGuild!} channels={channels} />;
      case '#/dashboard':
      default:
        return <DashboardOverview
            selectedGuild={selectedGuild!}
            prefix={prefix}
            ticketEnabled={moduleStatus.tickets}
            autoModEnabled={moduleStatus.autoMod}
            chatbotEnabled={moduleStatus.chatbot}
            giveawaysConfigured={moduleStatus.giveaways}
            claimTimeEnabled={moduleStatus.claimTime}
        />;
    }
  };
  
  if (error && guilds.length === 0) {
    return (
       <div className="min-h-screen w-full flex flex-col">
        <Header user={user} onLogout={onLogout} />
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#181818]/80 backdrop-blur-md shadow-lg rounded-xl p-8 border border-red-700/60 text-center">
                <ErrorIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Failed to Fetch Servers</h2>
                <p className="text-red-300">{error}</p>
            </div>
        </div>
      </div>
    );
  }

  if (!selectedGuild) {
    return (
      <div className="min-h-screen w-full flex flex-col">
          <Header user={user} onLogout={onLogout} />
          <div className="flex-grow flex items-center justify-center p-4">
           <div className="w-full max-w-lg bg-[#181818]/80 backdrop-blur-md shadow-lg rounded-xl p-8 border border-zinc-700/50 text-center animate-fade-in-up">
            <DiscordLogoIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Select a Server</h2>
            <p className="text-zinc-400 mb-6">
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
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-transparent">
        <Header 
            user={user} 
            onLogout={onLogout} 
            guilds={guilds}
            selectedGuild={selectedGuild}
            onGuildChange={handleGuildChange}
        />
        <div className="flex flex-grow overflow-hidden">
            <Sidebar moduleStatus={moduleStatus} onRefresh={() => fetchAllSettings(selectedGuild)} />
            <main className="flex-grow overflow-y-auto bg-zinc-900/40 backdrop-blur-sm">
              {error && !loadingData && (
                 <div className="p-4 mx-6 md:mx-8 mt-6 md:mt-8 bg-red-900/50 border border-red-700/80 rounded-lg animate-fade-in-up">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ErrorIcon className="h-6 w-6 text-red-400" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-md font-semibold text-red-300">There was an issue loading server data</h3>
                            <p className="text-sm text-zinc-300 mt-1">{error}</p>
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