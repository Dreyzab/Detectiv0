import type { VNContentPack } from '../../../../model/types';

export const INTERLUDE_LOTTE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'phone_rings': {
            text: 'Ein Horer im Telegraphenamt klingelt einmal, dann noch einmal. Der Beamte deutet auf Sie, als hatte man genau diesen Moment angekundigt.'
        },
        'lotte_speaks': {
            text: '"Inspektor?" Die Stimme kommt stotternd durch das Rauschen. Es ist [[Lotte]]. "Kurz halten. Die Vermittlung wird beobachtet."'
        },
        'lotte_warning': {
            text: '"Ihr Spurmuster ist sichtbar", flustert Lotte. "Jemand im Prasidium leitet Uberwachung uber Wartungsleitungen um. Wenn Sie weiter drucken, bewegen sie sich vor Ihnen."',
            choices: {
                'thank_personal': '"Sie haben richtig gehandelt, Lotte. Fuettern Sie mich weiter mit dem, was Sie ubersehen."',
                'dismiss_professional': '"Verstanden. Zuruck ins Protokoll und vergessen Sie diesen Anruf."'
            }
        },
        'thank_res': {
            text: '"Dann gehen wir vorsichtig weiter", sagt sie. "Kommen Sie zur Vermittlung, wenn Sie konnen. Ich habe etwas in den toten Kanalen gefunden." Die Leitung klickt tot.'
        },
        'dismiss_res': {
            text: 'Eine Pause. "Gut. Dann professionell. Wenn Sie es sich anders uberlegen, fragen Sie am Zentralbrett nach mir." Die Leitung bricht ab.'
        }
    }
};

export default INTERLUDE_LOTTE_DE;
