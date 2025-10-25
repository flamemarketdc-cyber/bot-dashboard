import React, { useState, useEffect } from 'react';
import { 
    HomeIcon, CogIcon, CommandsIcon, MessagesIcon, BrandingIcon, AutoModIcon, 
    TicketIcon, GiftIcon, ClockIcon, LoggingIcon, ReactionRoleIcon,
    ChatBubbleIcon, UserPlusIcon, HandWavingIcon, RefreshIcon
} from './Icons';
import Toggle from './Toggle';

interface SidebarProps {
    moduleStatus: { [key: string]: boolean };
    onRefresh: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    href: string;
    isSubItem?: boolean;
    moduleEnabled?: boolean;
    onToggleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ icon, label, isActive, href, isSubItem = false, moduleEnabled, onToggleChange }) => (
    <div className="relative">
        <a
            href={href}
            className={`w-full flex items-center gap-3 h-9 rounded-md text-left transition-all duration-200 ${
                isSubItem ? 'pl-8' : 'pl-3'
            } ${
                isActive 
                    ? 'bg-zinc-800/70 text-white font-medium' 
                    : 'text-zinc-400 hover:bg-zinc-700/40 hover:text-zinc-200'
            }`}
        >
            {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-red-600 rounded-r-full"></div>}
            <div className="w-5 flex items-center justify-center">{icon}</div>
            <span className="text-sm flex-grow">{label}</span>
        </a>
        {onToggleChange && (
             <div className="absolute right-2 top-1/2 -translate-y-1/2" onClick={e => e.stopPropagation()}>
                <Toggle
                    checked={moduleEnabled ?? false}
                    onChange={onToggleChange}
                    label=""
                    description=""
                    size="sm"
                />
             </div>
        )}
    </div>
);

const NavHeader: React.FC<{label: string}> = ({ label }) => (
    <h3 className="text-xs font-bold tracking-wider text-zinc-500 mt-4 mb-2 px-3">
        {label}
    </h3>
)

const Sidebar: React.FC<SidebarProps> = ({ moduleStatus, onRefresh }) => {
    const [activePath, setActivePath] = useState(window.location.hash || '#/dashboard');
    
    useEffect(() => {
        const handleHashChange = () => {
            setActivePath(window.location.hash || '#/dashboard');
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const mainNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5"/> },
        { id: 'general', label: 'General Settings', icon: <CogIcon /> },
        { id: 'commands', label: 'Commands', icon: <CommandsIcon /> },
        { id: 'messages', label: 'Messages', icon: <MessagesIcon /> },
        { id: 'branding', label: 'Custom Branding', icon: <BrandingIcon /> },
    ];

    const modulesNavItems = [
        { id: 'auto-moderation', label: 'Auto Moderation', icon: <AutoModIcon />, statusKey: 'autoMod' },
        { id: 'logging', label: 'Logging', icon: <LoggingIcon />, statusKey: 'logging' },
        { id: 'tickets', label: 'Tickets', icon: <TicketIcon />, statusKey: 'tickets' },
        { id: 'chatbot', label: 'Chatbot (AI)', icon: <ChatBubbleIcon />, statusKey: 'chatbot' },
        { id: 'giveaways', label: 'Giveaways', icon: <GiftIcon />, statusKey: 'giveaways' },
        { id: 'claimtime', label: 'Claim Time', icon: <ClockIcon />, statusKey: 'claimTime' },
        { id: 'welcome-messages', label: 'Welcome Messages', icon: <HandWavingIcon />, statusKey: 'welcomeMessages' },
        { id: 'join-roles', label: 'Join Roles', icon: <UserPlusIcon />, statusKey: 'joinRoles' },
        { id: 'reaction-roles', label: 'Reaction Roles', icon: <ReactionRoleIcon />, statusKey: 'reactionRoles' },
    ];

    return (
        <aside className="w-60 bg-[#1c1c1c]/80 backdrop-blur-md flex-shrink-0 flex flex-col border-r border-zinc-800">
            <div className="p-3 border-b border-zinc-800">
                 <button
                    onClick={onRefresh}
                    className="w-full flex items-center justify-center gap-2 h-9 rounded-md text-sm font-semibold transition-all duration-200 text-zinc-300 bg-zinc-700/40 hover:bg-zinc-700/80"
                >
                    <RefreshIcon className="w-4 h-4" />
                    <span>Fetch Data</span>
                </button>
            </div>
            <nav className="flex-grow overflow-y-auto p-3 space-y-0.5">
                {mainNavItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        href={`#/${item.id}`}
                        isActive={activePath.startsWith(`#/${item.id}`)}
                    />
                ))}
                
                <NavHeader label="MODULES" />
                
                {modulesNavItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        href={`#/${item.id}`}
                        isActive={activePath === `#/${item.id}`}
                        moduleEnabled={moduleStatus[item.statusKey]}
                        onToggleChange={() => console.log(`Toggled ${item.label}`)}
                    />
                ))}
            </nav>
            <div className="p-3 mt-auto border-t border-zinc-800">
                <a href="#" className="text-xs text-zinc-500 hover:text-zinc-400">Links</a>
            </div>
        </aside>
    );
};

export default Sidebar;