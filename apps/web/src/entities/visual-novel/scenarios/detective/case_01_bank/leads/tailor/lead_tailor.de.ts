import type { VNContentPack } from '../../../../../model/types';

export const LEAD_TAILOR_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'entrance': {
            text: 'Die Werkstatt ist voll mit Stoffballen und halbfertigen Kostumen. Wollstaub hangt im warmen Licht.'
        },
        'tailor_greets': {
            text: 'Ein schmaler Mann mit runder Brille blickt von der Nahmaschine auf. "Guten Tag. Ich bin [[Leopold Fein]]. Was kann ich fur Sie tun, Inspektor?"',
            choices: {
                'show_fabric': 'Den zerrissenen Samt aus der Bank zeigen.',
                'ask_hartmann_orders': '"Taucht der Name Hartmann in Ihren Unterlagen auf?"',
                'ask_box217_usage': '"Gibt es Kunden mit Bezug zu Schliessfach 217?"',
                'ask_customers': '"Wer beauftragt Ihre Premiumarbeiten?"',
                'browse_stock': 'Werkstattbestand ansehen.',
                'leave_shop': 'Gehen.'
            }
        },

        'show_fabric_scene': {
            text: 'Sie legen den roten Fetzen auf seinen Tisch. "Erkennen Sie diese Webung?"'
        },
        'tailor_examines': {
            text: 'Fein pruft die Fasern mit professioneller Sorgfalt. Die Wiedererkennung trifft ihn, bevor er sie verbergen kann.'
        },
        'tailor_recognition': {
            text: '"[[Venezianischer Theatersamt]]. Selten und teuer. Ich bin einer der wenigen Schneider in Baden, die ihn fuhren."',
            choices: {
                'perception_check_records': '[Wahrnehmung] Lesen, was im Ledger sichtbar ist.',
                'press_galdermann_name': '"Galdermann tauchte in diesem Fall vor Ihrem Namen auf. Erklaren Sie."',
                'ask_client': '"Wer hat das zuletzt gekauft?"',
                'thank_leave': 'Danken und gehen.'
            }
        },
        'perception_success': {
            text: 'Ihr Blick erwischt eine offene Ledger-Zeile: Barauftrag ohne Namen, "[[schwarzer Umhang mit rotem Futter]]."'
        },
        'perception_fail': {
            text: 'Der Tisch ist uberfullt. Nichts Lesbares, bevor er das Buch schliesst.'
        },
        'tailor_caught': {
            text: 'Fein bemerkt Ihren Blick zu spat. "Barzahler verlangen Diskretion. Ich liefere Schneiderei, keine Biografien."'
        },
        'tailor_client_info': {
            text: '"Diesen Monat ein Kaufer. Jung, Studentenfarben, wollte Buhnenqualitat mit guter Verdeckung."'
        },
        'tailor_hartmann_response': {
            text: '"Hartmann stand auf diskreten Liefervermerken. Immer dringend. Immer Bargeld uber Zwischenhandler."'
        },
        'tailor_box217_response': {
            text: '"Schliessfach-Kunden bestellen Reisecapes mit versteckten Innennahen. Teure Arbeit, kaum Namen."'
        },
        'tailor_galdermann_reply': {
            text: 'Fein atmet aus. "Uber Bankpatrone spreche ich nicht. Ich spreche uber Masse und Zahlung."'
        },
        'tailor_description': {
            text: '"Der Kaufer hatte eine [[Mensurnarbe]] und ein leichtes Hinken. Er nannte [[Corps Suevia]]."'
        },

        'ask_customers': {
            text: '"Theaterleute, Festkomitees und private Auftraggeber, die Diskretion zu schatzen wissen."'
        },
        'browse_stock': {
            text: 'Sie sehen mehrere Ballen roten Samts. Dieselbe Premiumqualitat wie die Bankprobe.'
        }
    }
};

export default LEAD_TAILOR_DE;
