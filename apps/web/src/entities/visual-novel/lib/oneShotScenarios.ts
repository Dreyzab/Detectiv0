export const ONE_SHOT_COMPLETION_FLAGS: Record<string, string> = {
    intro_char_creation: 'char_creation_complete',
    detective_case1_hbf_arrival: 'arrived_at_hbf',
    detective_case1_map_first_exploration: 'case01_map_exploration_intro_done'
};

export const isOneShotScenarioComplete = (
    scenarioId: string,
    flags: Record<string, boolean>
): boolean => {
    const completionFlag = ONE_SHOT_COMPLETION_FLAGS[scenarioId];
    if (!completionFlag) {
        return false;
    }

    return Boolean(flags[completionFlag]);
};
