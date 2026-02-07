
import type { Locale } from '@repo/shared/locales/types';

export interface QuestUIStrings {
    // Headers
    header_journal: string;
    header_objective: string;
    subtitle_journal: string;

    // Tabs
    tab_active: string;
    tab_solved: string;
    tab_failed: string;

    // Labels
    label_in_progress: string;
    label_current_stage: string;
    label_no_stage: string;
    label_stage_timeline: string;
    label_objectives: string;
    label_case_solved: string;
    label_journal_updated: string;
    label_new_investigation: string;

    // Navbar
    nav_investigation: string;
    nav_journal: string;
    nav_none: string;
    nav_close: string;
    nav_available: string;

    // Search / Empty States
    search_placeholder: string;
    empty_no_entries: string;
    empty_no_active: string; // "There are no active investigations..."

    // Buttons
    btn_start_quest: string;
    btn_force_complete: string;
    btn_reset: string;
}

export const QUEST_UI: Record<Locale, QuestUIStrings> = {
    en: {
        header_journal: "Investigation Journal",
        header_objective: "Current Objective",
        subtitle_journal: "Case files and current objectives",

        tab_active: "Active Investigations",
        tab_solved: "Solved Cases",
        tab_failed: "Cold Cases",

        label_in_progress: "In Progress",
        label_current_stage: "Current Stage",
        label_no_stage: "Stage not set",
        label_stage_timeline: "Stage Timeline",
        label_objectives: "Objectives",
        label_case_solved: "Case Solved",
        label_journal_updated: "Journal Updated",
        label_new_investigation: "New Investigation",

        nav_investigation: "Investigation",
        nav_journal: "Journal",
        nav_none: "None Selected",
        nav_close: "Close investigation",
        nav_available: "Available Cases",

        search_placeholder: "Search case files...",
        empty_no_entries: "No entries found",
        empty_no_active: "There are no investigations in this category at this time.",

        btn_start_quest: "Start Quest",
        btn_force_complete: "Force Complete",
        btn_reset: "Reset All"
    },
    de: {
        header_journal: "Ermittlungsakte",
        header_objective: "Aktuelles Ziel",
        subtitle_journal: "Fallakten und aktuelle Ziele",

        tab_active: "Aktive Ermittlungen",
        tab_solved: "Gelöste Fälle",
        tab_failed: "Ungelöste Fälle",

        label_in_progress: "In Arbeit",
        label_current_stage: "Aktuelle Phase",
        label_no_stage: "Phase nicht gesetzt",
        label_stage_timeline: "Phasenverlauf",
        label_objectives: "Ziele",
        label_case_solved: "Fall Gelöst",
        label_journal_updated: "Akte Aktualisiert",
        label_new_investigation: "Neue Ermittlung",

        nav_investigation: "Ermittlung",
        nav_journal: "Akte",
        nav_none: "Keine Auswahl",
        nav_close: "Ermittlung schließen",
        nav_available: "Verfügbare Fälle",

        search_placeholder: "Fallakten durchsuchen...",
        empty_no_entries: "Keine Einträge gefunden",
        empty_no_active: "Derzeit keine Ermittlungen in dieser Kategorie.",

        btn_start_quest: "Quest Starten",
        btn_force_complete: "Abschließen erzwingen",
        btn_reset: "Zurücksetzen"
    },
    ru: {
        header_journal: "Журнал Расследования",
        header_objective: "Текущая Цель",
        subtitle_journal: "Материалы дела и текущие задачи",

        tab_active: "Активные Дела",
        tab_solved: "Раскрытые Дела",
        tab_failed: "Архив / Глухари",

        label_in_progress: "В процессе",
        label_current_stage: "Текущий этап",
        label_no_stage: "Этап не задан",
        label_stage_timeline: "Лента этапов",
        label_objectives: "Задачи",
        label_case_solved: "Дело Раскрыто",
        label_journal_updated: "Журнал Обновлен",
        label_new_investigation: "Новое Расследование",

        nav_investigation: "Расследование",
        nav_journal: "Журнал",
        nav_none: "Не выбрано",
        nav_close: "Закрыть дело",
        nav_available: "Доступные Дела",

        search_placeholder: "Поиск по делу...",
        empty_no_entries: "Записей не найдено",
        empty_no_active: "В этой категории пока нет расследований.",

        btn_start_quest: "Начать Квест",
        btn_force_complete: "Завершить принудительно",
        btn_reset: "Сбросить Все"
    }
};
