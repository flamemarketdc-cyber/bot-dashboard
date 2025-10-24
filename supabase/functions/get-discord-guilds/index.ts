// Fix: Use `serve` from `std/http` to resolve Deno namespace type errors.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// supabase/functions/get-discord-guilds/index.ts

// NOTE: Deno.serve is the modern, native, and recommended way to create an HTTP server in Deno.
// We are using it directly to bypass a suspected bug in the older `std/http` compatibility layer
// that was causing persistent CORS issues.

const DISCORD_API_URL = 'https://discord.com/api/v10';
const MANAGE_GUILD_PERMISSION = 0x20; // 32

// Define shared headers for CORS to ensure they are consistently applied.
// This is critical for allowing browser-based clients to call the function.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight request immediately.
  // The browser sends this OPTIONS request first to check if the actual request is safe to send.
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
