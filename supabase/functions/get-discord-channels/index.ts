import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'

// Define CORS headers for browser-based clients
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Get guildId from request
    const { guildId } = await req.json()
    if (!guildId) {
      return new Response(JSON.stringify({ error: 'Guild ID is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // 2. Get Bot Token from secrets
    const botToken = (Deno as any).env.get('TOKEN');
    if (!botToken) {
        console.error('[get-discord-channels] TOKEN secret not set in Supabase.');
        return new Response(JSON.stringify({ error: 'Bot token is not configured on the server. Please ensure the TOKEN secret is set in your Supabase project.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500, // Internal Server Error - configuration issue
        });
    }

    // 3. Fetch channels from Discord API
    const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[get-discord-channels] Discord API error: ${response.status}`, errorBody)
      const details = JSON.parse(errorBody);
      // Pass Discord's error through
      return new Response(JSON.stringify({ error: `Discord API Error (${response.status}): ${details.message || 'Unknown error.'}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502, // Bad Gateway - error from upstream service
      });
    }

    // 4. Process and return channels
    const channels = await response.json()
    const relevantChannels = channels.filter(
      (channel: any) => channel.type === 0 || channel.type === 4
    );

    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[get-discord-channels] An unexpected error occurred:', error.message);
    // This catches errors like failed req.json() or other unexpected issues
    return new Response(JSON.stringify({ error: 'An internal server error occurred while processing the request.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})