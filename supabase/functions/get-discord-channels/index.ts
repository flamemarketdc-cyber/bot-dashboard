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
    const { guildId } = await req.json()
    if (!guildId) throw new Error('Guild ID is required.')

    // Retrieve the bot token from environment variables (Supabase secrets)
    const botToken = (Deno as any).env.get('DISCORD_BOT_TOKEN');
    if (!botToken) {
        console.error('[get-discord-channels] DISCORD_BOT_TOKEN secret not set in Supabase.');
        throw new Error('Bot token is not configured on the server.');
    }

    // Fetch channels from the Discord API using the bot token
    const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[get-discord-channels] Discord API error: ${response.status}`, errorBody)
      throw new Error(`Discord API Error (${response.status}): ${errorBody}`)
    }

    const channels = await response.json()

    // Filter for text channels (type 0) and categories (type 4) for UI selectors
    const relevantChannels = channels.filter(
      (channel: any) => channel.type === 0 || channel.type === 4
    )

    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('[get-discord-channels] An error occurred:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
