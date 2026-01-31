
import { updateGrowthMemory } from '../src/lib/growthMemory.js';

console.log("Running Growth Memory Verification...");

// Mock existing memory
let memory = {
    patterns: {
        "P01": { count: 2, last_seen: new Date().toISOString() } // Already seen twice
    },
    domains: {
        "D01": 3
    },
    depth_history: [],
    last_updated: new Date().toISOString()
};

// Mock Session 1 (Trigger Recurring Pattern)
const session1 = {
    patterns: ["P01", "P02"],
    selected_domains: ["D02"],
    depth_control: { max_depth_level: "L3" }
};

console.log("\nBefore Update:", JSON.stringify(memory, null, 2));

memory = updateGrowthMemory(memory, session1);

console.log("\nAfter Update (Session 1):", JSON.stringify(memory, null, 2));

// Checks
let passed = true;

// 1. Check Pattern Count
if (memory.patterns["P01"].count !== 3) {
    console.log("❌ P01 count should be 3");
    passed = false;
}

// 2. Check New Pattern
if (memory.patterns["P02"].count !== 1) {
    console.log("❌ P02 count should be 1");
    passed = false;
}

// 3. Check Domain
if (memory.domains["D02"] !== 1) {
    console.log("❌ D02 count should be 1");
    passed = false;
}

// 4. Check Depth History
if (memory.depth_history.length !== 1 || memory.depth_history[0].depth !== "L3") {
    console.log("❌ Depth history incorrect");
    passed = false;
}

if (passed) {
    console.log("\n✅ All Checks Passed");
    process.exit(0);
} else {
    console.log("\n❌ Verification Failed");
    process.exit(1);
}
