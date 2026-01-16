import { cn } from '../../lib/utils'

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'bg-white rounded-3xl p-6 shadow-xl shadow-sun-100/50 border border-sun-100 overflow-hidden',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
