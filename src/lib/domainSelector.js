
export const WISDOM_DOMAINS = {
    "D01": { name: "Modern Psychology", description: "Emotional regulation, cognitive clarity, validation, grounding" },
    "D02": { name: "Vedanta", description: "Self-inquiry, attachment, identity, inner observer" },
    "D03": { name: "Zen", description: "Presence, simplicity, letting go of overthinking" },
    "D04": { name: "Tao", description: "Flow, non-resistance, natural balance" },
    "D05": { name: "Practical Science", description: "Behavioral habits, routines, cause-effect clarity" }
};

export function selectDomains(session, userProfile = {}) {
    const { patterns = [], intensity_level } = session;
    const { age = 25 } = userProfile; // Default age if not provided

    const selectedDomains = new Set();
    const appliedRules = [];

    // R01: High intensity -> Psychology (D01)
    if ((patterns.includes("P01") || patterns.includes("P04")) && intensity_level >= 7) {
        selectedDomains.add("D01");
        appliedRules.push("R01");
    }

    // R02: Identity/Dissatisfaction + Adult -> Vedanta (D02)
    if ((patterns.includes("P02") || patterns.includes("P05")) && age >= 21) {
        selectedDomains.add("D02");
        appliedRules.push("R02");
    }

    // R03: Mental patterns + Low Intensity -> Zen (D03)
    if (patterns.includes("P01") && intensity_level <= 5) {
        selectedDomains.add("D03");
        appliedRules.push("R03");
    }

    // R04: Suppression -> Tao (D04)
    if (patterns.includes("P03")) {
        selectedDomains.add("D04");
        appliedRules.push("R04");
    }

    // R05: Teens -> Practical Science(D05) + Psych(D01)
    if (age <= 20) {
        selectedDomains.add("D05");
        selectedDomains.add("D01");
        appliedRules.push("R05");
    }

    // Fallback if empty (default to Psychology for safety)
    if (selectedDomains.size === 0) {
        selectedDomains.add("D01");
    }

    return {
        selected_domains: Array.from(selectedDomains).slice(0, 2), // Max 2 domains
        rule_ids_applied: appliedRules
    };
}
