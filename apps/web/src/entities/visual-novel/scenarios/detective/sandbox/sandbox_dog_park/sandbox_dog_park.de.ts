import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_PARK_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        park_intro: {
            text: 'Zwischen den alten Eichen im Schlossgarten kaut ein schwerer brauner Hund auf einem Brotlaib. Bruno hebt ein Ohr.',
            choices: {
                call_bruno: 'Ihn beim Namen rufen',
                approach_with_sausage: 'Mit Wurst langsam naehern',
                retreat: 'Rueckzug und spaeter wiederkommen'
            }
        },
        bruno_spooked: {
            text: 'Bruno schiesst hinter eine Bank und schaut dann neugierig hervor. Clara fluestert: "Ruhig. Keine hastigen Bewegungen."'
        },
        bruno_found: {
            text: 'Der Hund erkennt Ihre Stimme und wedelt so heftig, dass Blaetter vom Ast fallen.',
            choices: {
                check_collar: 'Das Halsband pruefen',
                escort_to_rathaus: 'Bruno zum Rathaus begleiten'
            }
        },
        collar_clue: {
            text: 'Am Halsband glaenzt eine Messingmarke mit Stadtsiegel. Eigentum eindeutig bestaetigt.'
        },
        dog_resolved: {
            text: 'Zurueck im Rathaus atmet Pfeiffer auf. "Sie haben meinen Hund und meinen Ruf gerettet, Detektiv."',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_DOG_PARK_DE;
