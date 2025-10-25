// supabase/functions/get-guilds/index.ts
// --- NEW, MORE DIRECT VERSION ---

import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // CORS check remains the same
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get the data the front-end is sending
    const { provider_token } = await req.json()

    // 2. If the token is missing, throw an error.
    if (!provider_token) {
      throw new Error('The dashboard did not provide a Discord token.')
    }

    // 3. Use the token directly to call the Discord API
    const discordResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${provider_token}`,
      },
    })

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text()
      throw new Error(`Discord API rejected the token. Reason: ${errorText}`)
    }

    const guilds = await discordResponse.json()
    const manageableGuilds = guilds.filter((guild) => (BigInt(guild.permissions) & 0x8n) === 0x8n);

    return new Response(JSON.stringify(manageableGuilds), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})