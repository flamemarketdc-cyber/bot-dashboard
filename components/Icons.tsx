import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "w-6 h-6" }) => (
  <div className={className}>{children}</div>
);

// General UI
export const MenuIcon = () => (
    <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></IconWrapper>
);
export const CloseIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></IconWrapper>
);
export const ChevronDownIcon = () => (
  <IconWrapper className="w-4 h-4"><svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></IconWrapper>
);
export const LogoutIcon = () => (
    <IconWrapper className="w-5 h-5"><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg></IconWrapper>
);
export const SwitchUserIcon = () => (
    <IconWrapper className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h12.75m0 0a9 9 0 00-9-9m9 9a9 9 0 01-9 9m9-9v3.375c0 .621-.504 1.125-1.125 1.125h-3.75c-.621 0-1.125-.504-1.125-1.125V16.5m12-9.375L16.5 3m0 0L12 7.5M16.5 3h-12a3 3 0 00-3 3v1.5" /></svg></IconWrapper>
);
export const RefreshIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" /></svg></IconWrapper>
);
export const DiscordIcon = () => (
    <IconWrapper><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1619-.425-.3973-.8742-.6083-1.2495a.0741.0741 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8851 1.5152.069.069 0 00-.0321.0256C.7234 9.5694-1.6599 14.3859.2995 18.9852a.07.07 0 00.0632.0426c2.022.6133 3.9631.8742 5.8642.9235a.0741.0741 0 00.086-.0632c.0321-.1921.056-.3842.086-.5762a.07.07 0 00-.024-.0632c-1.4284-.425-2.7663-.956-4.0137-1.587-.1921-.086-.28-.2841-.1372-.4504.6214-.7373 1.1494-1.5544 1.587-2.4212a.07.07 0 01.0426-.0426c.712-.224 1.3916-.417 2.0468-.5843a.07.07 0 01.056.0079c.6457.4972 1.2588.9482 1.8447 1.3414a.07.07 0 00.094-.0079c.816-.5433 1.5992-1.1264 2.326-1.7454a.07.07 0 00.094-.0079c.6457.4972 1.2588.9482 1.8447 1.3414a.07.07 0 00.094.0079c.816-.5433 1.5992-1.1264 2.326-1.7454a.07.07 0 00.086.0079c.6536.1672 1.3332.3602 2.0468.5843a.07.07 0 01.0426.0426c.4376.8662.9656 1.6833 1.587 2.4212.1428.1664.056.3643-.1372.4504-1.2474.6312-2.5852 1.1622-4.0137 1.587a.07.07 0 00-.024.0632c.0321.1921.056.3842.086.5762a.0741.0741 0 00.086.0632c1.9011-.0493 3.8412-.31 5.8642-.9235a.07.07 0 00.0632-.0426C25.3832 12.03.7874 5.5495.7874 5.5495a.069.069 0 00-.0321-.0256zM8.02 15.3312c-.7874 0-1.4284-.6214-1.4284-1.3916s.641-1.3916 1.4284-1.3916c.7874 0 1.4284.6214 1.4284 1.3916.008.7702-.633 1.3916-1.4284 1.3916zm7.9528 0c-.7874 0-1.4284-.6214-1.4284-1.3916s.641-1.3916 1.4284-1.3916c.7874 0 1.4284.6214 1.4284 1.3916s-.641 1.3916-1.4284 1.3916z"/></svg></IconWrapper>
);


// Header & Sidebar
export const FireIcon = () => (
  <IconWrapper className="w-5 h-5 text-orange-400"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M17.66 11.2C17.43 10.93 17.15 10.72 16.83 10.58C16.51 10.43 16.17 10.34 15.83 10.34C15.48 10.34 15.14 10.43 14.82 10.58C14.5 10.72 14.22 10.93 13.99 11.2C13.54 10.61 13.23 9.94 13.08 9.21C12.93 8.48 12.94 7.74 13.12 7.03C13.21 6.69 13.16 6.33 12.97 6.03C12.79 5.73 12.49 5.53 12.16 5.48L11.18 5.3C10.63 5.21 10.15 4.88 9.92 4.39L9.63 3.79C9.52 3.56 9.33 3.37 9.1 3.27C8.87 3.17 8.61 3.15 8.36 3.23L7.84 3.39C7.38 3.55 7.06 3.98 7.03 4.48C7 4.98 7.25 5.45 7.66 5.71L8.8 6.4C9.1 6.6 9.29 6.91 9.35 7.26C9.4 7.62 9.31 7.98 9.1 8.28L8.5 9.19C8.29 9.5 8.2 9.88 8.26 10.26C8.32 10.64 8.52 10.99 8.83 11.22L9.93 12C10.79 11.65 11.72 11.47 12.67 11.5C13.61 11.53 14.54 11.78 15.36 12.24C14.54 13.33 14.16 14.65 14.3 16C14.45 17.35 15.11 18.59 16.13 19.46C15.23 19.82 14.26 20 13.28 20C11.33 20 9.47 19.21 8.08 17.82C6.69 16.43 5.9 14.58 5.9 12.62C5.9 10.54 6.75 8.58 8.22 7.11C9.69 5.64 11.65 4.89 13.73 4.89C14.08 4.89 14.43 4.93 14.77 5C15.17 4.29 15.74 3.68 16.44 3.22C17.14 2.76 17.95 2.5 18.78 2.5C19.61 2.5 20.42 2.76 21.12 3.22C21.82 3.68 22.39 4.29 22.79 5C23.15 5.67 23.33 6.4 23.33 7.16C23.33 8.33 22.95 9.42 22.21 10.25C21.47 11.08 20.46 11.6 19.33 11.69C18.91 11.73 18.49 11.62 18.15 11.4C17.81 11.18 17.58 10.86 17.51 10.46C17.43 10.06 17.51 9.65 17.74 9.32C17.97 8.99 18.32 8.78 18.71 8.74C19.43 8.68 20.08 8.36 20.55 7.85C20.69 7.69 20.76 7.5 20.76 7.3C20.76 7.1 20.69 6.91 20.55 6.75C20.41 6.59 20.22 6.5 20.02 6.5C19.82 6.5 19.63 6.59 19.49 6.75C19.1 7.19 18.54 7.47 17.91 7.52C16.65 7.62 15.56 8.21 14.86 9.14C15.43 8.5 16.14 8.04 16.94 7.82C17.75 7.6 18.59 7.63 19.38 7.9C20.17 8.17 20.87 8.67 21.39 9.33C21.91 9.99 22.22 10.79 22.22 11.62C22.22 12.33 21.99 13.01 21.55 13.56C21.11 14.11 20.49 14.5 19.79 14.67C19.31 14.78 18.82 14.7 18.42 14.44C18.02 14.18 17.74 13.77 17.66 13.31C17.58 12.85 17.71 12.38 18 11.99C18.29 11.6 18.74 11.36 19.22 11.34H19.33C19.63 11.34 19.92 11.22 20.14 11C20.36 10.78 20.48 10.49 20.48 10.18C20.48 9.87 20.36 9.58 20.14 9.36C19.92 9.14 19.63 9.02 19.33 9.02C18.9 9.02 18.49 9.17 18.17 9.44C17.85 9.71 17.65 10.07 17.6 10.48L17.58 10.58C17.55 10.72 17.58 10.87 17.66 11.2Z" /></svg></IconWrapper>
);

