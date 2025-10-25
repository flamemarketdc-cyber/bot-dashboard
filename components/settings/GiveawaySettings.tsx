import React, { useState, useEffect } from 'react';
import type { Guild, GiveawaySettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

interface GiveawaySettingsProps {
  guild: Guild;
}

const GiveawaySettings: React.FC<GiveawaySettingsProps> = ({ guild }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getGiveawaySettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };
  
  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveGiveawaySettings(guild.id, settings);
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
      title="Giveaway Settings"
      description="Configure default permissions and settings for the giveaway system."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard title="Permissions">
        <label htmlFor="managerRoleIds" className="block text-sm font-medium text-zinc-300 mb-2">
            Giveaway Manager Role IDs
        </label>
        <p className="text-xs text-zinc-400 mb-3">Users with these roles can start, end, and manage giveaways.</p>
        <input
            type="text"
            id="managerRoleIds"
            name="managerRoleIds"
            value={settings.managerRoleIds}
            onChange={handleInputChange}
            placeholder="Enter role IDs, separated by commas"
            className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-md p-2 text-zinc-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
        <p className="text-xs text-zinc-500 mt-1">Separate multiple role IDs with a comma.</p>
      </SettingsCard>
        
      <SettingsCard title="Defaults">
        <label htmlFor="defaultEmoji" className="block text-sm font-medium text-zinc-300 mb-2">
            Default Reaction Emoji
        </label>
        <p className="text-xs text-zinc-400 mb-3">The emoji users must react with to enter giveaways.</p>
        <input
            type="text"
            id="defaultEmoji"
            name="defaultEmoji"
            value={settings.defaultEmoji}
            onChange={handleInputChange}
            placeholder="e.g., 🎉"
            className="w-full max-w-xs bg-[#1c1c1c] border border-zinc-800 rounded-md p-2 text-zinc-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
      </SettingsCard>
    </SettingsLayout>
  );
};

export default GiveawaySettings;