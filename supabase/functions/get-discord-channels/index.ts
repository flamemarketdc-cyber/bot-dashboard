// supabase/functions/get-discord-channels/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const DISCORD_API_URL = 'https://discord.com/api/v10';

// Define shared headers for CORS to ensure they are consistently applied
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { guildId, accessToken } = await req.json();
    if (!accessToken) {
        return new Response(JSON.stringify({ error: "Missing accessToken in request body" }), {
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
             status: 400
        });
    }
    if (!guildId) {
        return new Response(JSON.stringify({ error: "Missing guildId in request body" }), {
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
             status: 400
        });
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
        return new Response(JSON.stringify({ error: `Discord API Error: ${channelsResponse.status} ${channelsResponse.statusText}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: channelsResponse.status
        });
    }

    const channels = await channelsResponse.json();

    // Filter for text channels only (type 0) and categories (type 4)
    const textChannels = channels.filter((channel: any) => channel.type === 0 || channel.type === 4);

    return new Response(JSON.stringify(textChannels), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-discord-channels function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
});
