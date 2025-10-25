import type { 
    Guild, 
    Channel, 
    ApiResponse, 
    GeneralSettings, 
    // FIX: Import newly added settings types.
    TicketSettings,
    AutoModSettings,
    ChatbotSettings,
    GiveawaySettings,
    ClaimTimeSettings,
    CommandSettings,
    LoggingSettings,
} from '../types';
import { supabase } from './supabaseClient';


export const apiService = {
  // NOTE: These functions now make authenticated requests to the Discord API
  // via a secure backend (Supabase Edge Functions).
  getGuilds: async (accessToken: string): Promise<Guild[]> => {
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

  // FIX: Implement missing API methods for all settings modules.
  // --- Ticket Settings ---
  getTicketSettings: async (guildId: string): Promise<TicketSettings> => {
      const { data, error } = await supabase
        .from('ticket_settings')
        .select('panel_channel_id, category_id, support_role_ids')
        .eq('guild_id', guildId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return {
          panelChannelId: data?.panel_channel_id ?? null,
          categoryId: data?.category_id ?? null,
          supportRoleIds: data?.support_role_ids ?? '',
      };
  },
  
  saveTicketSettings: async (guildId: string, settings: TicketSettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('ticket_settings').upsert({
          guild_id: guildId,
          panel_channel_id: settings.panelChannelId,
          category_id: settings.categoryId,
          support_role_ids: settings.supportRoleIds,
      });

      if (error) {
          console.error("Error saving ticket settings:", error);
          return { success: false, message: "Failed to save ticket settings." };
      }
      return { success: true, message: "Ticket settings saved!" };
  },

  // --- AutoMod Settings ---
  getAutoModSettings: async (guildId: string): Promise<AutoModSettings> => {
      const { data, error } = await supabase
        .from('automod_settings')
        .select('enabled')
        .eq('guild_id', guildId)
        .single();
    
      if (error && error.code !== 'PGRST116') throw error;

      return {
        enabled: data?.enabled ?? true,
      };
  },

  // --- Chatbot Settings ---
  getChatbotSettings: async (guildId: string): Promise<ChatbotSettings> => {
      const { data, error } = await supabase
          .from('chatbot_settings')
          .select('enabled, channel_id, persona')
          .eq('guild_id', guildId)
          .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
          enabled: data?.enabled ?? false,
          channelId: data?.channel_id ?? null,
          persona: data?.persona ?? '',
      };
  },

  saveChatbotSettings: async (guildId: string, settings: ChatbotSettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('chatbot_settings').upsert({
          guild_id: guildId,
          enabled: settings.enabled,
          channel_id: settings.channelId,
          persona: settings.persona,
      });

      if (error) {
          console.error("Error saving chatbot settings:", error);
          return { success: false, message: "Failed to save chatbot settings." };
      }
      return { success: true, message: "Chatbot settings saved!" };
  },
  
  // --- Giveaway Settings ---
  getGiveawaySettings: async (guildId: string): Promise<GiveawaySettings> => {
      const { data, error } = await supabase
          .from('giveaway_settings')
          .select('manager_role_ids, default_emoji')
          .eq('guild_id', guildId)
          .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
          managerRoleIds: data?.manager_role_ids ?? '',
          defaultEmoji: data?.default_emoji ?? '🎉',
      };
  },

  saveGiveawaySettings: async (guildId: string, settings: GiveawaySettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('giveaway_settings').upsert({
          guild_id: guildId,
          manager_role_ids: settings.managerRoleIds,
          default_emoji: settings.defaultEmoji,
      });

      if (error) {
          console.error("Error saving giveaway settings:", error);
          return { success: false, message: "Failed to save giveaway settings." };
      }
      return { success: true, message: "Giveaway settings saved!" };
  },

  // --- Claim Time Settings ---
  getClaimTimeSettings: async (guildId: string): Promise<ClaimTimeSettings> => {
      const { data, error } = await supabase
          .from('claim_time_settings')
          .select('enabled, default_minutes, logic, role_times')
          .eq('guild_id', guildId)
          .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return {
          enabled: data?.enabled ?? false,
          defaultMinutes: data?.default_minutes ?? 10,
          logic: data?.logic ?? 'highest',
          roleTimes: data?.role_times ?? [],
      };
  },

  saveClaimTimeSettings: async (guildId: string, settings: ClaimTimeSettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('claim_time_settings').upsert({
          guild_id: guildId,
          enabled: settings.enabled,
          default_minutes: settings.defaultMinutes,
          logic: settings.logic,
          role_times: settings.roleTimes,
      });

      if (error) {
          console.error("Error saving claim time settings:", error);
          return { success: false, message: "Failed to save claim time settings." };
      }
      return { success: true, message: "Claim time settings saved!" };
  },

  // --- Command Settings ---
  getCommandSettings: async (guildId: string): Promise<CommandSettings> => {
      const { data, error } = await supabase
          .from('command_settings')
          .select('prefixes, error_command_not_found_enabled, error_wrong_usage_enabled')
          .eq('guild_id', guildId)
          .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return {
          prefixes: data?.prefixes ?? [','],
          errorCommandNotFoundEnabled: data?.error_command_not_found_enabled ?? true,
          errorWrongUsageEnabled: data?.error_wrong_usage_enabled ?? true,
      };
  },

  saveCommandSettings: async (guildId: string, settings: CommandSettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('command_settings').upsert({
          guild_id: guildId,
          prefixes: settings.prefixes,
          error_command_not_found_enabled: settings.errorCommandNotFoundEnabled,
          error_wrong_usage_enabled: settings.errorWrongUsageEnabled,
      });

      if (error) {
          console.error("Error saving command settings:", error);
          return { success: false, message: "Failed to save command settings." };
      }
      return { success: true, message: "Command settings saved!" };
  },

  // --- Logging Settings ---
  getLoggingSettings: async (guildId: string): Promise<LoggingSettings> => {
      const { data, error } = await supabase
          .from('logging_settings')
          .select('enabled, log_channel_id, member_join, member_leave, member_role_update, message_edit, message_delete, channel_create, channel_delete, channel_update')
          .eq('guild_id', guildId)
          .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return {
          enabled: data?.enabled ?? false,
          logChannelId: data?.log_channel_id ?? null,
          memberJoin: data?.member_join ?? false,
          memberLeave: data?.member_leave ?? false,
          memberRoleUpdate: data?.member_role_update ?? false,
          messageEdit: data?.message_edit ?? false,
          messageDelete: data?.message_delete ?? false,
          channelCreate: data?.channel_create ?? false,
          channelDelete: data?.channel_delete ?? false,
          channelUpdate: data?.channel_update ?? false,
      };
  },

  saveLoggingSettings: async (guildId: string, settings: LoggingSettings): Promise<ApiResponse> => {
      const { error } = await supabase.from('logging_settings').upsert({
          guild_id: guildId,
          enabled: settings.enabled,
          log_channel_id: settings.logChannelId,
          member_join: settings.memberJoin,
          member_leave: settings.memberLeave,
          member_role_update: settings.memberRoleUpdate,
          message_edit: settings.messageEdit,
          message_delete: settings.messageDelete,
          channel_create: settings.channelCreate,
          channel_delete: settings.channelDelete,
          channel_update: settings.channelUpdate,
      });

      if (error) {
          console.error("Error saving logging settings:", error);
          return { success: false, message: "Failed to save logging settings." };
      }
      return { success: true, message: "Logging settings saved!" };
  },
};