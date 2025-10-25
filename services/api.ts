import type { 
    Guild, 
    Channel, 
    ApiResponse, 
    GeneralSettings, 
    TicketSettings,
    AutoModSettings,
    ChatbotSettings,
    GiveawaySettings,
    ClaimTimeSettings,
    CommandSettings,
    ModerationSettings
} from '../types';
import { supabase } from './supabaseClient';


// --- MOCK DATA FOR PREVIEW MODE ---
const mockGuilds: Guild[] = [
    { id: '1', name: 'Flaming', icon: `https://cdn.discordapp.com/embed/avatars/0.png`, owner: true, permissions: '0' },
    { id: '2', name: 'Test Guild XYZ', icon: `https://cdn.discordapp.com/embed/avatars/1.png`, owner: false, permissions: '0x20' },
];

const mockChannels: Channel[] = [
    { id: 'c1', name: 'general', type: 0 },
    { id: 'c2', name: 'announcements', type: 0 },
    { id: 'c3', name: 'welcome-and-rules', type: 0 },
    { id: 'c4', name: 'logs', type: 0 },
    { id: 'cat1', name: 'SERVER CHANNELS', type: 4 },
    { id: 'cat2', name: 'SUPPORT', type: 4 },
];

const mockGeneralSettings: GeneralSettings = {
    prefix: '!',
    welcomeChannelId: 'c3',
    logChannelId: 'c4',
};

const mockTicketSettings: TicketSettings = {
    panelChannelId: 'c2',
    categoryId: 'cat2',
    supportRoleIds: '123456789012345678',
};

const mockAutoModSettings: AutoModSettings = {
    enabled: true,
    blockBadWords: true,
    antiSpam: true,
    whitelistedRoles: "987654321098765432",
};

const mockChatbotSettings: ChatbotSettings = {
    enabled: true,
    channelId: 'c1',
    persona: "You are a helpful and slightly sarcastic AI assistant for a Discord server. You love dad jokes.",
};

const mockGiveawaySettings: GiveawaySettings = {
    managerRoleIds: "112233445566778899",
    defaultEmoji: "🎁",
};

const mockClaimTimeSettings: ClaimTimeSettings = {
    enabled: true,
    defaultMinutes: 60,
    logic: 'highest',
    roleTimes: [{ roleId: '111', minutes: 120 }, { roleId: '222', minutes: 180 }],
};

const mockCommandSettings: CommandSettings = {
    prefixes: ['!', '?', '.'],
    errorCommandNotFoundEnabled: true,
    errorWrongUsageEnabled: false,
};

const mockModerationSettings = { enabled: false };
const mockSocialNotificationsSettings = { enabled: true };
const mockJoinRolesSettings = { enabled: true };
const mockWelcomeMessagesSettings = { enabled: false };
const mockRoleConnectionsSettings = { enabled: false };
const mockLoggingSettings = { enabled: true };
const mockReactionRolesSettings = { enabled: true };


const isPreviewGuild = (guildId: string) => mockGuilds.some(g => g.id === guildId);
// --- END MOCK DATA ---


