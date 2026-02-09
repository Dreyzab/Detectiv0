import type { VNContentPack } from '../../../../../model/types';

/**
 * Fall-1-Briefing — Deutscher Inhalt
 */
export const CASE1_BRIEFING_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'arrival_station': {
            text: 'Der Dampf reisst auf, als der Zug zischend zum Halt kommt. [[Freiburg Hauptbahnhof]]. Die Luft ist schwer von Kohlenrauch und dem Geruch nasser Pflastersteine. Ein Neuanfang... oder der Beginn von etwas Dunklerem.',
            choices: {
                'look_around': 'Auf den Bahnsteig treten'
            }
        },

        'meet_rookie': {
            text: 'Eine steife Gestalt in gebugelter Uniform salutiert. "Schutzmann Muller, Polizeidirektion Freiburg! Willkommen, mein Herr." Er senkt die Stimme. "Der Burgermeister ist... ungeduldig. Und die Lage bei der Bank ist... kompliziert."',
            choices: {
                'ask_bank': '"Kompliziert? Das ist ein Wort fur einen Raububerfall, Muller."',
                'ask_mayor': '"Warum ist Burgermeister Thoma personlich involviert?"',
                'observe_muller': '[Beobachtung] Das Auftreten des Polizisten mustern.',
                'proceed_mayor': '"Bringen Sie mich ins Rathaus. Zuerst der Burgermeister."',
                'proceed_bank': '"Keine Zeit fur Politik. Sofort zur Bank."'
            }
        },
        'muller_lore_bank': {
            text: '"Es ist Chaos, Herr Vance. Sozialisten brullen Parolen, Reporter blitzen mit Pulverlicht, Schaulustige drucken gegen die Absperrung." Er richtet nervos die Pickelhaube. "Bankdirektor Galdermann droht, uns alle feuern zu lassen, wenn wir die Menge nicht in den Griff bekommen."'
        },
        'muller_lore_mayor': {
            text: '"Seine Exzellenz lauft seit Sonnenaufgang auf und ab und schreit die Telefonistinnen an. Er nennt den Raub einen "politischen Anschlag" auf seine Karriere." Muller zogert. "Unter uns... er wirkt eher verangstigt als wutend."'
        },
        'muller_observe_self': {
            text: 'Flussschlamm an den Stiefeln, kein Strassenstaub. Ein leichtes Zittern in der Hand, als er den Helm richtet. Haltung wie ein Frontsoldat, nicht wie ein Revierpolizist. Dieser Mann hat Schlimmeres gesehen als zornige Banker.\n\n"Sie waren bei der 113., nicht wahr, Muller? Badische Infanterie."'
        },

        'mayor_office_1': {
            text: 'Der Rathausflur ist still, nur das Ticken einer alten Standuhr ist zu horen. Eine Sekretarin winkt Sie mit nervosen Handen durch. Innen steht Burgermeister Thoma am Fenster, die Finger trommeln auf dem Sims.\n\n"Vance. Endlich." Er dreht sich nicht um. "Wissen Sie, wie man das nennt? Eine "kuhne sozialistische Aktion". Die Zeitungen schreiben bereits meinen politischen Nachruf."'
        },
        'mayor_office_2': {
            text: 'Er dreht sich um. Das Gesicht eingefallen, die Augen dunkel von schlaflosen Nachten. "Das ist nicht bloss ein Raub. Jemand sendet eine Botschaft. An mich." Er geht zum Schreibtisch und schiebt Papiere beiseite.\n\n"Ich brauche jemanden, der sieht, was andere ubersehen. Jemanden... ausserhalb der ublichen Kanale." Er deutet auf eine Seitentur. "Darum habe ich Unterstutzung organisiert."'
        },
        'mayor_introduces_victoria': {
            text: 'Die Seitentur offnet sich. Eine Frau tritt ein: gross, streng, in praktischem grauem Wollstoff. Ihre Hande sind von Chemikalien gezeichnet, und sie tragt eine schwere Ledertasche wie ein Soldat sein Gewehr.\n\n"Fraulein Victoria Sterling. Sie studierte Chemie an unserer Universitat, eine der ersten Frauen mit dieser Zulassung." Der Ton des Burgermeisters klingt erzwungen begeistert. "Sie wird Ihre... wissenschaftliche Beraterin."'
        },
        'victoria_first_impression': {
            text: 'Victorias Blick trifft Ihren. Kalt. Prufend. Der Blick eines Menschen, der gelernt hat, sich gegen eine Welt zu panzern, die auf sein Scheitern wartet.\n\n"Herr Vance." Ihre Stimme ist knapp und professionell. "Ich habe Ihre Wiener Akten gelesen. Solide Arbeit. Wenn auch... unorthodox."',
            choices: {
                'react_respectful': '"Die Ehre ist ganz meinerseits, Fraulein Sterling. Chemie in Freiburg ist keine kleine Leistung."',
                'react_skeptical': '"Eine Laborwissenschaftlerin am Tatort. Der Burgermeister hat ungewohnliche Ideen von Ermittlungen."',
                'react_flirtatious': '"Man hat mir nicht gesagt, dass Sie ebenso schon wie brillant sind."',
                'observe_victoria': '[Beobachtung] Sie genauer mustern, bevor Sie antworten.'
            }
        },
        'victoria_react_respect': {
            text: 'Etwas verandert sich in ihrem Ausdruck. Keine Warme, aber ein kurzer Abbau der Distanz. "Sie sind... nicht das, was ich erwartet habe." Eine Pause. "Die meisten Detektive nehmen mich nicht ernst, bevor ich ein Wort sage."\n\nDer Burgermeister rauspert sich. "Ja, ja. Sehr gut. Sie zwei werden zusammenarbeiten."'
        },
        'victoria_react_skeptic': {
            text: 'Ihre Augen verengen sich. Die Temperatur im Raum sinkt spurbar. "Eine Laborwissenschaftlerin. Ja. Eine, die Gifte an Kristallstrukturen erkennt, Fasern bis zur Weberei zuruckverfolgt und Blutspuren sichtbar macht, die das Auge nicht sieht." Sie blinzelt nicht. "Leistet Ihre "konventionelle" Methode das auch, Herr Vance?"'
        },
        'victoria_react_flirt': {
            text: 'Ihr Ausdruck friert ein. Als sie spricht, klingt jedes Wort wie Eis. "Ich bin wegen meiner forensischen Chemie hier, nicht wegen meines Aussehens. Wenn Sie den Unterschied nicht kennen, hat der Burgermeister vielleicht falsch entschieden."\n\nDie folgende Stille ist frostig.'
        },
        'victoria_observe_result': {
            text: 'Tintenflecken an den Fingern, nicht beliebige Tinte, sondern das violette Laborbuchpigment. Leichte Rotung um die Augen: zu wenig Schlaf oder unterdruckte Tranen. Ein kleines Medaillon am Hals, das sie unbewusst umfasst, wenn sie sich unbeobachtet glaubt.\n\nSie ist aus mehr als beruflichem Ehrgeiz hier. Sie jagt etwas.'
        },
        'mayor_directive': {
            text: '"Ich brauche eine Losung vor der Sonntagspredigt." Der Burgermeister breitet die Hande aus. "Der Erzbischof wird uber "moralischen Verfall in stadtischen Institutionen" sprechen. Ich mochte nicht sein Anschauungsobjekt sein."\n\nEr reicht Ihnen einen Messingschlussel. "Voller Zugang zur Bank. Fraulein Sterling hat den Tresor bereits gepruft. Auf dem Weg kann sie Sie briefen."',
            choices: {
                'accept_partnership': '"Dann verlieren wir keine weitere Zeit. Fraulein Sterling, bitte."'
            }
        },
        'mayor_path_exit': {
            text: 'Victoria nickt kurz und geht zur Tur. Der Burgermeister sieht Ihnen nach, sein Gesicht bleibt unlesbar.\n\nDraussen wartet eine schwarze Kutsche. Victoria steigt ein, ohne Hilfe abzuwarten. "Zur Bank", sagt sie dem Kutscher. "Und schnell."'
        },

        'bank_path_1': {
            text: 'Die Menge druckt gegen die Polizeikette. Reporter schreien Fragen ins Nichts. Eine Frau im abgetragenen Tuch klagt um ihre Ersparnisse. Sozialistische Flugblatter flattern im Wind wie verletzte Vogel.\n\nBankhaus Krebs steht im Zentrum des Chaos, die Marmorfassade unversehrt, der Ruf jedoch irreparabel gesprungen.'
        },
        'bank_path_2': {
            text: 'Keine offizielle Einweisung. Kein Protokoll. Nur Sie und das Chaos. Die Polizisten mustern Sie misstrauisch, als Sie den Dienstausweis zeigen.\n\n"Noch ein Detektiv?" Ein Sergeant spuckt auf das Pflaster. "Viel Gluck. Der Bankdirektor brullt, der Tresor ist leer, und wir haben nichts ausser Kreidemarken und Ratseln."\n\nKreidemarken. Interessant.'
        },
        'mayor_arrives_bank': {
            text: 'Eine schwarze Kutsche schneidet durch die Menge. Die Polizei raumt hektisch den Weg. Burgermeister Thoma steigt aus, das Gesicht eine Maske kontrollierter Wut.\n\n"Vance! Ich sehe, Sie konnten nicht warten." Er richtet seinen Mantel. "Egal. Ich habe jemanden mitgebracht, der diese Ermittlung... ordnungsgemass begleitet."'
        },
        'mayor_introduces_victoria_bank': {
            text: 'Eine Frau steigt aus der Kutsche: gross, streng, mit schwerer Ledertasche. Graues Wollkleid, praktischer Schnitt, ein Blick scharfer als jedes Skalpell.\n\n"Fraulein Victoria Sterling. Wissenschaftliche Beraterin. Sie arbeitet mit Ihnen." Der Ton des Burgermeisters macht klar, dass dies keine Bitte ist. "Versuchen Sie, ihre Arbeit nicht zu behindern."'
        },
        'victoria_bank_intro': {
            text: 'Victoria uberfliegt die Szene mit klinischer Distanz. Als ihr Blick Ihren trifft, liegt darin keine Warme, nur Bewertung.\n\n"Herr Vance. Ich habe den Tresor bereits untersucht. Es gibt... Unregelmassigkeiten." Eine Pause. "Ich vertraue darauf, dass Sie meine Befunde nicht als "weibliche Intuition" abtun."',
            choices: {
                'react_respectful_bank': '"Ich verwerfe nichts ohne Beweise. Was haben Sie gefunden?"',
                'react_annoyed_bank': '"Ich arbeite allein, Fraulein. Die Spiele des Burgermeisters sind nicht mein Problem."'
            }
        },
        'victoria_react_respect_bank': {
            text: '"Kreidemarkierungen. Geometrische Muster. Nicht zufallig, jemand hat sie bewusst gesetzt." Ihre Augen verengen sich. "Und es gibt einen chemischen Ruckstand, den ich noch nicht sauber einordnen kann. Bittermandelgeruch, aber kein Cyanid. Etwas... Ungewohnliches."\n\nSie deutet zum Bankeingang. "Sollen wir?"'
        },
        'victoria_react_annoyed_bank': {
            text: '"Sie arbeiten allein." Sie wiederholt es ohne Betonung, doch ihr Blick verhaertet sich. "Wie praktisch fur Sie. Ich dagegen habe Befehle des Burgermeisters. Und anders als manche habe ich nicht den Luxus, machtige Manner zu ignorieren."\n\nSie geht ohne weitere Reaktion Richtung Bank. "Kommen Sie. Oder bleiben Sie. Die Spuren interessieren sich nicht fur Ihre Vorlieben."'
        },
        'bank_path_exit': {
            text: 'Die Bankturen ragen vor Ihnen auf. Dahinter: Antworten, oder noch mehr Fragen. Victoria geht neben Ihnen her, vielleicht widerwillig, aber dennoch Verbundete.\n\nDie Ermittlung beginnt jetzt.'
        }
    }
};

export default CASE1_BRIEFING_DE;
