import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div 
            className={`animate-spin rounded-full border-slate-600 border-t-red-500 ${sizeClasses[size]}`}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;