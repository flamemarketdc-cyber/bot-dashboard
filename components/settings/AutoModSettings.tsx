import React, { useState, useEffect } from 'react';
import type { Guild, AutoModSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import { SuccessIcon, ErrorIcon } from '../Icons';

interface AutoModSettingsProps {
  guild: Guild;
}

const SettingsCard: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6">{children}</div>
);

const Toggle: React.FC<{checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string; description: string;}> = ({checked, onChange, label, description}) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="text-md font-semibold text-gray-200">{label}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    </div>
);

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
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Auto Moderation</h2>
      <p className="text-gray-400 mb-6">Automatically moderate your server to keep it clean.</p>
      
      <div className="space-y-6 max-w-2xl">
        <SettingsCard>
            <Toggle 
                label="Enable Auto Moderation"
                description="Master switch to turn all auto-mod features on or off."
                checked={settings.enabled}
                onChange={(e) => handleToggle(e, 'enabled')}
            />
        </SettingsCard>

        <SettingsCard>
            <div className="space-y-4">
                <Toggle 
                    label="Block Bad Words"
                    description="Filter messages containing words from your blacklist."
                    checked={settings.blockBadWords}
                    onChange={(e) => handleToggle(e, 'blockBadWords')}
                />
                <hr className="border-gray-700" />
                 <Toggle 
                    label="Anti-Spam"
                    description="Prevent users from spamming messages or mentions."
                    checked={settings.antiSpam}
                    onChange={(e) => handleToggle(e, 'antiSpam')}
                />
            </div>
        </SettingsCard>
        
        <SettingsCard>
            <label htmlFor="whitelistedRoles" className="block text-md font-semibold text-gray-200 mb-2">
                Whitelisted Role IDs
            </label>
            <p className="text-sm text-gray-400 mb-3">Users with these roles will bypass auto-moderation filters.</p>
            <input
                type="text"
                id="whitelistedRoles"
                name="whitelistedRoles"
                value={settings.whitelistedRoles}
                onChange={handleInputChange}
                placeholder="Enter role IDs, separated by commas"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple role IDs with a comma.</p>
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

export default AutoModSettings;
