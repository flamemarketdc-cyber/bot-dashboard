import React from 'react';

interface SettingsCardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ children, title, description }) => (
    <div className="bg-[#292b2f] border border-black/20 rounded-lg p-6">
        {title && <h3 className="text-lg font-bold text-zinc-100 mb-1">{title}</h3>}
        {description && <p className="text-sm text-zinc-400 mb-4">{description}</p>}
        {children}
    </div>
);

export default SettingsCard;