import { useState } from 'react';
import { useDossierStore } from '@/features/detective/dossier/store';
import { VOICES, VOICE_GROUPS, GROUP_ORDER } from '@/features/detective/lib/parliament';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { DETECTIVE_UI } from '@/features/detective/locales';
import { asLocale } from '@/features/quests/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { FileText, Brain, Briefcase } from 'lucide-react';


// Tabs for the Dossier
type TabType = 'profile' | 'skills' | 'equipment';

export function CharacterPage() {
    const { voiceStats, devPoints, xp, level: charLevel } = useDossierStore();
    const { locale } = useVNStore();
    const ui = DETECTIVE_UI[asLocale(locale)];
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    // Prepare data for Radar Chart (aggregating by Group)
    // We calculate average level of voices in each group
    const radarData = GROUP_ORDER.map(groupId => {
        const group = VOICE_GROUPS[groupId];
        const voiceIds = group.voices;
        const totalLevel = voiceIds.reduce((sum, vid) => sum + (voiceStats[vid] || 0), 0);
        const avgLevel = voiceIds.length ? (totalLevel / voiceIds.length) : 0;

        return {
            subject: group.label,
            A: avgLevel,
            fullMark: 10, // Assuming max avg level is manageable for chart scale
            color: group.color
        };
    });

    return (
        <div className="min-h-screen bg-[#0c0a09] text-stone-200 font-serif pt-16 px-4 md:px-8 pb-20 overflow-hidden relative">
            {/* Background Texture - Manila Folder feel */}
            <div className="fixed inset-0 bg-[url('/images/paper-texture.png')] opacity-[0.08] pointer-events-none mix-blend-overlay" />
            <div className="fixed inset-0 bg-gradient-to-br from-stone-900 via-[#1c1917] to-[#0c0a09] -z-10" />

            {/* Header / Top Bar */}
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-amber-900/30 pb-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-heading text-amber-500 tracking-tight drop-shadow-md">
                        {ui.char_title}
                    </h1>
                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-1">
                        CONFIDENTIAL DOSSIER // REF-4922
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono text-stone-300">LVL {charLevel}</div>
                    <div className="text-xs text-amber-700/80 font-mono">{xp} XP</div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">

                {/* Left Sidebar - Tabs */}
                <nav className="flex md:flex-col gap-2 md:w-16 shrink-0 relative z-20">
                    <TabButton
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                        icon={FileText}
                        label="Bio"
                    />
                    <TabButton
                        active={activeTab === 'skills'}
                        onClick={() => setActiveTab('skills')}
                        icon={Brain}
                        label="Mind"
                    />
                    <TabButton
                        active={activeTab === 'equipment'}
                        onClick={() => setActiveTab('equipment')}
                        icon={Briefcase}
                        label="Gear"
                    />
                </nav>

                {/* Main Content Area - Folder Style */}
                <div className="flex-1 bg-[#1a1816] border border-stone-800 rounded-sm shadow-2xl relative overflow-hidden flex flex-col">
                    {/* Top Tab "Folder" cutout illusion could go here */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900/40 via-transparent to-amber-900/40 opacity-50" />

                    <div className="p-6 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <ProfileView ui={ui} />
                            )}
                            {activeTab === 'skills' && (
                                <SkillsView radarData={radarData} />
                            )}
                            {activeTab === 'equipment' && (
                                <EquipmentView />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Status Bar in Folder */}
                    <div className="bg-stone-950/50 p-2 border-t border-stone-800 flex justify-between items-center text-[10px] text-stone-600 font-mono uppercase px-4">
                        <span>Status: ACTIVE INVESTIGATION</span>
                        <span>{devPoints > 0 ? `${devPoints} UNSPENT POINTS` : 'NO PENDING UPGRADES'}</span>
                    </div>
                </div>

            </main>
        </div>
    );
}

