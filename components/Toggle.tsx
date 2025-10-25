import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    description: string;
    size?: 'sm' | 'md';
}

const Toggle: React.FC<ToggleProps> = ({checked, onChange, label, description, size = 'md'}) => {
    const sizeClasses = {
        sm: {
            container: "w-9 h-5",
            dot: "h-4 w-4",
            translate: "peer-checked:translate-x-4",
        },
        md: {
            container: "w-11 h-6",
            dot: "h-5 w-5",
            translate: "peer-checked:translate-x-full",
        },
    }
    const currentSize = sizeClasses[size];

    const content = (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className={`${currentSize.container} bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-800/50 peer-checked:after:${currentSize.translate} peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full ${currentSize.dot} after:transition-all peer-checked:bg-red-600`}></div>
        </label>
    );

    if (!label) {
        return content;
    }

    return (
        <div className="flex items-center justify-between">
            <div>
                <h4 className="text-md font-semibold text-zinc-200">{label}</h4>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
            {content}
        </div>
    );
}

export default Toggle;