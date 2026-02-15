import type { VNContentPack } from '../../../../model/types';

/**
 * Clerk Interrogation Demo — German content.
 * Dialogue text for the Ernst Vogel (clerk) interrogation.
 */
export const INTERROGATION_CLERK_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'intro': {
            text: 'Das Hinterzimmer der Bank ist schwach beleuchtet. Stapel von Hauptbüchern umgeben einen kleinen Schreibtisch, an dem Ernst Vogel, der junge Angestellte, sitzt und die Hände ringt. Er hatte in der Nacht des Raubüberfalls Dienst.\n\nZeit herauszufinden, was er weiß.',
        },
        'clerk_greeting': {
            text: 'Vogel blickt mit geröteten Augen auf. "H-Herr Detektiv? Man sagte mir, jemand würde kommen. Ich habe dem Schutzmann bereits alles erzählt, was ich weiß. Was... nicht viel ist."\n\nEr nestelt an einem Federhalter und meidet Ihren Blick.',
            choices: {
                'choice_direct_accusation': '"Hören Sie auf mit dem Theater, Vogel. Sie waren in jener Nacht als Einziger hier."',
                'choice_sympathetic': '"Lassen Sie sich Zeit, Ernst. Ich bin nur hier, um zu verstehen, was geschehen ist."',
                'choice_small_talk': '"Nettes Büro. Arbeiten Sie schon lange hier?"',
            }
        },
        'beat_accusation': {
            text: 'Vogel zuckt zusammen, als wäre er geschlagen worden. Der Federhalter klappert zu Boden.\n\n"Ich—Ich habe nicht—Sie können doch unmöglich glauben—" Er schluckt schwer, sein Adamsapfel hüpft. "Ich war die ganze Zeit an meinem Schreibtisch! Der Wachmann wird es bestätigen!"',
            choices: {
                'choice_press_harder': '"Der Wachmann wurde bewusstlos aufgefunden. Versuchen Sie es noch einmal."',
                'choice_back_off': '"Ruhig Blut. Ich decke nur alle Möglichkeiten ab."',
            }
        },
        'beat_sympathy': {
            text: 'Die Anspannung in Vogels Schultern lässt ein wenig nach. Er ringt sich ein schwaches Lächeln ab.\n\n"Danke, Herr Detektiv. Es war... ein schwerer Morgen. Alle sehen mich an, als ob—" Er hält inne und schluckt. "Als ob ich es getan hätte."',
            choices: {
                'choice_ask_about_night': '"Gehen Sie die Nacht mit mir durch. Schritt für Schritt."',
                'choice_show_evidence': '"Ich habe etwas im Tresorraum gefunden. Vielleicht können Sie mir helfen, es zu verstehen."',
            }
        },
        'beat_small_talk': {
            text: '"Drei Jahre diesen Mai." Ein Anflug von Stolz huscht über sein Gesicht, bevor er von der Angst erstickt wird. "Herr Krebs gab mir die Nachtschicht, weil... nun ja, niemand sonst sie wollte. Ich war froh über den extra Lohn."',
            choices: {
                'choice_mention_family': '"Haben Sie eine Familie zu versorgen?"',
                'choice_shift_topic': '"Sie waren also in jener Nacht allein?"',
            }
        },
        'beat_pressed': {
            text: 'Vogels Gesicht wird kreidebleich. Seine Hände zittern.\n\n"Der W-Wachmann... bewusstlos?" Er sieht ehrlich schockiert aus. "Ich dachte, er wäre nur... Heinrich schläft während der Nachtschicht immer ein. Das weiß jeder. Aber bewusstlos—"\n\nEr blickt zur Tür, als wäge er eine Flucht ab.',
            choices: {
                'choice_threaten': '"Noch eine Lüge und ich übergebe Sie dem Schutzmann. Die sind weniger geduldig als ich."',
                'choice_calm_down': '"Heinrich — das ist der Wachmann? Erzählen Sie mir von ihm."',
            }
        },
        'beat_recovery': {
            text: 'Vogel atmet zittrig aus. "Es tut mir leid. Ich bin nicht... Ich bin das nicht gewohnt."\n\nEr rückt seinen Kragen zurecht und setzt sich etwas aufrechter hin. Die Panik weicht etwas Resigniertem.\n\n"Was wollen Sie wissen?"',
            choices: {
                'choice_gentle_probe': '"Haben Sie etwas Ungewöhnliches gehört? Geräusche, Stimmen?"',
                'choice_wait_silent': 'Nichts sagen. Die Stille den Raum füllen lassen.',
            }
        },
        'beat_night_details': {
            text: '"Ich habe die Quartalsabrechnungen fertiggestellt. Gegen elf hörte ich... etwas. Ein schabendes Geräusch, von unten."\n\nVogels Blick wird fern. "Ich dachte, es wären Ratten. Das alte Gebäude ist voll davon. Aber dann war da dieser Geruch. Beißend, chemisch. Wie in der Apotheke in der Salzstraße."\n\nEr reibt sich die Schläfe. "Danach wurde alles... neblig."',
            choices: {
                'choice_push_details': '"Der Geruch. Beschreiben Sie ihn genau."',
                'choice_reassure': '"Gut, dass Sie sich an so viel erinnern. Fahren Sie fort."',
            }
        },
        'beat_evidence_shown': {
            text: 'Vogel starrt auf das Beweisstück, seine Pupillen weiten sich. "Wo haben Sie... das lag im Tresorraum?"\n\nEr lehnt sich trotz seiner Angst vor, professionelle Neugier gewinnt die Oberhand. "Das ist kein Standardwerkzeug. Das ist... spezialisiert. Wer auch immer das benutzt hat, wusste genau, was er tat."',
            choices: {
                'choice_confront_with_evidence': '"Und Sie haben keine Ahnung, wer das sein könnte?"',
                'choice_let_him_explain': '"Weiter. Was können Sie mir darüber sagen?"',
            }
        },
        'beat_sympathetic_reveal': {
            text: 'Vogel senkt die Stimme und schielt zur geschlossenen Tür.\n\n"Da ist eine Sache. In der Nacht vor dem Raubüberfall sah ich Herrn Krebs persönlich im Tresorraum. Um Mitternacht. Er sagte, er würde \'Inventur machen\', aber... das tut er nie. Und er trug einen Lederkoffer, den ich noch nie gesehen hatte."\n\nEr blickt Ihnen zum ersten Mal direkt in die Augen. "Ich habe es dem Schutzmann nicht erzählt, weil Herr Krebs... er unterschreibt meinen Lohn."',
        },
        'beat_lockout_result': {
            text: 'Vogel schlägt mit den Handflächen auf den Schreibtisch und steht auf, der Stuhl scharrt über den Boden.\n\n"Ich habe Ihnen nichts mehr zu sagen! Ich will einen Anwalt! Ich will—"\n\nEr stürmt zur Tür und reißt sie auf. Ein uniformierter Wachmann erscheint sofort. Vogel drängt sich an ihm vorbei und schreit etwas von seinen Rechten.\n\nDie Befragung ist vorbei. Vorerst.',
        },
        'beat_conclusion': {
            text: 'Sie klappen Ihr Notizbuch zu und stehen auf. Das Hinterzimmer wirkt kleiner als bei Ihrer Ankunft.\n\nDie Puzzleteile beginnen ein Bild zu formen — Krebs um Mitternacht, ein chemischer Geruch, ein Spezialwerkzeug. Aber ist Vogel ein Zeuge, ein Komplize oder nur ein verängstigter Angestellter, dem das Wasser bis zum Hals steht?\n\nNur die Beweise werden es zeigen.',
        }
    }
};

export default INTERROGATION_CLERK_DE;
