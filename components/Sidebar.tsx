import React from 'react';
import { HomeIcon, CogIcon, TicketIcon } from './Icons';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
            isActive 
                ? 'bg-indigo-600 text-white font-semibold' 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'general', label: 'General Settings', icon: <CogIcon /> },
        { id: 'tickets', label: 'Ticket System', icon: <TicketIcon /> },
    ];

    return (
        <aside className="w-64 bg-gray-800/50 shadow-lg rounded-xl border border-gray-700/30 p-4 flex-shrink-0">
            <nav className="space-y-2">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeModule === item.id}
                        onClick={() => setActiveModule(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
