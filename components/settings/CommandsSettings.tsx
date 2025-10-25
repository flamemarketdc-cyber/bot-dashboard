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
    <a href={href} className="w-full flex items-center justify-between bg-[#1c1c1c] border border-zinc-800 rounded-lg p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/50">
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

       <SettingsCard title="Command Prefixes">
        <p className="text-sm text-zinc-400 mb-4">Add or remove prefixes the bot will respond to. Up to 5 prefixes are allowed.</p>
        <div className="flex items-center gap-2 mb-3">
            <input
                type="text"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                placeholder="Enter new prefix..."
                maxLength={5}
                className="flex-grow bg-[#1c1c1c] border border-zinc-800 rounded-md p-2 text-zinc-200 focus:ring-2 focus:ring-red-500/80"
            />
            <button onClick={addPrefix} disabled={!newPrefix || settings.prefixes.length >= 5} className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                <PlusIcon />
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
            {settings.prefixes.map(p => (
                <div key={p} className="flex items-center gap-2 bg-zinc-900/80 rounded-full px-3 py-1 text-sm">
                    <span className="font-mono text-zinc-300">{p}</span>
                    <button onClick={() => removePrefix(p)} className="text-zinc-500 hover:text-red-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            ))}
        </div>
      </SettingsCard>
      
      <SettingsCard title="Error Messages">
        <div className="space-y-4">
            <Toggle 
                label="Command Not Found"
                description="Reply with an error when a user tries a command that doesn't exist."
                checked={settings.errorCommandNotFoundEnabled}
                onChange={(e) => handleToggle(e, 'errorCommandNotFoundEnabled')}
            />
            <Toggle 
                label="Wrong Command Usage"
                description="Reply with usage instructions when a command is used incorrectly."
                checked={settings.errorWrongUsageEnabled}
                onChange={(e) => handleToggle(e, 'errorWrongUsageEnabled')}
            />
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default CommandsSettings;