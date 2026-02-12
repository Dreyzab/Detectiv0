import { Link } from 'react-router-dom';
import { MindPalaceBoard } from '../../features/detective/mind-palace/MindPalaceBoard';
import { useDossierStore } from '../../features/detective/dossier/store';
import { DEDUCTION_REGISTRY } from '../../features/detective/lib/deductions';
import { useTranslation } from 'react-i18next';

const MindPalacePage = () => {
    const unlockedDeductions = useDossierStore(state => state.unlockedDeductions);
    const totalDeductions = Object.keys(DEDUCTION_REGISTRY).length;
    const { t } = useTranslation('detective');

    return (
        <div className="fixed inset-0 bg-[#0f0d0a] flex flex-col overflow-hidden">
            {/* Background texture layer */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'url(/images/detective/deduction_board_bg.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            {/* Vignette overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
            }} />

            {/* Header */}
            <header className="relative z-30 flex items-center justify-between px-4 py-3 border-b border-amber-900/30">
                {/* Back button */}
                <Link
                    to="/map"
                    className="text-amber-400/70 hover:text-amber-300 transition-colors font-mono text-xs tracking-wider uppercase flex items-center gap-1"
                >
                    <span>←</span>
                    <span className="hidden sm:inline">
                        {t('nav.map', { defaultValue: 'Map' })}
                    </span>
                </Link>

                {/* Title */}
                <div className="flex items-center gap-2">
                    <span className="text-amber-500/60 text-sm">◆</span>
                    <h1 className="text-amber-200 font-serif text-lg sm:text-xl tracking-[0.2em] uppercase font-bold">
                        {t('mindPalace.title', { defaultValue: 'Deduktion' })}
                    </h1>
                    <span className="text-amber-500/60 text-sm">◆</span>
                </div>

                {/* Progress */}
                <div className="text-amber-400/50 font-mono text-[10px] tracking-wider">
                    {unlockedDeductions.length}/{totalDeductions}
                </div>
            </header>

            {/* Main board */}
            <main className="relative z-20 flex-1 overflow-hidden">
                <MindPalaceBoard />
            </main>
        </div>
    );
};

export default MindPalacePage;
