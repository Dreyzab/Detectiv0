export const RPG_CONFIG = {
    // Formula: XP needed for next level = BASE + (CurrentLevel * SLOPE)
    // Level 1->2: 100 + (1 * 50) = 150 XP
    // Level 10->11: 100 + (10 * 50) = 600 XP
    XP_TO_NEXT_LEVEL_BASE: 100,
    XP_TO_NEXT_LEVEL_SLOPE: 50,

    // Usage Gains
    XP_GAIN_ON_CHECK_SUCCESS: 20,
    XP_GAIN_ON_CHECK_FAIL: 10,

    // Caps
    // Max level for a voice (skill).
    MAX_VOICE_LEVEL: 20,

    // Character Leveling (Global)
    // How many "Development Points" (manual skill boosts) to grant per Character Level
    DEV_POINTS_PER_LEVEL: 1
};

/**
 * Calculates how much XP is required to go from currentLevel to currentLevel + 1.
 */
export const getXpToNextVoiceLevel = (currentLevel: number) => {
    return RPG_CONFIG.XP_TO_NEXT_LEVEL_BASE + (currentLevel * RPG_CONFIG.XP_TO_NEXT_LEVEL_SLOPE);
};
