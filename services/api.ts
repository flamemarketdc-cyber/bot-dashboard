
import type { User, Guild, Channel, ApiResponse } from '../types';

// --- MOCK DATA ---
const MOCK_USER: User = {
  id: '123456789',
  username: 'AstroDev',
  avatar: 'https://picsum.photos/id/1025/128/128', // Placeholder doggo avatar
};

const MOCK_GUILDS: Guild[] = [
  { id: 'g1', name: '🚀 Project Nebula', icon: 'https://picsum.photos/id/10/128/128', owner: true, permissions: '2147483647' },
  { id: 'g2', name: '🎮 Gamer\'s Paradise', icon: 'https://picsum.photos/id/22/128/128', owner: false, permissions: '104324673' },
  { id: 'g3', name: '🎨 Art & Design Hub', icon: 'https://picsum.photos/id/35/128/128', owner: false, permissions: '8' },
  { id: 'g4', name: '🎵 Music Corner', icon: 'https://picsum.photos/id/48/128/128', owner: false, permissions: '104324673' },
];

const MOCK_CHANNELS: { [guildId: string]: Channel[] } = {
  'g1': [
    { id: 'c1-1', name: 'general', type: 0 },
    { id: 'c1-2', name: 'announcements', type: 0 },
    { id: 'c1-3', name: 'dev-team', type: 0 },
  ],
  'g2': [
    { id: 'c2-1', name: 'general-chat', type: 0 },
    { id: 'c2-2', name: 'looking-for-group', type: 0 },
    { id: 'c2-3', name: 'event-announcements', type: 0 },
  ],
  'g3': [
      {id: 'c3-1', name: 'showcase', type: 0},
      {id: 'c3-2', name: 'feedback', type: 0},
  ],
  'g4': [
    { id: 'c4-1', name: 'music-releases', type: 0 },
    { id: 'c4-2', name: 'listening-party', type: 0 },
  ],
};

// --- SIMULATED API SERVICE ---

// This object simulates a backend API. In a real app, these functions would
// use a library like `axios` to make HTTP requests to your Node.js server.

const USER_SESSION_KEY = 'discord_user_session';

export const mockApiService = {
  // Simulates the OAuth2 callback and "logging in" the user
  handleCallback: (): Promise<User> => {
    console.log("Simulating OAuth2 callback...");
    return new Promise((resolve) => {
      setTimeout(() => {
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(MOCK_USER));
        console.log("User logged in, session stored.");
        resolve(MOCK_USER);
      }, 1000);
    });
  },

  // Checks for an existing user session
  getUser: (): Promise<User> => {
    console.log("Checking for user session...");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionData = sessionStorage.getItem(USER_SESSION_KEY);
        if (sessionData) {
          console.log("Session found.");
          resolve(JSON.parse(sessionData));
        } else {
          console.log("No session found.");
          reject(new Error('Not logged in'));
        }
      }, 500);
    });
  },
  
  logout: (): void => {
    console.log("Logging out, clearing session.");
    sessionStorage.removeItem(USER_SESSION_KEY);
  },

  // Fetches guilds where the user has 'Manage Server' permissions
  getGuilds: (): Promise<Guild[]> => {
    // REAL IMPLEMENTATION:
    // return axios.get('/get-guilds').then(res => res.data);
    console.log("Fetching guilds...");
    return new Promise((resolve) => {
      setTimeout(() => {
        // MANAGE_GUILD permission bit is 0x20
        const MANAGE_GUILD = 0x20;
        const manageableGuilds = MOCK_GUILDS.filter(g => (parseInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD);
        console.log("Found manageable guilds:", manageableGuilds);
        resolve(manageableGuilds);
      }, 1200);
    });
  },

  // Fetches channels for a specific guild
  getChannels: (guildId: string): Promise<Channel[]> => {
    // REAL IMPLEMENTATION:
    // return axios.get(`/get-channels/${guildId}`).then(res => res.data);
     console.log(`Fetching channels for guild ${guildId}...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const channels = MOCK_CHANNELS[guildId] || [];
        const textChannels = channels.filter(c => c.type === 0);
        console.log("Found text channels:", textChannels);
        resolve(textChannels);
      }, 800);
    });
  },

  // Sends an announcement
  sendAnnouncement: (guildId: string, channelId: string, message: string): Promise<ApiResponse> => {
    // REAL IMPLEMENTATION:
    // return axios.post('/api/announce', { guild_id: guildId, channel_id: channelId, message });
    console.log(`Sending announcement to G:${guildId}, C:${channelId}`);
    console.log(`Message: ${message}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (message.toLowerCase().includes('error')) {
            reject({ success: false, message: 'Simulated error: Message contained "error".' });
        } else {
            resolve({ success: true, message: 'Announcement sent successfully!' });
        }
      }, 1500);
    });
  },
};
