import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_SON_HOUSE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        son_house_arrival: {
            text: 'Das Zimmer ist chaotisch, aber nicht verschwenderisch. Das wirkt nach Panik, nicht nach Luxus.',
            choices: {
                inspect_desk: 'Schreibtisch untersuchen',
                inspect_wardrobe: 'Kleiderschrank und Truhe pruefen',
                leave_house: 'Vorerst gehen'
            }
        },
        desk_findings: {
            text: 'Zwischen Mahnschreiben liegt eine Schuldennotiz mit dem Initial W und einer knappen Frist.'
        },
        wardrobe_findings: {
            text: 'Pfandscheine stecken in einer Mantelnaht. Friedrich versetzte private Wertsachen vor den angeblichen Diebstahlen.'
        },
        house_outro: {
            text: 'Clara: "Er hat ein Loch gestopft, kein Geld aus Laune verbrannt."',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_BANKER_SON_HOUSE_DE;
