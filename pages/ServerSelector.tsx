import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Guild } from '../App';
import type { Session } from '@supabase/supabase-js';
import { LogoutIcon } from '../components/Icons';

interface ServerSelectorProps {
    onGuildSelect: (guild: Guild) => void;
}

const ServerCard: React.FC<{ guild: Guild; onSelect: () => void }> = ({ guild, onSelect }) => {
    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
            }}
            className="bg-base-300/50 hover:bg-base-300/80 border border-base-400/50 rounded-lg p-4 flex flex-col items-center gap-4 text-center cursor-pointer transition-all duration-200 group"
            onClick={onSelect}
        >
            <img
                src={guild.icon}
                alt={`${guild.name} icon`}
                className="w-24 h-24 rounded-full shadow-lg group-hover:scale-105 transition-transform"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://cdn.discordapp.com/embed/avatars/0.png`;
                }}
            />
            <h3 className="font-bold text-white text-lg mt-2 truncate w-full">{guild.name}</h3>
        </motion.div>
    );
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

            if (!currentSession?.provider_token) {
                setError("Your session is missing a valid Discord token. Please log out and back in.");
                setLoading(false);
                return;
            }
            
            try {
                const { data, error: funcError } = await supabase.functions.invoke('get-discord-guilds', {
                    body: { provider_token: currentSession.provider_token }
                });

                if (funcError) throw funcError;
                if (data.error) throw new Error(data.error);
                
                const formattedGuilds = data.map((guild: any) => ({
                    ...guild,
                    icon: guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                      : `https://cdn.discordapp.com/embed/avatars/0.png`,
                }));

                setGuilds(formattedGuilds);
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

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-vibrant-red/40 rounded-full blur-[150px] animate-pulse-glow pointer-events-none"></div>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-5xl z-10"
                >
                    <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">Select a Server</h1>
                            <p className="text-gray-400 mt-2">Choose a server to manage with the dashboard.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 bg-base-200/50 hover:bg-base-300/80 text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </header>

                    {loading && (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-red mx-auto"></div>
                            <p className="mt-4 text-gray-400">Fetching your servers...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                            <p className="font-bold">An error occurred</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.05 },
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                        >
                            {guilds.length > 0 ? (
                                guilds.map((guild) => (
                                    <ServerCard key={guild.id} guild={guild} onSelect={() => onGuildSelect(guild)} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 bg-base-200/50 rounded-lg">
                                    <p className="text-gray-400">No manageable servers found.</p>
                                    <p className="text-xs text-gray-500 mt-2">You must have the 'Manage Server' permission to see a server here.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ServerSelector;
