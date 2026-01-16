import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-sun-400 focus:ring-4 focus:ring-sun-100/50 transition-all font-medium placeholder:text-gray-400 bg-white',
                className
            )}
            {...props}
        />
    )
}
