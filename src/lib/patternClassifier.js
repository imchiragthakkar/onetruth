
export const PATTERN_TAXONOMY = [
    {
        pattern_id: "P01",
        name: "Mental Overload",
        conditions: {
            life_area: ["Mind / Emotions"],
            emotional_tags: ["Overwhelmed", "Anxious"],
            intensity_level_min: 6
        }
    },
    {
        pattern_id: "P02",
        name: "Identity Confusion",
        conditions: {
            life_area: ["Meaning / Direction", "Work / Purpose"],
            emotional_tags: ["Confused", "Seeking clarity"]
        }
    },
    {
        pattern_id: "P03",
        name: "Emotional Suppression",
        conditions: {
            emotional_tags: ["Numb"],
            duration_category: ["Few months", "Long time"]
        }
    },
    {
        pattern_id: "P04",
        name: "Reactive Emotional State",
        conditions: {
            emotional_tags: ["Angry", "Anxious"],
            intensity_level_min: 7
        }
    },
    {
        pattern_id: "P05",
        name: "Persistent Dissatisfaction",
        conditions: {
            duration_category: ["Few months", "Long time"],
            life_area: ["Work / Purpose", "Relationships"]
        }
    }
];

export function classifySession(session) {
    const matchedPatterns = PATTERN_TAXONOMY.filter(pattern => {
        const { conditions } = pattern;

        // Check Life Area (OR logic within array if present)
        if (conditions.life_area && !conditions.life_area.includes(session.life_area)) {
            return false;
        }

        // Check Tags (OR logic: at least one tag must match)
        if (conditions.emotional_tags) {
            const hasMatchingTag = session.emotional_tags.some(tag => conditions.emotional_tags.includes(tag));
            if (!hasMatchingTag) return false;
        }

        // Check Intensity (Min value)
        if (conditions.intensity_level_min && session.intensity_level < conditions.intensity_level_min) {
            return false;
        }

        // Check Duration
        if (conditions.duration_category && !conditions.duration_category.includes(session.duration_category)) {
            return false;
        }

        return true;
    });

    // Return array of pattern IDs (max 3, prioritized by rule order in array)
    return matchedPatterns.slice(0, 3).map(p => p.pattern_id);
}
