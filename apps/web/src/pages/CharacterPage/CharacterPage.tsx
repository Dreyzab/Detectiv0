import { useDossierStore } from '@/features/detective/dossier/store';
import { VOICES, VOICE_GROUPS, GROUP_ORDER, type VoiceGroup } from '@/features/detective/lib/parliament';
import { getXpToNextVoiceLevel, RPG_CONFIG } from '@repo/shared/lib/rpg-config';

// Icons need to be mapped or we use group icons for now.
// Since we have 5 icons (Logic, Empathy, etc), we'll map Groups to these icons temporarily or reuse them.
import logicIcon from '@/shared/assets/icons/parliament/logic.png';
import empathyIcon from '@/shared/assets/icons/parliament/empathy.png';
import perceptionIcon from '@/shared/assets/icons/parliament/perception.png';
import authorityIcon from '@/shared/assets/icons/parliament/authority.png';
import occultIcon from '@/shared/assets/icons/parliament/occult.png';

// Mapping Groups to Icons (Best Fit Prototype)
const GROUP_ICONS: Record<VoiceGroup, string> = {
    intellect: logicIcon,    // Brain
    psyche: empathyIcon,     // Heart
    social: authorityIcon,   // Crown
    physical: perceptionIcon,// Eye (Observation/Body?) - Temporary fit
    shadow: perceptionIcon,  // Eye (Stealth/Observation) - Temporary fit
    spirit: occultIcon       // Star
};

// Localization
import { useVNStore } from '@/entities/visual-novel/model/store';
import { DETECTIVE_UI } from '@/features/detective/locales';
import { asLocale } from '@/features/quests/utils';

export function CharacterPage() {
    const { voiceStats, voiceXp, devPoints, spendDevPoint, xp, level: charLevel } = useDossierStore();

    // Localization
    const { locale } = useVNStore();
    const ui = DETECTIVE_UI[asLocale(locale)];

    // But actual Character Level is separate now (charLevel)

    return (
        <div className="min-h-screen bg-stone-900 text-amber-50 p-8 pt-24 font-serif">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Portrait & Core Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-stone-800/80 p-6 border border-amber-900/30 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />

                        <div className="aspect-[3/4] bg-stone-900 mb-6 border-2 border-stone-700 relative flex items-center justify-center">
                            {/* Placeholder for character portrait */}
                            <span className="text-stone-600 italic">{ui.char_portrait_unavailable}</span>
                            <div className="absolute inset-0 border border-amber-500/10 m-2" />
                        </div>

                        <h1 className="text-3xl font-display text-amber-100 mb-2 tracking-wide uppercase">{ui.char_title}</h1>

                        <div className="space-y-4 border-t border-stone-700 pt-4">
                            <div className="flex justify-between items-end">
                                <span className="text-stone-400 text-sm uppercase tracking-widest">{ui.char_rank_label}</span>
                                <span className="text-xl font-display text-amber-100">{ui.char_level_label} {charLevel}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-stone-400 text-sm uppercase tracking-widest">{ui.char_xp_label}</span>
                                <span className="text-stone-300 font-mono">{xp} XP</span>
                            </div>

                            {devPoints > 0 && (
                                <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded animate-pulse">
                                    <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-1">{ui.char_dev_points_title}</h3>
                                    <p className="text-amber-100 text-lg">{devPoints} Pts</p>
                                    <p className="text-amber-500/80 text-xs italic mt-1">{ui.char_dev_points_desc}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-stone-800/50 p-6 border border-stone-700">
                        <h3 className="text-amber-500 font-display uppercase tracking-widest text-sm mb-4">{ui.char_equipment_title}</h3>
                        <p className="text-stone-500 italic text-center py-8">{ui.char_equipment_empty}</p>
                    </div>
                </div>

                {/* Right Column: Parliament of Voices */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-stone-800/80 p-8 border border-amber-900/30 shadow-2xl relative">
                        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />

                        <h2 className="text-2xl font-display text-amber-100 mb-8 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-amber-500/50" />
                            {ui.char_parliament_title}
                            <span className="flex-1 h-[1px] bg-amber-500/50" />
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {GROUP_ORDER.map((groupId) => {
                                const group = VOICE_GROUPS[groupId];
                                const groupColor = group.color || '#a8a29e';
                                const groupIcon = GROUP_ICONS[groupId];

                                return (
                                    <div key={groupId} className="bg-stone-900/30 p-4 border border-stone-700/30 rounded-sm">
                                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-stone-700/50">
                                            <div className="w-8 h-8 rounded-full p-1 border border-stone-600/50" style={{ borderColor: groupColor }}>
                                                <img src={groupIcon} alt={group.label} className="w-full h-full object-contain opacity-70" />
                                            </div>
                                            <div>
                                                <h3 className="font-display text-lg leading-none" style={{ color: groupColor }}>{group.label}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {group.voices.map((voiceId) => {
                                                const voice = VOICES[voiceId];
                                                const level = voiceStats[voiceId] || 0;
                                                const currentXp = voiceXp?.[voiceId] || 0;
                                                const xpNeeded = getXpToNextVoiceLevel(level);
                                                const xpPercent = Math.min((currentXp / xpNeeded) * 100, 100);

                                                const isMaxLevel = level >= RPG_CONFIG.MAX_VOICE_LEVEL;

                                                return (
                                                    <div key={voiceId} className="group/voice bg-stone-900/20 p-2 rounded border border-transparent hover:border-stone-700 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-stone-300 text-sm font-medium group-hover/voice:text-amber-100 transition-colors" title={voice.description}>{voice.name}</span>
                                                                <span className="text-[10px] text-stone-600 uppercase tracking-wider">{level} / {RPG_CONFIG.MAX_VOICE_LEVEL}</span>
                                                            </div>

                                                            {devPoints > 0 && !isMaxLevel ? (
                                                                <button
                                                                    onClick={() => spendDevPoint(voiceId)}
                                                                    className="px-2 py-0.5 bg-amber-900/40 hover:bg-amber-700 text-amber-200 text-xs border border-amber-700 rounded transition-colors"
                                                                >
                                                                    +1
                                                                </button>
                                                            ) : (
                                                                <span className={`text-lg font-mono ${isMaxLevel ? 'text-amber-500' : 'text-stone-600'}`}>{level}</span>
                                                            )}
                                                        </div>

                                                        {/* XP Bar */}
                                                        {!isMaxLevel && (
                                                            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden relative">
                                                                <div
                                                                    className="h-full bg-stone-600 group-hover/voice:bg-amber-600/70 transition-all duration-500"
                                                                    style={{ width: `${xpPercent}%`, backgroundColor: groupColor }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Background / Bio */}
                    <div className="bg-stone-800/80 p-8 border border-amber-900/30 shadow-2xl relative">
                        <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5 mix-blend-overlay pointer-events-none" />
                        <h2 className="text-2xl font-display text-amber-100 mb-6 border-b border-stone-700 pb-4">{ui.char_background_title}</h2>
                        <div className="prose prose-invert prose-stone max-w-none text-stone-300">
                            <p>
                                {ui.char_background_text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
