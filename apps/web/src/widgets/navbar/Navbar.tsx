import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { DETECTIVE_CASES } from '@/features/detective/data/cases';
import {
    Globe,
    BookOpen,
    Map as MapIcon,
    Search,

    User,
    Wrench,
    Home
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { QUEST_UI } from '@/features/quests/locales';
import { DETECTIVE_UI } from '@/features/detective/locales';
import { SHARED_UI } from '@/shared/locales/ui';
import { asLocale } from '@/features/quests/utils';

const LOCALES = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const devDashboardEnabled = import.meta.env.VITE_ENABLE_DEV_DASHBOARD === 'true';

    // Stores
    // Stores
    const { locale: currentLocale, setLocale } = useVNStore();
    const ui = QUEST_UI[asLocale(currentLocale)];
    const detectiveUi = DETECTIVE_UI[asLocale(currentLocale)];
    const sharedUi = SHARED_UI[asLocale(currentLocale)];

    const {
        activeCaseId,
        isDossierOpen,
        toggleDossier
    } = useDossierStore();

    // Local UI State

    const activeCase = activeCaseId ? DETECTIVE_CASES[activeCaseId] : null;


    const currentPath = location.pathname;

    return (
        <div className="relative flex items-center justify-between px-6 py-3">

            {/* Left: Navigation Buttons */}
            <div className="flex items-center gap-4">
                <NavButton
                    icon={<Home className="w-5 h-5" />}
                    label={sharedUi.nav_home}
                    active={currentPath === '/'}
                    onClick={() => navigate('/')}
                />
                <NavButton
                    icon={<MapIcon className="w-5 h-5" />}
                    label={detectiveUi.nav_map}
                    active={currentPath === '/map'}
                    onClick={() => navigate('/map')}
                />
                <NavButton
                    icon={<BookOpen className="w-5 h-5" />}
                    label={detectiveUi.nav_dossier}
                    active={isDossierOpen}
                    onClick={() => toggleDossier()}
                />
                <NavButton
                    icon={<User className="w-5 h-5" />}
                    label={detectiveUi.nav_profile}
                    active={currentPath === '/character'}
                    onClick={() => navigate('/character')}
                />
                {devDashboardEnabled && (
                    <NavButton
                        icon={<Wrench className="w-5 h-5" />}
                        label={sharedUi.label_dev_tools}
                        active={currentPath === '/developer'}
                        onClick={() => navigate('/developer')}
                    />
                )}
            </div>

            {/* Center: Quest Journal Link */}
            <div className="relative px-4 border-x border-[#ca8a04]/20 flex-1 flex justify-center">
                <button
                    onClick={() => navigate('/quests')}
                    className={cn(
                        "flex items-center gap-2 text-primary hover:text-white transition-colors group/case",
                        currentPath === '/quests' ? "opacity-100" : "opacity-80 hover:opacity-100"
                    )}
                    title={ui.nav_investigation}
                >
                    <Search className="w-4 h-4 text-[#ca8a04]" />
                    <div className="flex flex-col items-start leading-none">
                        <span className={cn(
                            "text-[10px] uppercase tracking-widest font-bold transition-colors",
                            currentPath === '/quests' ? "text-[#ca8a04]" : "text-[#8c7b6c]"
                        )}>{ui.nav_investigation}</span>
                        <span className="text-sm font-serif truncate max-w-[150px]">
                            {activeCase ? detectiveUi[`${activeCase.id}_title` as keyof typeof detectiveUi] || activeCase.title : ui.nav_journal}
                        </span>
                    </div>
                </button>
            </div>

            {/* Right: Locale Selector */}
            <div className="relative">
                <button
                    onClick={() => {
                        const currentIndex = LOCALES.findIndex(l => l.id === currentLocale);
                        const nextIndex = (currentIndex + 1) % LOCALES.length;
                        setLocale(LOCALES[nextIndex].id);
                    }}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-white/5 transition-all text-primary"
                    title="Switch Language"
                >
                    <Globe className="w-5 h-5 text-[#ca8a04]" />
                    <span className="text-xs font-bold uppercase">{currentLocale}</span>
                </button>
            </div>

        </div>
    );
};

interface NavButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

const NavButton = ({ icon, label, active, disabled, onClick }: NavButtonProps) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
            "flex flex-col items-center gap-1 group transition-all",
            disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"
        )}
    >
        <div className={cn(
            "p-2 rounded-full border transition-all duration-300",
            active
                ? "bg-[#ca8a04] border-[#ca8a04] text-surface shadow-[0_0_15px_rgba(202,138,4,0.4)]"
                : "bg-white/5 border-transparent text-primary group-hover:border-[#ca8a04]/50"
        )}>
            {icon}
        </div>
        <span className={cn(
            "text-[9px] uppercase tracking-tighter font-bold transition-opacity",
            active ? "text-[#ca8a04] opacity-100" : "text-[#8c7b6c] opacity-0 group-hover:opacity-100"
        )}>
            {label}
        </span>
    </button>
);
