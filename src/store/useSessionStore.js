import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSessionStore = create(
    persist(
        (set, get) => ({
            sessions: [],
            currentSession: null,

            // Actions
            addSession: (sessionData) => {
                const newSession = {
                    session_id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    processed: false,
                    ...sessionData
                };

                set((state) => ({
                    sessions: [newSession, ...state.sessions],
                    currentSession: newSession
                }));

                return newSession;
            },

            clearCurrentSession: () => set({ currentSession: null }),
        }),
        {
            name: 'ansure-session-storage', // unique name
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);
