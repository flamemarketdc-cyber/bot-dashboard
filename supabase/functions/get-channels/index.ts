import { corsHeaders } from '../_shared/cors.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guildId } = await req.json()
    if (!guildId) {
      throw new Error('Missing guildId parameter.')
    }

    const BOT_TOKEN = Deno.env.get('TOKEN')
    if (!BOT_TOKEN) {
      throw new Error('TOKEN is not set in Supabase secrets.')
    }

    const discordResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    })

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text()
      console.error(`[get-channels] Discord API Error: ${discordResponse.status}`, errorText)
      throw new Error(`Discord API Error: ${errorText}`)
    }

    const channels = await discordResponse.json()
    
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})