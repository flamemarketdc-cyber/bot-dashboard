import React, { useState, useEffect } from 'react';
import type { Guild, Channel, TicketSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Select from '../Select';
import Spinner from '../Spinner';
import { SuccessIcon, ErrorIcon } from '../Icons';

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

  // Filter channels for different select inputs
  const textChannels = channels.filter(c => c.type === 0);
  const categoryChannels = channels.filter(c => c.type === 4);

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Ticket System</h2>
      <p className="text-gray-400 mb-6">Set up the ticketing system for your server.</p>
      
      <div className="space-y-6 max-w-2xl">
        <Select
          label="Ticket Panel Channel"
          name="panelChannelId"
          value={settings.panelChannelId ?? ""}
          onChange={handleSelectChange}
          options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
          placeholder="Channel to create tickets in"
        />
        
        <Select
          label="Ticket Category"
          name="categoryId"
          value={settings.categoryId ?? ""}
          onChange={handleSelectChange}
          options={categoryChannels.map(c => ({ value: c.id, label: `📁 ${c.name}` }))}
          placeholder="Category to create new tickets under"
        />
        
        <div>
          <label htmlFor="supportRoleIds" className="block text-sm font-medium text-gray-300 mb-2">
            Support Role IDs
          </label>
          <input
            type="text"
            id="supportRoleIds"
            name="supportRoleIds"
            value={settings.supportRoleIds}
            onChange={handleInputChange}
            placeholder="Enter role IDs, separated by commas"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
           <p className="text-xs text-gray-500 mt-1">Separate multiple role IDs with a comma (e.g., 87654321,12345678).</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-700">
            {apiResponse ? (
                 <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    apiResponse.success 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-red-900/50 text-red-300'
                 }`}>
                    {apiResponse.success ? <SuccessIcon /> : <ErrorIcon />}
                    <span>{apiResponse.message}</span>
                 </div>
            ) : <div />}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto ml-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              {isSaving && <Spinner size="sm" />}
              <span className="ml-2">{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSettings;
