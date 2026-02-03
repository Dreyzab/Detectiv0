
import type { Locale } from './types';

export interface SharedUIStrings {
    // Actions
    action_back: string;
    action_cancel: string;
    action_confirm: string;
    action_save: string;
    action_close: string;
    action_reset: string;
    action_continue: string;

    // States
    state_loading: string;
    state_error: string;

    // Common
    label_settings: string;
    label_qr_scanner: string;
    label_dev_tools: string;

    // Navigation
    nav_home: string;
}

export const SHARED_UI: Record<Locale, SharedUIStrings> = {
    en: {
        action_back: "Back",
        action_cancel: "Cancel",
        action_confirm: "Confirm",
        action_save: "Save",
        action_close: "Close",
        action_reset: "Reset",
        action_continue: "Continue",

        state_loading: "Loading...",
        state_error: "An error occurred",

        label_settings: "Settings",
        label_qr_scanner: "QR Scanner",
        label_dev_tools: "Dev Tools",

        nav_home: "Home"
    },
    de: {
        action_back: "Zurück",
        action_cancel: "Abbrechen",
        action_confirm: "Bestätigen",
        action_save: "Speichern",
        action_close: "Schließen",
        action_reset: "Zurücksetzen",
        action_continue: "Weiter",

        state_loading: "Laden...",
        state_error: "Ein Fehler ist aufgetreten",

        label_settings: "Einstellungen",
        label_qr_scanner: "QR-Scanner",
        label_dev_tools: "Entwickler",

        nav_home: "Hauptmenü"
    },
    ru: {
        action_back: "Назад",
        action_cancel: "Отмена",
        action_confirm: "Подтвердить",
        action_save: "Сохранить",
        action_close: "Закрыть",
        action_reset: "Сброс",
        action_continue: "Продолжить",

        state_loading: "Загрузка...",
        state_error: "Произошла ошибка",

        label_settings: "Настройки",
        label_qr_scanner: "QR Сканер",
        label_dev_tools: "Инструменты",

        nav_home: "Главная"
    }
};
