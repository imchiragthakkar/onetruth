import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { updateGrowthMemory, getGrowthInsights } from '../lib/growthMemory';

export const useMemoryStore = create(
    persist(
        (set, get) => ({
            memory: null, // The raw memory object

            // Actions
            updateMemory: (session) => {
                set((state) => {
                    const updatedMemory = updateGrowthMemory(state.memory, session);
                    return { memory: updatedMemory };
                });
            },

            clearMemory: () => set({ memory: null }),

            // Selectors (derived state helpers)
            getInsights: () => {
                const state = get();
                return getGrowthInsights(state.memory);
            }
        }),
        {
            name: 'ansure-growth-memory',
            getStorage: () => localStorage,
        }
    )
);
