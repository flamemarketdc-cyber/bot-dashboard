import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import { Guild } from '../App';
import type { Session } from '@supabase/supabase-js';
import { LogoutIcon } from '../components/Icons';

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
            try {
                // The Supabase client automatically includes the user's auth header.
                // The edge function will securely use this to get the Discord token.
                const { data, error: funcError } = await supabase.functions.invoke('get-guilds');

                if (funcError) throw funcError;

                // The function returns an object with an 'error' key on failure
                if (data.error) throw new Error(data.error);

                setGuilds(data);
            } catch (e: any) {
                console.error("Failed to fetch guilds:", e);
                setError(e.message || "Could not fetch your servers. Please try logging out and back in.");
            } finally {
                setLoading(false);
            }
        };

        fetchGuilds();
    }, [session]);
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };


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
                 <div className="text-center mb-8">
                    <img src={session.user.user_metadata.avatar_url} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-base-300"/>
                    <h1 className="text-4xl font-bold text-white mb-2">Select a Server</h1>
                    <p className="text-gray-400">Welcome, {session.user.user_metadata.full_name}. Choose a server to continue.</p>
                </div>

                {loading && <div className="text-center text-gray-400">Loading your servers...</div>}
                
                {error && (
                    <div className="text-center text-vibrant-red bg-vibrant-red/10 p-4 rounded-lg">
                        <p className="font-semibold">{error}</p>
                        <p className="mt-2 text-sm text-gray-400">This can happen if your session has expired. Please try logging out and back in to refresh your connection with Discord.</p>
                    </div>
                )}

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