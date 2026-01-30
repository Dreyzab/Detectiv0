import { useDossierStore } from '@/features/detective/dossier/store';
import { useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';

export const NotebookWidget = () => {
    const { entries, evidence } = useDossierStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'notes' | 'evidence'>('notes');
    const [search, setSearch] = useState('');

    const filteredEntries = entries
        .filter(e => e.type === 'note' || e.type === 'clue') // consistency
        .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase()))
        // Sort by timestamp if available, else generic sort
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    const filteredEvidence = evidence
        .filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 z-[300] bg-[#2a2420] text-[#d4c5a3] p-3 rounded-full border border-[#d4c5a3]/50 shadow-xl hover:bg-[#d4c5a3] hover:text-[#1a1612] transition-all"
                title="Open Notebook"
            >
                <BookOpen size={24} />
                {/* Badge for new items could go here */}
            </button>
        );
    }

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 z-[300] bg-[#1a1612] border-l border-[#d4c5a3]/30 shadow-2xl flex flex-col font-serif">
            {/* Header */}
            <div className="p-4 border-b border-[#d4c5a3]/20 flex items-center justify-between bg-[#0c0a09]">
                <h2 className="text-xl text-[#d4c5a3] tracking-widest uppercase font-bold flex items-center gap-2">
                    <BookOpen size={20} />
                    Notebook
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-[#a8a29e] hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Search */}
            <div className="p-4 bg-[#1c1917]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#2a2420] border border-[#44403c] rounded-md pl-10 pr-4 py-2 text-[#e5e5e5] placeholder-gray-500 focus:outline-none focus:border-[#d4c5a3]"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#d4c5a3]/20">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${activeTab === 'notes' ? 'bg-[#2a2420] text-[#d4c5a3] border-b-2 border-[#d4c5a3]' : 'text-[#a8a29e] hover:bg-[#2a2420]/50'}`}
                >
                    Notes ({filteredEntries.length})
                </button>
                <button
                    onClick={() => setActiveTab('evidence')}
                    className={`flex-1 py-3 text-sm uppercase tracking-wider transition-colors ${activeTab === 'evidence' ? 'bg-[#2a2420] text-[#d4c5a3] border-b-2 border-[#d4c5a3]' : 'text-[#a8a29e] hover:bg-[#2a2420]/50'}`}
                >
                    Evidence ({filteredEvidence.length})
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'notes' ? (
                    filteredEntries.length === 0 ? (
                        <p className="text-[#57534e] text-center italic mt-10">No notes recorded yet.</p>
                    ) : (
                        filteredEntries.map((entry) => (
                            <div key={entry.id} className="bg-[#2a2420]/50 border border-[#d4c5a3]/20 p-3 rounded hover:border-[#d4c5a3]/50 transition-colors cursor-default">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs px-1.5 py-0.5 rounded border uppercase tracking-tighter ${entry.type === 'clue' ? 'border-amber-500/50 text-amber-500 bg-amber-950/30' : 'border-yellow-200/30 text-yellow-200/70'
                                        }`}>
                                        {entry.type}
                                    </span>
                                    <span className="text-[10px] text-[#78716c]">{new Date(entry.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h3 className="text-[#e5e5e5] font-medium leading-tight mb-1">{entry.title}</h3>
                                <p className="text-sm text-[#a8a29e] line-clamp-3 leading-snug">{entry.content}</p>
                            </div>
                        ))
                    )
                ) : (
                    filteredEvidence.length === 0 ? (
                        <p className="text-[#57534e] text-center italic mt-10">No physical evidence collected.</p>
                    ) : (
                        filteredEvidence.map((item) => (
                            <div key={item.id} className="bg-[#1e1b18] border border-amber-900/30 p-3 flex gap-3 items-center">
                                {/* Icon placeholder */}
                                <div className="w-10 h-10 bg-amber-950/50 flex items-center justify-center border border-amber-900/50">
                                    <span className="text-xl">📦</span>
                                </div>
                                <div>
                                    <h3 className="text-amber-100 font-medium">{item.name}</h3>
                                    <p className="text-xs text-amber-500/80">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};
