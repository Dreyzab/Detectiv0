import type { VoiceId } from '@/features/detective/lib/parliament';
import { DEFAULT_PACK_ID } from '@repo/shared/data/pack-meta';

export interface VoiceCommentary {
    voiceId: VoiceId;
    threshold: number;
    text: string;
}

export interface KeywordTooltip {
    id: string;
    title: string;          // e.g. "Disturbing Reports"
    fact: string;           // Lorem ipsum / Wiki style text
    voices: VoiceCommentary[];
}

export const PARLIAMENT_TOOLTIP_REGISTRY: Record<string, KeywordTooltip> = {
    'disturbing reports': {
        id: 'disturbing_reports',
        title: 'Disturbing Reports',
        fact: 'Official communiques from Freiburg indicate a localized spike in criminal activity centered around the Altstadt region. Local constabulary describes the situation as "unprecedented but contained."',
        voices: [
            {
                voiceId: 'logic',
                threshold: 2,
                text: 'The frequency of these reports is statistically anomalous. Three major incidents in one week suggests coordination.'
            },
            {
                voiceId: 'perception', // Was 'shivers', mapped to perception
                threshold: 4,
                text: 'The cobblestones are vibrating. Something ancient is stirring beneath the Münster.'
            },
            {
                voiceId: 'authority',
                threshold: 3,
                text: 'They are afraid. You can smell the fear in the ink of the report. They need a leader.'
            }
        ]
    },
    'Bankhaus J.A. Krebs': {
        id: 'bank_krebs',
        title: 'Bankhaus J.A. Krebs',
        fact: 'Established 1721. One of the oldest private banks in Baden. Known for serving the Catholic bourgeoisie and holding significant assets of the Archdiocese.',
        voices: [
            {
                voiceId: 'encyclopedia', // Was 'knowledge'
                threshold: 3,
                text: 'A fortress of old money. Their vaults are designed to withstand artillery, not just thieves.'
            },
            {
                voiceId: 'tradition', // Was 'honor'
                threshold: 2,
                text: 'A place where promises are kept. Or broken in secret.'
            }
        ]
    },
    'political motives': {
        id: 'political_motives',
        title: 'Political Motives',
        fact: 'Freiburg is a hotbed of tension between the conservative Centre Party, the rising Social Democrats, and various student fraternities.',
        voices: [
            {
                voiceId: 'charisma', // Was 'rhetoric'
                threshold: 3,
                text: 'Ideology is just a costume for ambition. Listen to *who* benefits, not what they say.'
            },
            {
                voiceId: 'empathy', // Was 'solidarity'
                threshold: 3,
                text: 'The workers are restless. If this was a political strike, we would have heard the songs.'
            }
        ]
    },
    'Mayor Thoma': {
        id: 'mayor_thoma',
        title: 'Mayor Otto Winterer',
        fact: 'Leader of the city administration. Known for his modernization projects and "Golden Days" policies.',
        voices: [
            {
                voiceId: 'authority',
                threshold: 1,
                text: 'He holds the keys. Respect the hierarchy, but do not bow too low.'
            },
            {
                voiceId: 'deception', // Was 'suggestion'
                threshold: 4,
                text: 'He is hiding something. A nervous tic in his signature? A hesitation in his decree?'
            }
        ]
    },
    // ═══════════════════════════════════════════════════════════════
    // GERMAN KEYWORDS (Alt Briefing)
    // ═══════════════════════════════════════════════════════════════
    'Insiderwissen': {
        id: 'insider_knowledge',
        title: 'Insiderwissen',
        fact: 'Ein Überfall ohne Gewaltspuren deutet auf intime Kenntnis der Banksicherheit hin. Jemand kannte die Kombination oder hatte einen Schlüssel.',
        voices: [
            {
                voiceId: 'logic',
                threshold: 2,
                text: 'Kein Einbruch — ein Einlass. Die Statistik sagt: 70% aller Banküberfälle haben interne Helfer.'
            },
            {
                voiceId: 'deception',
                threshold: 3,
                text: 'Jemand in dieser Bank hat gelogen. Und wird wieder lügen.'
            }
        ]
    },
    'Clara von Altenburg': {
        id: 'clara_altenburg',
        title: 'Clara von Altenburg',
        fact: 'Tochter des Bürgermeisters. Medizinstudentin und Witwe. Bekannt für ihre unkonventionelle Faszination für Kriminologie.',
        voices: [
            {
                voiceId: 'empathy',
                threshold: 2,
                text: 'Sie trägt Trauer wie eine Rüstung. Der Tod ihres Mannes hat sie nicht gebrochen — er hat sie geschärft.'
            },
            {
                voiceId: 'encyclopedia',
                threshold: 3,
                text: 'Eine der wenigen Frauen, die Medizin studieren dürfen. Das spricht für Charakterstärke... oder mächtige Verbindungen.'
            }
        ]
    },
    'Geruch': {
        id: 'smell_clue',
        title: 'Der verdächtige Geruch',
        fact: 'Ein chemischer Geruch am Tatort kann auf spezielle Werkzeuge oder hinterlassene Substanzen hinweisen.',
        voices: [
            {
                voiceId: 'senses',
                threshold: 3,
                text: 'Bittere Mandeln? Nicht Zyankali — etwas Industrielles. Äther? Chloroform? Nitroglyzerin-Rückstände?'
            },
            {
                voiceId: 'intuition',
                threshold: 2,
                text: 'Dieser Geruch gehört nicht hierher. Er erzählt eine Geschichte, die niemand sonst hören kann.'
            }
        ]
    },
    'Fenster': {
        id: 'window_clue',
        title: 'Das entriegelte Fenster',
        fact: 'Ein nicht eingeschlagenes, sondern entriegeltes Fenster deutet auf Zugang von innen oder einen Komplizen.',
        voices: [
            {
                voiceId: 'perception',
                threshold: 2,
                text: 'Keine Splitter. Keine Kratzer am Rahmen. Dieses Fenster wurde geöffnet, nicht aufgebrochen.'
            },
            {
                voiceId: 'logic',
                threshold: 3,
                text: 'Jemand musste es von innen öffnen. Oder einen Schlüssel haben. Die Liste der Verdächtigen wird kürzer.'
            }
        ]
    },
    'Banküberfall': {
        id: 'bank_robbery',
        title: 'Der Banküberfall',
        fact: 'In der Nacht wurde das Bankhaus J.A. Krebs überfallen. Keine Gewalt, keine Zeugen, professionelle Ausführung.',
        voices: [
            {
                voiceId: 'logic',
                threshold: 1,
                text: 'Zu sauber. Zu präzise. Das ist kein gewöhnlicher Raubüberfall — das ist ein Auftrag.'
            },
            {
                voiceId: 'authority',
                threshold: 2,
                text: 'Die Polizei ist ratlos. Sie brauchen jemanden, der außerhalb des Systems denkt.'
            }
        ]
    }
};

