// =========================================================
// FINAL CORRECTED ServerSelector.tsx (Sends Token Manually)
// =========================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Guild } from '../App';
import type { Session } from '@supabase/supabase-js';
import { LogoutIcon } from '../components/Icons';

// The ServerCard sub-component is perfect, no changes are needed here.
const ServerCard: React.FC<{ guild: Guild, onSelect: () => void }> = ({ guild, onSelect }) => {
    // ... (keep the ServerCard code exactly as it was)
};

const ServerSelector: React.FC<ServerSelectorProps> = ({ onGuildSelect }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuilds = async (currentSession: Session) => {
            setError(null);
            setLoading(true);

            // --- THIS IS THE NEW LOGIC ---
            // 1. Check if the session and the required token exist.
            if (!currentSession?.provider_token) {
                setError("Your session is missing a valid Discord token. Please log out and back in.");
                setLoading(false);
                return;
            }
            
            try {
                // 2. Call the function and MANUALLY include the token in the body.
                const { data, error: funcError } = await supabase.functions.invoke('get-guilds', {
                    body: { provider_token: currentSession.provider_token }
                });

                if (funcError) throw funcError;
                if (data.error) throw new Error(data.error);
                setGuilds(data);
            } catch (e: any) {
                console.error("Failed to fetch guilds:", e);
                setError(e.message || "Could not fetch your servers.");
            } finally {
                setLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            if (event === 'SIGNED_IN' && session) {
                fetchGuilds(session);
            } else if (event === 'SIGNED_OUT') {
                setGuilds([]);
                setLoading(false);
            }
        });
        
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (initialSession) {
                 setSession(initialSession);
                 fetchGuilds(initialSession);
            } else {
                 setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // The rest of the component's JSX is perfect.
    return (
        // ... (keep the JSX for the component exactly as it was)
    );
};

export default ServerSelector;