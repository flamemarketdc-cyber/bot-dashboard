import type { Guild, Channel, ApiResponse, GeneralSettings, TicketSettings } from '../types';
import { supabase } from './supabaseClient';

export const apiService = {
  // NOTE: These functions now make authenticated requests to the Discord API
  // via a secure backend (Supabase Edge Functions).
  getGuilds: async (): Promise<Guild[]> => {
    console.log("Fetching guilds via Supabase Function...");
    
    // Get session to find the Discord provider token
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.provider_token;

    if (!accessToken) {
      console.error('No Discord provider_token found in session.');
      throw new Error('Authentication error: Could not find Discord access token. Please try logging out and back in.');
    }
    console.log('Discord access token found. Invoking function...');

    const { data, error } = await supabase.functions.invoke('get-discord-guilds', {
      body: { accessToken }, // Pass the token in the body to avoid header conflicts
    });

    console.log('Supabase function response:', { data, error });
    
    if (error) {
      console.error("Error invoking get-discord-guilds function:", error.message);
      throw new Error(`Failed to fetch servers from Discord. Function error: ${error.message}`);
    }

    if (!Array.isArray(data)) {
        console.error("Data received from function is not an array:", data);
        throw new Error("Unexpected response format from server.");
    }

    console.log(`Successfully fetched ${data.length} guilds.`);
    return data;
  },

  getChannels: async (guildId: string): Promise<Channel[]> => {
     console.log(`Fetching channels for guild ${guildId} via Supabase Function...`);
     
     // Get session to find the Discord provider token
     const { data: { session } } = await supabase.auth.getSession();
     const accessToken = session?.provider_token;
 
     if (!accessToken) {
       throw new Error('Authentication error: Could not find Discord access token.');
     }

    const { data, error } = await supabase.functions.invoke('get-discord-channels', {
        body: { guildId, accessToken }, // Pass the token in the body
    });
    
    if (error) {
      console.error(`Error invoking get-discord-channels function for guild ${guildId}:`, error.message);
      throw new Error("Failed to fetch channels from Discord.");
    }
    
    return data;
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