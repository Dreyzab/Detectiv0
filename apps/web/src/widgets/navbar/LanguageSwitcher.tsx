import { useTranslation } from 'react-i18next';
import { useVNStore } from '@/entities/visual-novel/model/store';
import type { Locale } from '@repo/shared/locales/types';

const LOCALES: { code: Locale; flag: string }[] = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'de', flag: '🇩🇪' },
    { code: 'ru', flag: '🇷🇺' },
];

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const setLocale = useVNStore(state => state.setLocale);
    const currentLocale = i18n.language as Locale;

    const handleChange = (locale: Locale) => {
        setLocale(locale);
    };

    return (
        <div className="flex items-center gap-1">
            {LOCALES.map(({ code, flag }) => (
                <button
                    key={code}
                    onClick={() => handleChange(code)}
                    className={`text-lg px-1.5 py-0.5 rounded transition-all ${currentLocale === code
                        ? 'bg-amber-600/30 scale-110'
                        : 'opacity-60 hover:opacity-100 hover:bg-stone-800'
                        }`}
                    aria-label={`Switch to ${code}`}
                >
                    {flag}
                </button>
            ))}
        </div>
    );
};
