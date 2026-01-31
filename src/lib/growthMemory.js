
export const MEMORY_CONFIG = {
    min_sessions_for_pattern: 3,
    forget_after_days: 180
};

/**
 * Updates the user's growth memory based on a completed session.
 * @param {Object} currentMemory - The existing memory object.
 * @param {Object} session - The completed session data.
 * @returns {Object} The updated memory object.
 */
export function updateGrowthMemory(currentMemory, session) {
    const memory = currentMemory || {
        patterns: {}, // { pattern_id: { count: N, last_seen: timestamp } }
        domains: {},  // { domain_id: count }
        depth_history: [], // [{ depth: string, timestamp: string }]
        last_updated: null
    };

    const now = new Date();

    // 1. Update Patterns (Recurring Themes)
    const sessionPatterns = session.patterns || [];
    const updatedPatterns = { ...memory.patterns };

    sessionPatterns.forEach(pId => {
        if (!updatedPatterns[pId]) {
            updatedPatterns[pId] = { count: 0, last_seen: now.toISOString() };
        }
        updatedPatterns[pId].count += 1;
        updatedPatterns[pId].last_seen = now.toISOString();
    });

    // Prune old patterns (Forget Rule)
    Object.keys(updatedPatterns).forEach(pId => {
        const entry = updatedPatterns[pId];
        const daysSince = (now - new Date(entry.last_seen)) / (1000 * 60 * 60 * 24);
        if (daysSince > MEMORY_CONFIG.forget_after_days) {
            delete updatedPatterns[pId];
        }
    });

    // 2. Update Reflection Style (Domains)
    const updatedDomains = { ...memory.domains };
    const sessionDomains = session.selected_domains || [];
    sessionDomains.forEach(dId => {
        updatedDomains[dId] = (updatedDomains[dId] || 0) + 1;
    });

    // 3. Update Depth History (Growth Signals)
    // We store only the max depth reached in this session
    const depthLevel = session.depth_control?.max_depth_level;
    const updatedDepthHistory = [...(memory.depth_history || [])];

    if (depthLevel) {
        updatedDepthHistory.push({
            depth: depthLevel,
            timestamp: now.toISOString()
        });
    }

    // Optional: Prune depth history if it gets too long? 
    // Let's keep last 50 entries for now.
    if (updatedDepthHistory.length > 50) {
        updatedDepthHistory.shift();
    }

    return {
        ...memory,
        patterns: updatedPatterns,
        domains: updatedDomains,
        depth_history: updatedDepthHistory,
        last_updated: now.toISOString()
    };
}

/**
 * Extracts high-level insights from the memory object for UI consumption.
 * @param {Object} memory 
 */
export function getGrowthInsights(memory) {
    if (!memory) return null;

    // Recurring Patterns
    const recurringPatterns = Object.entries(memory.patterns)
        .filter(([_, data]) => data.count >= MEMORY_CONFIG.min_sessions_for_pattern)
        .map(([id, _]) => id);

    // Top Domains
    const sortedDomains = Object.entries(memory.domains)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([id]) => id);

    return {
        recurring_patterns: recurringPatterns,
        top_domains: sortedDomains,
        total_sessions_logged: memory.depth_history?.length || 0
    };
}
