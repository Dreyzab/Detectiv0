
import { useQuestStore } from './store';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useVNStore } from '../../entities/visual-novel/model/store';
import { QUEST_UI } from './locales';
import { getLocalizedText, asLocale } from './utils';

type Tab = 'active' | 'completed' | 'failed';

export const QuestJournalPage = () => {
    const navigate = useNavigate();
    const { userQuests, quests } = useQuestStore();
    const { locale } = useVNStore();
    const currentLocale = asLocale(locale);
    const ui = QUEST_UI[currentLocale];

    const [activeTab, setActiveTab] = useState<Tab>('active');

    const filteredQuests = Object.values(userQuests).filter(q => {
        if (activeTab === 'active') return q.status === 'active';
        if (activeTab === 'completed') return q.status === 'completed';
        if (activeTab === 'failed') return q.status === 'failed';
        return false;
    });

    return (
        <div className="min-h-screen bg-[#1c1917] text-[#e5e5e5] font-serif p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-[#ca8a04]/10 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-6 h-6 text-[#ca8a04] group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#ca8a04] tracking-wider uppercase">{ui.header_journal}</h1>
                        <p className="text-[#a8a29e] italic">{ui.subtitle_journal}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={ui.search_placeholder}
                            className="bg-[#0c0a09] border border-[#ca8a04]/30 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[#ca8a04] w-64 text-[#e5e5e5]"
                        />
                        <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-2.5" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-4xl mx-auto mb-8 border-b border-[#ca8a04]/20 flex gap-8">
                <TabButton
                    label={ui.tab_active}
                    icon={<BookOpen className="w-4 h-4" />}
                    isActive={activeTab === 'active'}
                    onClick={() => setActiveTab('active')}
                    count={Object.values(userQuests).filter(q => q.status === 'active').length}
                />
                <TabButton
                    label={ui.tab_solved}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    isActive={activeTab === 'completed'}
                    onClick={() => setActiveTab('completed')}
                    count={Object.values(userQuests).filter(q => q.status === 'completed').length}
                />
                <TabButton
                    label={ui.tab_failed}
                    icon={<XCircle className="w-4 h-4" />}
                    isActive={activeTab === 'failed'}
                    onClick={() => setActiveTab('failed')}
                    count={Object.values(userQuests).filter(q => q.status === 'failed').length}
                />
            </div>

            {/* Content Grid */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQuests.length > 0 ? (
                    filteredQuests.map(uq => {
                        const quest = quests[uq.questId];
                        const title = getLocalizedText(quest.title, currentLocale);
                        const description = getLocalizedText(quest.description, currentLocale);

                        return (
                            <div key={uq.questId} className="bg-[#1c1917] border border-[#ca8a04]/20 rounded-lg p-6 hover:border-[#ca8a04]/50 transition-colors group relative overflow-hidden">
                                {uq.status === 'completed' && <div className="absolute top-0 right-0 p-2"><CheckCircle2 className="w-6 h-6 text-green-500/50" /></div>}
                                {uq.status === 'failed' && <div className="absolute top-0 right-0 p-2"><XCircle className="w-6 h-6 text-red-500/50" /></div>}

                                <h3 className="text-xl font-bold text-[#ca8a04] mb-2 group-hover:text-[#eab308] transition-colors">{title}</h3>
                                <p className="text-[#a8a29e] text-sm mb-4 line-clamp-2">{description}</p>

                                <div className="space-y-3">
                                    <div className="text-xs font-bold text-[#78716c] uppercase tracking-wider">{ui.label_objectives}</div>
                                    {quest.objectives.map(obj => {
                                        const isDone = uq.completedObjectiveIds.includes(obj.id);
                                        const objText = getLocalizedText(obj.text, currentLocale);
                                        return (
                                            <div key={obj.id} className="flex items-start gap-2 text-sm">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                                    isDone ? "bg-green-500" : "bg-[#ca8a04]"
                                                )} />
                                                <span className={cn(
                                                    isDone ? "text-[#78716c] line-through" : "text-[#d6d3d1]"
                                                )}>{objText}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#ca8a04]/10 flex justify-between items-center text-xs text-[#78716c]">
                                    <span>ID: {uq.questId}</span>
                                    {uq.status === 'active' && (
                                        <span className="flex items-center gap-1 text-[#ca8a04]">
                                            <Clock className="w-3 h-3" /> {ui.label_in_progress}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-[#ca8a04]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-[#ca8a04]/40" />
                        </div>
                        <h3 className="text-[#e5e5e5] font-bold text-lg">{ui.empty_no_entries}</h3>
                        <p className="text-[#a8a29e]">{ui.empty_no_active}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    count: number;
}

const TabButton = ({ label, icon, isActive, onClick, count }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={cn(
            "pb-4 flex items-center gap-2 text-sm font-bold tracking-wide transition-all relative",
            isActive ? "text-[#ca8a04]" : "text-[#78716c] hover:text-[#a8a29e]"
        )}
    >
        {icon}
        {label}
        <span className={cn(
            "ml-1 text-xs px-2 py-0.5 rounded-full",
            isActive ? "bg-[#ca8a04]/20 text-[#ca8a04]" : "bg-[#292524] text-[#78716c]"
        )}>{count}</span>
        {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ca8a04] shadow-[0_0_10px_rgba(202,138,4,0.5)]" />
        )}
    </button>
);
