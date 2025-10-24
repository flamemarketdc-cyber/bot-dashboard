import React, { useState } from 'react';
import { HomeIcon, CogIcon, TicketIcon, ShieldCheckIcon, ChatBubbleIcon, GiftIcon, ClockIcon } from './Icons';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isExpanded: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, isExpanded, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 h-12 rounded-lg text-left transition-all duration-200 relative ${
            isActive 
                ? 'bg-red-900/40 text-white font-semibold' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }`}
    >
        {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 red-gradient-bg rounded-r-full"></div>}
        {icon}
        <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'general', label: 'General Settings', icon: <CogIcon /> },
        { id: 'tickets', label: 'Ticket System', icon: <TicketIcon /> },
        { id: 'automod', label: 'Auto Moderation', icon: <ShieldCheckIcon /> },
        { id: 'chatbot', label: 'Chatbot', icon: <ChatBubbleIcon /> },
        { id: 'giveaways', label: 'Giveaways', icon: <GiftIcon /> },
        { id: 'claimtime', label: 'Claim Time', icon: <ClockIcon /> },
    ];

    return (
        <aside 
            className={`transition-all duration-300 ease-in-out bg-slate-900/30 backdrop-blur-sm border-r border-slate-700/60 p-4 flex-shrink-0 flex flex-col ${isExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="h-16 flex items-center justify-center font-black text-2xl red-gradient-text mb-4">
                {isExpanded ? "COMMAND" : "C"}
            </div>
            <nav className="space-y-2">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeModule === item.id}
                        isExpanded={isExpanded}
                        onClick={() => setActiveModule(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;