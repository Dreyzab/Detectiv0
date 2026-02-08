import type { VNContentPack } from '../../../../../model/types';

export const CASE1_BANK_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        // ─────────────────────────────────────────────────────────────
        // ANKUNFT
        // ─────────────────────────────────────────────────────────────
        'arrival': {
            text: 'Bankhaus J.A. Krebs. Der Tatort. Die Morgenluft ist kalt.',
            choices: {
                'enter_solo': 'Zeit, an die Arbeit zu gehen.',
                'enter_duo': 'Gehen wir hinein, Victoria.'
            }
        },
        'scene_solo_entry': {
            text: 'Ich stoße die schweren Türen auf. Die Stille drinnen ist beklemmend. Ich arbeite anfangs lieber allein.'
        },
        'scene_duo_entry': {
            text: 'Wir betreten das Gebäude gemeinsam. Victoria schaut sich um, unbeeindruckt von der Pracht oder der Anspannung.'
        },
        'victoria_interrupts': {
            text: 'Herr Inspektor! Warten Sie! Fangen Sie nicht ohne mich an!'
        },
        'victoria_intro_dialogue': {
            text: 'Ich bin [[Victoria Sterling]]. Mein Onkel... der Bürgermeister... bestand darauf, dass ich Ihnen helfe. Ich verspreche, nicht im Weg zu sein.',
            choices: {
                'react_mockery': 'Das ist eine Ermittlung, kein Mädchenpensionat.',
                'react_surprise': 'Ich hätte nicht erwartet, dass die Verwandtschaft des Bürgermeisters sich die Hände schmutzig macht.',
                'react_interest': 'Mal sehen, ob Sie den Blick für diese Arbeit haben.'
            }
        },
        'react_mockery_res': { text: 'Ich habe alle Ihre Fallakten gelesen, Herr Inspektor. Unterschätzen Sie mich nicht.' },
        'react_surprise_res': { text: 'Überraschungen können in unserem Metier nützlich sein, Herr Inspektor.' },
        'react_interest_res': { text: 'Ich werde Sie nicht enttäuschen. Übrigens habe ich schon etwas gefunden.' },

        // ─────────────────────────────────────────────────────────────
        // HAUPTHALLE
        // ─────────────────────────────────────────────────────────────
        'bank_hub': {
            text: 'Die [[große Halle]] des Bankhauses Krebs ist ungewöhnlich still. Herr [[Galdermann]] steht bei seinem Büro. Ein [[nervöser Angestellter]] zappelt am Schalter. Die [[schwere Tresortür]] steht einen Spalt offen.',
            choices: {
                'speak_manager': 'Mit Herrn Galdermann sprechen',
                'speak_clerk': 'Den Angestellten befragen',
                'inspect_vault': 'Den Tresor untersuchen',
                'conclude_investigation': 'Ich habe hier genug gesehen.'
            }
        },

        // ─────────────────────────────────────────────────────────────
        // DIALOG MIT DEM DIREKTOR
        // ─────────────────────────────────────────────────────────────
        'manager_intro': {
            text: 'Herr Galdermann mustert Sie mit der einstudierten Wärme eines Mannes, der Schuldnern zulächelt, bevor er sie pfändet.',
            choices: {
                'manager_confront_seed': 'Ihr Name fiel schon, bevor ich diese Bank erreichte.',
                'manager_open_case': 'Beginnen wir mit dem Zeitablauf.'
            }
        },
        'manager_seed_reaction': {
            text: 'Ein Flackern huscht über sein Gesicht. „Ich bin bekannt in Freiburg. Das beweist überhaupt nichts.“'
        },
        'manager_about_robbery': {
            text: '„Ein bedauerlicher Vorfall, Herr Inspektor. Der Tresor wurde gewaltlos geöffnet. Zweifellos ein Insiderjob. Ich empfehle Ihnen, das Personal zu befragen."',
            choices: {
                'manager_press_hartmann': 'Hartmann erscheint in mehreren Spuren. Erklären Sie das.',
                'manager_request_statements': 'Ich will die unverfälschten Aussagen, keine Zusammenfassungen.'
            }
        },
        'manager_hartmann_reaction': {
            text: '„[[Hartmann]] ist ein routinierter Angestellter. Klatsch bauscht gewöhnliche Namen auf.“'
        },
        'manager_dismissive': {
            text: '„Und nun entschuldigen Sie mich bitte, ich muss Kunden beruhigen. Die Polizei hat bereits alle [[Aussagen]] aufgenommen, die sie braucht."'
        },

        // ─────────────────────────────────────────────────────────────
        // VERHÖR DES ANGESTELLTEN
        // ─────────────────────────────────────────────────────────────
        'clerk_intro': {
            text: 'Der junge Angestellte — [[Ernst Vogel]], laut seinem Namensschild — sieht aus, als hätte er seit Tagen nicht geschlafen. Seine Hände zittern, während er Papiere sortiert.'
        },
        'clerk_nervous': {
            text: '„Ich... Ich hatte Nachtdienst, Herr Inspektor. Ich schwöre, ich habe [[den Tresor abgeschlossen]]! Aber heute Morgen stand er einfach... offen. Wie von Zauberhand."',
            choices: {
                'ask_about_hartmann': 'Wer genau ist dieser Hartmann in Ihrem Betrieb?',
                'ask_about_box_217': 'Was war im Schließfach 217?',
                'read_clerk_empathy': '[Empathie] Er verbirgt etwas. Seine Angst lesen.',
                'press_clerk': 'Sie erwarten, dass ich glaube, Magie hat den Tresor geöffnet?',
                'leave_clerk': 'Das wäre vorerst alles.'
            }
        },
        'clerk_hartmann_response': {
            text: '„Zugriff auf die Hauptbücher. Vertrauenswürdig. In letzter Zeit bekam [[Hartmann]] fast täglich versiegelte Briefe.“'
        },
        'clerk_box217_response': {
            text: '„Die Diskretion bei Schließfächern ist strikt... aber [[Fach 217]] war von der Direktion als sensibel markiert.“'
        },
        'clerk_empathy_success': {
            text: 'Sein Blick zuckt zur Tür. Keine Schuld — das ist Terror. Er hat in jener Nacht etwas gesehen. Jemanden. Und er hat Angst, dass sie zurückkommen.'
        },
        'clerk_empathy_fail': {
            text: 'Sie können ihn nicht ganz lesen. Die Angst ist echt, aber ihre Quelle bleibt undurchsichtig.'
        },
        'clerk_revelation': {
            text: '„Da ist ein Mann... Gustav. Der [[Bächleputzer]]. Er reinigt die Wasserkanäle im Morgengrauen. Er hat mir erzählt... er sah einen [[Schatten]] beim Bank in jener Nacht. Eine Gestalt in Schwarz."'
        },
        'clerk_closes_up': {
            text: 'Vogel macht dicht und sortiert mit verdoppelter Intensität seine Papiere. „Ich habe Ihnen alles erzählt, was ich weiß, Herr Inspektor."'
        },
        'clerk_press': {
            text: '„Ich... Ich weiß nicht, was Sie hören wollen, mein Herr! Das Schloss wurde nicht geknackt! Ich habe es selbst kontrolliert, dreimal!"'
        },
        'clerk_done': {
            text: 'Der Angestellte hat nichts mehr zu bieten. Vorerst.'
        },

        // ─────────────────────────────────────────────────────────────
        // TRESOR-UNTERSUCHUNG
        // ─────────────────────────────────────────────────────────────
        'vault_inspection': {
            text: 'Die Tresortür hängt offen, wie zum Hohn. Drinnen erzählen leere Fächer die Geschichte. Aber der [[Schließmechanismus]] und der [[Boden]] könnten mehr verraten.',
            choices: {
                'examine_lock_logic': '[Logik] Den Schließmechanismus analysieren.',
                'sense_atmosphere_intuition': '[Intuition] Irgendetwas an diesem Raum fühlt sich... falsch an.',
                'compare_chemical_sender': '[Logik] Rückstände mit dem Absender der Chemiewerke vergleichen.',
                'return_to_hub': 'Zurück zur Haupthalle.'
            }
        },
        'vault_logic_success': {
            text: 'Keine chemischen Rückstände an den Zuhaltungen. Keine Dietrichspuren. Dieses Schloss wurde mit der richtigen Kombination geöffnet — oder einer perfekten Kopie des Schlüssels. Ein [[Insider]]? Sie bemerken einen Fetzen [[roten Samt]], der am Türscharnier hängt.'
        },
        'vault_logic_fail': {
            text: 'Der Mechanismus ist komplex. Sie bräuchten mehr Zeit oder Expertise, um zu verstehen, wie er umgangen wurde.'
        },
        'vault_intuition_success': {
            text: 'Sie atmen langsam ein. Da — unter Staub und Messing — ein schwacher Geruch. [[Bittere Mandeln]]. Industriechemikalien. Was auch immer hier verwendet wurde, es war kein rohes Dynamit. Sie finden feine [[Pulverrückstände]] auf dem Boden.'
        },
        'vault_intuition_fail': {
            text: 'Etwas nagt am Rand Ihrer Sinne, aber Sie können es nicht greifen. Der Raum gibt seine Geheimnisse nicht preis.'
        },
        'vault_sender_match_success': {
            text: 'Absenderhinweis und Rückstandsprofil stimmen überein. Dies deutet auf Zugang durch die [[Breisgauer Chemiewerke]] hin, kein zufälliger Einbruch.'
        },
        'vault_sender_match_fail': {
            text: 'Plausible Verbindung, aber unzureichende Sicherheit. Benötigt Bestätigung.'
        },
        'vault_continue': {
            text: 'Der Tresor birgt noch Geheimnisse. Was möchten Sie noch untersuchen?',
            choices: {
                'examine_lock_logic': '[Logik] Den Schließmechanismus analysieren.',
                'sense_atmosphere_intuition': '[Intuition] Auf die Atmosphäre konzentrieren.',
                'return_to_hub': 'Das reicht fürs Erste.'
            }
        },
        'vault_leave': {
            text: 'Sie treten vom Tresor zurück. Die gesammelten Beweise zeichnen ein beunruhigendes Bild.'
        },

        // ─────────────────────────────────────────────────────────────
        // ABSCHLUSS
        // ─────────────────────────────────────────────────────────────
        'bank_conclusion': {
            text: 'Sie haben aus der Bank selbst gesammelt, was Sie konnten. Drei Spuren kristallisieren sich aus dem Chaos heraus:'
        },
        'bank_conclusion_summary': {
            text: 'Der [[rote Samt]] weist auf einen [[Schneider oder Kostümbildner]]. Die [[chemischen Rückstände]] erfordern eine [[Analyse in der Apotheke]]. Und der [[Bächleputzer]] trinkt in der [[örtlichen Wirtschaft]]. Zeit, auf die Straßen Freiburgs zu gehen.'
        }
    }
};

export default CASE1_BANK_DE;
