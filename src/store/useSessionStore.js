import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { classifySession } from '../lib/patternClassifier';

export const useSessionStore = create(
    persist(
        (set, get) => ({
            sessions: [],
            currentSession: null,

            addSession: (sessionData) => {
                // Run Classification
                const initialPatterns = classifySession(sessionData);

                const newSession = {
                    session_id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    processed: true, // Mark processed as we ran classification
                    patterns: initialPatterns,
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
