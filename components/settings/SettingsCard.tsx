import React from 'react';

interface SettingsCardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ children, title, description }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/60 rounded-lg p-6">
        {title && <h3 className="text-lg font-bold text-slate-100 mb-1">{title}</h3>}
        {description && <p className="text-sm text-slate-400 mb-4">{description}</p>}
        {children}
    </div>
);

export default SettingsCard;