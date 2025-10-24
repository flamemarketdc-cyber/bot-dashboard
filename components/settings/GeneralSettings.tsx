import React, { useState, useEffect } from 'react';
import type { Guild, Channel, GeneralSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Select from '../Select';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

interface GeneralSettingsProps {
  guild: Guild;
  channels: Channel[];
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ guild, channels }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getGeneralSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value || null });
  };
  
  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveGeneralSettings(guild.id, settings);
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
  
  const textChannels = channels.filter(c => c.type === 0);
  const noChannelsAvailable = channels.length === 0;

  return (
    <SettingsLayout
      title="General Settings"
      description="Configure the core behavior and channel settings for the bot in your server."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard title="Bot Prefix">
        <label htmlFor="prefix" className="block text-sm font-medium text-slate-300 mb-2">
          The character the bot responds to.
        </label>
        <input
          type="text"
          id="prefix"
          name="prefix"
          value={settings.prefix}
          onChange={handleInputChange}
          className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
      </SettingsCard>

      <SettingsCard title="Channel Configuration">
        <div className="space-y-4">
          <Select
            label="Welcome Channel"
            name="welcomeChannelId"
            value={settings.welcomeChannelId ?? ""}
            onChange={handleSelectChange}
            options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
            placeholder={noChannelsAvailable ? "Could not load channels" : "Select a channel for greetings"}
            description="The bot will greet new members in this channel."
            disabled={noChannelsAvailable}
          />
          <Select
            label="Log Channel"
            name="logChannelId"
            value={settings.logChannelId ?? ""}
            onChange={handleSelectChange}
            options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
            placeholder={noChannelsAvailable ? "Could not load channels" : "Select a channel for logs"}
            description="Important bot and server events will be logged here."
            disabled={noChannelsAvailable}
          />
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default GeneralSettings;