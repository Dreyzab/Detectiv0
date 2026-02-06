import React from 'react';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { usePassiveChecks } from './usePassiveChecks';
import { VoiceOrb } from './VoiceOrb';
import { ThoughtCloud } from './ThoughtCloud';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';

export const MindPalaceOverlay: React.FC = () => {
    const { activeScenarioId, currentSceneId } = useVNStore();

    // Resolve scene object
    const scenario = activeScenarioId ? getScenarioById(activeScenarioId) : null;
    const currentScene = (scenario && currentSceneId) ? scenario.scenes[currentSceneId] : undefined;

    const { activePassive } = usePassiveChecks(currentScene);

    if (!activePassive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[60]">
            {/* Voice Orb Area (Top Center) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <VoiceOrb
                    voiceId={activePassive.voiceId}
                    state="speaking"
                    size="md"
                />
            </div>

            {/* Text Cloud */}
            <ThoughtCloud
                voiceId={activePassive.voiceId}
                text={activePassive.text}
                isVisible={true}
            />
        </div>
    );
};
