import { create } from 'zustand'
import { WISDOM_DATA } from '../lib/wisdomContent'
import { useAuthStore } from './useAuthStore'

export const useWisdomStore = create((set, get) => ({
    selectedCategory: null,
    activeStory: null,

    // Actions
    setCategory: (categoryId) => set({ selectedCategory: categoryId, activeStory: null }),

    clearCategory: () => set({ selectedCategory: null, activeStory: null }),

    openStory: (story) => set({ activeStory: story }),

    closeStory: () => set({ activeStory: null }),

    // Helper to get content for the current user
    getContentForUser: () => {
        const { selectedCategory } = get()
        const { user } = useAuthStore.getState()

        if (!selectedCategory || !user) return null

        const categoryData = WISDOM_DATA[selectedCategory]
        if (!categoryData) return null

        const ageGroup = user.ageGroup || 'adults' // Fallback
        const content = categoryData.content[ageGroup]

        return {
            categoryName: categoryData.name,
            categoryColor: categoryData.color,
            categoryBg: categoryData.bgColor,
            logic: categoryData.logic,
            ...content
        }
    }
}))
