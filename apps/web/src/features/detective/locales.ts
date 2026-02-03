
import type { Locale } from '@repo/shared/locales/types';

export interface DetectiveUIStrings {
    // Dossier Tabs
    tab_facts: string;
    tab_evidence: string;
    tab_board: string;
    tab_map: string;
    tab_voices: string;

    // Headers
    header_case_file: string;
    header_facts: string;
    header_evidence: string;
    header_known_locations: string;
    header_voice_parliament: string;

    // Footer
    footer_police_dept: string;

    // Empty States
    empty_facts: string;
    empty_evidence: string;
    empty_flags: string;

    // Status
    status_locked: string;

    // Map Legend / States
    state_discovered: string;
    state_visited: string;
    state_completed: string;

    // Navigation
    nav_map: string;
    nav_dossier: string;
    nav_profile: string;

    // Cases
    case_01_title: string;
    case_01_description: string;

    // Character Page
    char_title: string;
    char_rank_label: string;
    char_level_label: string;
    char_xp_label: string;
    char_dev_points_title: string;
    char_dev_points_desc: string;
    char_equipment_title: string;
    char_equipment_empty: string;
    char_parliament_title: string;
    char_background_title: string;
    char_background_text: string;
    char_portrait_unavailable: string;

    // Onboarding
    onboarding_telegram_title: string;
    onboarding_telegram_message: string;
    onboarding_ack: string;
}

