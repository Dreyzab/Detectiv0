import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface ChemicalAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const ChemicalAnalysisModal = ({ isOpen, onClose, onComplete }: ChemicalAnalysisModalProps) => {
    const [drops, setDrops] = useState<number>(0);
    const [reactionColor, setReactionColor] = useState<'none' | 'blue' | 'red'>('none');



    const handleAddDrop = () => {
        const newDrops = drops + 1;
        setDrops(newDrops);

        // Simulation mechanics: 3-5 drops = Blue (Success), <3 = None, >5 = Red (Fail/Reset)
        if (newDrops >= 3 && newDrops <= 5) {
            setReactionColor('blue');
        } else if (newDrops > 5) {
            setReactionColor('red');
        } else {
            setReactionColor('none');
        }
    };

    const handleConfirm = () => {
        if (reactionColor === 'blue') {
            setTimeout(() => {
                onComplete();
                onClose();
            }, 2000);
        } else {
            // Failure logic -> Reset
            setDrops(0);
            setReactionColor('none');
            // Maybe show wobble effect
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1814] border border-[#d4c5a3] w-full max-w-lg p-6 rounded-lg shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                <h2 className="text-[#d4c5a3] font-serif text-2xl mb-4 text-center tracking-widest uppercase">
                    Professor Kiliani's Lab
                </h2>

                <div className="flex flex-col items-center gap-6">
                    {/* Visual Stage */}
                    <div className="relative w-64 h-64 bg-black/50 rounded-full border border-white/10 flex items-center justify-center">
                        {/* Bottle (Draggable/Clickable) */}
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: -15 }}
                            onClick={handleAddDrop}
                            className="absolute -top-4 right-0 z-10"
                        >
                            <img
                                src="/images/detective/chemical_bottle.webp"
                                alt="Reagent"
                                className="w-24 drop-shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:drop-shadow-[0_0_25px_rgba(255,165,0,0.6)] transition-all"
                            />
                        </motion.button>

                        {/* Test Tube / Beaker Representation */}
                        <div className={cn(
                            "w-32 h-40 border-b-4 border-l-2 border-r-2 border-white/20 rounded-b-xl relative overflow-hidden transition-colors duration-1000",
                            reactionColor === 'blue' ? "bg-blue-900/40" : reactionColor === 'red' ? "bg-red-900/40" : "bg-transparent"
                        )}>
                            {/* Liquid Level */}
                            <motion.div
                                className={cn(
                                    "absolute bottom-0 left-0 right-0 transition-colors duration-500",
                                    reactionColor === 'blue' ? "bg-blue-500 shadow-[0_0_30px_#3b82f6]" :
                                        reactionColor === 'red' ? "bg-red-900" : "bg-amber-100/20"
                                )}
                                animate={{ height: `${drops * 15}%` }}
                            />

                            {/* Reaction Image Overlay (Success) */}
                            <AnimatePresence>
                                {reactionColor === 'blue' && (
                                    <motion.img
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        src="/images/detective/chemical_reaction_blue.webp"
                                        className="absolute inset-0 object-cover mix-blend-screen opacity-80"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="text-center space-y-2">
                        <p className="text-[#8c7b6c] font-mono text-xs">
                            Drops Added: <span className="text-[#d4c5a3]">{drops}</span>
                        </p>

                        <p className="text-[#d4c5a3] font-serif italic text-sm">
                            {reactionColor === 'blue'
                                ? "The solution glows with a distinct cyan hue..."
                                : reactionColor === 'red'
                                    ? "Turbid! The mixture is ruined."
                                    : "Add reagent carefully to induce precipitation."}
                        </p>

                        <button
                            onClick={handleConfirm}
                            disabled={drops === 0}
                            className={cn(
                                "mt-4 px-6 py-2 border font-bold uppercase text-xs tracking-widest transition-all",
                                reactionColor === 'blue'
                                    ? "bg-[#d4c5a3] text-[#2c1810] border-[#d4c5a3] hover:bg-white"
                                    : "bg-transparent text-[#8c7b6c] border-[#8c7b6c] opacity-50 cursor-not-allowed"
                            )}
                        >
                            Analyze Result
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
