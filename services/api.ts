import type { User, Guild, Channel, ApiResponse, GeneralSettings, TicketSettings } from '../types';
import { supabase } from './supabaseClient';

// --- MOCK DATA (Retained for Guilds/Channels as this requires a separate backend flow) ---
const MOCK_GUILDS: Guild[] = [
  { id: 'g1', name: '🚀 Project Nebula', icon: 'https://picsum.photos/id/10/128/128', owner: true, permissions: '2147483647' },
  { id: 'g2', name: '🎮 Gamer\'s Paradise', icon: 'https://picsum.photos/id/22/128/128', owner: false, permissions: '104324673' },
  { id: 'g3', name: '🎨 Art & Design Hub', icon: 'https://picsum.photos/id/35/128/128', owner: false, permissions: '8' },
  { id: 'g4', name: '🎵 Music Corner', icon: 'https://picsum.photos/id/48/128/128', owner: true, permissions: '2147483647' },
];

const MOCK_CHANNELS: { [guildId: string]: Channel[] } = {
  'g1': [
    { id: 'c1-1', name: 'general', type: 0 },
    { id: 'c1-2', name: 'announcements', type: 0 },
    { id: 'c1-3', name: 'dev-logs', type: 0 },
  ],
  'g2': [
    { id: 'c2-1', name: 'general-chat', type: 0 },
    { id: 'c2-2', name: 'looking-for-group', type: 0 },
    { id: 'c2-3', name: 'event-announcements', type: 0 },
  ],
  'g4': [
    { id: 'c4-1', name: 'music-releases', type: 0 },
    { id: 'c4-2', name: 'support-tickets', type: 0 },
  ],
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // NOTE: In a real app, getGuilds and getChannels would make authenticated requests
  // to the Discord API from a secure backend (e.g., a Supabase Edge Function).
  // We keep them mocked here for simplicity.
  getGuilds: async (): Promise<Guild[]> => {
    console.log("Fetching guilds (mock)...");
    await sleep(1200);
    const MANAGE_GUILD = 0x20;
    const manageableGuilds = MOCK_GUILDS.filter(g => g.owner || (parseInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD);
    return manageableGuilds;
  },

  getChannels: async (guildId: string): Promise<Channel[]> => {
     console.log(`Fetching channels for guild ${guildId} (mock)...`);
    await sleep(800);
    const channels = MOCK_CHANNELS[guildId] || [];
    const textChannels = channels.filter(c => c.type === 0);
    return textChannels;
  },

  // --- Bot Settings API (Now using Supabase) ---
  
  getGeneralSettings: async (guildId: string): Promise<GeneralSettings> => {
      console.log(`Fetching general settings for G:${guildId} from Supabase...`);
      const { data, error } = await supabase
        .from('guild_settings')
        .select('prefix, welcome_channel_id, log_channel_id')
        .eq('guild_id', guildId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = 'Not Found'
          console.error("Error fetching general settings:", error);
          throw error;
      }
      
      return {
          prefix: data?.prefix ?? '!', // Default prefix
          welcomeChannelId: data?.welcome_channel_id ?? null,
          logChannelId: data?.log_channel_id ?? null,
      };
  },
  
  saveGeneralSettings: async (guildId: string, settings: GeneralSettings): Promise<ApiResponse> => {
      console.log(`Saving general settings for G:${guildId} to Supabase`, settings);
      
      const { error } = await supabase.from('guild_settings').upsert({
          guild_id: guildId,
          prefix: settings.prefix,
          welcome_channel_id: settings.welcomeChannelId,
          log_channel_id: settings.logChannelId,
      });

      if (error) {
          console.error("Error saving general settings:", error);
          return { success: false, message: "Failed to save settings." };
      }
      return { success: true, message: "General settings saved successfully!" };
  },

  getTicketSettings: async (guildId: string): Promise<TicketSettings> => {
      console.log(`Fetching ticket settings for G:${guildId} from Supabase...`);
      const { data, error } = await supabase
        .from('guild_settings')
        .select('panel_channel_id, category_id, support_role_ids')
        .eq('guild_id', guildId)
        .single();
    
      if (error && error.code !== 'PGRST116') { // PGRST116 = 'Not Found'
          console.error("Error fetching ticket settings:", error);
          throw error;
      }

      return {
          panelChannelId: data?.panel_channel_id ?? null,
          categoryId: data?.category_id ?? null,
          supportRoleIds: data?.support_role_ids ?? "",
      };
  },

  saveTicketSettings: async (guildId: string, settings: TicketSettings): Promise<ApiResponse> => {
      console.log(`Saving ticket settings for G:${guildId} to Supabase`, settings);
      
      const { error } = await supabase.from('guild_settings').upsert({
          guild_id: guildId,
          panel_channel_id: settings.panelChannelId,
          category_id: settings.categoryId,
          support_role_ids: settings.supportRoleIds,
      });

      if (error) {
          console.error("Error saving ticket settings:", error);
          return { success: false, message: "Failed to save settings." };
      }
      return { success: true, message: "Ticket settings saved successfully!" };
  },
};
