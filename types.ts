export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
}

export interface Channel {
  id:string;
  name: string;
  type: number; // 0 for text, 4 for category
}

export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface GeneralSettings {
    prefix: string;
    welcomeChannelId: string | null;
    logChannelId: string | null;
}

export interface TicketSettings {
    panelChannelId: string | null;
    categoryId: string | null;
    supportRoleIds: string;
}

export interface AutoModSettings {
    enabled: boolean;
    blockBadWords: boolean;
    antiSpam: boolean;
    whitelistedRoles: string;
}

export interface ChatbotSettings {
    enabled: boolean;
    channelId: string | null;
    persona: string;
}

export interface GiveawaySettings {
    managerRoleIds: string;
    defaultEmoji: string;
}

export interface ClaimTimeSettings {
    enabled: boolean;
    defaultMinutes: number;
    logic: 'additive' | 'highest';
    roleTimes: { roleId: string; minutes: number }[];
}

export interface CommandSettings {
  prefixes: string[];
  errorCommandNotFoundEnabled: boolean;
  errorWrongUsageEnabled: boolean;
}

export interface LoggingSettings {
    // Placeholder for future logging settings
    enabled: boolean;
}

export interface ReactionRoleSettings {
    // Placeholder for future reaction role settings
    enabled: boolean;
}

export interface ModerationSettings {
    enabled: boolean;
}

export interface SocialNotificationsSettings {
    enabled: boolean;
}

export interface JoinRolesSettings {
    enabled: boolean;
}

export interface WelcomeMessagesSettings {
    enabled: boolean;
}

export interface RoleConnectionsSettings {
    enabled: boolean;
}