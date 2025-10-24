import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'
const MANAGE_GUILD_PERMISSION = 0x20 // Hex for "Manage Server"

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
    const { accessToken } = await req.json()
    if (!accessToken) {
      throw new Error('Access token is required.')
    }

    // Fetch guilds from Discord API
    const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[get-guilds] Discord API error:', errorBody)
      throw new Error(`Discord API request failed with status: ${response.status}`)
    }
    
    const guilds = await response.json()

    // Filter for guilds where the user has "Manage Server" permissions and map the data.
    const manageableGuilds = guilds
      .filter(
        (guild: any) => guild.owner || (parseInt(guild.permissions) & MANAGE_GUILD_PERMISSION)
      )
      .map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`,
        owner: guild.owner,
        permissions: guild.permissions,
      }))

    return new Response(JSON.stringify(manageableGuilds), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('[get-guilds] An error occurred:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
