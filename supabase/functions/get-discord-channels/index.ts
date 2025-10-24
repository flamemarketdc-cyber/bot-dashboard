// supabase/functions/get-discord-channels/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DISCORD_API_URL = 'https://discord.com/api/v10';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const { guildId } = await req.json();
    if (!guildId) {
        throw new Error("Missing guildId in request body");
    }

    // The user's OAuth token works here because the Supabase Discord provider
    // requests the 'guilds' scope by default, which allows reading channels.
    const channelsResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: authHeader,
      },
    });
    
    if (!channelsResponse.ok) {
        const errorBody = await channelsResponse.json();
        console.error("Discord API error:", errorBody);
        throw new Error(`Failed to fetch channels from Discord: ${channelsResponse.statusText}`);
    }

    const channels = await channelsResponse.json();

    // Filter for text channels only (type 0)
    const textChannels = channels.filter((channel: any) => channel.type === 0);

    return new Response(JSON.stringify(textChannels), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500,
    });
  }
});
