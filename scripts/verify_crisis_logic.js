import { detectCrisis } from '../src/lib/crisisDetection.js';

console.log("Running Crisis Detection Verification...");

const testCases = [
    {
        name: "Explicit Self-Harm",
        input: { text: "I want to end everything", intensity: 5 },
        expectedSeverity: "critical"
    },
    {
        name: "Hopelessness + High Intensity",
        input: { text: "There is no point in anything", intensity: 9 },
        expectedSeverity: "high"
    },
    {
        name: "Hopelessness + Low Intensity (Should be None)",
        input: { text: "There is no point", intensity: 5 },
        expectedSeverity: "none"
    },
    {
        name: "High Intensity Only",
        input: { text: "I am just so angry!", intensity: 9 },
        expectedSeverity: "high"
    },
    {
        name: "Normal Input",
        input: { text: "I had a bad day", intensity: 6 },
        expectedSeverity: "none"
    }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.name}`);

    // Simulate what the crisis detection expects
    const result = detectCrisis(test.input.text, test.input.intensity);

    console.log(`  Input: "${test.input.text}" (Intensity: ${test.input.intensity})`);
    console.log(`  Expected Severity: ${test.expectedSeverity}`);
    console.log(`  Actual Severity: ${result.severity}`);

    if (result.severity === test.expectedSeverity) {
        console.log("  ✅ PASS");
        passed++;
    } else {
        console.log("  ❌ FAIL");
        failed++;
        console.log("  Result Details:", JSON.stringify(result, null, 2));
    }
});

console.log(`\nResults: ${passed} Passed, ${failed} Failed`);

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
