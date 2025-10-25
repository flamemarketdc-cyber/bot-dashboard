import React from 'react';
import { CogIcon, TicketIcon, AutoModIcon, ChatBubbleIcon, GiftIcon, ClockIcon, ShieldCheckIcon } from './Icons';
import type { Guild } from '../types';

interface DashboardOverviewProps {
    selectedGuild: Guild;
    prefix: string;
    ticketEnabled: boolean;
    autoModEnabled: boolean;

    chatbotEnabled: boolean;
    giveawaysConfigured: boolean;
    claimTimeEnabled: boolean;
}

const StatCard: React.FC<{title: string; value: string; status?: boolean; icon: React.ReactNode, href: string}> = ({title, value, status, icon, href}) => (
    <a href={href} className="bg-[#1c1c1c] p-5 rounded-lg border border-zinc-800 flex items-start gap-4 transition-all duration-200 hover:bg-zinc-800/50 hover:border-zinc-700">
      <div className="bg-black/20 p-3 rounded-full">{icon}</div>
      <div className="flex-grow">
          <p className="text-zinc-400 text-sm font-medium">{title}</p>
          <p className="text-zinc-100 text-lg font-bold">{value}</p>
      </div>
      {status !== undefined && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-zinc-300'}`}>
              {status ? 'Enabled' : 'Disabled'}
          </span>
      )}
    </a>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    selectedGuild,
    prefix,
    ticketEnabled,
    autoModEnabled,
    chatbotEnabled,
    giveawaysConfigured,
    claimTimeEnabled,
}) => {
    return (
        <div className="p-6 md:p-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-zinc-400 mb-8">An overview of all modules on <span className="font-semibold text-zinc-100">{selectedGuild?.name}</span>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard title="Bot Prefix" value={`'${prefix}'`} icon={<CogIcon className="text-zinc-300" />} href="#/general" />
                <StatCard title="Auto Moderation" value={autoModEnabled ? 'Active' : 'Inactive'} status={autoModEnabled} icon={<AutoModIcon className="text-zinc-300"/>} href="#/auto-moderation" />
                <StatCard title="Ticket System" value={ticketEnabled ? 'Active' : 'Not Set Up'} status={ticketEnabled} icon={<TicketIcon />} href="#/tickets" />
                <StatCard title="Chatbot" value={chatbotEnabled ? 'Active' : 'Inactive'} status={chatbotEnabled} icon={<ChatBubbleIcon />} href="#/chatbot" />
                <StatCard title="Giveaways" value={giveawaysConfigured ? 'Configured' : 'Not Set Up'} status={giveawaysConfigured} icon={<GiftIcon />} href="#/giveaways" />
                <StatCard title="Giveaway Claim Time" value={claimTimeEnabled ? 'Active' : 'Inactive'} status={claimTimeEnabled} icon={<ClockIcon />} href="#/claimtime" />
            </div>
        </div>
    );
};

export default DashboardOverview;