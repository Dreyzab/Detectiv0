import { useEffect, useState, useRef } from 'react';
import { useDossierStore } from '../dossier/store';
import { performSkillCheck } from '@repo/shared/lib/dice';
import type { VNScene } from '@/entities/visual-novel/model/types';
import type { VoiceId } from '../lib/parliament';

export const usePassiveChecks = (currentScene?: VNScene) => {
    const { voiceStats, recordCheckResult } = useDossierStore();

    // Local state for the current active passive intervention
    const [activePassive, setActivePassive] = useState<{
        voiceId: VoiceId;
        text: string;
    } | null>(null);

    // Process checks when scene changes
    // We use a ref to track if we've already rolled for this scene instance to prevent re-rolls on unrelated state updates
    const processedSceneIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!currentScene?.passiveChecks || currentScene.passiveChecks.length === 0) {
            setActivePassive(null);
            return;
        }

        // Prevent re-rolling if we've already processed this scene
        if (processedSceneIdRef.current === currentScene.id) {
            return;
        }

        processedSceneIdRef.current = currentScene.id;

        let foundIntervention = null;

        for (const check of currentScene.passiveChecks) {
            const level = voiceStats[check.voiceId] || 0;
            const result = performSkillCheck(level, check.difficulty);

            // Record result (for history/xp)
            // Note: This is a side-effect in render flow, but acceptable given we gate it with processedSceneIdRef
            recordCheckResult(check.id, result.success ? 'passed' : 'failed');

            if (result.success && check.passiveText) {
                foundIntervention = {
                    voiceId: check.voiceId,
                    text: check.passiveText
                };

                // Found one, stop checking others to avoid overlap
                break;
            }
        }

        setActivePassive(foundIntervention);

        // Auto-dismiss after 6 seconds
        const timer = foundIntervention ? setTimeout(() => {
            setActivePassive(null);
        }, 6000) : null;

        return () => {
            if (timer) clearTimeout(timer);
        };
        // Removed voiceStats from dependency array to prevent re-rolls when stats change mid-scene
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentScene?.id]);

    return {
        activePassive
    };
};
