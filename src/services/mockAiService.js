import { CORE_VISION, TONE_CONTROLLER, AGE_CONTROLLER } from '../lib/prompts';

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

    return {
        role: "assistant",
        content: "Mock response for testing flow only."
    };
}
