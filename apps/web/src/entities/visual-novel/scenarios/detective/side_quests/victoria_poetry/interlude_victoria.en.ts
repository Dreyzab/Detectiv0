import type { VNContentPack } from '../../../../model/types';

export const INTERLUDE_VICTORIA_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'street_encounter': {
            text: 'You walk with Victoria down Kaiser-Joseph-Straße. Suddennly, a [[beggar]] spits at her feet. "Harlot! Parasite! Daughter of a thief!"'
        },
        'victoria_reaction': {
            text: 'Victoria freezes. Her face goes pale, then red. She grips her parasol until her knuckles turn white. The beggar disappears into the crowd.'
        },
        'victoria_confession': {
            text: '"Used to be, they would tip their hats," she whispers, voice trembling. "Now... they look at me like I starved them myself. Is that what I am, Inspector? Just... my father\'s daughter?"',
            choices: {
                'comfort_empathy': '[Empathy] "You are your own person, Victoria. Not his sins."',
                'challenge_authority': '[Authority] "Ignore them. Wolves bark at what they cannot reach."',
                'ignore': 'Say nothing.'
            }
        },
        'comfort_success': {
            text: 'She looks at you, surprised. "My own person... I try to be. But this city... it remembers names." She takes a deep breath. "Thank you. I needed to hear that."'
        },
        'comfort_fail': {
            text: '"Easy for you to say. You don\'t carry the name von Krebs." She looks away, distant.'
        },
        'challenge_success': {
            text: 'She straightens her back, masking the hurt with pride. "You are right. I should not let the rabble disturb me. I am a Krebs, after all."'
        },
        'challenge_fail': {
            text: '"They are not wolves, Inspector. They are hungry people. And my father... nevermind." She walks ahead.'
        },
        'ignore_res': {
            text: 'The silence stretches between you. Victoria sighs and composes herself, but the distance remains.'
        }
    }
};

export default INTERLUDE_VICTORIA_EN;
