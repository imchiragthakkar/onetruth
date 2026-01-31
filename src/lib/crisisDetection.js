export const CRISIS_INDICATORS = {
    explicit_self_harm: [
        "I want to die",
        "I want to end everything",
        "I don’t want to live",
        "I want to hurt myself"
    ],
    hopelessness_statements: [
        "Nothing will ever change",
        "There is no point",
        "I feel completely empty"
    ],
    emotional_overload: {
        intensity_level_min: 9
    }
};

export const DETECTION_RULES = [
    {
        rule_id: "C01",
        condition: (text, intensity) => {
            if (!text) return false;
            const lowerText = text.toLowerCase();
            return CRISIS_INDICATORS.explicit_self_harm.some(phrase => lowerText.includes(phrase.toLowerCase()));
        },
        severity: "critical"
    },
    {
        rule_id: "C02",
        condition: (text, intensity) => {
            if (!text) return false;
            const lowerText = text.toLowerCase();
            const hasHopelessness = CRISIS_INDICATORS.hopelessness_statements.some(phrase => lowerText.includes(phrase.toLowerCase()));
            return hasHopelessness && intensity >= 8;
        },
        severity: "high"
    },
    {
        rule_id: "C03",
        condition: (text, intensity) => intensity >= 9,
        severity: "high"
    }
];

export const RESPONSE_MODES = {
    critical: {
        disable_tasks: [
            "Question Ladder Generator",
            "Wisdom Framing Engine",
            "Action Suggestion Engine"
        ],
        allowed_content: [
            "empathy",
            "support_resources",
            "encouragement_to_seek_help"
        ],
        message: "It sounds like you are going through an incredibly difficult time. Your safety is the most important thing right now. Please consider reaching out to a professional or a trusted person who can support you instantly."
    },
    high: {
        disable_tasks: [
            "Wisdom Framing Engine"
        ],
        allowed_content: [
            "grounding",
            "validation",
            "gentle_support"
        ],
        message: "I hear how much pain you are in. It is okay to feel this way, and you don't have to carry it alone. Taking a moment to just breathe can sometimes help trigger a bit of calmness."
    }
};

export const HUMAN_ESCALATION = {
    methods: [
        "display_crisis_message",
        "show_local_support_numbers",
        "offer_contact_to_trusted_person"
    ]
};

export function detectCrisis(text, intensity) {
    let maxSeverity = "none";
    const triggeredRules = [];

    // Check all rules
    DETECTION_RULES.forEach(rule => {
        if (rule.condition(text, intensity)) {
            triggeredRules.push(rule.rule_id);

            // Upgrade severity if current rule is more severe
            if (rule.severity === "critical") {
                maxSeverity = "critical";
            } else if (rule.severity === "high" && maxSeverity !== "critical") {
                maxSeverity = "high";
            }
        }
    });

    if (maxSeverity === "none") {
        return {
            is_crisis: false,
            severity: "none",
            rules_triggered: [],
            response_mode: null,
            escalation: null
        };
    }

    return {
        is_crisis: true,
        severity: maxSeverity,
        rules_triggered: triggeredRules,
        response_mode: RESPONSE_MODES[maxSeverity],
        escalation: HUMAN_ESCALATION
    };
}
