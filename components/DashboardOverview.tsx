import React from 'react';
// FIX: Import `AutoModIcon` which is used for the Auto Moderation stat card.
import { CogIcon, TicketIcon, ShieldCheckIcon, ChatBubbleIcon, GiftIcon, ClockIcon, AutoModIcon } from './Icons';
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

const StatCard: React.FC<{title: string; value: string; status?: boolean; icon: React.ReactNode}> = ({title, value, status, icon}) => (
    <div className="bg-[#16191C]/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/60 flex items-start gap-4 transition-all duration-300 hover:bg-slate-800/60 hover:border-red-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/20">
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
            <h2 className="text-4xl font-black red-gradient-text mb-2">Mission Control</h2>
            <p className="text-slate-400 mb-8">High-level overview of the bot's status in <span className="font-semibold text-red-400">{selectedGuild?.name}</span>.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Bot Prefix" value={`'${prefix}'`} icon={<CogIcon />} />
                <StatCard title="Ticket System" value={ticketEnabled ? 'Active' : 'Not Set Up'} status={ticketEnabled} icon={<TicketIcon />} />
                <StatCard title="Auto Moderation" value={autoModEnabled ? 'Active' : 'Inactive'} status={autoModEnabled} icon={<AutoModIcon />} />
                <StatCard title="Chatbot" value={chatbotEnabled ? 'Active' : 'Inactive'} status={chatbotEnabled} icon={<ChatBubbleIcon />} />
                <StatCard title="Giveaways" value={giveawaysConfigured ? 'Configured' : 'Not Set Up'} status={giveawaysConfigured} icon={<GiftIcon />} />
                <StatCard title="Giveaway Claim Time" value={claimTimeEnabled ? 'Active' : 'Inactive'} status={claimTimeEnabled} icon={<ClockIcon />} />
            </div>
        </div>
    );
};

export default DashboardOverview;