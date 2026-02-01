import type { VNContentPack } from '../../../../../model/types';

export const CASE1_LAB_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'start': {
            text: 'The [[microscope]] sits ready on the workbench. Prof. Stein cleans his glasses. "Well, let\'s see what this [[fabric fragment]] tells us."',
            choices: {
                'analyze_fabric': 'Analyze the fabric'
            }
        },
        'analysis_result': {
            text: '"Interesting weave," Stein mutters. "[[Imported silk]]. Specific dye from the 1904 batch. Only one tailor in Freiburg uses this: [[Ganter\'s personal tailor]]."',
            choices: {
                'take_report': 'Take the lab report'
            }
        }
    }
};

export default CASE1_LAB_EN;
