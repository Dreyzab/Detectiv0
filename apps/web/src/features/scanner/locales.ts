
import type { Locale } from '@repo/shared/locales/types';

export interface ScannerUIStrings {
    title: string;
    camera_placeholder: string;
    input_placeholder: string;
    btn_scan: string;

    result_success: string;
    result_unknown: string;
    result_evidence: string;
    result_map: string;
    result_flags: string;
    result_scenario: string;

    label_last_result: string;
    label_quick_test: string;
}

export const SCANNER_UI: Record<Locale, ScannerUIStrings> = {
    en: {
        title: "🕵️ Hardlink Scanner (Sim)",
        camera_placeholder: "[ Camera Feed Placeholder ]",
        input_placeholder: "Enter Hardlink ID (e.g. CASE01_BRIEFING_01)",
        btn_scan: "Scan Archive",

        result_success: "✅ SUCCESS:",
        result_unknown: "❌ Unknown Hardlink:",
        result_evidence: "Evidence Found:",
        result_map: "Map Point Updated:",
        result_flags: "Flags updated.",
        result_scenario: "Starting Scenario:",

        label_last_result: "Last Scan Result:",
        label_quick_test: "Quick Test:"
    },
    de: {
        title: "🕵️ Hardlink-Scanner (Sim)",
        camera_placeholder: "[ Kamera-Feed Platzhalter ]",
        input_placeholder: "Hardlink-ID eingeben (z.B. CASE01_BRIEFING_01)",
        btn_scan: "Archiv scannen",

        result_success: "✅ ERFOLG:",
        result_unknown: "❌ Unbekannter Hardlink:",
        result_evidence: "Beweis gefunden:",
        result_map: "Kartenpunkt aktualisiert:",
        result_flags: "Markierungen aktualisiert.",
        result_scenario: "Starte Szenario:",

        label_last_result: "Letztes Scan-Ergebnis:",
        label_quick_test: "Schnelltest:"
    },
    ru: {
        title: "🕵️ Сканер Хардлинков (Сим)",
        camera_placeholder: "[ Видео с камеры ]",
        input_placeholder: "Введите ID Хардлинка (напр. CASE01_BRIEFING_01)",
        btn_scan: "Сканировать Архив",

        result_success: "✅ УСПЕХ:",
        result_unknown: "❌ Неизвестный Хардлинк:",
        result_evidence: "Найдена улика:",
        result_map: "Обновлена карта:",
        result_flags: "Флаги обновлены.",
        result_scenario: "Запуск сценария:",

        label_last_result: "Результат сканирования:",
        label_quick_test: "Быстрый тест:"
    }
};
