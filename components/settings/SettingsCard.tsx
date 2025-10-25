import React from 'react';

interface SettingsCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, children }) => {
    return (
        <div className="bg-base-200 rounded-lg shadow-lg">
            <div className="p-6 border-b border-base-300">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default SettingsCard;