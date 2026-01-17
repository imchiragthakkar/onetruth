import React, { useState } from 'react'
import { Send, Search, Zap, Shield, Heart, HelpCircle } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
// import { AgeSelector } from '../components/wisdom/AgeSelector'
import { WisdomCard } from '../components/wisdom/WisdomCard'
import { useAuthStore } from '../store/useAuthStore' // Import Auth Store
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { WISDOM_DB, TOPICS } from '../lib/data'

export default function Landing() {
    const { user } = useAuthStore()
    // Use user's ageGroup if logged in, otherwise default to 'adults'
    const ageGroup = user?.ageGroup || 'adults'

    // const [ageGroup, setAgeGroup] = useState('adults') // Removed state
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [wisdom, setWisdom] = useState(null)

    // Migration / Fetch Logic
    const handleSearch = async (topicKey) => {
        setLoading(true)
        setWisdom(null)

        try {
            let key = topicKey
            if (!key) {
                // Simple keyword matching for demo
                const q = query.toLowerCase()
                if (q.includes('stress')) key = 'stress'
                else if (q.includes('fear')) key = 'fear'
                else if (q.includes('anger')) key = 'anger'
                else if (q.includes('relationship') || q.includes('love')) key = 'relationships'
                else if (q.includes('confus')) key = 'confusion'
                else key = 'stress' // Default fallback
            }

            // 1. Try to fetch from Firestore
            const { doc, getDoc, setDoc, collection } = await import('firebase/firestore')
            const { db } = await import('../lib/firebase')

            const docRef = doc(db, "wisdom", key)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data[ageGroup]) {
                    setWisdom(data[ageGroup])
                }
            } else {
                // 2. Migration Fallback: If not in DB, upload from local WISDOM_DB
                // This ensures "Backend" is populated as requested
                const localData = WISDOM_DB[key]
                if (localData) {
                    await setDoc(docRef, localData)
                    if (localData[ageGroup]) {
                        setWisdom(localData[ageGroup])
                    }
                    console.log(`Migrated ${key} to Firestore`)
                }
            }
        } catch (error) {
            console.error("Error fetching wisdom:", error)
            // Fallback to local if network fails
            const topicData = WISDOM_DB[topicKey || 'stress'] // simplified
            if (topicData && topicData[ageGroup]) {
                setWisdom(topicData[ageGroup])
            }
        } finally {
            setLoading(false)
        }
    }

    // Icons mapping for topics
    const iconMap = {
        stress: Zap,
        fear: Shield,
        anger: Zap,
        confusion: HelpCircle,
        relationships: Heart
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">

                {/* Header Section */}
                <div className="text-center space-y-6 mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight">
                        Wisdom {user ? <span className="text-sun-600 capitalize">for {ageGroup}</span> : <span className="text-sun-600">for Life</span>}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
                        {user ? "Ancient guidance tailored to your life stage." : "Sign in to get wisdom adapted to your age."}
                        <br />Select a problem to find your answer.
                    </p>

                    {/* AgeSelector Removed */}
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-10">
                    {TOPICS.map((topic) => {
                        const Icon = iconMap[topic.id] || Zap
                        return (
                            <button
                                key={topic.id}
                                onClick={() => handleSearch(topic.id)}
                                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-sun-50 border border-transparent hover:border-sun-300 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="bg-sun-100 text-sun-600 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <Icon size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-sun-700">{topic.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative mb-8">
                    <div className="relative">
                        <Input
                            placeholder="Or type your problem here..."
                            className="pl-12 py-4 rounded-full shadow-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Button
                                size="sm"
                                onClick={() => handleSearch()}
                                className="rounded-full px-4"
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-sun-200 border-t-sun-500 rounded-full animate-spin"></div>
                        <p className="text-sun-600 font-medium animate-pulse">Consulting the archives...</p>
                    </div>
                )}

                {/* Result */}
                <WisdomCard data={wisdom} />

            </div>
        </Layout>
    )
}
