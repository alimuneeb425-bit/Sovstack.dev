/**
 * Sovstack Brain Integration Client (Vanilla JS)
 * Coordinates secure prompt submissions directly to the local backend gateway.
 */

// Fallback to local address for developer terminal loops
const BRAIN_API_URL = 'https://glowing-space-journey-xrwq546jpv4r246r-5000.app.github.dev';


/**
 * Connects UI text fields directly with the 9-agent compilation framework.
 * @param {string} userPrompt - Structural description of the target logic.
 * @param {string} targetMode - The execution target environment profile.
 */
async function dispatchToAssemblyLine(userPrompt, targetMode) {
    const endpoint = `${BRAIN_API_URL}/api/compile-relay`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_prompt: userPrompt,
                target_mode: targetMode
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server connection dropped: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || "The multi-agent matrix dropped compilation context.");
        }

        // Returns pristine { source, manifest } structures directly to your layout handlers
        return result.payload;

    } catch (error) {
        console.error("[Handshake Failure]:", error.message);
        throw error;
    }
}
