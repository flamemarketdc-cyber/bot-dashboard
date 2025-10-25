import React, { useState, useEffect } from 'react';
import type { Guild, AutoModSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import Toggle from '../Toggle';
// FIX: Import ChevronRightIcon to resolve reference error.
import { AutoModIcon, PlusIcon, CogIcon, ChevronRightIcon } from '../Icons';

interface AutoModSettingsProps {
  guild: Guild;
}

const CategoryToggle: React.FC<{label: string, tag: string}> = ({label, tag}) => (
    <div className="bg-zinc-900 p-3 rounded-md flex justify-between items-center border border-zinc-800">
        <div>
            <span className="text-white font-medium text-sm">{label}</span>
            <span className="ml-2 text-xs font-semibold bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">{tag}</span>
        </div>
        <Toggle checked={true} onChange={() => {}} label="" description="" size="sm" />
    </div>
);

const ActionButton: React.FC<{label: string, children: React.ReactNode, hasConfig?: boolean}> = ({label, children, hasConfig}) => (
    <div className="bg-zinc-900 p-3 rounded-md flex justify-between items-center border border-zinc-800">
        <div className="flex items-center gap-3">
            {children}
            <span className="text-white font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {hasConfig && <button className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-300 hover:text-white"><CogIcon className="w-5 h-5"/></button>}
            <button className="h-6 w-6 rounded-md flex items-center justify-center bg-red-600/50 text-red-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
            </button>
        </div>
    </div>
);


const AutoModSettings: React.FC<AutoModSettingsProps> = ({ guild }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiService.getAutoModSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  if (isLoading || !settings) {
    return <div className="flex items-center justify-center h-full p-8"><Spinner size="lg" /></div>;
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-8">
            <AutoModIcon className="w-8 h-8 text-zinc-300"/>
            <h2 className="text-3xl font-bold text-white">Auto Moderation</h2>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="bg-[#1c1c1c] rounded-lg p-6 flex justify-between items-center mb-6 border border-zinc-800">
                <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        AI Moderation
                        <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">BETA</span>
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">Use artificial intelligence to assist you in moderating your server.</p>
                </div>
                <button className="bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Disable</button>
            </div>
            
            <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-zinc-400 mb-2">Inappropriate language categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CategoryToggle label="Insults" tag="Medium" />
                    <CategoryToggle label="Threats" tag="Medium" />
                    <CategoryToggle label="Identity attacks" tag="Medium" />
                    <CategoryToggle label="Other offensive language" tag="Medium" />
                </div>
                <a href="#" className="text-sm text-red-400 hover:underline mt-3 inline-block">Language support</a>
            </div>

            <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-zinc-400 mb-2">Actions</h4>
                <div className="space-y-3">
                    <ActionButton label="Report to moderators" hasConfig>
                        <input type="checkbox" className="h-5 w-5 rounded bg-transparent border-2 border-zinc-500 text-red-500 focus:ring-red-500" defaultChecked />
                    </ActionButton>
                    <ActionButton label="Delete message">
                         <input type="checkbox" className="h-5 w-5 rounded bg-transparent border-2 border-zinc-500 text-red-500 focus:ring-red-500" />
                    </ActionButton>
                    <button className="w-full border-2 border-dashed border-zinc-700 rounded-md p-3 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors flex items-center justify-center gap-2">
                        <PlusIcon /> No other actions added
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                    <a href="#" className="text-zinc-300 hover:text-white hover:underline">Manage roles</a>
                    <a href="#" className="text-zinc-300 hover:text-white hover:underline">Manage channels</a>
                    <a href="#" className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1">
                        Advanced settings 
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M9.28 4.22a.75.75 0 00-1.06 1.06L10.94 8l-2.72 2.72a.75.75 0 101.06 1.06L13.06 8 9.28 4.22z"></path></svg>
                    </a>
                </div>
                <div className="text-zinc-400 flex items-center gap-1">
                    Scanning 10 messages per minute <PlusIcon />
                </div>
            </div>
             <div className="mt-8 bg-[#1c1c1c] rounded-lg p-4 flex justify-between items-center border border-zinc-800">
                <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8.05 17a2 2 0 103.9 0H8.05z" /></svg>
                       Discord's built-in auto moderation
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">Specify additional actions for Discord's built-in auto moderation.</p>
                </div>
                <ChevronRightIcon />
            </div>
        </div>
    </div>
  );
};

export default AutoModSettings;