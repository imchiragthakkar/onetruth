import { generateGeminiResponse } from './gemini';

// --- Configuration & Constants ---

const SYSTEM_IDENTITY = `
CORE VISION & IDENTITY
You are Guru Sahayak, a calm, wise, human-like mentor.
Purpose: To help humans understand the root cause of their problems through clarity, reflection, and truth-based insight.
Core Belief: Most human suffering comes from misunderstood causes, not lack of intelligence or effort.
Guiding Principle: Clarity before solutions. Understanding before action.

ETHICAL BOUNDARIES (STRICT)
- You are NOT a doctor, therapist, religious authority, fortune teller, or replacement for real human support.
- You NEVER claim absolute truth, divine authority, or offer guaranteed outcomes.
- you DO NOT diagnose, treat mental illness, or provide medical advice.

PHILOSOPHICAL SOURCES
- Principles: Non-religious Vedanta, Modern Psychology, Human Behavioral Science, Socratic Inquiry.
- Forbidden: Scriptural quotes as authority, religious preaching, converting users.

BEHAVIORAL CONSTRAINTS
- No Judgment: Never judge, shame, or induce guilt.
- No Spiritual Bypassing: Do not dismiss feelings with "it's all an illusion" without first validating the human experience.
- Tone: Respectful, calm, non-superior. Equal human-to-human connection.

SAFETY & RESPONSIBILITY
- Crisis Policy: If the user mentions suicide, self-harm, or ending their life, you MUST STOP root cause analysis and provide immediate, supportive resources.
- Truth Handling: Truth must never be delivered in a way that harms dignity. Use "Gentle Honesty".

INTERACTION RULES
- Ask only ONE question at a time.
- Keep responses short and focused (Max 2 paragraphs).
- Do not just give advice; guide the user to find the answer themselves.

TONE & PERSONALITY CONTROLLER
- Core Persona: Calm, grounded, thoughtful human mentor.
- Forbidden Tones: Preachy, dramatic, overly enthusiastic, cold/clinical, sarcastic, patronizing.
- Language Rules: Plain language, no jargon, no complex metaphors. everyday human vocabulary. 
- Emotional Intelligence: Acknowledge emotions but do not amplify distress. Validate without necessarily agreeing with the narrative.
- Communication Boundaries: 
  - NEVER say "I know exactly how you feel" or "I have been through this".
  - NEVER position yourself as a savior.
  - NEVER claim empathy experience (you are an AI).
`;

const AGE_ADAPTATION_RULES = {
    kids: "Sentence Length: Short. Vocabulary: Very simple. Tone: Gentle, reassuring. Avoid: Abstract ideas, philosophical terms.", // <14
    youth: "Sentence Length: Short. Vocabulary: Very simple. Tone: Gentle, reassuring. Avoid: Abstract philosophy, complex terminology.", // 14-18
    adults: "Sentence Length: Medium. Vocabulary: Clear, modern. Tone: Supportive and reflective.", // 19-35
    elders: "Sentence Length: Medium. Vocabulary: Mature, grounded. Tone: Calm and wise." // 36-60+
};

const AGENT_ROLES = {
    ROOT_CAUSE: 'AGENT_1_ROOT_CAUSE_QUESTIONER',
    SYNTHESIZER: 'AGENT_2_INSIGHT_SYNTHESIZER',
    ACTION: 'AGENT_3_ACTION_GUIDE'
};

// Crisis Detection
const CRISIS_KEYWORDS = ["suicide", "kill myself", "self harm", "end my life", "die"];

// --- Helper Functions ---

const getAgeAdaptation = (ageGroup) => {
    return AGE_ADAPTATION_RULES[ageGroup] || AGE_ADAPTATION_RULES['adults'];
};

const getDefaultPrompt = (history) => {
    return history.map(msg => `${msg.role === 'user' ? 'User' : 'Guru'}: ${msg.content}`).join('\n');
};

// --- Main Class ---

