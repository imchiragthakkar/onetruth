import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuthStore } from '../store/useAuthStore'
import { useWisdomStore } from '../store/useWisdomStore'
import { CategoryCard } from '../components/CategoryCard'
import { StoryView } from '../components/StoryView'
import { WitnessButton } from '../components/WitnessButton'
import { GuruChat } from '../components/GuruChat'
import { WISDOM_DATA } from '../lib/wisdomContent'
import { Navigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function Dashboard() {
    const { user, loading } = useAuthStore()
    const { activeStory, openStory, setCategory } = useWisdomStore()
    const [isGuruOpen, setIsGuruOpen] = useState(false)

    if (!loading && !user) {
        return <Navigate to="/auth" />
    }

    const handleCategoryClick = (catId) => {
        setCategory(catId)
        openStory(true) // Open immediately for now
    }

    return (
        <Layout>
            {activeStory && <StoryView />}

            <GuruChat isOpen={isGuruOpen} onClose={() => setIsGuruOpen(false)} />

            <div className="container mx-auto px-4 py-8 max-w-4xl relative min-h-screen">
                <header className="mb-12 text-center space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-gray-900">
                        Silent Teacher
                    </h1>
                    <p className="text-gray-500 text-lg">
                        What is troubling your mind today, <span className="text-primary-600 font-medium">{user?.displayName || 'Seeker'}</span>?
                    </p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                    {Object.values(WISDOM_DATA).map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onClick={() => handleCategoryClick(category.id)}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">
                        Based on Perennial Philosophy
                    </p>
                </div>

                <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end z-40">
                    <WitnessButton />
                    <Button
                        onClick={() => setIsGuruOpen(true)}
                        className="rounded-full w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    >
                        <MessageSquare size={24} />
                    </Button>
                </div>
            </div>
        </Layout>
    )
}


