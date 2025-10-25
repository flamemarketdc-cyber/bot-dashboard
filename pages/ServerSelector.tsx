// =========================================================
// FINAL, COMPLETE, AND CORRECTED ServerSelector.tsx
// This version is "bulletproof" and will not cause a loop.
// It includes a definitive console.log for debugging the deployment.
// =========================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Guild } from '../App';
import type { Session } from '@supabase/supabase-js';
import { LogoutIcon } from '../components/Icons';

interface ServerSelectorProps {
    onGuildSelect: (guild: Guild) => void;
}

// The ServerCard sub-component is perfect, no changes are needed here.
const ServerCard: React.FC<{ guild: Guild, onSelect: () => void }> = ({ guild, onSelect }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-base-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={onSelect}
        >
            <div className="relative pt-[100%]">
                <img 
                    src={guild.icon}
                    alt={guild.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold">Manage</span>
                </div>
            </div>
            <div className="p-3 text-center">
                <h3 className="font-semibold text-white truncate">{guild.name}</h3>
            </div>
        </motion.div>
    );
};

// This is the main component with the corrected logic.
const ServerSelector: React.FC<ServerSelectorProps> = ({ onGuildSelect }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- THIS IS THE BULLETPROOF FIX ---
    // We use a SINGLE useEffect hook to handle all authentication and data fetching.
    useEffect(() => {
        // --- THIS IS THE DEFINITIVE PROOF FOR DEBUGGING ---
        console.log("--- DEFINITIVE PROOF: I AM RUNNING THE NEW BULLETPROOF CODE ---");
        // --- END OF PROOF ---

        const fetchGuilds = async () => {
            setError(null);
            setLoading(true);
            try {
                // First, ensure we have a valid session before invoking
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (!currentSession) {
                    throw new Error("You are not logged in.");
                }

                const { data, error: funcError } = await supabase.functions.invoke('get-guilds');
                
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

        // This listener handles all authentication events (login, logout, token refresh).
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            
            // The key logic: if the user is successfully signed in, THEN we fetch the guilds.
            if (event === 'SIGNED_IN') {
                fetchGuilds();
            } 
            // If the user signs out, we clear the data and stop loading.
            else if (event === 'SIGNED_OUT') {
                setGuilds([]);
                setLoading(false);
            }
        });
        
        // This handles the initial page load if the user is ALREADY logged in.
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            if (initialSession) {
                 setSession(initialSession);
                 fetchGuilds();
            } else {
                 setLoading(false); // If there's no session, stop loading.
            }
        });

        // Cleanup function to unsubscribe when the component unmounts.
        return () => subscription.unsubscribe();
    }, []); // The empty array [] ensures this ENTIRE block only runs ONCE.

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // The rest of your component's JSX is perfect.
    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 relative">
             <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                 <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-base-300/50 hover:bg-base-300 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                    <LogoutIcon />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
            <div className="w-full max-w-4xl mx-auto">
                {session?.user && (
                    <div className="text-center mb-8">
                        <img src={session.user.user_metadata.avatar_url} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-base-300"/>
                        <h1 className="text-4xl font-bold text-white mb-2">Select a Server</h1>
                        <p className="text-gray-400">Welcome, {session.user.user_metadata.full_name}. Choose a server to continue.</p>
                    </div>
                )}

                {loading && <div className="text-center text-gray-400">Loading your servers...</div>}
                
                {error && (
                    <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">
                        <p className="font-semibold">Edge Function returned a non-2xx status code</p>
                        <p className="mt-2 text-sm text-gray-400">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                     <motion.div 
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                        <AnimatePresence>
                            {guilds.length > 0 ? (
                                guilds.map(guild => (
                                    <ServerCard key={guild.id} guild={guild} onSelect={() => onGuildSelect(guild)} />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400 mt-8">
                                    <p>No manageable servers found.</p>
                                    <p className="text-sm mt-1">Make sure you have "Manage Server" permissions for the bot to see your servers.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ServerSelector;