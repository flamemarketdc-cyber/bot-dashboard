import React from 'react';
import {
  HomeIcon,
  SettingsIcon,
  CommandsIcon,
  MessagesIcon,
  BrandingIcon,
  AutoModIcon,
  ModerationIcon,
  SocialNotificationsIcon,
  JoinRolesIcon,
  ReactionRolesIcon,
  WelcomeMessagesIcon,
  RoleConnectionsIcon,
  LoggingIcon,
  CloseIcon,
} from './Icons';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex items-center p-2.5 my-0.5 rounded-lg cursor-pointer transition-colors duration-200 relative ${
        active ? 'text-vibrant-red' : 'text-gray-400 hover:bg-base-300/50 hover:text-white'
      }`}
    >
      {active && <div className="absolute left-0 top-0 h-full w-1 bg-vibrant-red rounded-r-full"></div>}
      <div className={`absolute left-0 top-0 h-full w-full ${active ? 'bg-vibrant-red/20' : ''}`}></div>
      <div className="w-5 h-5 mr-3 z-10">{icon}</div>
      <span className="font-semibold text-sm z-10">{label}</span>
    </a>
  </li>
);

const ModuleHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-3 mt-4 mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">{children}</h3>
);

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen, activePage, setActivePage }) => {
  const handleNavigation = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
    }
  };

  const mainNav = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <SettingsIcon />, label: 'General Settings' },
    { icon: <CommandsIcon />, label: 'Commands' },
    { icon: <MessagesIcon />, label: 'Messages' },
    { icon: <BrandingIcon />, label: 'Custom Branding' },
  ];

  const modulesNav = [
    { icon: <AutoModIcon />, label: 'Auto Moderation' },
    { icon: <ModerationIcon />, label: 'Moderation' },
    { icon: <SocialNotificationsIcon />, label: 'Social Notifications' },
    { icon: <JoinRolesIcon />, label: 'Join Roles' },
    { icon: <ReactionRolesIcon />, label: 'Reaction Roles' },
    { icon: <WelcomeMessagesIcon />, label: 'Welcome Messages' },
    { icon: <RoleConnectionsIcon />, label: 'Role Connections' },
    { icon: <LoggingIcon />, label: 'Logging' },
  ];

  return (
    <aside
      className={`absolute top-0 left-0 z-40 w-72 h-full bg-base-200 flex-col md:flex md:static md:translate-x-0 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
        <div className="flex items-center justify-between h-20 px-4 md:hidden">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">Navigation</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white md:hidden">
              <CloseIcon />
            </button>
        </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul>
          {mainNav.map(item => (
            <NavItem key={item.label} icon={item.icon} label={item.label} active={activePage === item.label} onClick={() => handleNavigation(item.label)} />
          ))}
        </ul>
        <ModuleHeading>Modules</ModuleHeading>
        <ul>
          {modulesNav.map(item => (
            <NavItem key={item.label} icon={item.icon} label={item.label} active={activePage === item.label} onClick={() => handleNavigation(item.label)} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;