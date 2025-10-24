import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'

// Define CORS headers for browser-based clients
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  console.log(`[get-discord-channels] Received request: ${req.method}`);
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('[get-discord-channels] Handling OPTIONS preflight request.');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[get-discord-channels] Handling POST request.');
    // 1. Get guildId and accessToken from the request body
    const { guildId, accessToken } = await req.json()
    if (!guildId) throw new Error('Guild ID is required.')
    if (!accessToken) throw new Error('Access token is required.')

    // 2. Fetch channels from the Discord API
    const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[get-discord-channels] Discord API error:', errorBody)
      throw new Error(`Discord API request failed with status: ${response.status}`)
    }

    const channels = await response.json()

    // 3. Filter for text channels (type 0) and categories (type 4) for UI selectors
    const relevantChannels = channels.filter(
      (channel: any) => channel.type === 0 || channel.type === 4
    )

    // 4. Return the filtered channels
    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // 5. Handle any errors and return a JSON response
    console.error('[get-discord-channels] An error occurred:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
