import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const DISCORD_API_URL = 'https://discord.com/api/v10';
const MANAGE_GUILD_PERMISSION = 0x20; // Hex for "Manage Server"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Missing accessToken' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const discordRes = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!discordRes.ok) {
      const text = await discordRes.text();
      console.error(`Discord API Error: ${text}`);
      return new Response(JSON.stringify({ error: `Discord API Error: ${discordRes.statusText}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: discordRes.status,
      });
    }

    const guilds = await discordRes.json();
    
    // Filter for guilds where the user has "Manage Server" permissions.
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch servers' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});