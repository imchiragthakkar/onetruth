// verify_summary.js
import { generateSessionSummary } from '../src/lib/sessionSummaryGenerator.js';

console.log("Running Session Summary Generator Verification...");

const mockSession = {
    session_id: "test-session-123",
    raw_text: "I am feeling overwhelmed by work and I don't know what to do.",
    life_area: "Work / Purpose",
    patterns: ["P01", "P02"], // Mental Overload, Identity Confusion
    responses: [
        {
            reflection: {
                reflection_text: "It makes sense that this feels heavy."
            }
        },
        {
            reflection: {
                reflection_text: "What you observe cannot be the observer itself."
            }
        }
    ],
    suggested_actions: [
        { text: "Take 5 deep breaths." },
        { text: "Write down 3 things you can control." }
    ]
};

console.log("\nMock Session Data:");
console.log(JSON.stringify(mockSession, null, 2));

const summary = generateSessionSummary(mockSession);

console.log("\nGenerated Summary:");
console.log(JSON.stringify(summary, null, 2));

// Checks
let passed = true;

// Check S01
if (!summary.sections.find(s => s.title === "What You Came With" && s.content.includes("overwhelmed"))) {
    console.log("❌ S01 Failed");
    passed = false;
}

// Check S02
if (!summary.sections.find(s => s.title === "What Emerged" && s.content.includes("Mental Overload"))) {
    console.log("❌ S02 Failed");
    passed = false;
}

// Check S04 (Reflections)
if (!summary.sections.find(s => s.title === "Key Realizations" && s.content.includes("It makes sense"))) {
    console.log("❌ S04 Failed");
    passed = false;
}

// Check S05 (Actions)
if (!summary.sections.find(s => s.title === "Optional Next Steps" && s.content.includes("Take 5 deep breaths"))) {
    console.log("❌ S05 Failed");
    passed = false;
}

if (passed) {
    console.log("\n✅ All Checks Passed");
    process.exit(0);
} else {
    console.log("\n❌ Verification Failed");
    process.exit(1);
}
