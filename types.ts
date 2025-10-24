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
  type: number; // 0 for text channel
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
    supportRoleIds: string; // Storing as a comma-separated string for UI simplicity
}