export const apiService = {
  // NOTE: These functions now make authenticated requests to the Discord API
  // via a secure backend (Supabase Edge Functions).
  getGuilds: async (accessToken: string): Promise<Guild[]> => {
    if (accessToken === 'preview') {
        console.log("PREVIEW MODE: Returning mock guilds.");
        return new Promise(resolve => setTimeout(() => resolve(mockGuilds), 500));
    }
    console.log("Fetching guilds via Supabase Function...");
    
    console.log('Discord access token found. Invoking function...');

    const { data, error } = await supabase.functions.invoke('get-guilds', {
      body: { accessToken },
    });

    console.log('Supabase function response:', { data, error });
    
    if (error) {
      console.error("Error invoking get-guilds function:", error.message);
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
    if (isPreviewGuild(guildId)) {
        console.log(`PREVIEW MODE: Returning mock channels for guild ${guildId}.`);
        return mockChannels;
    }
     console.log(`Fetching channels for guild ${guildId} via Supabase Function...`);
     
     const { data: { session } } = await supabase.auth.getSession();
     if (!session) {
       throw new Error('Authentication error: User is not logged in.');
     }

    const { data, error } = await supabase.functions.invoke('get-channels', {
        body: { guildId },
    });
    
    if (error) {
      console.error(`Error invoking get-channels function for guild ${guildId}:`, error.message, error.context);
      // Try to get a more specific error from the function's response if available
      const functionError = error.context?.data?.error || error.context?.reason?.message;
      const reason = functionError || error.message;
      throw new Error(reason);
    }
    
    return data;
  },

  // --- Bot Settings API (Now using Supabase) ---
  
  getGeneralSettings: async (guildId: string): Promise<GeneralSettings> => {
      if (isPreviewGuild(guildId)) return mockGeneralSettings;
      const { data, error } = await supabase
        .from('guild_settings')
        .select('prefix, welcome_channel_id, log_channel_id')
        .eq('guild_id', guildId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return {
          prefix: data?.prefix ?? ',',
          welcomeChannelId: data?.welcome_channel_id ?? null,
          logChannelId: data?.log_channel_id ?? null,
      };
  },
  
  saveGeneralSettings: async (guildId: string, settings: GeneralSettings): Promise<ApiResponse> => {
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
      return { success: true, message: "General settings saved!" };
  },

  getTicketSettings: async (guildId: string): Promise<TicketSettings> => {
      if (isPreviewGuild(guildId)) return mockTicketSettings;
      const { data, error } = await supabase
        .from('guild_settings')
        .select('panel_channel_id, category_id, support_role_ids')
        .eq('guild_id', guildId)
        .single();
    
      if (error && error.code !== 'PGRST116') throw error;

      return {
          panelChannelId: data?.panel_channel_id ?? null,
          categoryId: data?.category_id ?? null,
          supportRoleIds: data?.support_role_ids ?? "",
      };
  },

  saveTicketSettings: async (guildId: string, settings: TicketSettings): Promise<ApiResponse> => {
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
      return { success: true, message: "Ticket settings saved!" };
  },

  getAutoModSettings: async (guildId: string): Promise<AutoModSettings> => {
      if (isPreviewGuild(guildId)) return mockAutoModSettings;
      const { data, error } = await supabase
        .from('guild_settings')
        .select('automod_enabled, automod_block_bad_words, automod_anti_spam, automod_whitelisted_roles')
        .eq('guild_id', guildId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
          enabled: data?.automod_enabled ?? false,
          blockBadWords: data?.automod_block_bad_words ?? true,
          antiSpam: data?.automod_anti_spam ?? true,
          whitelistedRoles: data?.automod_whitelisted_roles ?? "",
      };
  },

    saveAutoModSettings: async (guildId: string, settings: AutoModSettings): Promise<ApiResponse> => {
        const { error } = await supabase.from('guild_settings').upsert({
            guild_id: guildId,
            automod_enabled: settings.enabled,
            automod_block_bad_words: settings.blockBadWords,
            automod_anti_spam: settings.antiSpam,
            automod_whitelisted_roles: settings.whitelistedRoles,
        });

        if (error) {
            console.error("Error saving automod settings:", error);
            return { success: false, message: "Failed to save settings." };
        }
        return { success: true, message: "Auto-moderation settings saved!" };
    },

    getChatbotSettings: async (guildId: string): Promise<ChatbotSettings> => {
        if (isPreviewGuild(guildId)) return mockChatbotSettings;
        const { data, error } = await supabase
            .from('guild_settings')
            .select('chatbot_enabled, chatbot_channel_id, chatbot_persona')
            .eq('guild_id', guildId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return {
            enabled: data?.chatbot_enabled ?? false,
            channelId: data?.chatbot_channel_id ?? null,
            persona: data?.chatbot_persona ?? "You are a helpful Discord bot.",
        };
    },

    saveChatbotSettings: async (guildId: string, settings: ChatbotSettings): Promise<ApiResponse> => {
        const { error } = await supabase.from('guild_settings').upsert({
            guild_id: guildId,
            chatbot_enabled: settings.enabled,
            chatbot_channel_id: settings.channelId,
            chatbot_persona: settings.persona,
        });

        if (error) {
            console.error("Error saving chatbot settings:", error);
            return { success: false, message: "Failed to save settings." };
        }
        return { success: true, message: "Chatbot settings saved!" };
    },

    getGiveawaySettings: async (guildId: string): Promise<GiveawaySettings> => {
        if (isPreviewGuild(guildId)) return mockGiveawaySettings;
        const { data, error } = await supabase
            .from('guild_settings')
            .select('giveaway_manager_role_ids, giveaway_default_emoji')
            .eq('guild_id', guildId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return {
            managerRoleIds: data?.giveaway_manager_role_ids ?? "",
            defaultEmoji: data?.giveaway_default_emoji ?? "🎉",
        };
    },

    saveGiveawaySettings: async (guildId: string, settings: GiveawaySettings): Promise<ApiResponse> => {
        const { error } = await supabase.from('guild_settings').upsert({
            guild_id: guildId,
            giveaway_manager_role_ids: settings.managerRoleIds,
            giveaway_default_emoji: settings.defaultEmoji,
        });

        if (error) {
            console.error("Error saving giveaway settings:", error);
            return { success: false, message: "Failed to save settings." };
        }
        return { success: true, message: "Giveaway settings saved!" };
    },
    
    getClaimTimeSettings: async (guildId: string): Promise<ClaimTimeSettings> => {
        if (isPreviewGuild(guildId)) return mockClaimTimeSettings;
        const { data, error } = await supabase
            .from('guild_settings')
            .select('claimtime_enabled, claimtime_default_minutes, claimtime_logic, claimtime_role_times')
            .eq('guild_id', guildId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Ensure roleTimes is always an array
        const roleTimes = Array.isArray(data?.claimtime_role_times) ? data.claimtime_role_times : [];

        return {
            enabled: data?.claimtime_enabled ?? false,
            defaultMinutes: data?.claimtime_default_minutes ?? 60,
            logic: data?.claimtime_logic === 'additive' ? 'additive' : 'highest',
            roleTimes: roleTimes,
        };
    },

    saveClaimTimeSettings: async (guildId: string, settings: ClaimTimeSettings): Promise<ApiResponse> => {
        const { error } = await supabase.from('guild_settings').upsert({
            guild_id: guildId,
            claimtime_enabled: settings.enabled,
            claimtime_default_minutes: settings.defaultMinutes,
            claimtime_logic: settings.logic,
            claimtime_role_times: settings.roleTimes,
        });

        if (error) {
            console.error("Error saving claim time settings:", error);
            return { success: false, message: "Failed to save settings." };
        }
        return { success: true, message: "Claim time settings saved!" };
    },

    getCommandSettings: async (guildId: string): Promise<CommandSettings> => {
        if (isPreviewGuild(guildId)) return mockCommandSettings;
        const { data, error } = await supabase
            .from('guild_settings')
            .select('command_prefixes, command_error_not_found, command_error_wrong_usage')
            .eq('guild_id', guildId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return {
            prefixes: data?.command_prefixes ?? ['!'],
            errorCommandNotFoundEnabled: data?.command_error_not_found ?? true,
            errorWrongUsageEnabled: data?.command_error_wrong_usage ?? true,
        };
    },

    saveCommandSettings: async (guildId: string, settings: CommandSettings): Promise<ApiResponse> => {
        const { error } = await supabase.from('guild_settings').upsert({
            guild_id: guildId,
            command_prefixes: settings.prefixes,
            command_error_not_found: settings.errorCommandNotFoundEnabled,
            command_error_wrong_usage: settings.errorWrongUsageEnabled,
        });

        if (error) {
            console.error("Error saving command settings:", error);
            return { success: false, message: "Failed to save command settings." };
        }
        return { success: true, message: "Command settings saved!" };
    },

    // Mocks for new modules
    getModerationSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockModerationSettings; return mockModerationSettings; },
    getSocialNotificationsSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockSocialNotificationsSettings; return mockSocialNotificationsSettings; },
    getJoinRolesSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockJoinRolesSettings; return mockJoinRolesSettings; },
    getWelcomeMessagesSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockWelcomeMessagesSettings; return mockWelcomeMessagesSettings; },
    getRoleConnectionsSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockRoleConnectionsSettings; return mockRoleConnectionsSettings; },
    getLoggingSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockLoggingSettings; return mockLoggingSettings; },
    getReactionRolesSettings: async (guildId: string) => { if(isPreviewGuild(guildId)) return mockReactionRolesSettings; return mockReactionRolesSettings; },
};