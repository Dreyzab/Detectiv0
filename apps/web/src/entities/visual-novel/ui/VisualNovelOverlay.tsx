
import { useVNStore } from '../model/store';
import { useEffect, useState } from 'react';
import type { VNCharacter } from '../model/types';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useNavigate } from 'react-router-dom';


// Mock character database for prototype
const CHARACTERS: Record<string, VNCharacter> = {
    'inspector': { id: 'inspector', name: 'Inspector', color: '#d4c5a3' },
    'gendarm': { id: 'gendarm', name: 'Gendarm Müller', color: '#3b82f6' },
    'bank_manager': { id: 'bank_manager', name: 'Herr Direktor', color: '#ef4444' },
    'worker': { id: 'worker', name: 'Worker', color: '#16a34a' },
    'unknown': { id: 'unknown', name: '???', color: '#a8a29e' },
};

export const VisualNovelOverlay = () => {
    const { activeScenario, currentSceneId, advanceScene, endScenario } = useVNStore();
    const { setPointState, addEvidence, setFlag } = useDossierStore();
    const navigate = useNavigate();
    const [typedText, setTypedText] = useState('');

    const scene = activeScenario?.scenes[currentSceneId || ''];
    const character = scene?.characterId ? CHARACTERS[scene.characterId] : null;
    const background = scene?.backgroundUrl || activeScenario?.defaultBackgroundUrl;

    // Typewriter effect
    useEffect(() => {
        if (!scene?.text) return;
        setTypedText('');
        let index = 0;
        const speed = 30; // ms per char

        const interval = setInterval(() => {
            if (index < scene.text.length) {
                setTypedText(scene.text.substring(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [scene?.text]);

    if (!activeScenario || !currentSceneId || !scene) return null;

    const handleChoice = (nextId: string, actions?: { type: string; payload: unknown }[]) => {
        if (actions) {
            actions.forEach(action => {
                switch (action.type) {
                    case 'grant_evidence':
                        addEvidence(action.payload as import('@/features/detective/dossier/store').Evidence);
                        break;
                    case 'unlock_point':
                        setPointState(action.payload as string, 'discovered');
                        break;
                    case 'add_flag':
                        Object.entries(action.payload as Record<string, boolean>).forEach(([k, v]) => setFlag(k, v));
                        break;
                    case 'start_battle': {
                        const payload = action.payload as { scenarioId: string; deckType: string };
                        endScenario();
                        navigate(`/tutorial-battle?scenarioId=${payload.scenarioId}&deckType=${payload.deckType}`);
                        break;
                    }
                }
            });
        }

        if (nextId === 'END') {
            endScenario();
        } else {
            advanceScene(nextId);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col">
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{
                    backgroundImage: `url(${background})`,
                    filter: 'sepia(0.3) contrast(1.1) brightness(0.4)'
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex-1 flex flex-col justify-end p-4 md:p-12 pb-12 max-w-5xl mx-auto w-full">

                {/* Text Box */}
                <div className="bg-[#1a1612]/95 border border-[#d4c5a3]/30 p-6 md:p-8 rounded-sm shadow-2xl backdrop-blur-sm min-h-[200px] flex flex-col gap-4">

                    {/* Name Tag */}
                    {character && (
                        <div className="self-start px-4 py-1 bg-[#2a2420] border border-[#d4c5a3]/50 transform -translate-y-10 shadow-lg">
                            <span
                                className="font-serif font-bold text-lg uppercase tracking-widest"
                                style={{ color: character.color }}
                            >
                                {character.name}
                            </span>
                        </div>
                    )}

                    {/* Dialogue Text */}
                    <p className="font-serif text-lg md:text-xl leading-relaxed text-[#e5e5e5] h-full">
                        {typedText}
                        <span className="animate-pulse inline-block w-2 h-4 bg-[#d4c5a3] ml-1 align-middle" />
                    </p>

                    {/* Choices */}
                    <div className="flex flex-wrap gap-3 mt-4 justify-end">
                        {scene.choices ? (
                            scene.choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleChoice(choice.nextSceneId, choice.actions)}
                                    className="px-6 py-3 bg-[#2a2420] border border-[#d4c5a3]/30 hover:bg-[#d4c5a3] hover:text-[#1a1612] transition-colors font-serif text-sm uppercase tracking-widest text-[#d4c5a3]"
                                >
                                    {choice.text}
                                </button>
                            ))
                        ) : (
                            <button
                                onClick={() => handleChoice(scene.nextSceneId || 'END', scene.onEnter)} // Fallback if no choices, standard 'Next'
                                className="px-8 py-3 bg-[#d4c5a3] text-[#1a1612] font-bold font-serif uppercase tracking-widest hover:bg-white transition-colors animate-pulse"
                            >
                                Continue ►
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
