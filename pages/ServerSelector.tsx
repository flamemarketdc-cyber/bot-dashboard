import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Guild } from '../App';
import type { Session } from '@supabase/supabase-js';

interface ServerSelectorProps {
    session: Session;
    onGuildSelect: (guild: Guild) => void;
}

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
    )
}


const ServerSelector: React.FC<ServerSelectorProps> = ({ session, onGuildSelect }) => {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuilds = async () => {
            if (!session?.provider_token) {
                setError("Authentication token is missing.");
                setLoading(false);
                return;
            }

            try {
                const { data, error: funcError } = await supabase.functions.invoke('get-discord-guilds', {
                    body: { accessToken: session.provider_token }
                });

                if (funcError) throw funcError;

                setGuilds(data);
            } catch (e: any) {
                console.error("Failed to fetch guilds:", e);
                setError("Could not fetch your servers. Please try logging out and back in.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuilds();
    }, [session]);

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Select a Server</h1>
                    <p className="text-gray-400">Choose a server to start managing its settings.</p>
                </div>

                {loading && <div className="text-center text-gray-400">Loading your servers...</div>}
                {error && <div className="text-center text-vibrant-red bg-vibrant-red/10 p-4 rounded-lg">{error}</div>}

                {!loading && !error && (
                    <motion.div 
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                        <AnimatePresence>
                            {guilds.map(guild => (
                                <ServerCard key={guild.id} guild={guild} onSelect={() => onGuildSelect(guild)} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ServerSelector;