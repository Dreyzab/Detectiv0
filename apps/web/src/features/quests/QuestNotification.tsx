
import { useQuestStore } from './store';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useVNStore } from '../../entities/visual-novel/model/store';
import { QUEST_UI } from './locales';
import { getLocalizedText, asLocale } from './utils';


interface NotificationItem {
    questId: string;
    type: 'start' | 'update' | 'complete';
}

export const QuestNotification = () => {
    const { userQuests, quests } = useQuestStore();
    const { locale } = useVNStore();
    const currentLocale = asLocale(locale);
    const ui = QUEST_UI[currentLocale];

    // Store IDs not strings to allow dynamic localization
    const [queue, setQueue] = useState<NotificationItem[]>([]);
    const [visible, setVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState<NotificationItem | null>(null);
    const [prevQuests, setPrevQuests] = useState(userQuests);

    // Watch for changes
    useEffect(() => {
        const newQueue: NotificationItem[] = [];
        let hasChanges = false;

        // Check for new quests
        Object.keys(userQuests).forEach(questId => {
            if (!prevQuests[questId]) {
                newQueue.push({
                    questId,
                    type: 'start'
                });
                hasChanges = true;
            } else {
                // Check if status changed to completed/failed
                if (userQuests[questId].status !== prevQuests[questId].status) {
                    if (userQuests[questId].status === 'completed') {
                        newQueue.push({
                            questId,
                            type: 'complete'
                        });
                        hasChanges = true;
                    }
                }

                // Check for new objectives (completed count changed?)
                if (userQuests[questId].completedObjectiveIds.length > prevQuests[questId].completedObjectiveIds.length) {
                    newQueue.push({
                        questId,
                        type: 'update'
                    });
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            setQueue(prev => [...prev, ...newQueue]);
            setPrevQuests(userQuests);
        }
    }, [userQuests, quests, prevQuests]);

    // Process Queue
    useEffect(() => {
        if (!visible && queue.length > 0) {
            const next = queue[0];
            setCurrentItem(next);
            setQueue(prev => prev.slice(1));
            setVisible(true);

            // Auto hide
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [queue, visible]);

    if (!visible || !currentItem) return null;

    const quest = quests[currentItem.questId];
    // Fallback if quest data missing
    if (!quest) return null;

    const title = getLocalizedText(quest.title, currentLocale);

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-[#1c1917]/95 border border-[#ca8a04] px-6 py-4 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center gap-4 min-w-[300px]">
                <div className="p-2 bg-[#ca8a04]/10 rounded-full border border-[#ca8a04]/20">
                    {currentItem.type === 'start' && <BookOpen className="w-6 h-6 text-[#ca8a04]" />}
                    {currentItem.type === 'complete' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {currentItem.type === 'update' && <BookOpen className="w-6 h-6 text-[#ca8a04]" />}
                </div>
                <div>
                    <p className="text-[#ca8a04] text-xs font-bold tracking-widest uppercase mb-0.5">
                        {currentItem.type === 'start' && ui.label_new_investigation}
                        {currentItem.type === 'complete' && ui.label_case_solved}
                        {currentItem.type === 'update' && ui.label_journal_updated}
                    </p>
                    <p className="text-[#e5e5e5] font-serif font-bold text-lg leading-none">{title}</p>
                </div>
            </div>
        </div>
    );
}
