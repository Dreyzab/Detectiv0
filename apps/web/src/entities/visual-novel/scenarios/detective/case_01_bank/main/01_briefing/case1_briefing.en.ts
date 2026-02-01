import type { VNContentPack } from '../../../../../model/types';

export const CASE1_BRIEFING_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'start': {
            text: 'Inspector. Berlin has received [[disturbing reports]] from Freiburg. The [[Bankhaus J.A. Krebs]] has been targeted.'
        },
        'mission': {
            text: 'We suspect [[political motives]]. Or perhaps... something more esoteric. Proceed to Freiburg immediately.',
            choices: {
                'accept': 'Board the train to Freiburg'
            }
        },
        'arrival_station': {
            text: 'The steam clears as the train hisses to a halt. [[Freiburg Hauptbahnhof]]. The air is thick with coal smoke and anticipation. A fresh start... or a dead end?',
            choices: {
                'look_around': 'Step onto the platform'
            }
        },
        'meet_rookie': {
            text: 'Inspector! Over here! I am [[Officer Müller]]. I\'ve been assigned to assist you with the investigation. Welcome to Freiburg!',
        },
        'mayor_info': {
            text: 'I know you want to see the crime scene, but... [[Mayor Thoma]] requested to speak with you personally. He said it is urgent. But the Bank is also waiting...',
            choices: {
                'choice_visit_mayor': 'I should pay my respects to the Mayor first.',
                'choice_skip_mayor': 'I go to the Bank first. The crime scene won\'t wait.'
            }
        },
        'mayor_office_1': {
            text: 'Inspector. Welcome to Freiburg. I wish we met under better circumstances. This bank robbery... it is a stain on our city.'
        },
        'mayor_office_2': {
            text: 'You need someone who knows this city. Someone I can trust. Not just these... standard officers.'
        },
        'meet_victoria_office': {
            text: 'I have studied the files, Inspector. And I know every street in Freiburg. I will not be a burden.'
        },
        'mayor_directive': {
            text: 'This is Victoria. She will be your... liaison. Treat her well. Now, go to the Bank. Find who did this.',
            choices: {
                'accept_assistant': 'Come along then, Fräulein Sterling.'
            }
        }
    }
};

export default CASE1_BRIEFING_EN;
