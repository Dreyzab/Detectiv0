import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error';
}

export const Badge = ({ className = '', variant = 'success', ...props }: BadgeProps) => {
    const variants = {
        success: 'bg-green-500/20 text-green-300 border-green-500/50',
        warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        error: 'bg-red-500/20 text-red-300 border-red-500/50',
    };

    return (
        <span
            className={`px-2 py-0.5 rounded text-xs border ${variants[variant]} ${className}`}
            {...props}
        />
    );
};
