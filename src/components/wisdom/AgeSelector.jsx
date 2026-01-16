import { cn } from '../../lib/utils'
import { AGE_GROUPS } from '../../lib/data'

export function AgeSelector({ currentGroup, onSelect }) {
    return (
        <div className="flex bg-gray-100 p-1 rounded-full overflow-hidden inline-flex">
            {AGE_GROUPS.map(group => (
                <button
                    key={group.id}
                    onClick={() => onSelect(group.id)}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                        currentGroup === group.id
                            ? 'bg-white text-sun-600 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    {group.label}
                </button>
            ))}
        </div>
    )
}
