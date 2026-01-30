import { useState } from 'react';
import { useDossierStore, type Evidence } from '../dossier/store';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemicalAnalysisModal } from './ChemicalAnalysisModal';

export const DeductionBoard = () => {
    const evidence = useDossierStore(state => state.evidence);
    const unlockedDeductions = useDossierStore(state => state.unlockedDeductions);
    const combineEvidence = useDossierStore(state => state.combineEvidence);
    const setFlag = useDossierStore(state => state.setFlag);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'failure'; message: string } | null>(null);
    const [isChemicalModalOpen, setIsChemicalModalOpen] = useState(false);

    const handleCardClick = (id: string) => {
        if (selectedId === null) {
            setSelectedId(id);
        } else if (selectedId === id) {
            setSelectedId(null);
        } else {
            // Attempt combination
            const result = combineEvidence(selectedId, id);
            if (result) {
                if (result.type === 'minigame' && result.id === 'chemical_analysis') {
                    // Trigger Mini-game
                    setIsChemicalModalOpen(true);
                    setFeedback({ type: 'success', message: "Requires Analysis..." });
                } else {
                    setFeedback({ type: 'success', message: `${result.label}: ${result.description}` });
                }
                setTimeout(() => setFeedback(null), 4000);
            } else {
                setFeedback({ type: 'failure', message: "No meaningful connection found." });
                setTimeout(() => setFeedback(null), 2000);
            }
            setSelectedId(null);
        }
    };

    return (
        <div className="relative w-full h-full bg-[#1a1814] overflow-hidden flex flex-col items-center p-8">
            {/* Background Pattern - Corkboard feel */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80 pointer-events-none"
                style={{ backgroundImage: 'url(/images/detective/deduction_board_bg.png)' }}
            />

            <div className="z-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {evidence.map((item) => (
                    <EvidenceCard
                        key={item.id}
                        item={item}
                        isSelected={selectedId === item.id}
                        onClick={() => handleCardClick(item.id)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "absolute bottom-10 px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-md text-white font-serif text-lg z-50",
                            feedback.type === 'success' ? "bg-green-900/80 border-green-500" : "bg-red-900/80 border-red-500"
                        )}
                    >
                        {feedback.type === 'success' && <span className="mr-2">🔎</span>}
                        {feedback.type === 'failure' && <span className="mr-2">❌</span>}
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Deduced Connections List (Optional visual log) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                {unlockedDeductions.length > 0 && (
                    <div className="text-xs text-white/50 font-mono border border-white/10 p-2 rounded bg-black/50">
                        {unlockedDeductions.length} Deductions Logged
                    </div>
                )}
            </div>

            <ChemicalAnalysisModal
                key={isChemicalModalOpen ? 'open' : 'closed'}
                isOpen={isChemicalModalOpen}
                onClose={() => setIsChemicalModalOpen(false)}
                onComplete={() => {
                    setFlag('chemical_analysis_complete', true);
                    setFeedback({ type: 'success', message: "Analysis Confirmed: Positive match." });
                }}
            />
        </div>
    );
};

interface EvidenceCardProps {
    item: Evidence;
    isSelected: boolean;
    onClick: () => void;
}

const EvidenceCard = ({ item, isSelected, onClick }: EvidenceCardProps) => {
    const [rotation] = useState(() => Math.random() * 2 - 1);
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: rotation }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "relative bg-[#f5f0e1] p-2 shadow-lg cursor-pointer transition-all duration-300 transform",
                "border-2",
                isSelected ? "border-amber-500 ring-4 ring-amber-500/30 scale-105 z-20" : "border-transparent",
                // Polaroid aesthetics
                "w-full aspect-[3/4] flex flex-col"
            )}
        >
            {/* Image Placeholder */}
            <div className="flex-1 bg-neutral-800 overflow-hidden relative group">
                {item.icon ? (
                    <img src={item.icon} alt={item.name} className="w-full h-full object-cover sepia-[.5] group-hover:sepia-0 transition-all" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <span className="text-4xl">?</span>
                    </div>
                )}
            </div>

            {/* Label */}
            <div className="h-12 flex items-center justify-center pt-2">
                <span className="font-serif text-neutral-900 font-bold text-center leading-tight text-sm">
                    {item.name}
                </span>
            </div>

            {/* Selection Pin */}
            {isSelected && (
                <div className="absolute -top-3 -right-3 text-2xl drop-shadow-md">
                    📌
                </div>
            )}
        </motion.div>
    );
};
