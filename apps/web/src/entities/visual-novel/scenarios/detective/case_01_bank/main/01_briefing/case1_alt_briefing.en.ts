import type { VNContentPack } from '../../../../../model/types';

/**
 * Case 1 Alt Briefing — English Content (Fallback)
 * 
 * NOTE: Unleashed requested "German only" for this scenario.
 * We are using the German content here to ensure the scenario loads
 * even if the app's locale is set to 'en'.
 */

export const CASE1_ALT_BRIEFING_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        // ═══════════════════════════════════════════════════════════════
        // ACT 1: ANKUNFT AM BAHNHOF
        // ═══════════════════════════════════════════════════════════════
        'arrival_platform': {
            text: '[[Freiburg Hauptbahnhof]]. Dampfwolken steigen von den Lokomotiven auf.'
        },
        'platform_atmosphere': {
            text: 'Menschen eilen vorbei. Das Geräusch von Kutschen mischt sich mit dem Klirren der Schienen.'
        },
        'police_approach': {
            text: 'Zwei Polizisten kommen auf mich zu. Sie haben mich sofort erkannt.',
            choices: {}
        },
        'police_briefing': {
            text: '„Herr Detektiv, gut, dass Sie da sind. Wir haben einen [[Banküberfall]] – professionell, keine Zeugen, kaum Spuren. Wir brauchen Ihre Hilfe."',
            choices: {
                'ask_details': '„Was ist genau passiert?"',
                'go_immediately': '„Bringen Sie mich zum Tatort."'
            }
        },
        'briefing_details': {
            text: '„Die Bank wurde in der Nacht überfallen. Keine Schüsse, keine Gewalt gegen Kunden. Die Polizei vermutet [[Insiderwissen]]."'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 2: FAHRT ZUM TATORT
        // ═══════════════════════════════════════════════════════════════
        'transition_to_bank': {
            text: 'Die Polizisten bringen mich direkt zum Tatort. Eine elegante Bankfiliale in der Freiburger Innenstadt.'
        },
        'bank_arrival': {
            text: 'Die Stadt ist herbstlich trüb. Die Kopfsteinpflaster glänzen vom Regen. Vor dem [[Bankhaus J.A. Krebs]] herrscht geschäftiges Treiben.'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 3: BEGEGNUNG MIT CLARA
        // ═══════════════════════════════════════════════════════════════
        'notice_argument': {
            text: 'Eine junge Frau unterhält sich lautstark mit einem uniformierten Beamten. Sie wirkt aufgebracht, aber ihre Haltung ist kontrolliert. Fast herausfordernd.'
        },
        'ask_about_clara': {
            text: '„Das ist [[Clara von Altenburg]], die Tochter des Bürgermeisters. Sie studiert Medizin, aber... sie hat eine seltsame Faszination für Kriminologie entwickelt, seit ihr Mann gestorben ist."'
        },
        'clara_confronts': {
            text: '„Und Sie, mein Herr? Wer sind Sie, dass Sie hier an einem Tatort wie diesem stehen und Fragen stellen?"',
            choices: {
                'respond_professional': '„Mein Name ist Vance. Ich wurde von der Polizei hinzugezogen, um bei diesem Fall zu ermitteln."',
                'respond_curious': '„Jemand, der sich wundert, warum die Tochter des Bürgermeisters an einem Tatort wie diesem ist."',
                'respond_direct': '„Ein Privatdetektiv, der versucht, einen Fall zu lösen, während die Zeit davonläuft."'
            }
        },
        'clara_react_professional': {
            text: 'Sie nickt knapp. Eine Spur von Respekt ist in ihrem Blick zu erkennen.'
        },
        'clara_react_curious': {
            text: 'Ihre Augen blitzen auf — eine Mischung aus Ärger und einer gewissen Amüsiertheit.'
        },
        'clara_react_direct': {
            text: 'Sie mustert mich nachdenklich. Die direkte Fokussierung auf den Fall scheint ihren eigenen Drang nach Gerechtigkeit anzusprechen.'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 4: CLARAS BEOBACHTUNGEN
        // ═══════════════════════════════════════════════════════════════
        'clara_introduces': {
            text: '„Mein Name ist Clara von Altenburg. Und ich bin hier, weil die Herren der Polizei offensichtlich nicht die richtigen Schlüsse ziehen."'
        },
        'clara_observation_1': {
            text: '„Die [[Fenster]] waren nicht eingeschlagen, sondern geöffnet. Nicht aufgebrochen, sondern einfach… entriegelt. Die angeblichen Aufbruchspuren an der [[Tresortür]]? Zu grob. Fast wie inszeniert."'
        },
        'officer_interrupts': {
            text: '„Gnädiges Fräulein, Sie sollten sich nicht einmischen! Das ist Polizeisache!"'
        },
        'detective_intervenes': {
            text: 'Ich hebe eine Hand und weise den Beamten damit in die Schranken. „Lassen Sie sie reden. Ich bin ganz Ohr."'
        },
        'clara_continues': {
            text: '„Die Art, wie die [[Akten]] durchwühlt wurden — chaotisch, aber... verdächtig zielgerichtet. Als ob jemand wusste, was er suchte."'
        },
        'clara_smell_clue': {
            text: '„Und dann ist da noch die Sache mit dem [[Geruch]]…"',
            choices: {
                'enter_bank': '„Zeigen Sie mir, was Sie gefunden haben."'
            }
        },
        'briefing_exit': {
            text: 'Clara führt mich zum Eingang der Bank. Die Untersuchung beginnt jetzt.'
        }
    }
};

export default CASE1_ALT_BRIEFING_EN;
