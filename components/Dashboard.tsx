
import React, { useState, useEffect, useCallback } from 'react';
import type { User, Guild, Channel, ApiResponse } from '../types';
import { mockApiService } from '../services/api';
import Header from './Header';
import Select from './Select';
import Spinner from './Spinner';
import { SendIcon, SuccessIcon, ErrorIcon } from './Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  
  const [selectedGuild, setSelectedGuild] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const [loadingGuilds, setLoadingGuilds] = useState<boolean>(true);
  const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    mockApiService.getGuilds()
      .then(setGuilds)
      .catch(err => console.error("Failed to fetch guilds", err))
      .finally(() => setLoadingGuilds(false));
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      setLoadingChannels(true);
      setChannels([]);
      setSelectedChannel('');
      mockApiService.getChannels(selectedGuild)
        .then(setChannels)
        .catch(err => console.error("Failed to fetch channels", err))
        .finally(() => setLoadingChannels(false));
    }
  }, [selectedGuild]);
  
  const handleSend = async () => {
    if (!selectedGuild || !selectedChannel || !message.trim()) {
      setApiResponse({ success: false, message: 'Please select a server, channel, and enter a message.' });
      return;
    }
    
    setIsSending(true);
    setApiResponse(null);

    try {
      const response = await mockApiService.sendAnnouncement(selectedGuild, selectedChannel, message);
      setApiResponse(response);
      if(response.success) {
        setMessage('');
      }
    } catch (error: any) {
        setApiResponse(error as ApiResponse);
    } finally {
      setIsSending(false);
      setTimeout(() => setApiResponse(null), 5000); // Clear message after 5s
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[70vh]">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow bg-gray-800 shadow-2xl rounded-xl p-6 md:p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Create Announcement</h2>
        
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                    label="Select a Server"
                    value={selectedGuild}
                    onChange={(e) => setSelectedGuild(e.target.value)}
                    disabled={loadingGuilds}
                    options={guilds.map(g => ({ value: g.id, label: g.name }))}
                    loading={loadingGuilds}
                    placeholder="Loading servers..."
                />
                <Select
                    label="Select a Channel"
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    disabled={!selectedGuild || loadingChannels}
                    options={channels.map(c => ({ value: c.id, label: `# ${c.name}` }))}
                    loading={loadingChannels}
                    placeholder={!selectedGuild ? "Select a server first" : "Loading channels..."}
                />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Announcement Message
              </label>
              <textarea
                id="message"
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement here... Supports markdown!"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 {apiResponse && (
                     <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                        apiResponse.success 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-red-900/50 text-red-300'
                     }`}>
                        {apiResponse.success ? <SuccessIcon /> : <ErrorIcon />}
                        <span>{apiResponse.message}</span>
                     </div>
                 )}
                <button
                  onClick={handleSend}
                  disabled={isSending || !selectedGuild || !selectedChannel || !message}
                  className="w-full sm:w-auto ml-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  {isSending ? (
                      <Spinner size="sm" />
                  ) : (
                      <SendIcon />
                  )}
                  <span className="ml-2">{isSending ? 'Sending...' : 'Send Announcement'}</span>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