// --- Sub Components ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`
            group flex flex-col items-center justify-center p-3 rounded-md transition-all duration-300
            ${active
                ? 'bg-amber-900/20 text-amber-500 border border-amber-900/40 shadow-[0_0_10px_rgba(245,159,10,0.1)]'
                : 'text-stone-600 hover:text-stone-300 hover:bg-stone-800/50'}
        `}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} className="mb-1" />
        <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">{label}</span>
    </button>
);

const ProfileView = ({ ui }: any) => (
    <motion.div
        key="profile"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="h-full flex flex-col gap-6"
    >
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait */}
            <div className="w-40 h-52 bg-stone-950 border-2 border-stone-800 flex items-center justify-center shrink-0 relative group self-center md:self-start rotate-1 shadow-lg transform transition-transform hover:rotate-0">
                <div className="absolute inset-0 bg-stone-800 opacity-20 bg-[url('/noise.png')]" />
                <span className="text-stone-700 font-display text-4xl opacity-50">?</span>
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d4d4d4] opacity-80 -rotate-2 mix-blend-overlay shadow-sm" />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-display text-stone-200 border-b border-stone-800 pb-2">
                    Detective Profile
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                        <span className="block text-amber-700/70 uppercase text-[10px] tracking-widest mb-1">Rank</span>
                        <span className="font-mono text-stone-300">Lieutenant</span>
                    </div>
                    <div>
                        <span className="block text-amber-700/70 uppercase text-[10px] tracking-widest mb-1">Affiliation</span>
                        <span className="font-mono text-stone-300">RCM</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-amber-700/70 uppercase text-[10px] tracking-widest mb-1">Biometrics</span>
                        <span className="font-mono text-stone-300">Male, 40s, Heavy Drinker</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-4">
            <h3 className="text-amber-600/80 font-display uppercase tracking-widest text-sm mb-3 border-b border-stone-800 pb-1">
                Background
            </h3>
            <p className="text-stone-400 leading-relaxed font-serif text-sm">
                {ui.char_background_text || "No background information available. Subject is suffering from retrograde amnesia."}
            </p>
        </div>
    </motion.div>
);

const SkillsView = ({ radarData }: any) => {
    // We need to access store again inside this component for mapping
    const { voiceStats, devPoints, spendDevPoint } = useDossierStore();

    return (
        <motion.div
            key="skills"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-8 h-full"
        >
            <div className="flex flex-col md:flex-row gap-8 h-full">

                {/* Radar Chart Area */}
                <div className="w-full md:w-1/2 min-h-[300px] md:h-full flex flex-col items-center justify-center bg-stone-950/30 rounded-lg p-4 border border-stone-800/50">
                    <h3 className="text-xs text-stone-500 uppercase tracking-widest mb-4 font-mono text-center w-full shrink-0">Psycho-Metric Profile</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#44403c" strokeDasharray="3 3" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: '#a8a29e', fontSize: 10, fontFamily: 'monospace' }}
                                />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="#f59f0a"
                                    strokeWidth={2}
                                    fill="#f59f0a"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skills List Area */}
                <div className="w-full md:w-1/2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-800">
                    <h3 className="text-xs text-amber-600/80 uppercase tracking-widest mb-4 font-mono sticky top-0 bg-[#1a1816] py-2 z-10">
                        Parliament of Voices
                    </h3>

                    <div className="space-y-6">
                        {GROUP_ORDER.map(groupId => {
                            const group = VOICE_GROUPS[groupId];
                            const groupColor = group.color || '#a8a29e';

                            return (
                                <div key={groupId}>
                                    <div className="flex items-center gap-2 mb-2 group opacity-80 hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColor }} />
                                        <h4 className="text-sm font-display text-stone-300" style={{ color: groupColor }}>{group.label}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 pl-4 border-l border-stone-800">
                                        {group.voices.map(voiceId => {
                                            const voice = VOICES[voiceId];
                                            const level = voiceStats[voiceId] || 0;

                                            return (
                                                <div key={voiceId} className="flex justify-between items-center py-1 group/item">
                                                    <span className="text-stone-500 text-xs font-serif group-hover/item:text-stone-300 transition-colors" title={voice.description}>
                                                        {voice.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {/* Dots for visual level */}
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-1 h-1 rounded-full ${i < level ? 'bg-amber-500/70' : 'bg-stone-800'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {devPoints > 0 && (
                                                            <button
                                                                onClick={() => spendDevPoint(voiceId)}
                                                                className="text-[10px] text-amber-500 hover:text-amber-400 opacity-0 group-hover/item:opacity-100 transition-opacity px-1 border border-amber-900/50 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );

}


const EquipmentView = () => (
    <motion.div
        key="equipment"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="h-full flex flex-col items-center justify-center text-center p-8"
    >
        <Briefcase size={48} className="text-stone-800 mb-4" />
        <h3 className="text-stone-500 font-display uppercase tracking-widest text-lg mb-2">Evidence Locker Empty</h3>
        <p className="text-stone-600 text-sm max-w-xs leading-relaxed">
            Your pockets are empty, detective. Go out there and find something that matters.
        </p>
    </motion.div>
);
