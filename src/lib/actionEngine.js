
export const ACTION_LIBRARY = {
    "D01": {
        domain: "Modern Psychology",
        suggestions: [
            "You might notice when this emotion appears and what happens just before it.",
            "It could help to name the feeling once a day, without judging it."
        ]
    },
    "D02": {
        domain: "Vedanta",
        suggestions: [
            "You may quietly observe thoughts as events, not instructions.",
            "It could be interesting to notice what remains when you stop labeling the experience."
        ]
    },
    "D03": {
        domain: "Zen",
        suggestions: [
            "You might sit with the sensation for a few breaths without changing it.",
            "It may help to do one ordinary task with full attention."
        ]
    },
    "D04": {
        domain: "Tao",
        suggestions: [
            "You could experiment with not pushing against the feeling today.",
            "It may be useful to allow the situation to unfold without interference."
        ]
    },
    "D05": {
        domain: "Practical Science",
        suggestions: [
            "You might track when this pattern appears and when it doesn’t.",
            "It could help to change one small condition and observe the result."
        ]
    }
};

export function generateActions(session) {
    const { depth_control, selected_domains = [] } = session;
    const maxDepth = depth_control?.max_depth_level || "L3";

    // 1. Verify Depth Permission
    // If L1 (Stabilization), exclude optional actions to prevent overwhelm or pressure.
    if (maxDepth === "L1") {
        return [];
    }

    // 2. Select Actions
    // We want 1-2 actions matching the domains.
    const actions = [];
    const domainsToUse = selected_domains.length > 0 ? selected_domains.slice(0, 2) : ["D01"];

    domainsToUse.forEach(domainId => {
        const domainActions = ACTION_LIBRARY[domainId];
        if (domainActions && domainActions.suggestions.length > 0) {
            // Pick rand
            const suggestion = domainActions.suggestions[Math.floor(Math.random() * domainActions.suggestions.length)];

            actions.push({
                action_id: crypto.randomUUID(),
                session_id: session.session_id,
                action_text: suggestion,
                action_type: "optional_suggestion", // Generic type for now, mapped to library
                domain_id: domainId,
                optional_flag: true,
                generated_at: new Date().toISOString()
            });
        }
    });

    return actions.slice(0, 2); // Ensure max 2
}
