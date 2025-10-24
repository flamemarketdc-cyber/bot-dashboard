import React, { useState, useEffect, Fragment } from 'react';
import { 
    HomeIcon, CogIcon, CommandsIcon, MessagesIcon, BrandingIcon, 
    AutoModIcon, TicketIcon, RefreshIcon 
} from './Icons';

interface SidebarProps {
    onRefresh: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isExpanded: boolean;
    href: string;
}> = ({ icon, label, isActive, isExpanded, href }) => (
    <a
        href={href}
        className={`w-full flex items-center gap-4 px-4 h-11 rounded-md text-left transition-all duration-200 relative ${
            isActive 
                ? 'bg-red-900/40 text-white font-semibold' 
                : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
        }`}
    >
        {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 red-gradient-bg rounded-r-full"></div>}
        <div className="w-6 flex items-center justify-center">{icon}</div>
        <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </a>
);

const NavHeader: React.FC<{isExpanded: boolean; label: string}> = ({ isExpanded, label }) => (
    <h3 className={`text-xs font-bold tracking-wider text-zinc-500 mt-4 mb-2 transition-opacity duration-100 ${isExpanded ? 'opacity-100 px-4' : 'opacity-0'}`}>
        {label}
    </h3>
)

const Sidebar: React.FC<SidebarProps> = ({ onRefresh }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activePath, setActivePath] = useState(window.location.hash || '#/dashboard');

    useEffect(() => {
        const handleHashChange = () => {
            setActivePath(window.location.hash || '#/dashboard');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const navSections = [
        {
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
                { id: 'general', label: 'General Settings', icon: <CogIcon className="w-6 h-6 text-zinc-300" /> },
                { id: 'commands', label: 'Commands', icon: <CommandsIcon /> },
                { id: 'messages', label: 'Messages', icon: <MessagesIcon /> },
                { id: 'branding', label: 'Custom Branding', icon: <BrandingIcon /> },
            ]
        },
        {
            title: 'MODULES',
            items: [
                { id: 'automod', label: 'Auto Moderation', icon: <AutoModIcon /> },
                { id: 'tickets', label: 'Ticket System', icon: <TicketIcon /> },
            ]
        }
    ];

    return (
        <aside 
            className={`transition-all duration-300 ease-in-out bg-[#16191C] border-r border-zinc-700/40 p-3 flex-shrink-0 flex flex-col ${isExpanded ? 'w-64' : 'w-20'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="h-16 flex items-center justify-center font-black text-2xl red-gradient-text mb-4">
                {isExpanded ? "COMMAND" : "C"}
            </div>
            <button
                onClick={onRefresh}
                className="w-full flex items-center justify-center gap-2 px-2 h-10 mb-4 rounded-md text-sm font-semibold transition-all duration-200 text-zinc-300 bg-zinc-800/60 hover:bg-zinc-700/80 hover:text-white"
            >
                <RefreshIcon />
                <span className={`transition-opacity duration-100 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    Fetch roles/channels
                </span>
            </button>
            <nav className="flex-grow">
                {navSections.map((section, index) => (
                    <Fragment key={index}>
                        {section.title && <NavHeader isExpanded={isExpanded} label={section.title} />}
                        <div className="space-y-1.5">
                            {section.items.map(item => (
                                <NavItem 
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    href={`#/${item.id}`}
                                    isActive={activePath === `#/${item.id}`}
                                    isExpanded={isExpanded}
                                />
                            ))}
                        </div>
                    </Fragment>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;