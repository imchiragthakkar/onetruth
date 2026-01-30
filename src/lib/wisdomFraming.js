
export const WISDOM_FRAMES = {
    "D01": {
        domain: "Modern Psychology",
        frame_style: "emotional_normalization",
        templates: [
            "It makes sense that this feels heavy given what you described.",
            "Strong emotions often point to something important needing attention."
        ]
    },
    "D02": {
        domain: "Vedanta",
        frame_style: "observer_self",
        templates: [
            "Notice that the experience is happening to you, but it is not all of you.",
            "What you observe cannot be the observer itself."
        ]
    },
    "D03": {
        domain: "Zen",
        frame_style: "present_clarity",
        templates: [
            "When thoughts settle, what remains becomes clearer.",
            "Sometimes seeing is enough; nothing needs fixing yet."
        ]
    },
    "D04": {
        domain: "Tao",
        frame_style: "natural_flow",
        templates: [
            "When resistance softens, movement becomes easier.",
            "What is allowed often changes by itself."
        ]
    },
    "D05": {
        domain: "Practical Science",
        frame_style: "cause_effect_observation",
        templates: [
            "Patterns repeat when conditions remain the same.",
            "Small changes often create disproportionate effects."
        ]
    }
};

export function generateReflections(session, responseText) {
    const { selected_domains = [] } = session;

    // Default to Psychology if no domain selected
    const domainsToUse = selected_domains.length > 0 ? selected_domains : ["D01"];

    // Pick a random domain from the approved list
    const randomDomainId = domainsToUse[Math.floor(Math.random() * domainsToUse.length)];
    const frame = WISDOM_FRAMES[randomDomainId];

    if (!frame) return null;

    // Pick a random template
    const template = frame.templates[Math.floor(Math.random() * frame.templates.length)];

    return {
        reflection_id: crypto.randomUUID(),
        session_id: session.session_id,
        domain_used: frame.domain,
        reflection_text: template,
        generated_at: new Date().toISOString()
    };
}