export const TOOLTIP_SETS: Record<string, Record<string, KeywordTooltip>> = {
    fbg1905: PARLIAMENT_TOOLTIP_REGISTRY,
    ka1905: {
        // ── Karlsruhe Sandbox Keywords ────────────────────
        'kw_kaiserstrasse': {
            id: 'kw_kaiserstrasse',
            title: 'Kaiserstraße',
            fact: 'The grand boulevard of Karlsruhe, stretching from the Schloss gardens to the Durlacher Tor. By 1905, electric trams run its length, and the gaslights are being replaced with modern electric lamps.',
            voices: [
                { voiceId: 'logic', threshold: 0, text: 'A key commercial artery. Many suspects will frequent this street.' },
                { voiceId: 'empathy', threshold: 0, text: 'The heart of the city. People reveal themselves in how they walk it — hurried, leisurely, or furtive.' }
            ]
        },
        'kw_gambling_culture': {
            id: 'kw_gambling_culture',
            title: 'Spielkultur',
            fact: 'Gambling in Baden has a long tradition, from the grand Casino in Baden-Baden to underground card rooms. By 1905, many young men of means are drawn to discreet establishments.',
            voices: [
                { voiceId: 'logic', threshold: 0, text: 'Where there is gambling, there is debt. Debt creates leverage — and suspects.' },
                { voiceId: 'empathy', threshold: 0, text: 'Addiction is a powerful force. Understanding it may be key to understanding the son\'s behavior.' }
            ]
        },
        'kw_ectoplasm': {
            id: 'kw_ectoplasm',
            title: 'Ektoplasma',
            fact: 'A term coined by Charles Richet in 1894. Claimed to be a substance produced by mediums during séances. By 1905, both believers and skeptics debate its existence fiercely.',
            voices: [
                { voiceId: 'logic', threshold: 0, text: 'Science has no consensus. We must gather our own evidence before drawing conclusions.' },
                { voiceId: 'empathy', threshold: 0, text: 'Whether real or not, the fear it causes is genuine. The estate staff are terrified.' }
            ]
        },
        'kw_guild': {
            id: 'kw_guild',
            title: 'Ermittlergilde',
            fact: 'The regional Investigators Guild maintains a network of seasoned detectives and retired police officers. Membership grants access to forensic tools, informants, and case archives.',
            voices: [
                { voiceId: 'logic', threshold: 0, text: 'The Guild Master has decades of experience. His counsel will be invaluable for complex cases.' },
                { voiceId: 'empathy', threshold: 0, text: 'A mentor can see what we miss. His perspective may reveal blind spots in our approach.' }
            ]
        },
        'kw_schlossgarten': {
            id: 'kw_schlossgarten',
            title: 'Schlossgarten',
            fact: 'The palace gardens of Karlsruhe, radiating from the Schloss in a fan-shaped design. A popular retreat for citizens, with ancient oaks and winding paths.',
            voices: [
                { voiceId: 'logic', threshold: 0, text: 'A large area with many hiding spots. Useful for discreet meetings — or missing dogs.' },
                { voiceId: 'empathy', threshold: 0, text: 'Nature soothes the troubled mind. Perhaps there is a reason the dog comes here.' }
            ]
        }
    }
};

export const getTooltipSet = (packId?: string): Record<string, KeywordTooltip> =>
    TOOLTIP_SETS[packId ?? DEFAULT_PACK_ID] ?? TOOLTIP_SETS[DEFAULT_PACK_ID];


/**
 * Helper to normalize keys (case insensitive lookup)
 */

export function getTooltipContent(key: string, packId?: string): KeywordTooltip | null {
    const set = getTooltipSet(packId);

    // 1. Try exact match
    if (set[key]) return set[key];

    // 2. Try lower case
    const lower = key.toLowerCase();
    const entry = Object.entries(set).find(([k]) => k.toLowerCase() === lower);

    if (entry) {
        return entry[1];
    }

    // 3. If not found in a non-default set, fallback to default pack set.
    if (packId && packId !== DEFAULT_PACK_ID) {
        return getTooltipContent(key, DEFAULT_PACK_ID);
    }

    return null;
}

