import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { DETECTIVE_CASES } from '@/features/detective/data/cases';
import {
    Globe,
    BookOpen,
    Map as MapIcon,
    Search,
    ChevronUp,
    ChevronDown,
    User,
    Wrench,
    Home
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const { locale: currentLocale, setLocale } = useVNStore();
    const {
        activeCaseId,
        setActiveCase,
        isDossierOpen,
        toggleDossier
    } = useDossierStore();

    // Local UI State
    const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
    const [isCaseMenuOpen, setIsCaseMenuOpen] = useState(false);

    const activeCase = activeCaseId ? DETECTIVE_CASES[activeCaseId] : null;
    const availableCases = Object.values(DETECTIVE_CASES);

    const currentPath = location.pathname;

    return (
        <div className="relative flex items-center justify-between px-6 py-3">

                    {/* Left: Navigation Buttons */}
                    <div className="flex items-center gap-4">
                        <NavButton
                            icon={<Home className="w-5 h-5" />}
                            label="Home"
                            active={currentPath === '/'}
                            onClick={() => navigate('/')}
                        />
                        <NavButton
                            icon={<MapIcon className="w-5 h-5" />}
                            label="Map"
                            active={currentPath === '/map'}
                            onClick={() => navigate('/map')}
                        />
                        <NavButton
                            icon={<BookOpen className="w-5 h-5" />}
                            label="Dossier"
                            active={isDossierOpen}
                            onClick={() => toggleDossier()}
                        />
                        <NavButton
                            icon={<User className="w-5 h-5" />}
                            label="Profile"
                            active={currentPath === '/character'}
                            onClick={() => navigate('/character')}
                        />
                        {devDashboardEnabled && (
                            <NavButton
                                icon={<Wrench className="w-5 h-5" />}
                                label="Dev"
                                active={currentPath === '/developer'}
                                onClick={() => navigate('/developer')}
                            />
                        )}
                    </div>

                    {/* Center: Case Selector (Consolidated MapHUD) */}
                    <div className="relative px-4 border-x border-[#ca8a04]/20 flex-1 flex justify-center">
                        <button
                            onClick={() => setIsCaseMenuOpen(!isCaseMenuOpen)}
                            className="flex items-center gap-2 text-primary hover:text-white transition-colors group/case"
                        >
                            <Search className="w-4 h-4 text-[#ca8a04]" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[10px] uppercase tracking-widest text-[#8c7b6c] font-bold">Investigation</span>
                                <span className="text-sm font-serif truncate max-w-[150px]">
                                    {activeCase?.title || "None Selected"}
                                </span>
                            </div>
                            {isCaseMenuOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                        </button>

                        {/* Case Dropup */}
                        {isCaseMenuOpen && (
                            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 bg-surface/95 border border-[#ca8a04]/30 p-2 rounded-lg shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="text-[10px] text-[#8c7b6c] uppercase font-bold p-2 mb-1 border-b border-[#ca8a04]/10">Available Cases</div>
                                {availableCases.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            setActiveCase(c.id);
                                            setIsCaseMenuOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left p-2 rounded text-sm transition-colors font-serif",
                                            activeCaseId === c.id
                                                ? "bg-[#ca8a04]/20 text-[#ca8a04]"
                                                : "text-primary hover:bg-white/5"
                                        )}
                                    >
                                        {c.title}
                                    </button>
                                ))}
                                <button
                                    onClick={() => { setActiveCase(null); setIsCaseMenuOpen(false); }}
                                    className="w-full text-left p-2 rounded text-xs text-[#8c7b6c] hover:bg-white/5 italic"
                                >
                                    Close investigation
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Locale Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)}
                            className="flex items-center gap-2 p-2 rounded-full hover:bg-white/5 transition-all text-primary"
                        >
                            <Globe className="w-5 h-5 text-[#ca8a04]" />
                            <span className="text-xs font-bold uppercase">{currentLocale}</span>
                        </button>

                        {/* Locale Dropup */}
                        {isLocaleMenuOpen && (
                            <div className="absolute bottom-full right-0 mb-4 bg-surface/95 border border-[#ca8a04]/30 p-1 rounded-full shadow-2xl backdrop-blur-xl flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                {LOCALES.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => {
                                            setLocale(loc.id);
                                            setIsLocaleMenuOpen(false);
                                        }}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all",
                                            currentLocale === loc.id ? "bg-[#ca8a04] scale-110" : "hover:bg-white/10"
                                        )}
                                        title={loc.name}
                                    >
                                        {loc.flag}
                                    </button>
                                ))}
                            </div>
                        )}
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
