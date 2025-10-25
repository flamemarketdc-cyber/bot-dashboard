import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const DISCORD_API_URL = 'https://discord.com/api/v10'

// FIX: Declare the Deno global object to resolve TypeScript errors in environments
// where Deno's global types are not automatically recognized.
declare const Deno: any;

serve(async (req: Request) => {
  // Explicitly handle the browser's preflight "OPTIONS" request.
  // This is crucial for fixing the CORS error.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { guildId } = await req.json();
    if (!guildId) {
      throw new Error('Missing guildId parameter.');
    }

    const BOT_TOKEN = Deno.env.get('BOT_TOKEN');
    if (!BOT_TOKEN) {
      console.error('[get-channels] BOT_TOKEN secret not set in Supabase project settings.');
      throw new Error('Bot token is not configured on the server. Please contact the administrator.');
    }

    const discordResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    if (!discordResponse.ok) {
      const responseBodyText = await discordResponse.text();
      console.error(`[get-channels] Discord API Error (${discordResponse.status}):`, responseBodyText);
      throw new Error(`Failed to fetch channels from Discord (Status: ${discordResponse.status}). Ensure the bot is in this server and has 'View Channel' permissions. Also, verify the BOT_TOKEN is correct.`);
    }
    
    const channels = await discordResponse.json();
    
    // Filter for text (0) and category (4) channels to support all dashboard features
    const relevantChannels = channels.filter(
      (channel: any) => channel.type === 0 || channel.type === 4
    );

    return new Response(JSON.stringify(relevantChannels), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[get-channels] Caught an unhandled error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});