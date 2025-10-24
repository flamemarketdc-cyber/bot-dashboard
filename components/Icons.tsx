
import React from 'react';

export const DiscordLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M20.3,3.9A17.8,17.8,0,0,0,14,2.1,19.3,19.3,0,0,0,9.9,2.1a18,18,0,0,0-6.3,1.8A19.8,19.8,0,0,0,2.1,13.2a19.4,19.4,0,0,0,3.3,7.5,19.1,19.1,0,0,0,7.5,3.3,18,18,0,0,0,1.9.1,18.4,18.4,0,0,0,9.2-3.4,19.3,19.3,0,0,0,3.3-7.5A18.8,18.8,0,0,0,20.3,3.9ZM8.2,16.8a2.6,2.6,0,0,1-2.4-2.8,2.7,2.7,0,0,1,2.9-2.4,2.7,2.7,0,0,1,2.4,2.8A2.6,2.6,0,0,1,8.2,16.8Zm7.5,0a2.6,2.6,0,0,1-2.4-2.8,2.7,2.7,0,0,1,2.9-2.4,2.7,2.7,0,0,1,2.4,2.8A2.6,2.6,0,0,1,15.8,16.8Z" />
    </svg>
);

export const ChevronDownIcon: React.FC = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const LogoutIcon: React.FC = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const SuccessIcon: React.FC = () => (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ErrorIcon: React.FC = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
