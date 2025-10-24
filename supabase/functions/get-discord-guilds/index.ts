// supabase/functions/get-discord-guilds/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DISCORD_API_URL = 'https://discord.com/api/v10';
const MANAGE_GUILD_PERMISSION = 0x20; // 32

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Fetch user's guilds from Discord API
    const guildsResponse = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: authHeader, // Forward the user's auth header
      },
    });

    if (!guildsResponse.ok) {
        const errorBody = await guildsResponse.json();
        console.error("Discord API error:", errorBody);
        throw new Error(`Failed to fetch guilds from Discord: ${guildsResponse.statusText}`);
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500,
    });
  }
});