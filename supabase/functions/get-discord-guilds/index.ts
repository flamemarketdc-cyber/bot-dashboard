import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts'

// Add type declaration for Deno to fix "Cannot find name 'Deno'" error.
declare const Deno: any;

const DISCORD_API_URL = 'https://discord.com/api/v10'
const MANAGE_GUILD_PERMISSION = 0x20 // Hex for "Manage Server"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    // Create a Supabase client with the user's authorization.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user's session to access the provider token.
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('User not authenticated.');

    const accessToken = session.provider_token;
    if (!accessToken) {
      throw new Error('Discord provider token not found in session. Please log out and back in.');
    }

    // Fetch guilds from Discord API
    const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[get-guilds] Discord API error:', { status: response.status, body: errorBody });
      throw new Error(`Discord API request failed: ${response.status}. This could be due to an expired session.`);
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
});