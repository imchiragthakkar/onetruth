import React, { useState } from 'react'
import { Eye } from 'lucide-react'

export const WitnessButton = () => {
    const [isActive, setIsActive] = useState(false)

    const handleWitness = () => {
        setIsActive(true)
        setTimeout(() => setIsActive(false), 3000) // 3 second "breath"
    }

    return (
        <>
            <button
                onClick={handleWitness}
                className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-2xl hover:bg-primary-600 transition-all transform hover:scale-110 z-50 group"
                aria-label="The Witness"
            >
                <Eye size={24} className={isActive ? 'animate-pulse' : ''} />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Witness Mode
                </span>
            </button>

            {/* Overlay Animation */}
            <div
                className={`fixed inset-0 bg-white/80 backdrop-blur-md z-40 flex items-center justify-center transition-all duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="text-center text-primary-800 animate-fade-in">
                    <Eye size={64} className="mx-auto mb-4 text-primary-500 animate-bounce" />
                    <h2 className="text-3xl font-serif font-bold mb-2">Just Watch</h2>
                    <p className="text-xl opacity-75">You are the sky. Thoughts are just clouds.</p>
                </div>
            </div>
        </>
    )
}
