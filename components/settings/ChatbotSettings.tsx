import React, { useState, useEffect } from 'react';
import type { Guild, Channel, ChatbotSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Select from '../Select';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';


interface ChatbotSettingsProps {
  guild: Guild;
  channels: Channel[];
}

const ChatbotSettings: React.FC<ChatbotSettingsProps> = ({ guild, channels }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getChatbotSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, enabled: e.target.checked });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({ ...settings, channelId: e.target.value || null });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({ ...settings, persona: e.target.value });
  };

  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveChatbotSettings(guild.id, settings);
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
      title="Chatbot (AI)"
      description="Configure an AI-powered chatbot to interact with users in your server."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard>
        <Toggle 
          label="Enable Chatbot"
          description="Allow the bot to chat in a designated channel when mentioned."
          checked={settings.enabled}
          onChange={handleToggle}
        />
      </SettingsCard>

      <SettingsCard title="Configuration">
        <div className="space-y-4">
          <Select
            label="Chatbot Channel"
            name="channelId"
            value={settings.channelId ?? ""}
            onChange={handleSelectChange}
            options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
            placeholder={noChannelsAvailable ? "Could not load channels" : "Select a channel for the bot"}
            description="The bot will only respond to mentions in this channel."
            disabled={noChannelsAvailable}
          />
          <div>
            <label htmlFor="persona" className="block text-sm font-medium text-zinc-300 mb-2">
                Bot Persona
            </label>
            <p className="text-xs text-zinc-400 mb-2">Give the AI instructions on how to behave. This is its personality and context.</p>
            <textarea
                id="persona"
                name="persona"
                value={settings.persona}
                onChange={handleTextAreaChange}
                rows={5}
                className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-md p-2 text-zinc-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                placeholder="e.g., You are a witty bot that loves talking about video games..."
            />
          </div>
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default ChatbotSettings;