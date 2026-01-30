import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { classifySession } from '../lib/patternClassifier';
import { selectDomains } from '../lib/domainSelector';
import { determineReadiness } from '../lib/readinessDetector';
import { generateQuestionLadder } from '../lib/questionGenerator';
import { generateReflections } from '../lib/wisdomFraming';

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
                const userProfile = { age: 25 };
                const { selected_domains, rule_ids_applied: domainRules } = selectDomains({
                    ...sessionData,
                    patterns: initialPatterns
                }, userProfile);

                // Run Readiness/Depth Detection
                const { max_depth_level, rule_ids_applied: readinessRules, determined_at } = determineReadiness({
                    ...sessionData,
                    patterns: initialPatterns
                }, userProfile);

                // Run Question Generator
                const readinessSessionContext = {
                    ...sessionData,
                    depth_control: { max_depth_level }
                };

                const questionLadder = generateQuestionLadder(readinessSessionContext);

                const newSession = {
                    session_id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    processed: true,
                    patterns: initialPatterns,
                    selected_domains,
                    domain_rules: domainRules,
                    depth_control: {
                        max_depth_level,
                        rule_ids_applied: readinessRules,
                        determined_at
                    },
                    question_ladder: questionLadder,
                    ...sessionData
                };

                set((state) => ({
                    sessions: [newSession, ...state.sessions],
                    currentSession: newSession
                }));

                return newSession;
            },

            saveResponse: (questionSequenceId, questionIndex, responseText) => {
                set((state) => {
                    const sessionIndex = state.sessions.findIndex(s => s.session_id === state.currentSession?.session_id);
                    if (sessionIndex === -1) return state;

                    const session = state.sessions[sessionIndex];

                    // Generate Reflection
                    const reflection = generateReflections(session, responseText);

                    // Create Response Object
                    const newResponse = {
                        response_id: crypto.randomUUID(),
                        question_sequence_id: questionSequenceId,
                        question_index: questionIndex,
                        text: responseText,
                        reflection: reflection,
                        timestamp: new Date().toISOString()
                    };

                    // Initialize responses array if not exists
                    const updatedResponses = session.responses ? [...session.responses, newResponse] : [newResponse];

                    const updatedSession = { ...session, responses: updatedResponses };
                    const newSessions = [...state.sessions];
                    newSessions[sessionIndex] = updatedSession;

                    return {
                        sessions: newSessions,
                        currentSession: updatedSession
                    };
                });
            },

            clearCurrentSession: () => set({ currentSession: null }),
        }),
        {
            name: 'ansure-session-storage', // unique name
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);
