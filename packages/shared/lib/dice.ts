
/**
 * Checks a skill roll against a difficulty.
 * @param level The skill level (e.g. 1-20)
 * @param difficulty The target difficulty class (DC)
 * @returns { success: boolean, roll: number, total: number, isCritical: boolean, isFumble: boolean }
 */
export function performSkillCheck(level: number, difficulty: number) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + level;

    // Critical Success (Nat 20) always succeeds? Or just a bonus? 
    // For now, let's treat Nat 20 as auto-success and Nat 1 as auto-fail if we want Disco Elysium style.
    // However, simplest logic:
    const isCritical = roll === 20;
    const isFumble = roll === 1;

    let success = total >= difficulty;

    if (isCritical) success = true;
    if (isFumble) success = false;

    return { success, roll, total, isCritical, isFumble };
}
