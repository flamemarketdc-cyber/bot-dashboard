import React, { useState, useEffect, useCallback } from 'react';
import type { User, Guild, Channel, GeneralSettings, ApiResponse } from '../types';
import { apiService } from '../services/api';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  providerToken?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, providerToken }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState<string>('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (!providerToken) {
      setError("Authentication error: Could not find Discord access token.");
      setLoadingGuilds(false);
      return;
    }

    setLoadingGuilds(true);
    apiService.getGuilds(providerToken)
      .then(fetchedGuilds => {
        setGuilds(fetchedGuilds);
        const savedGuildId = localStorage.getItem('selectedGuildId');
        if (savedGuildId && fetchedGuilds.some(g => g.id === savedGuildId)) {
          setSelectedGuildId(savedGuildId);
        } else if (fetchedGuilds.length > 0) {
          const firstGuildId = fetchedGuilds[0].id;
          setSelectedGuildId(firstGuildId);
          localStorage.setItem('selectedGuildId', firstGuildId);
        }
      })
      .catch(err => {
        setError(err.message || "An unknown error occurred while fetching servers.");
      })
      .finally(() => {
        setLoadingGuilds(false);
      });
  }, [providerToken]);

  const fetchDataForGuild = useCallback(async (guildId: string) => {
    if (!guildId) return;
    setLoadingData(true);
    setError(null);
    setChannels([]);
    setSettings(null);

    try {
      const [fetchedChannels, fetchedSettings] = await Promise.all([
        apiService.getChannels(guildId),
        apiService.getGeneralSettings(guildId),
      ]);
      setChannels(fetchedChannels);
      setSettings(fetchedSettings);
    } catch (err: any) {
      setError(`Failed to fetch data for server: ${err.message}`);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchDataForGuild(selectedGuildId);
  }, [selectedGuildId, fetchDataForGuild]);

  const handleGuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const guildId = e.target.value;
    setSelectedGuildId(guildId);
    if (guildId) {
      localStorage.setItem('selectedGuildId', guildId);
    } else {
      localStorage.removeItem('selectedGuildId');
    }
  };

  const handleSettingsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value || null });
  };

  const handleSave = async () => {
    if (!settings || !selectedGuildId) return;
    setIsSaving(true);
    setApiResponse(null);
    try {
      const response = await apiService.saveGeneralSettings(selectedGuildId, settings);
      setApiResponse(response);
    } catch (error) {
      setApiResponse({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setApiResponse(null), 3000);
    }
  };
  
  return (
    <div>
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user.username}</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      
      <main style={{ padding: '20px' }}>
        <h2>Server Settings</h2>
        
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="guild-select">Select a Server: </label>
          <select 
            id="guild-select" 
            value={selectedGuildId} 
            onChange={handleGuildChange}
            disabled={loadingGuilds || guilds.length === 0}
          >
            <option value="">{loadingGuilds ? 'Loading...' : guilds.length === 0 ? 'No servers found' : 'Choose a server'}</option>
            {guilds.map(guild => (
              <option key={guild.id} value={guild.id}>{guild.name}</option>
            ))}
          </select>
        </div>

        {loadingData && <p>Loading server data...</p>}
        
        {selectedGuildId && !loadingData && settings && (
          <section style={{ border: '1px solid #eee', padding: '15px' }}>
            <h3>General Settings for {guilds.find(g => g.id === selectedGuildId)?.name}</h3>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="prefix">Bot Prefix: </label>
              <input 
                type="text" 
                id="prefix"
                name="prefix"
                value={settings.prefix}
                onChange={handleSettingsInputChange}
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <label htmlFor="welcomeChannelId">Welcome Channel: </label>
              <select
                id="welcomeChannelId"
                name="welcomeChannelId"
                value={settings.welcomeChannelId ?? ""}
                onChange={handleSettingsInputChange}
                disabled={channels.length === 0}
              >
                <option value="">{channels.length === 0 ? 'No text channels found' : 'None'}</option>
                {channels.filter(c => c.type === 0).map(c => (
                  <option key={c.id} value={c.id}># {c.name}</option>
                ))}
              </select>
            </div>
             <div style={{ margin: '10px 0' }}>
              <label htmlFor="logChannelId">Log Channel: </label>
              <select
                id="logChannelId"
                name="logChannelId"
                value={settings.logChannelId ?? ""}
                onChange={handleSettingsInputChange}
                disabled={channels.length === 0}
              >
                <option value="">{channels.length === 0 ? 'No text channels found' : 'None'}</option>
                {channels.filter(c => c.type === 0).map(c => (
                  <option key={c.id} value={c.id}># {c.name}</option>
                ))}
              </select>
            </div>

            <button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            {apiResponse && (
                <p style={{ color: apiResponse.success ? 'green' : 'red', marginTop: '10px' }}>
                    {apiResponse.message}
                </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;