
export const DEPTH_LEVELS = {
    L1: { name: "Stabilization", description: "Emotional safety, grounding, validation only", rank: 1 },
    L2: { name: "Reflection", description: "Gentle observation and awareness-building", rank: 2 },
    L3: { name: "Inquiry", description: "Why-based questioning and belief examination", rank: 3 },
    L4: { name: "Insight", description: "Meaning reframing and wisdom principles", rank: 4 },
    L5: { name: "Integration", description: "Actionable alignment and lifestyle application", rank: 5 }
};

export const READINESS_RULES = [
    {
        rule_id: "RD01",
        condition: (session, profile) => session.intensity_level >= 8,
        max_depth: "L1",
        reason: "High emotional distress requires stabilization"
    },
    {
        rule_id: "RD02",
        condition: (session, profile) => (profile.age || 25) <= 17,
        max_depth: "L2",
        reason: "Teen users require gentle reflection only"
    },
    {
        rule_id: "RD03",
        condition: (session, profile) => session.patterns && session.patterns.includes("P03") && session.intensity_level >= 6,
        max_depth: "L2",
        reason: "Suppressed emotion needs safety before inquiry"
    },
    {
        rule_id: "RD04",
        condition: (session, profile) => session.intensity_level <= 5 && (profile.age || 25) >= 21,
        max_depth: "L4",
        reason: "Emotionally stable adults can access insight"
    },
    {
        rule_id: "RD05",
        condition: (session, profile) => session.intensity_level <= 4 && session.patterns && (session.patterns.includes("P02") || session.patterns.includes("P05")),
        max_depth: "L5",
        reason: "Low distress identity issues allow full integration"
    }
];

export function determineReadiness(session, userProfile = {}) {
    const applicableRules = [];
    let minAllowedRank = 5; // Start with max permission (L5)
    let finalMaxDepth = "L3"; // Default safe middle ground if no rules trigger or all allow high depth

    // Check all rules
    READINESS_RULES.forEach(rule => {
        if (rule.condition(session, userProfile)) {
            const ruleDepthRank = DEPTH_LEVELS[rule.max_depth].rank;

            // "Use most restrictive rule" -> Take the minimum rank
            if (ruleDepthRank < minAllowedRank) {
                minAllowedRank = ruleDepthRank;
                finalMaxDepth = rule.max_depth;
            }

            applicableRules.push(rule.rule_id);
        }
    });

    // If no specific restrictive rules fired, and we are still at default start (5),
    // we might want to default to something safer than L5 unless explicitly allowed.
    // However, the logic says "resolve_max_depth_level".
    // If RD04 or RD05 matched, they would have set the allowed rank. 
    // If ONLY restrictive rules matched (RD01-03), we followed them.
    // If NO rules matched at all?
    if (applicableRules.length === 0) {
        // Fallback default
        finalMaxDepth = "L3";
    } else {
        // We have the minimum rank found.
        // But wait, RD04/RD05 are *permissive* rules ("can access insight"). 
        // Logic check: The user requirement says "Use most restrictive rule".
        // If RD01 (Restrict to L1) AND RD04 (Allow L4) both somehow evaluated to true?
        // (Conditions make them mutually exclusive mostly, but let's be safe).
        // Our logic `if (ruleDepthRank < minAllowedRank)` ensures we always pick the LOWER rank.
        // So strict safety is preserved.

        // One edge case: If only RD04 matches (Max L4), minAllowedRank becomes 4.
        // If ONLY RD05 matches (Max L5), minAllowedRank becomes 5.
        // If NO rules match, we default to L3.

        // Wait, if RD04 matches, it sets max_depth to L4. 
        // If we started minAllowedRank at 5, and RD04 hits, we set it to 4. Correct.
    }

    return {
        max_depth_level: finalMaxDepth,
        rule_ids_applied: applicableRules,
        determined_at: new Date().toISOString()
    };
}
