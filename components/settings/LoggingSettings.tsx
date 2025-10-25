import React, { useState, useEffect } from 'react';
import type { Guild, Channel, LoggingSettings as Settings, ApiResponse } from '../../types';
import { apiService } from '../../services/api';
import Select from '../Select';
import Spinner from '../Spinner';
import SettingsLayout from './SettingsLayout';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';

interface LoggingSettingsProps {
  guild: Guild;
  channels: Channel[];
}

const LoggingSettings: React.FC<LoggingSettingsProps> = ({ guild, channels }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getLoggingSettings(guild.id)
      .then(setSettings)
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [guild.id]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, name: keyof Settings) => {
    if (!settings) return;
    setSettings({ ...settings, [name]: e.target.checked });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({ ...settings, logChannelId: e.target.value || null });
  };
  
  const handleSave = async () => {
      if (!settings) return;
      setIsSaving(true);
      setApiResponse(null);
      try {
          const response = await apiService.saveLoggingSettings(guild.id, settings);
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
      title="Logging"
      description="Choose which server events to log and where to send them."
      isSaving={isSaving}
      onSave={handleSave}
      apiResponse={apiResponse}
    >
      <SettingsCard>
        <Toggle 
          label="Enable Logging"
          description="Master switch to turn all logging on or off."
          checked={settings.enabled}
          onChange={(e) => handleToggle(e, 'enabled')}
        />
      </SettingsCard>
      
      <SettingsCard title="Log Channel">
        <Select
            label=""
            name="logChannelId"
            value={settings.logChannelId ?? ""}
            onChange={handleSelectChange}
            options={textChannels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
            placeholder={noChannelsAvailable ? "Could not load channels" : "Select a channel for logs"}
            description="Important bot and server events will be logged here."
            disabled={noChannelsAvailable || !settings.enabled}
        />
      </SettingsCard>

      <SettingsCard title="Member Events">
        <div className="space-y-4">
            <Toggle label="Member Joined" description="Log when a new member joins the server." checked={settings.memberJoin} onChange={(e) => handleToggle(e, 'memberJoin')} />
            <Toggle label="Member Left" description="Log when a member leaves or is kicked/banned." checked={settings.memberLeave} onChange={(e) => handleToggle(e, 'memberLeave')} />
            <Toggle label="Role Updates" description="Log when roles are added or removed from a member." checked={settings.memberRoleUpdate} onChange={(e) => handleToggle(e, 'memberRoleUpdate')} />
        </div>
      </SettingsCard>

      <SettingsCard title="Message Events">
        <div className="space-y-4">
            <Toggle label="Message Edited" description="Log when a user edits a message." checked={settings.messageEdit} onChange={(e) => handleToggle(e, 'messageEdit')} />
            <Toggle label="Message Deleted" description="Log when a message is deleted." checked={settings.messageDelete} onChange={(e) => handleToggle(e, 'messageDelete')} />
        </div>
      </SettingsCard>

      <SettingsCard title="Channel Events">
        <div className="space-y-4">
            <Toggle label="Channel Created" description="Log when a new channel is created." checked={settings.channelCreate} onChange={(e) => handleToggle(e, 'channelCreate')} />
            <Toggle label="Channel Deleted" description="Log when a channel is deleted." checked={settings.channelDelete} onChange={(e) => handleToggle(e, 'channelDelete')} />
            <Toggle label="Channel Updated" description="Log changes to channel names, topics, or permissions." checked={settings.channelUpdate} onChange={(e) => handleToggle(e, 'channelUpdate')} />
        </div>
      </SettingsCard>
    </SettingsLayout>
  );
};

export default LoggingSettings;