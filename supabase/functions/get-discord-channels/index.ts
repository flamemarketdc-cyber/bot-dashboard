import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const DISCORD_API_URL = 'https://discord.com/api/v10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { guildId, accessToken } = await req.json();

    if (!guildId) {
      return new Response(JSON.stringify({ error: 'Missing guildId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Missing accessToken' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const discordRes = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!discordRes.ok) {
        const text = await discordRes.text();
        console.error(`Discord API Error: ${text}`);
        return new Response(JSON.stringify({ error: `Discord API Error: ${discordRes.statusText}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: discordRes.status,
        });
    }

    const channels = await discordRes.json();

    // Filter for text channels (type 0) and categories (type 4) for UI selectors
    const relevantChannels = channels.filter((channel: any) => channel.type === 0 || channel.type === 4);

    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch channels' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});