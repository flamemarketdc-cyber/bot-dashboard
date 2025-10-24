import React, { useState, useEffect } from 'react';
import type { Guild, ClaimTimeSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';
import { PlusIcon, TrashIcon } from '../Icons';

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
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    setSettings({ ...settings, enabled: e.target.checked });
  };
  
  const handleLogicChange = (logic: 'additive' | 'highest') => {
    if (!settings) return;
    setSettings({ ...settings, logic });
  }

  const handleRoleTimeChange = (index: number, field: 'roleId' | 'minutes', value: string) => {
    if (!settings) return;
    const newRoleTimes = [...settings.roleTimes];
    if (field === 'minutes') {
        newRoleTimes[index] = { ...newRoleTimes[index], minutes: parseInt(value, 10) || 0 };
    } else {
        newRoleTimes[index] = { ...newRoleTimes[index], roleId: value };
    }
    setSettings({ ...settings, roleTimes: newRoleTimes });
  };
  
  const addRoleTime = () => {
    if (!settings) return;
    setSettings({ ...settings, roleTimes: [...settings.roleTimes, { roleId: '', minutes: 0 }] });
  };

  const removeRoleTime = (index: number) => {
    if (!settings) return;
    const newRoleTimes = settings.roleTimes.filter((_, i) => i !== index);
    setSettings({ ...settings, roleTimes: newRoleTimes });
  };


  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      // Filter out empty role entries before saving
      const finalSettings = {
          ...settings,
          roleTimes: settings.roleTimes.filter(rt => rt.roleId.trim() !== '' && rt.minutes > 0)
      };
      setSettings(finalSettings);

      try {
          const response = await apiService.saveClaimTimeSettings(guild.id, finalSettings);
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
      title="Giveaway Claim Time"
      description="Configure how long giveaway winners have to claim their prize."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard>
        <Toggle 
            label="Enable Custom Claim Times"
            description="If disabled, giveaways will not have a claim time limit."
            checked={settings.enabled}
            onChange={handleToggle}
        />
      </SettingsCard>

      <SettingsCard title="Default Configuration">
        <div className="space-y-4">
            <div>
                <label htmlFor="defaultMinutes" className="block text-sm font-medium text-slate-300 mb-2">
                    Default Claim Time (in minutes)
                </label>
                <p className="text-xs text-slate-400 mb-3">The base time a winner has to claim their prize if they have no special roles.</p>
                <input
                    type="number"
                    id="defaultMinutes"
                    name="defaultMinutes"
                    value={settings.defaultMinutes}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role Time Logic
                </label>
                <p className="text-xs text-slate-400 mb-3">How to calculate claim time for users with multiple special roles.</p>
                <div className="flex gap-2">
                    <button onClick={() => handleLogicChange('highest')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${settings.logic === 'highest' ? 'red-gradient-bg text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}>Highest Wins</button>
                    <button onClick={() => handleLogicChange('additive')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${settings.logic === 'additive' ? 'red-gradient-bg text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}>Additive</button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    {settings.logic === 'highest'
                        ? 'The user gets the time from their highest-value role.'
                        : 'Times from all of the user\'s roles are added together.'
                    }
                </p>
            </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Role-Specific Times">
        <p className="text-sm text-slate-400 mb-4">Add specific roles to override the default claim time. This is great for rewarding VIPs or server boosters.</p>
        <div className="space-y-3">
            {settings.roleTimes.map((rt, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <input
                        type="text"
                        placeholder="Role ID"
                        value={rt.roleId}
                        onChange={(e) => handleRoleTimeChange(index, 'roleId', e.target.value)}
                        className="flex-grow bg-slate-900 border border-slate-700/80 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-red-500/80"
                    />
                     <input
                        type="number"
                        placeholder="Minutes"
                        value={rt.minutes}
                        onChange={(e) => handleRoleTimeChange(index, 'minutes', e.target.value)}
                        className="w-32 bg-slate-900 border border-slate-700/80 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-red-500/80"
                    />
                    <button onClick={() => removeRoleTime(index)} className="p-2 text-slate-400 hover:text-red-400 transition rounded-md hover:bg-red-900/40">
                        <TrashIcon />
                    </button>
                </div>
            ))}
        </div>
        <button onClick={addRoleTime} className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition">
            <PlusIcon /> Add Role Override
        </button>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default ClaimTimeSettings;