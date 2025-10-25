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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError) {
      console.error('[get-guilds] Supabase session error:', sessionError.message);
      throw new Error(`Authentication error: ${sessionError.message}`);
    }

    if (!session) {
      console.error('[get-guilds] No active session found for the user.');
      throw new Error('User not authenticated. Please log in again.');
    }

    const accessToken = session.provider_token;
    if (!accessToken) {
      console.error('[get-guilds] Discord provider_token is missing from the session.');
      // This is the critical, user-requested error message.
      throw new Error('Discord provider token not found. Please enable "Session Refreshing" in your Supabase project\'s Discord Auth Provider settings and then log out and back in.');
    }

    const response = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => response.text());
      console.error('[get-guilds] Discord API error:', { 
        status: response.status, 
        body: errorBody 
      });

      // Provide a more specific error if the token is invalid (401)
      if (response.status === 401) {
          throw new Error('Your Discord session seems to have expired. Please log out and log back in.');
      }
      
      throw new Error(`Failed to fetch guilds from Discord. Status: ${response.status}`);
    }
    
    const guilds = await response.json()

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
    console.error('[get-guilds] A critical error occurred:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Keep 400 as it's a client-side originating issue (bad token/session)
    })
  }
});
