import type { VNContentPack } from '../../../../../model/types';

export const CASE1_FINALE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        // DEDUCTION
        'deduction_start': {
            text: 'You stand before the [[Old Warehouse]]. The pieces of the puzzle swirl in your mind. The **Red Velvet** from the tailor. The **Chemicals** from the apothecary. The **Shadow Witness** from the pub. It\'s time to decide what truth you will pursue.'
        },
        'deduction_choice': {
            text: 'Who is behind the robbery at Bankhaus Krebs?',
            choices: {
                'theory_political': 'It\'s a Political Provocation. The "anarchists" are impostors framed by the elite.',
                'theory_criminal': 'It\'s a Syndicate War. A new gang is challenging Kessler\'s control.'
            }
        },

        // PATH A: POLITICAL
        'path_political_entry': {
            text: 'You slip past the police cordon. Inside, you don\'t see hardened criminals. You see scared young men in workmen\'s clothes that fit too poorly. And... a familiar face directing them.'
        },
        'political_confrontation': {
            text: '[[Kommissar Richter]]! He turns, hand on his holster. "Inspector? You shouldn\'t be here. This is a delicate operation. These \'anarchists\' are about to confess."',
            choices: {
                'expose_corruption': '[Authority] "Drop the act, Richter. I know about the costumes. The chemicals. It\'s a stage play, and you\'re the director!"'
            }
        },
        'political_victory': {
            text: 'Richter hesitates. He sees Victoria emerging from the shadows behind you. "Victoria? Mein Gott..." He lowers his gun. "It was... orders. From the top. To scare the voters." The raid is called off. The Truth is out.'
        },
        'political_compromise': {
            text: 'Richter sneers. "You have no proof. Arrest him!" You are dragged away as the "raid" proceeds. The papers will hail it as a victory against terror, but you know the lie.'
        },

        // PATH B: CRIMINAL
        'path_criminal_entry': {
            text: 'You kick open the door. The warehouse is a war zone. Men in expensive Viennese suits are exchanging fire with Kessler\'s smugglers.'
        },
        'criminal_confrontation': {
            text: 'A man in a velvet lined coat stands over a wounded smuggler. He aims a pistol. "Freiburg belongs to the Syndicate now!"',
            choices: {
                'stop_violence': '[Volition] fire a warning shot and identify yourself as Police.'
            }
        },
        'criminal_victory': {
            text: 'Your shot rings out, shattering the tension. Police whistles sound outside. The Viennese gangster curses and flees through the skylight. You have prevented a massacre, but the war has just begun.'
        },
        'criminal_chaos': {
            text: 'The gunfire drowns out your voice. A stray bullet clips your shoulder. By the time reinforcements arrive, the warehouse is a morgue. The Syndicate has made its statement in blood.'
        },

        // ENDINGS
        'END_POLITICAL': { text: 'CASE CLOSED. Outcome: The conspiracy is exposed. The Mayor\'s reputation is damaged, but the innocents go free.' },
        'END_POLITICAL_BAD': { text: 'CASE CLOSED. Outcome: The lie becomes history. You are disgraced.' },
        'END_CRIMINAL': { text: 'CASE CLOSED. Outcome: The gang war is stalled. You are a hero to the public, but a target for the shadowy Syndicate.' },
        'END_CRIMINAL_BAD': { text: 'CASE CLOSED. Outcome: Bloodbath. The city plunges into fear.' },
        'credits': { text: 'CONGRATULATIONS. You have completed the Open City investigation demo.' }
    }
};

export default CASE1_FINALE_EN;

