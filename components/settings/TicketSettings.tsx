import React, { useState, useEffect } from 'react';
import type { Guild, Channel, TicketSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Select from '../Select';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';

interface TicketSettingsProps {
  guild: Guild;
  channels: Channel[];
}

const TicketSettings: React.FC<TicketSettingsProps> = ({ guild, channels }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getTicketSettings(guild.id)
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
          const response = await apiService.saveTicketSettings(guild.id, settings);
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
  const categoryChannels = channels.filter(c => c.type === 4);

  return (
    <SettingsLayout
      title="Ticket System"
      description="Set up and manage the support ticket system for your server."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard title="Channel Setup">
        <div className="space-y-4">
          <Select
            label="Ticket Panel Channel"
            name="panelChannelId"
            value={settings.panelChannelId ?? ""}
            onChange={handleSelectChange}
            options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
            placeholder="Select a channel"
            description="The channel where users can create new tickets."
          />
          <Select
            label="Ticket Category"
            name="categoryId"
            value={settings.categoryId ?? ""}
            onChange={handleSelectChange}
            options={categoryChannels.map(c => ({ value: c.id, label: `📁 ${c.name}` }))}
            placeholder="Select a category"
            description="The category where new ticket channels will be created."
          />
        </div>
      </SettingsCard>
        
      <SettingsCard title="Permissions">
        <label htmlFor="supportRoleIds" className="block text-sm font-medium text-slate-300 mb-2">
          Support Role IDs
        </label>
        <p className="text-xs text-slate-400 mb-2">Users with these roles can view and respond to tickets.</p>
        <input
          type="text"
          id="supportRoleIds"
          name="supportRoleIds"
          value={settings.supportRoleIds}
          onChange={handleInputChange}
          placeholder="Enter role IDs, separated by commas"
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
        <p className="text-xs text-slate-500 mt-1">Separate multiple role IDs with a comma (e.g., 87654321,12345678).</p>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default TicketSettings;