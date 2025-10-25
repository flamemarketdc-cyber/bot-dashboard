import React, { useState, useEffect } from 'react';
import SettingsCard from './SettingsCard';
import Toggle from '../Toggle';
import { ShieldIcon, TrashIcon, PlusIcon } from '../Icons';
import { supabase } from '../../services/supabaseClient';
import { Guild } from '../../App';

interface GeneralSettingsProps {
    guild: Guild;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ guild }) => {
    const [is24Hour, setIs24Hour] = useState(true);
    const [errorLogsEnabled, setErrorLogsEnabled] = useState(false);
    const [managerRoles, setManagerRoles] = useState(['Admin', 'Moderator']);
    const [prefix, setPrefix] = useState(',');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPrefix = async () => {
            const { data, error } = await supabase
                .from('guild_settings')
                .select('prefix')
                .eq('guild_id', guild.id)
                .single();

            if (data && data.prefix) {
                setPrefix(data.prefix);
            }
        };

        fetchPrefix();
    }, [guild.id]);

    const handleSavePrefix = async () => {
        setSaving(true);
        const { error } = await supabase
            .from('guild_settings')
            .upsert({ guild_id: guild.id, prefix: prefix });

        if (error) {
            console.error('Error saving prefix:', error);
            // Here you would show an error toast to the user
        } else {
            // Here you would show a success toast
        }
        setSaving(false);
    };


    const handleRemoveRole = (roleToRemove: string) => {
        setManagerRoles(roles => roles.filter(role => role !== roleToRemove));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white">General Settings</h1>
            <p className="text-gray-400 mt-1">Manage general settings for your server.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Column 1 */}
                <div className="flex flex-col gap-6">
                    <SettingsCard title="Bot Prefix" description="Set the command prefix for the bot in this server.">
                        <div className="flex gap-2">
                           <input 
                                type="text"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                className="flex-grow bg-base-300 border border-base-400 text-white rounded-md p-2 focus:ring-vibrant-red focus:border-vibrant-red"
                                placeholder="Enter prefix..."
                           />
                            <button 
                                onClick={handleSavePrefix}
                                disabled={saving}
                                className="px-5 bg-vibrant-red text-white font-semibold rounded-md hover:bg-opacity-80 transition-all disabled:bg-opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Localization" description="Set your preferred language and time format.">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                                <select id="language" name="language" className="w-full bg-base-300 border border-base-400 text-white rounded-md p-2 focus:ring-vibrant-red focus:border-vibrant-red">
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300">Time Format</h4>
                                    <p className="text-xs text-gray-500">Display time in 24-hour format.</p>
                                </div>
                                <Toggle enabled={is24Hour} setEnabled={setIs24Hour} />
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-6">
                    <SettingsCard title="Manager Roles" description="Users with these roles can change bot settings.">
                        <div className="space-y-3">
                            {managerRoles.map(role => (
                                <div key={role} className="flex items-center justify-between bg-base-300/50 p-2 rounded-md">
                                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2"><ShieldIcon/> {role}</span>
                                    <button onClick={() => handleRemoveRole(role)} className="text-gray-500 hover:text-vibrant-red"><TrashIcon/></button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                             <select className="w-full bg-base-300 border border-base-400 text-white rounded-md p-2 focus:ring-vibrant-red focus:border-vibrant-red">
                                    <option disabled selected>Select a role to add...</option>
                                    <option>Head Mod</option>
                                    <option>Community Manager</option>
                                </select>
                            <button className="flex items-center justify-center px-4 bg-vibrant-red text-white font-semibold rounded-md hover:bg-opacity-80 transition-colors">
                                <PlusIcon />
                            </button>
                        </div>
                    </SettingsCard>

                     <SettingsCard title="Developer" description="Manage developer-related settings.">
                         <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-300">Error Logs</h4>
                                    <p className="text-xs text-gray-500">Enable logging of command errors.</p>
                                </div>
                                <Toggle enabled={errorLogsEnabled} setEnabled={setErrorLogsEnabled} />
                            </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
