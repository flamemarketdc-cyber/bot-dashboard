import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'

serve(async (req: Request) => {
  // This is a preflight request. We don't need to do anything with it.
  // Just return a 200 OK response with the correct CORS headers.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { guildId } = await req.json()
    if (!guildId) {
      return new Response(JSON.stringify({ error: 'Guild ID is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const BOT_TOKEN = (Deno as any).env.get('BOT_TOKEN')
    if (!BOT_TOKEN) {
        console.error('[get-channels] BOT_TOKEN secret not set in Supabase.');
        return new Response(JSON.stringify({ error: 'Bot token is not configured on the server. Please ensure the BOT_TOKEN secret is set in your Supabase project.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
    }

    const response = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[get-channels] Discord API error: ${response.status}`, errorBody)
      let details;
      try {
        details = JSON.parse(errorBody);
      } catch(e) {
        details = { message: errorBody };
      }
      return new Response(JSON.stringify({ error: `Discord API Error (${response.status}): ${details.message || 'Unknown error.'}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const channels = await response.json()
    
    // Filter for text (0) and category (4) channels
    const relevantChannels = channels.filter(
      (channel: any) => channel.type === 0 || channel.type === 4
    );

    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[get-channels] An unexpected error occurred:', error.message);
    return new Response(JSON.stringify({ error: 'An internal server error occurred while processing the request.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
