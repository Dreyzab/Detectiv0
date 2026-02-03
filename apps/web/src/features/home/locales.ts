
import type { Locale } from '@repo/shared/locales/types';

export interface HomeUIStrings {
    title_main: string;

    card_title: string;
    card_subtitle: string;

    btn_continue: string;
    btn_new_game: string;

    modal_reset_title: string;
    modal_reset_confirm: string;

    debug_jump_bank: string;
}

export const HOME_UI: Record<Locale, HomeUIStrings> = {
    en: {
        title_main: "Grezwanderer 4",

        card_title: "Archive: Freiburg 1905",
        card_subtitle: "Investigate the cold cases of the past. Logic is your weapon.",

        btn_continue: "Continue Investigation",
        btn_new_game: "New Game",

        modal_reset_title: "Start New Game?",
        modal_reset_confirm: "Are you sure? All progress will be lost.",

        debug_jump_bank: "[DEBUG] Jump to Bank Case"
    },
    de: {
        title_main: "Grezwanderer 4",

        card_title: "Archiv: Freiburg 1905",
        card_subtitle: "Untersuchen Sie die ungelösten Fälle der Vergangenheit.",

        btn_continue: "Ermittlung Fortsetzen",
        btn_new_game: "Neues Spiel",

        modal_reset_title: "Neues Spiel starten?",
        modal_reset_confirm: "Sind Sie sicher? Alle Fortschritte gehen verloren.",

        debug_jump_bank: "[DEBUG] Zum Bank-Fall springen"
    },
    ru: {
        title_main: "Грецвандерер 4",

        card_title: "Архив: Фрайбург 1905",
        card_subtitle: "Расследуйте нераскрытые дела прошлого. Логика — ваше оружие.",

        btn_continue: "Продолжить",
        btn_new_game: "Новая Игра",

        modal_reset_title: "Начать новую игру?",
        modal_reset_confirm: "Вы уверены? Весь прогресс будет утерян.",

        debug_jump_bank: "[DEBUG] Перейти к Делу Банка"
    }
};
