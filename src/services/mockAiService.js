import { CORE_VISION, TONE_CONTROLLER, AGE_CONTROLLER, PROBLEM_CATEGORIZATION, ROOT_CAUSE_QUESTIONING } from '../lib/prompts';

export function mockAIResponse(input) {
    // Helper to simulate loading a prompt (in a real scenario, this might return the text)
    const loadPrompt = (promptData) => {
        return {
            role: "assistant",
            content: typeof promptData === 'string' ? promptData : JSON.stringify(promptData),
            meta: "Prompt Loaded successfully"
        };
    };

    // Check if input object has a task property (assuming input is an object)
    const task = input?.task || input; // Handle object or string input

    if (task === "TASK_1") return loadPrompt(CORE_VISION);
    if (task === "TASK_2") return loadPrompt(TONE_CONTROLLER);
    if (task === "TASK_3") return loadPrompt(AGE_CONTROLLER);
    if (task === "TASK_4_PROBLEM_CATEGORIZATION") return loadPrompt(PROBLEM_CATEGORIZATION);
    if (task === "TASK_5_ROOT_CAUSE_QUESTIONING") return loadPrompt(ROOT_CAUSE_QUESTIONING);

    return {
        role: "assistant",
        content: "Mock response for testing flow only."
    };
}
