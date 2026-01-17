import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../store/useAuthStore'
import { User, Mail, Calendar, LogOut, Edit2, Save, X } from 'lucide-react'

export default function Profile() {
    const { user, signOut, updateProfile } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [age, setAge] = useState(user?.age || '')
    const [loading, setLoading] = useState(false)

    if (!user) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500">Please sign in to view your profile.</p>
                </div>
            </Layout>
        )
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            await updateProfile({ age })
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to update profile", error)
        } finally {
            setLoading(false)
        }
    }

    const ageGroupColors = {
        kids: 'bg-green-100 text-green-700 border-green-200',
        youth: 'bg-blue-100 text-blue-700 border-blue-200',
        adults: 'bg-orange-100 text-orange-700 border-orange-200',
        elders: 'bg-purple-100 text-purple-700 border-purple-200'
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-16 h-16 bg-sun-100 rounded-full flex items-center justify-center text-sun-600">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500">Manage your journey details</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Main Details Card */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => {
                                        setAge(user.age || '')
                                        setIsEditing(true)
                                    }}
                                    className="p-2 text-gray-400 hover:text-sun-600 hover:bg-sun-50 rounded-full transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar size={20} className="text-gray-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Age & Wisdom Stage</p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                type="number"
                                                value={age}
                                                onChange={e => setAge(e.target.value)}
                                                className="w-24 h-9"
                                            />
                                            <Button size="sm" onClick={handleUpdate} disabled={loading}>
                                                {loading ? 'Saving...' : 'Save'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-gray-900 font-medium">{user.age || 'N/A'} years</span>
                                            <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded border ${ageGroupColors[user.ageGroup] || 'bg-gray-100 text-gray-600'}`}>
                                                {user.ageGroup}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Stats Placeholder */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Journey</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-sun-50 rounded-xl text-center">
                                <p className="text-3xl font-bold text-sun-600">0</p>
                                <p className="text-sm text-sun-800">Practices</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl text-center">
                                <p className="text-3xl font-bold text-blue-600">0</p>
                                <p className="text-sm text-blue-800">Days Streak</p>
                            </div>
                        </div>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        onClick={signOut}
                    >
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </Layout>
    )
}
