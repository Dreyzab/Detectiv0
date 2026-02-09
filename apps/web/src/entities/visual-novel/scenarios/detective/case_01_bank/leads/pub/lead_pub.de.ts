import type { VNContentPack } from '../../../../../model/types';

export const LEAD_PUB_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'entrance': {
            text: 'Das Gasthaus "Zum Schlappen" ist laut, verraucht und misstrauisch. Alt-Gustav sitzt in der Ecke, wahrend der Wirt jeden Fremden mustert.',
            choices: {
                'follow_night_guard_rumor': 'Claras Spur zum Nachtwachen-Gerucht verfolgen.',
                'approach_gustav': 'Gustav direkt ansprechen.',
                'ask_barkeep': 'Zuerst den Wirt befragen.',
                'eavesdrop': 'Arbeitern am Nachbartisch zuhoren.'
            }
        },
        'pub_night_guard_path': {
            text: 'Der Wirt tippt mit dem Kinn zu Gustav. "Wenn Sie Augen fur den Morgengrauen-Dienst suchen, beginnen Sie bei ihm."'
        },

        'gustav_intro': {
            text: 'Gustav blickt langsam auf. Kanalwasser hat seine Hande fruher altern lassen als sein Gesicht.'
        },
        'gustav_suspicious': {
            text: '"Sie sind nicht von hier. Warum fragen Sie den alten Gustav aus?"',
            choices: {
                'mention_hartmann_payments': '"Hartmann soll Geld uber Mittelsmanner bewegt haben. Sagt Ihnen das was?"',
                'charisma_buy_drink': '[Charisma] "Die nachste Runde geht auf mich."',
                'authority_badge': '[Autoritat] "Polizeibefragung. Kooperieren Sie."',
                'leave_gustav': 'Vorerst zuruckziehen.'
            }
        },
        'gustav_hartmann_reply': {
            text: 'Gustav kneift die Augen zusammen. "Der Name fiel bei Laufburschen vor Tagesanbruch. Geld lief still, nicht sauber."'
        },
        'gustav_charisma_success': {
            text: 'Bei dem Angebot wird er weicher. "Schon gut. Ich sage Ihnen, was ich sah."'
        },
        'gustav_charisma_fail': {
            text: '"Mit Fremden trinke ich nicht." Er dreht sich weg.'
        },
        'gustav_authority_success': {
            text: 'Er versteift sich. "Kein Arger, Inspektor. Ich rede."'
        },
        'gustav_clams_up': {
            text: '"Polizei? Dann habe ich nichts gesehen."'
        },
        'gustav_reveals': {
            text: '"In der Raubnacht putzte ich an der Fischerau. Sah eine dunkle Gestalt am Bankgerust. Bewegte sich wie jemand von der Buhne."'
        },
        'gustav_description': {
            text: '"Dann Richtung Stuhlinger. Schnell, geubt, ohne Zogern."'
        },

        'barkeep_intro': {
            text: 'Der Wirt poliert ein Glas, ohne den Blick von Ihnen zu nehmen.',
            choices: {
                'barkeep_ask_gustav': '"Wer ist der alte Mann?"',
                'barkeep_ask_rumors': '"Welche Geruchte kursieren?"',
                'ask_previous_investigator': '"Ein fruherer Ermittler ist verschwunden. War er hier?"'
            }
        },
        'barkeep_points_gustav': {
            text: '"Das ist Gustav, der Bachleputzer. Fruhschicht, scharfe Augen, lose Zunge nach Schnaps."'
        },
        'barkeep_rumors': {
            text: '"Geruchte gibt es viele. Nur wenige uberleben den Kontakt mit Fakten."'
        },
        'barkeep_previous_investigator': {
            text: 'Er senkt die Stimme. "Ja. Fragte nach Bankgerusten und verschwand dann von dieser Route."'
        },

        'eavesdrop': {
            text: 'Sie bleiben still und lassen den Raum um Sie herum sprechen.'
        },
        'eavesdrop_content': {
            text: '"...Nachtwache wurde bezahlt... Einstieg uber Gerust sah sauber aus..."'
        }
    }
};

export default LEAD_PUB_DE;
