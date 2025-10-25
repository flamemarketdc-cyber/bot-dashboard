import React, { useState, useEffect } from 'react';
import type { Guild, CommandSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';
import { PlusIcon, TrashIcon, CustomCommandIcon, DefaultCommandIcon, ChevronRightIcon } from '../Icons';

interface CommandsSettingsProps {
  guild: Guild;
}

const SettingsClickableCard: React.FC<{icon: React.ReactNode, title: string, description: string, href: string}> = ({icon, title, description, href}) => (
    <a href={href} className="w-full flex items-center justify-between bg-[#292b2f] border border-black/20 rounded-lg p-6 transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-700/30">
        <div className="flex items-center gap-6">
            {icon}
            <div>
                <h4 className="text-lg font-bold text-zinc-100">{title}</h4>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </div>
        <ChevronRightIcon />
    </a>
);


const CommandsSettings: React.FC<CommandsSettingsProps> = ({ guild }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [newPrefix, setNewPrefix] = useState('');

  useEffect(() => {
    setIsLoading(true);
    apiService.getCommandSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Settings) => {
    if (!settings) return;
    setSettings({ ...settings, [name]: e.target.checked });
  };
  
  const addPrefix = () => {
    if (newPrefix && settings && settings.prefixes.length < 5 && !settings.prefixes.includes(newPrefix)) {
        setSettings({ ...settings, prefixes: [...settings.prefixes, newPrefix] });
        setNewPrefix('');
    }
  };

  const removePrefix = (prefixToRemove: string) => {
    if (!settings) return;
    setSettings({ ...settings, prefixes: settings.prefixes.filter(p => p !== prefixToRemove) });
  };

  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveCommandSettings(guild.id, settings);
          setApiResponse(response);
      } catch (error: any) {
          setApiResponse({ success: false, message: 'An unexpected error occurred.' });
      } finally {
          setIsSaving(false);
          setTimeout(() => setApiResponse(null), 5000);
      }
  };

  if (isLoading || !settings) {
    return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;
  }

  return (
    <SettingsLayout
      title="Commands"
      description="Manage custom commands, default commands, prefixes, and error messages."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <div className="space-y-4">
        <SettingsClickableCard 
            icon={<CustomCommandIcon />}
            title="Custom commands"
            description="Create and manage your own commands."
            href="#/commands/custom"
        />
        <SettingsClickableCard 
            icon={<DefaultCommandIcon />}
            title="Default commands"
            description="Update permissions, aliases and more for all default commands."
            href="#/commands/default"
        />
      </div>

      <SettingsCard title="Prefixes">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-400">Put one of the following prefixes in front of your message to execute commands.</p>
            <span className="text-xs font-semibold bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md">{settings.prefixes.length}/5</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
            <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                maxLength={5}
                placeholder="New prefix..."
                className="flex-grow bg-[#202225] border border-black/50 rounded-md p-2 text-zinc-200 focus:ring-2 focus:ring-red-500"
            />
            <button
                onClick={addPrefix}
                disabled={!newPrefix || settings.prefixes.length >= 5}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-all disabled:bg-zinc-600 disabled:cursor-not-allowed"
            >
                Add
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
            {settings.prefixes.map(prefix => (
                <div key={prefix} className="flex items-center gap-1.5 bg-zinc-700/70 py-1 pl-3 pr-1 rounded-full">
                    <span className="font-mono text-zinc-200">{prefix}</span>
                    <button onClick={() => removePrefix(prefix)} className="p-1 text-zinc-400 hover:text-red-400 transition rounded-full hover:bg-red-900/40">
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    </button>
                </div>
            ))}
        </div>
      </SettingsCard>
        
      <SettingsCard title="Error Messages">
        <div className="space-y-4">
            <Toggle 
                label="Command not found"
                description="Sent when an executed command doesn't exist."
                checked={settings.errorCommandNotFoundEnabled}
                onChange={(e) => handleToggle(e, 'errorCommandNotFoundEnabled')}
            />
            <hr className="border-zinc-700/50" />
             <Toggle 
                label="Wrong command usage"
                description="Sent when an existing command is used incorrectly."
                checked={settings.errorWrongUsageEnabled}
                onChange={(e) => handleToggle(e, 'errorWrongUsageEnabled')}
            />
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default CommandsSettings;