import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// EN
import enCommon from '../../locales/en/common.json';
import enDetective from '../../locales/en/detective.json';
import enQuests from '../../locales/en/quests.json';
import enScanner from '../../locales/en/scanner.json';
import enHome from '../../locales/en/home.json';
import enEntry from '../../locales/en/entry.json';

// DE
import deCommon from '../../locales/de/common.json';
import deDetective from '../../locales/de/detective.json';
import deQuests from '../../locales/de/quests.json';
import deScanner from '../../locales/de/scanner.json';
import deHome from '../../locales/de/home.json';
import deEntry from '../../locales/de/entry.json';

// RU
import ruCommon from '../../locales/ru/common.json';
import ruDetective from '../../locales/ru/detective.json';
import ruQuests from '../../locales/ru/quests.json';
import ruScanner from '../../locales/ru/scanner.json';
import ruHome from '../../locales/ru/home.json';
import ruEntry from '../../locales/ru/entry.json';

const resources = {
    en: {
        common: enCommon,
        detective: enDetective,
        quests: enQuests,
        scanner: enScanner,
        home: enHome,
        entry: enEntry
    },
    de: {
        common: deCommon,
        detective: deDetective,
        quests: deQuests,
        scanner: deScanner,
        home: deHome,
        entry: deEntry
    },
    ru: {
        common: ruCommon,
        detective: ruDetective,
        quests: ruQuests,
        scanner: ruScanner,
        home: ruHome,
        entry: ruEntry
    }
} as const;

// Get initial locale from localStorage (VN store persists there)
const getInitialLocale = (): string => {
    try {
        const stored = localStorage.getItem('gw4-vn-store');
        if (stored) {
            const parsed = JSON.parse(stored);
            const locale = parsed?.state?.locale;
            if (locale && ['en', 'de', 'ru'].includes(locale)) {
                return locale;
            }
        }
    } catch {
        // Ignore parse errors
    }
    return 'en';
};

i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLocale(),
    fallbackLng: 'en',
    ns: ['common', 'detective', 'quests', 'scanner', 'home', 'entry'],
    defaultNS: 'common',
    interpolation: {
        escapeValue: false // React already escapes
    }
});

export default i18n;
