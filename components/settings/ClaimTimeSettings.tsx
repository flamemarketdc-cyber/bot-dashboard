import React, { useState, useEffect } from 'react';
import type { Guild, ClaimTimeSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';

interface ClaimTimeSettingsProps {
  guild: Guild;
}

const ClaimTimeSettings: React.FC<ClaimTimeSettingsProps> = ({ guild }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getClaimTimeSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, enabled: e.target.checked });
  };

  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveClaimTimeSettings(guild.id, settings);
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
      title="Claim Time System"
      description="Reward active users by allowing them to claim a role periodically."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard>
        <Toggle 
            label="Enable Claim Time"
            description="Allow users to use the claim command."
            checked={settings.enabled}
            onChange={handleToggle}
        />
      </SettingsCard>

      <SettingsCard title="Configuration">
        <div className="space-y-4">
          <div>
              <label htmlFor="roleId" className="block text-sm font-medium text-slate-300 mb-2">
                  Claim Role ID
              </label>
              <input
                  type="text"
                  id="roleId"
                  name="roleId"
                  value={settings.roleId ?? ""}
                  onChange={handleInputChange}
                  placeholder="Role to give to users"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
          </div>
          <div>
              <label htmlFor="command" className="block text-sm font-medium text-slate-300 mb-2">
                  Command Name
              </label>
              <input
                  type="text"
                  id="command"
                  name="command"
                  value={settings.command}
                  onChange={handleInputChange}
                  className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
          </div>
            <div>
              <label htmlFor="frequencyHours" className="block text-sm font-medium text-slate-300 mb-2">
                  Claim Frequency (in hours)
              </label>
              <input
                  type="number"
                  id="frequencyHours"
                  name="frequencyHours"
                  value={settings.frequencyHours}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
          </div>
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default ClaimTimeSettings;
