
import { useQuestStore } from './store';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export const QuestNotification = () => {
    // This is a simplified version. Ideally we'd have an event system or a 'lastUpdated' field.
    // For now, we'll just check if the active quest count changes or if we can hook into the store.
    // Since useQuestStore is a zustand store, we can subscribe to changes? 
    // Or simpler: The user plays the game -> triggers action -> store updates.
    // We want to show a notification when that happens.

    // Limitation: Zustand standard subscription gives us state, but not "what changed".
    // We might need to modify the store to emit events or track "latestNotification".
    // For this implementation, I will assume the store has a `notificationQueue` or similar, 
    // OR I'll add a simple logic to detect changes if this component is mounted.

    // Better approach without refactoring store too much: 
    // Just show a generic "Journal Updated" if we detect quest count change? 
    // But specific "Quest Started: X" is better.

    // Let's rely on a temporary local state approach comparing previous data to new data.

    const { userQuests, quests } = useQuestStore();
    const [queue, setQueue] = useState<{ title: string, type: 'start' | 'update' | 'complete' }[]>([]);
    const [visible, setVisible] = useState(false);
    const [currentMsg, setCurrentMsg] = useState<{ title: string, type: 'start' | 'update' | 'complete' } | null>(null);
    const [prevQuests, setPrevQuests] = useState(userQuests);

    // Watch for changes
    useEffect(() => {
        const newQueue = [...queue];
        let hasChanges = false;

        // Check for new quests
        Object.keys(userQuests).forEach(questId => {
            if (!prevQuests[questId]) {
                newQueue.push({
                    title: quests[questId]?.title || "Unknown Quest",
                    type: 'start'
                });
                hasChanges = true;
            } else {
                // Check if status changed to completed/failed
                if (userQuests[questId].status !== prevQuests[questId].status) {
                    if (userQuests[questId].status === 'completed') {
                        newQueue.push({
                            title: quests[questId]?.title || "Unknown Quest",
                            type: 'complete'
                        });
                        hasChanges = true;
                    }
                }

                // Check for new objectives (completed count changed?)
                if (userQuests[questId].completedObjectiveIds.length > prevQuests[questId].completedObjectiveIds.length) {
                    newQueue.push({
                        title: quests[questId]?.title || "Unknown Quest",
                        type: 'update'
                    });
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            setQueue(newQueue);
            setPrevQuests(userQuests);
        }
    }, [userQuests, quests]); // Dependent on userQuests changing

    // Process Queue
    useEffect(() => {
        if (!visible && queue.length > 0) {
            const next = queue[0];
            setCurrentMsg(next);
            setQueue(prev => prev.slice(1));
            setVisible(true);

            // Auto hide
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [queue, visible]);

    if (!visible || !currentMsg) return null;

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-[#1c1917]/95 border border-[#ca8a04] px-6 py-4 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center gap-4 min-w-[300px]">
                <div className="p-2 bg-[#ca8a04]/10 rounded-full border border-[#ca8a04]/20">
                    {currentMsg.type === 'start' && <BookOpen className="w-6 h-6 text-[#ca8a04]" />}
                    {currentMsg.type === 'complete' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {currentMsg.type === 'update' && <BookOpen className="w-6 h-6 text-[#ca8a04]" />}
                </div>
                <div>
                    <p className="text-[#ca8a04] text-xs font-bold tracking-widest uppercase mb-0.5">
                        {currentMsg.type === 'start' && 'New Investigation'}
                        {currentMsg.type === 'complete' && 'Case Solved'}
                        {currentMsg.type === 'update' && 'Journal Updated'}
                    </p>
                    <p className="text-[#e5e5e5] font-serif font-bold text-lg leading-none">{currentMsg.title}</p>
                </div>
            </div>
        </div>
    );
}
