import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { classifySession } from '../lib/patternClassifier';
import { selectDomains } from '../lib/domainSelector';

export const useSessionStore = create(
    persist(
        (set, get) => ({
            sessions: [],
            currentSession: null,

            addSession: (sessionData) => {
                // Run Classification
                const initialPatterns = classifySession(sessionData);

                // Run Domain Selection
                // Note: userProfile is mocked for now, ideally retrieved from useAuthStore if we had access here
                // or passed in. We'll assume default age logic inside selectDomains matches generic adult if unspecified.
                const { selected_domains, rule_ids_applied } = selectDomains({
                    ...sessionData,
                    patterns: initialPatterns
                }, { age: 25 }); // Defaulting to 25 for prototype consistency

                const newSession = {
                    session_id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    processed: true,
                    patterns: initialPatterns,
                    selected_domains,
                    rule_ids_applied,
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