export const DETECTIVE_UI: Record<Locale, DetectiveUIStrings> = {
    en: {
        tab_facts: "Facts",
        tab_evidence: "Evidence",
        tab_board: "Board",
        tab_map: "Map",
        tab_voices: "Voices",

        header_case_file: "Case File #1",
        header_facts: "Facts & Notes",
        header_evidence: "Collected Evidence",
        header_known_locations: "Known Locations",
        header_voice_parliament: "Voice Parliament",

        footer_police_dept: "Freiburg Police Dept. • 1905",

        empty_facts: "No facts recorded yet.",
        empty_evidence: "No evidence collected.",
        empty_flags: "No flags set",

        status_locked: "LOCKED",

        state_discovered: "Discovered",
        state_visited: "Visited",
        state_completed: "Completed",

        nav_map: "Map",
        nav_dossier: "Dossier",
        nav_profile: "Profile",

        case_01_title: "Case 1: The Robbery",
        case_01_description: "Investigation of the Bankhaus Krebs robbery.",

        // Character
        char_title: "The Detective",
        char_rank_label: "Rank",
        char_level_label: "Level",
        char_xp_label: "Experience",
        char_dev_points_title: "Development Points Available",
        char_dev_points_desc: "Spend to improve skills instantly.",
        char_equipment_title: "Equipment",
        char_equipment_empty: "No items equipped",
        char_parliament_title: "Parliament of Voices",
        char_background_title: "Background",
        char_background_text: "Arrived in Freiburg via the night train from Berlin. The luggage was lighter than the memories left behind.",
        char_portrait_unavailable: "Portrait Unavailable",

        // Onboarding
        onboarding_telegram_title: "Telegram - Imperial Telegraph Office",
        onboarding_telegram_message: "STOP. REPORT TO FREIBURG IMMEDIATELY. STOP. LOCAL POLICE REQUIRES ASSISTANCE. STOP. BANKHAUS KREBS ROBBERY. STOP. DO NOT FAIL US. STOP.",
        onboarding_ack: "Acknowledge"
    },
    de: {
        tab_facts: "Fakten",
        tab_evidence: "Beweise",
        tab_board: "Tafel",
        tab_map: "Karte",
        tab_voices: "Stimmen",

        header_case_file: "Akte #1",
        header_facts: "Fakten & Notizen",
        header_evidence: "Gesammelte Beweise",
        header_known_locations: "Bekannte Orte",
        header_voice_parliament: "Stimmenparlament",

        footer_police_dept: "Polizeipräsidium Freiburg • 1905",

        empty_facts: "Noch keine Fakten aufgezeichnet.",
        empty_evidence: "Keine Beweise gesammelt.",
        empty_flags: "Keine Markierungen",

        status_locked: "GESPERRT",

        state_discovered: "Entdeckt",
        state_visited: "Besucht",
        state_completed: "Abgeschlossen",

        nav_map: "Karte",
        nav_dossier: "Akte",
        nav_profile: "Profil",

        case_01_title: "Fall 1: Der Raubüberfall",
        case_01_description: "Untersuchung des Raubüberfalls auf das Bankhaus Krebs.",

        // Character
        char_title: "Der Detektiv",
        char_rank_label: "Rang",
        char_level_label: "Stufe",
        char_xp_label: "Erfahrung",
        char_dev_points_title: "Entwicklungspunkte verfügbar",
        char_dev_points_desc: "Ausgeben, um Fähigkeiten sofort zu verbessern.",
        char_equipment_title: "Ausrüstung",
        char_equipment_empty: "Keine Gegenstände ausgerüstet",
        char_parliament_title: "Parlament der Stimmen",
        char_background_title: "Hintergrund",
        char_background_text: "Ankunft in Freiburg mit dem Nachtzug aus Berlin. Das Gepäck war leichter als die Erinnerungen, die zurückgelassen wurden.",
        char_portrait_unavailable: "Porträt nicht verfügbar",

        // Onboarding
        onboarding_telegram_title: "Telegramm - Kaiserliches Telegraphenamt",
        onboarding_telegram_message: "STOPP. SOFORT IN FREIBURG MELDEN. STOPP. LOKALE POLIZEI BENÖTIGT UNTERSTÜTZUNG. STOPP. RAUB BANKHAUS KREBS. STOPP. ENTTÄUSCHEN SIE UNS NICHT. STOPP.",
        onboarding_ack: "Bestätigen"
    },
    ru: {
        tab_facts: "Факты",
        tab_evidence: "Улики",
        tab_board: "Доска",
        tab_map: "Карта",
        tab_voices: "Голоса",

        header_case_file: "Дело #1",
        header_facts: "Факты и Заметки",
        header_evidence: "Собранные Улики",
        header_known_locations: "Известные Места",
        header_voice_parliament: "Парламент Голосов",

        footer_police_dept: "Полиция Фрайбурга • 1905",

        empty_facts: "Факты пока не записаны.",
        empty_evidence: "Улики не найдены.",
        empty_flags: "Нет флагов",

        status_locked: "ЗАКРЫТО",

        state_discovered: "Открыто",
        state_visited: "Посещено",
        state_completed: "Завершено",

        nav_map: "Карта",
        nav_dossier: "Досье",
        nav_profile: "Профиль",

        case_01_title: "Дело 1: Ограбление",
        case_01_description: "Расследование ограбления Банка Кребс.",

        // Character
        char_title: "Детектив",
        char_rank_label: "Ранг",
        char_level_label: "Уровень",
        char_xp_label: "Опыт",
        char_dev_points_title: "Доступны очки развития",
        char_dev_points_desc: "Потратьте, чтобы улучшить навыки.",
        char_equipment_title: "Снаряжение",
        char_equipment_empty: "Нет снаряжения",
        char_parliament_title: "Парламент Голосов",
        char_background_title: "Предыстория",
        char_background_text: "Прибытие во Фрайбург ночным поездом из Берлина. Багаж был легче, чем воспоминания, оставленные позади.",
        char_portrait_unavailable: "Портрет недоступен",

        // Onboarding
        onboarding_telegram_title: "Телеграмма - Имперский Телеграф",
        onboarding_telegram_message: "СТОП. НЕМЕДЛЕННО ПРИБЫТЬ ВО ФРАЙБУРГ. СТОП. ПОЛИЦИИ ТРЕБУЕТСЯ ПОМОЩЬ. СТОП. ОГРАБЛЕНИЕ БАНКА КРЕБС. СТОП. НЕ ПОДВЕДИТЕ НАС. СТОП.",
        onboarding_ack: "Принять"
    }
};
