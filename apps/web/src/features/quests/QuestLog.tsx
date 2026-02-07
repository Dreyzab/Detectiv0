import { useQuestStore } from './store';
import { cn } from '@/shared/lib/utils';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useVNStore } from '../../entities/visual-novel/model/store';
import { QUEST_UI } from './locales';
import { getLocalizedText, asLocale, getQuestStageLabel, getObjectivesForStage, getQuestTimelineWindow } from './utils';
import { TimelineStageChip } from './TimelineStageChip';

export const QuestLog = () => {
    const { userQuests, quests } = useQuestStore();
    const { locale } = useVNStore();
    const currentLocale = asLocale(locale);
    const ui = QUEST_UI[currentLocale];

    const [isExpanded, setIsExpanded] = useState(true);

    const location = useLocation();
    const activeQuests = Object.values(userQuests).filter((questState) => questState.status === 'active');

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setIsExpanded(false), 30000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, activeQuests.length]);

    useEffect(() => {
        if (activeQuests.length > 0) {
            const timer = setTimeout(() => setIsExpanded(true), 0);
            return () => clearTimeout(timer);
        }
    }, [activeQuests.length]);

    const isVisible = location.pathname === '/map' || location.pathname.startsWith('/vn');

    if (!isVisible) return null;
    if (activeQuests.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-40 w-80 font-serif">
            <div
                className="bg-[#1c1917]/90 border border-[#ca8a04]/40 p-3 rounded-t-lg shadow-xl cursor-pointer flex justify-between items-center backdrop-blur-md"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="text-[#ca8a04] font-bold text-sm tracking-widest uppercase">{ui.header_objective}</span>
                <ChevronRight className={cn('w-4 h-4 text-[#ca8a04] transition-transform', isExpanded ? 'rotate-90' : '')} />
            </div>

            {isExpanded && (
                <div className="bg-[#1c1917]/80 border-x border-b border-[#ca8a04]/20 p-4 rounded-b-lg backdrop-blur-md space-y-6 animate-in slide-in-from-top-2">
                    {activeQuests.map((userQuest) => {
                        const quest = quests[userQuest.questId];
                        if (!quest) return null;

                        const title = getLocalizedText(quest.title, currentLocale);
                        const description = getLocalizedText(quest.description, currentLocale);
                        const stageLabel = getQuestStageLabel(quest, userQuest.stage, currentLocale);
                        const objectives = getObjectivesForStage(quest, userQuest.stage);
                        const timeline = getQuestTimelineWindow(quest, userQuest.questId, userQuest.stage, currentLocale);

                        return (
                            <div key={userQuest.questId} className="space-y-2">
                                <h3 className="text-[#e5e5e5] font-bold text-lg leading-tight">{title}</h3>
                                <p className="text-[#a8a29e] text-xs italic">{description}</p>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#ca8a04]/30 bg-[#0c0a09]/60 px-2.5 py-1 text-[11px]">
                                    <span className="uppercase tracking-wider text-[#78716c]">{ui.label_current_stage}:</span>
                                    <span className="font-semibold text-[#d4c5a3]">{stageLabel || ui.label_no_stage}</span>
                                </div>

                                {timeline.length > 0 && (
                                    <div className="rounded-md border border-[#ca8a04]/20 bg-[#0c0a09]/40 p-2">
                                        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
                                            {ui.label_stage_timeline}
                                        </div>
                                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                                            {timeline.map((entry, index) => (
                                                <div key={entry.stage} className="flex items-center gap-1.5 shrink-0">
                                                    <TimelineStageChip entry={entry} size="log" />
                                                    {index < timeline.length - 1 && (
                                                        <span className="text-[#78716c] text-[10px]">-&gt;</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 mt-3 pl-1">
                                    {objectives.map((objective) => {
                                        const isDone = userQuest.completedObjectiveIds.includes(objective.id);
                                        const objectiveText = getLocalizedText(objective.text, currentLocale);

                                        return (
                                            <div key={objective.id} className="flex items-start gap-2 text-sm">
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                ) : (
                                                    <Circle className="w-4 h-4 text-[#ca8a04]/50 mt-0.5 shrink-0" />
                                                )}
                                                <span className={cn('transition-colors', isDone ? 'text-gray-500 line-through' : 'text-[#d4c5a3]')}>
                                                    {objectiveText}
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
