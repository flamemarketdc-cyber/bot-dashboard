import React, { useState, useEffect } from 'react';
import type { Guild, GiveawaySettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import { SuccessIcon, ErrorIcon } from '../Icons';

interface GiveawaySettingsProps {
  guild: Guild;
}

const SettingsCard: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6">{children}</div>
);

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
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Giveaway Settings</h2>
      <p className="text-gray-400 mb-6">Configure defaults for the giveaway system.</p>
      
      <div className="space-y-6 max-w-2xl">
        <SettingsCard>
            <label htmlFor="managerRoleIds" className="block text-md font-semibold text-gray-200 mb-2">
                Giveaway Manager Role IDs
            </label>
            <p className="text-sm text-gray-400 mb-3">Users with these roles can start, end, and manage giveaways.</p>
            <input
                type="text"
                id="managerRoleIds"
                name="managerRoleIds"
                value={settings.managerRoleIds}
                onChange={handleInputChange}
                placeholder="Enter role IDs, separated by commas"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple role IDs with a comma.</p>
        </SettingsCard>
        
        <SettingsCard>
            <label htmlFor="defaultEmoji" className="block text-md font-semibold text-gray-200 mb-2">
                Default Reaction Emoji
            </label>
            <p className="text-sm text-gray-400 mb-3">The emoji users must react with to enter giveaways.</p>
            <input
                type="text"
                id="defaultEmoji"
                name="defaultEmoji"
                value={settings.defaultEmoji}
                onChange={handleInputChange}
                placeholder="e.g., 🎉"
                className="w-full max-w-xs bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
            />
        </SettingsCard>
        
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            {apiResponse && (
                 <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    apiResponse.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                 }`}>
                    {apiResponse.success ? <SuccessIcon /> : <ErrorIcon />}
                    <span>{apiResponse.message}</span>
                 </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all"
            >
              {isSaving ? <Spinner size="sm" /> : <span className="ml-2">{isSaving ? 'Saving...' : 'Save Changes'}</span>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default GiveawaySettings;
