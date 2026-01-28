const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Sends a prompt to the Gemini API and returns the text response.
 * @param {string} prompt - The text prompt to send.
 * @param {string} apiKey - The Google Gemini API Key.
 * @returns {Promise<string>} - The generated text response.
 */
export async function generateGeminiResponse(prompt, apiKey) {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    try {
        const response = await fetch(`${API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Safety check for empty response
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            throw new Error("No response generated from AI.");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Call Failed:", error);
        throw error;
    }
}
