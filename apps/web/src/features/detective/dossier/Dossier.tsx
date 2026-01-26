import { useDossierStore } from './store';
import { cn } from '../../../shared/lib/utils';
import { useState } from 'react';
import { useInventoryStore } from '../../../entities/inventory/model/store';
import { VOICE_GROUPS, VOICES, GROUP_ORDER } from '../lib/parliament';

export const Dossier = () => {
    const { entries, evidence, pointStates } = useDossierStore();
    const { voiceLevels } = useInventoryStore();
    const [activeTab, setActiveTab] = useState<'facts' | 'evidence' | 'map' | 'voices'>('facts');

    return (
        <div className="fixed top-20 right-4 w-80 h-[600px] bg-[#fdfbf7] shadow-2xl rounded-sm border border-[#d4c5a3] flex flex-col font-serif overflow-hidden z-20 rotate-1 transform hover:rotate-0 transition-transform duration-300">
            {/* Header / Binding */}
            <div className="h-12 bg-[#2c1810] flex items-center justify-center relative shadow-md">
                <h2 className="text-[#d4c5a3] font-bold text-lg tracking-widest uppercase">Case File #1</h2>
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#1a0f0a]" /> {/* Spine */}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#d4c5a3] bg-[#f4ebd0] overflow-x-auto shrink-0 no-scrollbar">
                {(['facts', 'evidence', 'map', 'voices'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-2 text-[10px] uppercase font-bold tracking-wider text-[#5c4d3c] hover:bg-[#eaddcf] min-w-[60px] border-r border-[#d4c5a3]/30 last:border-r-0",
                            activeTab === tab && "bg-[#fdfbf7] text-[#2c1810] border-t-2 border-[#2c1810]"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-[url('/images/paper-texture.png')] bg-contain">
                {activeTab === 'facts' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        {entries.length === 0 && <p className="italic text-gray-500 text-sm">No facts recorded yet.</p>}
                        {entries.map(entry => (
                            <div key={entry.id} className="border-b border-[#d4c5a3] pb-2">
                                <h3 className="font-bold text-[#2c1810]">{entry.title}</h3>
                                <p className="text-sm text-[#4a3b2a] leading-relaxed">{entry.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'evidence' && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                        {evidence.length === 0 && <p className="italic text-gray-500 text-sm col-span-2">No evidence collected.</p>}
                        {evidence.map(item => (
                            <div key={item.id} className="border border-[#d4c5a3] p-2 bg-[#f4ebd0] shadow-sm">
                                <div className="font-bold text-xs text-[#2c1810]">{item.name}</div>
                                <div className="text-[10px] text-[#5c4d3c] italic">{item.description}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <h3 className="font-bold text-[#2c1810] mb-2 border-b border-[#d4c5a3]">Known Locations</h3>
                        <ul className="space-y-2">
                            {Object.entries(pointStates).map(([id, state]) => (
                                state !== 'locked' && (
                                    <li key={id} className="text-sm text-[#4a3b2a] flex justify-between items-center group">
                                        <span className="group-hover:translate-x-1 transition-transform">{id}</span>
                                        <span className={cn(
                                            "text-[10px] px-1 rounded uppercase tracking-tighter border",
                                            state === 'completed' ? "bg-green-100 text-green-800 border-green-200" : "bg-blue-100 text-blue-800 border-blue-200"
                                        )}>
                                            {state}
                                        </span>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'voices' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        {GROUP_ORDER.map(gId => {
                            const group = VOICE_GROUPS[gId];
                            return (
                                <div key={gId} className="space-y-2">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest border-b border-[#d4c5a3]" style={{ color: group.color }}>
                                        {group.label}
                                    </h4>
                                    <div className="space-y-2">
                                        {group.voices.map(vId => {
                                            const voice = VOICES[vId];
                                            const level = voiceLevels[vId] || 0;
                                            return (
                                                <div key={vId} className="group">
                                                    <div className="flex justify-between text-[10px] mb-1">
                                                        <span className="font-bold text-[#4a3b2a]">{voice.name}</span>
                                                        <span className="font-mono text-[#8c7b6c]">LVL {level}</span>
                                                    </div>
                                                    <div className="h-1 bg-[#d4c5a3]/30 overflow-hidden relative">
                                                        <div
                                                            className="h-full transition-all duration-1000 ease-out"
                                                            style={{
                                                                width: `${Math.min(level * 10, 100)}%`,
                                                                backgroundColor: group.color
                                                            }}
                                                        />
                                                    </div>
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

            {/* Footer */}
            <div className="p-2 border-t border-[#d4c5a3] text-center text-[10px] text-[#8c7b6c] uppercase bg-[#f4ebd0]/50 sticky bottom-0">
                Freiburg Police Dept. • 1905
            </div>
        </div>
    );
};
