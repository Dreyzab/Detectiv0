import type { VNContentPack } from '../../../../../model/types';

export const CASE1_ARCHIVE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'archive_entry': {
            text: 'Das Archiv des Neuen Rathauses riecht nach Staub, Wachs und alter Politik. Reihen von Registern verschwinden im Halbdunkel.',
            choices: {
                'archive_request_access': 'Vollzugriff auf die Fallakten beim Archivpersonal anfordern.',
                'archive_revisit_casefile': 'Ihr zusammengestelltes Archivdossier erneut durchgehen.',
                'archive_insufficient_leads': 'Mit unvollstandigen Spuren zu recherchieren versuchen.'
            }
        },
        'archive_insufficient': {
            text: '"Fur gesperrte Akten reicht das nicht", sagt Dr. Voss und tippt auf Ihre Notizen. "Bringen Sie belastbares Material aus allen drei Spurkanalen, dann offne ich das versiegelte Regal."'
        },
        'archive_revisit_summary': {
            text: 'Sie gleichen Ihre Notizen erneut ab. Das Archivpaket zeigt weiter auf das Bahn-Lagerhaus, und die Zutrittsroute bleibt nutzbar.'
        },
        'archive_keeper_intro': {
            text: 'Dr. Margarethe Voss schliesst einen Seitenschrank auf. "Bankhaus Krebs. Verurteilte Grundstucke. Nachtgenehmigungen. Sie haben eine Stunde, bevor dieser Raum schliesst."'
        },
        'archive_research_hub': {
            text: 'Drei Stapel liegen bereit: Stadtregister, Stempelbucher und alte Satzungsnachtrage.',
            choices: {
                'archive_check_registry': '[Enzyklopadie] Eigentumsregister und Scheinfirmeneintrage querprufen.',
                'archive_check_stamps': '[Wahrnehmung] Siegelstempel und uberdruckte Prufvermerke untersuchen.',
                'archive_check_customs': '[Tradition] Historische Stadtklauseln und Notverordnungen auswerten.',
                'archive_compile_dossier': 'Archivpaket zusammenstellen und den Recherchegang abschliessen.'
            }
        },
        'archive_registry_success': {
            text: '[[encyclopedia|Enzyklopadie Erfolg]]: Die Register passen zusammen. Eine Kette von Scheinkonten verbindet Krebs-Gelder mit einem verurteilten Lagerhausgrundstuck am Bahngelande.'
        },
        'archive_registry_fail': {
            text: '[[encyclopedia|Enzyklopadie Fehlschlag]]: Die Handschriften gehen ineinander uber. Sie notieren Teiltreffer, aber keine saubere Eigentumerkette.'
        },
        'archive_stamps_success': {
            text: '[[perception|Wahrnehmung Erfolg]]: Unter frischer Tinte finden Sie einen alteren Kontrollstempel. Die Lagerhauswache hat eine reproduzierbare Lucke um Mitternacht.'
        },
        'archive_stamps_fail': {
            text: '[[perception|Wahrnehmung Fehlschlag]]: Die Stempelschichten sind zu beschadigt. Sie konnen den Patrouillenrhythmus nur grob schatzen.'
        },
        'archive_customs_success': {
            text: '[[tradition|Tradition Erfolg]]: Eine vergessene Kriegsverordnung erlaubt weiterhin Notzugang mit kommunaler Gegensignatur. Es gibt einen legalen Weg.'
        },
        'archive_customs_fail': {
            text: '[[tradition|Tradition Fehlschlag]]: Die Rechtsklauseln widersprechen sich. Sie nehmen eher Unklarheit als einen sauberen Beschlussweg mit.'
        },
        'archive_dossier_resolution': {
            text: 'Sie bundeln alle Seiten zu einem operativen Paket. Jetzt geht es um Belastbarkeit.',
            choices: {
                'archive_resolution_strong': 'Ein Hochsicherheits-Paket fur den Durchsuchungsweg ausstellen.',
                'archive_resolution_partial': 'Mit einem Teilpaket vorgehen und Unsicherheit akzeptieren.'
            }
        },
        'archive_resolution_strong_outcome': {
            text: '"Das reicht fur Bewegung", bestatigt Dr. Voss. "Lagerhausakte, Routenzeitfenster, Rechtshebel. Wenn Sie heute Nacht zuschlagen, dann entschlossen."'
        },
        'archive_resolution_partial_outcome': {
            text: '"Es halt, aber knapp", warnt Dr. Voss. "Sie konnen vorgehen, mussen am Lagerhaus aber wahrscheinlich improvisieren."'
        }
    }
};

export default CASE1_ARCHIVE_DE;
