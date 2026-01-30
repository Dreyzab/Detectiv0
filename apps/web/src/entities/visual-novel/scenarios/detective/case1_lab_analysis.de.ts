import type { VNContentPack } from '../../model/types';

export const CASE1_LAB_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'start': {
            text: 'Das [[Mikroskop]] steht bereit auf dem Werktisch. Prof. Stein putzt seine Brille. "Nun, schauen wir mal, was uns dieses [[Stofffragment]] verrät."',
            choices: {
                'analyze_fabric': 'Stoff analysieren'
            }
        },
        'analysis_result': {
            text: '"Interessante Webart," murmelt Stein. "[[Importierte Seide]]. Spezieller Farbstoff aus der 1904er Serie. Nur ein Schneider in Freiburg verwendet das: [[Ganters persönlicher Schneider]]."',
            choices: {
                'take_report': 'Laborbericht nehmen'
            }
        }
    }
};