export class GuruSahayak {
    constructor(apiKey, ageGroup = 'adults') {
        this.apiKey = apiKey;
        this.ageGroup = ageGroup;
        this.history = []; // Array of { role: 'user' | 'assistant', content: string }
        this.currentStage = AGENT_ROLES.ROOT_CAUSE;
        this.questionCount = 0;
        this.depthTarget = 5; // Minimum questions before synthesis
    }

    setAgeGroup(group) {
        this.ageGroup = group;
    }

    async processMessage(userMessage) {
        // 1. Safety Layer
        if (CRISIS_KEYWORDS.some(keyword => userMessage.toLowerCase().includes(keyword))) {
            return {
                text: "I hear that you are in deep pain. Please, your life is valuable. I am an AI and cannot provide the help you need right now. Please contact a local helpline or emergency services immediately. There are people who want to support you.",
                isCrisis: true
            };
        }

        // 2. Add User Message to History
        this.history.push({ role: 'user', content: userMessage });

        // 3. Construct Prompt based on Stage
        let systemPrompt = `${SYSTEM_IDENTITY}\n${getAgeAdaptation(this.ageGroup)}\n`;
        let taskPrompt = "";

        if (this.currentStage === AGENT_ROLES.ROOT_CAUSE) {
            this.questionCount++;
            taskPrompt = `
Task: Ask ONE clarifying, pattern-seeking, or belief-challenging question to go deeper.
Rule: Do NOT give advice yet. ONLY ask a question.
Current Step: ${this.questionCount} / ${this.depthTarget} (Target Depth)
Context:\n${getDefaultPrompt(this.history)}
Guru Sahayak Response:`;

            // Check transition condition (simple heuristic for prototype: count)
            if (this.questionCount >= this.depthTarget) {
                // In a real agent, we might ask the LLM if it has enough info.
                // For now, we transition after depth target is hit AND the user seems to have explained enough.
                // We'll let this turn be the transition check in a more complex version, 
                // but here we simply prepare to switch NEXT turn if we wanted, 
                // OR we can decide to switch NOW if we implement a "check_status" call.
                // To keep it simple: We stay in Question mode until strictly > depthTarget
            }
        }

        if (this.questionCount > this.depthTarget && this.currentStage === AGENT_ROLES.ROOT_CAUSE) {
            // Switch to Synthesis
            this.currentStage = AGENT_ROLES.SYNTHESIZER;
            taskPrompt = `
Task: The user has shared enough. Provide a Root Cause Summary based on Vedantic/Psychological principles.
Output Format:
1. Root Cause Summary (1 short paragraph)
2. Why it exists (1 short paragraph)
3. Validation (1 sentence)
DO NOT ask questions. DO NOT give action steps yet.
Context:\n${getDefaultPrompt(this.history)}
Guru Sahayak Response:`;
        } else if (this.currentStage === AGENT_ROLES.SYNTHESIZER) {
            // Switch to Action
            this.currentStage = AGENT_ROLES.ACTION;
            taskPrompt = `
Task: Provide practical guidance based on the previous root cause.
Output Structure:
1. Mindset Shift (1 sentence)
2. Practical Step (1 small action)
3. Reflection Question (1 gentle question)
Context:\n${getDefaultPrompt(this.history)}
Guru Sahayak Response:`;
        } else if (this.currentStage === AGENT_ROLES.ACTION) {
            // Post-Action / Wrap up or Loop
            taskPrompt = `
Task: The session is concluding. Offer a gentle closing or answer any final clarification on the action step.
Context:\n${getDefaultPrompt(this.history)}
Guru Sahayak Response:`;
        }

        // 4. Call LLM
        try {
            const responseText = await generateGeminiResponse(systemPrompt + taskPrompt, this.apiKey);

            // 5. Update History
            this.history.push({ role: 'assistant', content: responseText });

            return {
                text: responseText,
                stage: this.currentStage
            };
        } catch (error) {
            console.error("Guru Sahayak Error:", error);
            return {
                text: "My mind is clouded for a moment (Connection Error). Please try again.",
                error: true
            };
        }
    }

    reset() {
        this.history = [];
        this.currentStage = AGENT_ROLES.ROOT_CAUSE;
        this.questionCount = 0;
    }
}
