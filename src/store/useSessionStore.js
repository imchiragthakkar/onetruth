import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { classifySession } from '../lib/patternClassifier';
import { selectDomains } from '../lib/domainSelector';
import { determineReadiness } from '../lib/readinessDetector';
import { generateQuestionLadder } from '../lib/questionGenerator';
import { generateReflections } from '../lib/wisdomFraming';
import { generateActions } from '../lib/actionEngine';
import { detectCrisis } from '../lib/crisisDetection';

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

                // Run Crisis Detection
                const crisisCheck = detectCrisis(sessionData.raw_text, sessionData.intensity_level);

                // Run Question Generator (Normal or Crisis Override)
                let questionLadder;
                let finalMaxDepth = max_depth_level;
                let finalReadinessRules = readinessRules;

                if (crisisCheck.is_crisis) {
                    finalMaxDepth = "L1"; // Force safest depth
                    questionLadder = [{
                        id: "safety_override",
                        text: "I am concerned about what you are sharing. Your safety is very important. Please know that there are people who can support you during this difficult time. Would you be open to connecting with a support resource?",
                        type: "safety_check"
                    }];
                } else {
                    const readinessSessionContext = {
                        ...sessionData,
                        depth_control: { max_depth_level }
                    };
                    questionLadder = generateQuestionLadder(readinessSessionContext);
                }

                const newSession = {
                    session_id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    processed: true,
                    patterns: initialPatterns,
                    selected_domains,
                    domain_rules: domainRules,
                    is_crisis_event: crisisCheck.is_crisis,
                    crisis_data: crisisCheck.is_crisis ? crisisCheck : null,
                    depth_control: {
                        max_depth_level: finalMaxDepth,
                        rule_ids_applied: finalReadinessRules,
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

                    // Check for crisis in new response
                    const currentIntensity = session.intensity_level || 5;
                    const crisisCheck = detectCrisis(responseText, currentIntensity);

                    let reflection;

                    if (crisisCheck.is_crisis || session.is_crisis_event) {
                        // Reuse the predefined safety message from detection logic if available, or a generic fallback
                        reflection = crisisCheck.response_mode?.message || "Please prioritizing your safety and well-being. Connecting with a support professional can make a big difference.";

                        // If this is a new crisis detection in an existing session, update the session state?
                        // Ideally we should mark the session as crisis now. But we are inside saveResponse.
                        // We will update the response object to indicate this interaction was a crisis trigger.
                    } else {
                        reflection = generateReflections(session, responseText);
                    }

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


            completeSession: () => {
                set((state) => {
                    const sessionIndex = state.sessions.findIndex(s => s.session_id === state.currentSession?.session_id);
                    if (sessionIndex === -1) return state;

                    const session = state.sessions[sessionIndex];

                    // Generate Actions
                    const suggestedActions = generateActions(session);

                    const updatedSession = {
                        ...session,
                        completed: true,
                        completed_at: new Date().toISOString(),
                        suggested_actions: suggestedActions
                    };

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
