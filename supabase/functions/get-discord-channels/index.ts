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
    const { guildId, accessToken } = await req.json();
    if (!accessToken) {
        throw new Error("Missing accessToken in request body");
    }
    if (!guildId) {
        throw new Error("Missing guildId in request body");
    }

    const channelsResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!channelsResponse.ok) {
        const responseText = await channelsResponse.text();
        console.error(`Discord API Error: ${channelsResponse.status} ${channelsResponse.statusText}`);
        console.error(`Response Body: ${responseText}`);
        throw new Error(`Discord API Error: ${channelsResponse.status} ${channelsResponse.statusText}.`);
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
    console.error("Error in get-discord-channels function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500,
    });
  }
});