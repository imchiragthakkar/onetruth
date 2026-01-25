import React from 'react'
import { Leaf, Network, Compass, Zap } from 'lucide-react'

const iconMap = {
    Leaf: Leaf,
    Network: Network,
    Compass: Compass,
    Zap: Zap
}

export const CategoryCard = ({ category, onClick }) => {
    const Icon = iconMap[category.icon] || Leaf

    return (
        <button
            onClick={onClick}
            className={`w-full aspect-square rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${category.bgColor} border border-white/50`}
        >
            <div className={`p-4 rounded-full bg-white shadow-sm ${category.color}`}>
                <Icon size={32} strokeWidth={2.5} />
            </div>
            <span className={`font-serif font-bold text-lg ${category.color}`}>
                {category.name}
            </span>
        </button>
    )
}