// Sidebar Navigation
export const HomeIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg></IconWrapper>
);
export const SettingsIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></IconWrapper>
);
export const CommandsIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg></IconWrapper>
);
export const MessagesIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 7.5V6a4.5 4.5 0 10-9 0v1.5M12 12.75h.008v.008H12v-.008z" /></svg></IconWrapper>
);
export const BrandingIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43c-1.102 0-2.02-.79-2.332-1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43zM9.53 16.122a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43-2.43c-1.102 0-2.02.79-2.332 1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43zM14.47 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43c-1.102 0-2.02-.79-2.332-1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43zM14.47 16.122a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43-2.43c-1.102 0-2.02.79-2.332 1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43zM14.47 9.878a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43-2.43c-1.102 0-2.02.79-2.332 1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43zM9.53 9.878a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43-2.43c-1.102 0-2.02.79-2.332 1.844a3 3 0 005.78 1.128 2.25 2.25 0 012.43 2.43z" /></svg></IconWrapper>
);
export const AutoModIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /></svg></IconWrapper>
);
export const ModerationIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></IconWrapper>
);
export const SocialNotificationsIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.032 23.849 23.849 0 005.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg></IconWrapper>
);
export const JoinRolesIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg></IconWrapper>
);
export const ReactionRolesIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.84-1.84a.75.75 0 00-1.06 0l-1.84 1.84a.75.75 0 000 1.06l1.84 1.84a.75.75 0 001.06 0l1.84-1.84a.75.75 0 000-1.06z" /></svg></IconWrapper>
);
export const WelcomeMessagesIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg></IconWrapper>
);
export const RoleConnectionsIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg></IconWrapper>
);
export const LoggingIcon = () => (
  <IconWrapper><svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></IconWrapper>
);

// Home Page Cards
export const CardMessagesIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5A3.375 3.375 0 006.75 12h1.5a1.125 1.125 0 011.125 1.125v1.5c0 .621-.504 1.125-1.125-1.125h-1.5a3.375 3.375 0 00-3.375 3.375V18.75z" /></svg></IconWrapper>
);
export const CardModerationIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></IconWrapper>
);
export const CardUserReportsIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg></IconWrapper>
);
export const CardRoleGreetingsIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.5A2.25 2.25 0 006 20.25z" /></svg></IconWrapper>
);
export const CardAIModIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 15m3.937 3.937l.707-.707m-4.243-4.243l-.707.707m0 0L9 15m3.937 3.937l.707.707M15 9.75l2.121-2.121A3 3 0 0015.937 3.937l-2.121 2.121m0 0L15 9.75M9 15l2.121 2.121A3 3 0 0015.063 21.063l2.121-2.121m0 0L15 15.75M3 8.25l2.121-2.121A3 3 0 017.243 3.937l2.121 2.121m0 0L12 9.75M3 15.75l2.121 2.121A3 3 0 007.243 21.063l2.121-2.121m0 0L12 15.75" /></svg></IconWrapper>
);
export const CardPrefixesIcon = () => (
    <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></IconWrapper>
);

// Settings Page
export const LanguageIcon = () => (
  <IconWrapper className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg></IconWrapper>
);
export const ClockIcon = () => (
    <IconWrapper className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></IconWrapper>
);
export const ShieldIcon = () => (
    <IconWrapper className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286z" /></svg></IconWrapper>
);
export const TrashIcon = () => (
    <IconWrapper className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.057-2.09.96-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></IconWrapper>
);
export const PlusIcon = () => (
    <IconWrapper className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></IconWrapper>
);
