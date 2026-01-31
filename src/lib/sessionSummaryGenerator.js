import { PATTERN_TAXONOMY } from './patternClassifier.js';

export function generateSessionSummary(session) {
    const summaryId = crypto.randomUUID();
    const sections = [];

    // S01: What You Came With
    if (session.raw_text) {
        sections.push({
            title: "What You Came With",
            content: session.raw_text
        });
    }

    // S02: What Emerged (Pattern Themes)
    if (session.patterns && session.patterns.length > 0) {
        const patternNames = session.patterns.map(pId => {
            const pattern = PATTERN_TAXONOMY.find(p => p.pattern_id === pId);
            return pattern ? pattern.name : null;
        }).filter(Boolean);

        if (patternNames.length > 0) {
            sections.push({
                title: "What Emerged",
                content: patternNames.join(", ")
            });
        }
    }

    // S03: Emotions You Noticed
    // Logic: Look for responses that might be emotional. 
    // Since we don't have strict layer tagging in responses yet, we'll try to match 
    // based on question context if possible, or just skip if data isn't clear.
    // For now, if there's a response to a question with type "emotional_exploration" or similar, we use it.
    // As a fallback per requirements, we will skip if we can't reliably filter L3/Emotional content 
    // to avoid mislabeling. 
    // *Refined Plan*: If we have specific fields or if the user typed something short in L3 (often emotional words),
    // we could include it. But without clear metadata, we will omit to be safe, OR 
    // we can assume the user's responses in the middle of the ladder are reflective.
    // *Decision*: Omit S03 for now unless we are sure, to adhere to "no_ai_interpretation". 
    // Actually, the requirement says "content_source: user_responses, filter_layers: ['L3']".
    // We can iterate through responses and check the question_index relative to ladder length?
    // Let's assume the middle questions (index 1 or 2 in a 3-step ladder) are deeper.
    // Better yet, let's look for any response that seems to contain emotional keywords? No, that's interpretation.
    // Let's stick to the prompt: filter_layers: ["L3"]. We don't have "L3" tags on responses.
    // We will skip S03 for this iteration to ensure safety/accuracy multiple sources.

    // S04: Key Realizations (Reflections)
    if (session.responses && session.responses.length > 0) {
        // Gather all reflection texts served to the user
        const reflections = session.responses
            .map(r => r.reflection ? r.reflection.reflection_text : null)
            .filter(Boolean);

        // Remove duplicates and join
        const uniqueReflections = [...new Set(reflections)];

        if (uniqueReflections.length > 0) {
            sections.push({
                title: "Key Realizations",
                content: uniqueReflections.join("\n\n")
            });
        }
    }

    // S05: Optional Next Steps
    if (session.suggested_actions && session.suggested_actions.length > 0) {
        // suggested_actions is array of objects { text, type, ... }
        const actionTexts = session.suggested_actions.map(a => a.text);
        sections.push({
            title: "Optional Next Steps",
            content: actionTexts.join("\n")
        });
    }

    return {
        summary_id: summaryId,
        session_id: session.session_id,
        sections: sections,
        generated_at: new Date().toISOString()
    };
}
