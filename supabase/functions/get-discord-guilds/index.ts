// supabase/functions/get-discord-guilds/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const DISCORD_API_URL = 'https://discord.com/api/v10';
const MANAGE_GUILD_PERMISSION = 0x20; // 32

// Define shared headers for CORS to ensure they are consistently applied
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
       return new Response(JSON.stringify({ error: 'Missing accessToken in request body' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Fetch user's guilds from Discord API
    const guildsResponse = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!guildsResponse.ok) {
        const responseText = await guildsResponse.text();
        console.error(`Discord API Error: ${guildsResponse.status} ${guildsResponse.statusText}`);
        console.error(`Response Body: ${responseText}`);
        return new Response(JSON.stringify({ error: `Discord API Error: ${guildsResponse.status} ${guildsResponse.statusText}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: guildsResponse.status,
        });
    }

    const guilds = await guildsResponse.json();

    // Filter for guilds where the user has MANAGE_GUILD permissions and map to our desired format
    const manageableGuilds = guilds
      .filter(
        (guild: any) => guild.owner || (parseInt(guild.permissions) & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION
      )
      .map((guild: any) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`,
          owner: guild.owner,
          permissions: guild.permissions,
      }));

    return new Response(JSON.stringify(manageableGuilds), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-discord-guilds function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
});
