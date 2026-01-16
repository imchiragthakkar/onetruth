import { cn } from '../../lib/utils'

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
    const variants = {
        primary: 'bg-sun-500 text-white hover:bg-sun-600 shadow-md shadow-sun-200',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
        ghost: 'bg-transparent hover:bg-sun-50 text-sun-600',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-4 text-lg'
    }

    return (
        <button
            className={cn(
                'rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}
