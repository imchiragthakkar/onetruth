import React from 'react'
import { Layout } from '../components/layout/Layout'
import { useAuthStore } from '../store/useAuthStore'
import { useWisdomStore } from '../store/useWisdomStore'
import { CategoryCard } from '../components/CategoryCard'
import { StoryView } from '../components/StoryView'
import { WitnessButton } from '../components/WitnessButton'
import { WISDOM_DATA } from '../lib/wisdomContent'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
    const { user, loading } = useAuthStore()
    const { activeStory, openStory, setCategory } = useWisdomStore()

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

                <WitnessButton />
            </div>
        </Layout>
    )
}

