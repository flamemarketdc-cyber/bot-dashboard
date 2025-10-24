import React, { useState, useEffect } from 'react';
import type { Guild, AutoModSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';

interface AutoModSettingsProps {
  guild: Guild;
}

const AutoModSettings: React.FC<AutoModSettingsProps> = ({ guild }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getAutoModSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Settings) => {
    if (!settings) return;
    setSettings({ ...settings, [name]: e.target.checked });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveAutoModSettings(guild.id, settings);
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
      title="Auto Moderation"
      description="Automatically moderate your server to keep it safe and clean."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
        <SettingsCard>
            <Toggle 
                label="Enable Auto Moderation"
                description="Master switch to turn all auto-mod features on or off."
                checked={settings.enabled}
                onChange={(e) => handleToggle(e, 'enabled')}
            />
        </SettingsCard>

        <SettingsCard title="Filters">
            <div className="space-y-4">
                <Toggle 
                    label="Block Bad Words"
                    description="Filter messages containing words from your blacklist."
                    checked={settings.blockBadWords}
                    onChange={(e) => handleToggle(e, 'blockBadWords')}
                />
                <hr className="border-slate-700/60" />
                 <Toggle 
                    label="Anti-Spam"
                    description="Prevent users from spamming messages or mentions."
                    checked={settings.antiSpam}
                    onChange={(e) => handleToggle(e, 'antiSpam')}
                />
            </div>
        </SettingsCard>
        
        <SettingsCard title="Whitelist">
            <label htmlFor="whitelistedRoles" className="block text-sm font-medium text-slate-300 mb-2">
                Whitelisted Role IDs
            </label>
            <p className="text-xs text-slate-400 mb-3">Users with these roles will bypass all auto-moderation filters.</p>
            <input
                type="text"
                id="whitelistedRoles"
                name="whitelistedRoles"
                value={settings.whitelistedRoles}
                onChange={handleInputChange}
                placeholder="Enter role IDs, separated by commas"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple role IDs with a comma.</p>
        </SettingsCard>
    </SettingsLayout>
  );
};

export default AutoModSettings;