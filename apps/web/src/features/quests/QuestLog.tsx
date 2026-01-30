
import { useQuestStore } from './store';
import { cn } from '@/shared/lib/utils';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export const QuestLog = () => {
    const { userQuests, quests } = useQuestStore();
    const [isExpanded, setIsExpanded] = useState(true);

    const activeQuests = Object.values(userQuests).filter(q => q.status === 'active');

    if (activeQuests.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-40 w-80 font-serif">
            {/* Header */}
            <div
                className="bg-[#1c1917]/90 border border-[#ca8a04]/40 p-3 rounded-t-lg shadow-xl cursor-pointer flex justify-between items-center backdrop-blur-md"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="text-[#ca8a04] font-bold text-sm tracking-widest uppercase">Current Objective</span>
                <ChevronRight className={cn("w-4 h-4 text-[#ca8a04] transition-transform", isExpanded ? "rotate-90" : "")} />
            </div>

            {/* List */}
            {isExpanded && (
                <div className="bg-[#1c1917]/80 border-x border-b border-[#ca8a04]/20 p-4 rounded-b-lg backdrop-blur-md space-y-6 animate-in slide-in-from-top-2">
                    {activeQuests.map(uq => {
                        const quest = quests[uq.questId];
                        return (
                            <div key={uq.questId} className="space-y-2">
                                <h3 className="text-[#e5e5e5] font-bold text-lg leading-tight">{quest.title}</h3>
                                <p className="text-[#a8a29e] text-xs italic">{quest.description}</p>

                                <div className="space-y-2 mt-3 pl-1">
                                    {quest.objectives.map(obj => {
                                        const isDone = uq.completedObjectiveIds.includes(obj.id);
                                        return (
                                            <div key={obj.id} className="flex items-start gap-2 text-sm">
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-[#ca8a04]/50 mt-0.5 shrink-0" />
                                                )}
                                                <span className={cn(
                                                    "transition-colors",
                                                    isDone ? "text-gray-500 line-through" : "text-[#d4c5a3]"
                                                )}>
                                                    {obj.text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
