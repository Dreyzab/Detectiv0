import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-white hover:opacity-90',
            secondary: 'bg-secondary text-white hover:opacity-90',
            danger: 'bg-red-500 text-white hover:bg-red-600',
        };

        return (
            <button
                ref={ref}
                className={`px-4 py-2 rounded-lg transition-all ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);
