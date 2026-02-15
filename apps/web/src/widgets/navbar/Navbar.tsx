import { Link, useLocation } from 'react-router-dom';
import { Home, Map, QrCode, Settings, Terminal, User, type LucideIcon } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

// Checking imports in HomePage: no 'cn' or 'clsx' used.
// I will standard className strings for safety or check if standard/shared/lib/css exists.
// Let's use template literals and conditional logic for simplicity or import 'clsx' if installed.
// "import { Button } from '../shared/ui/Button';" is used.
// Let's stick to standard Tailwind classes.

const NavItem = ({ to, icon: Icon, label, isActive }: { to: string; icon: LucideIcon; label: string; isActive: boolean }) => (
    <Link
        to={to}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${isActive ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'
            }`}
    >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </Link>
);

export const Navbar = () => {
    const { t } = useTranslation('common');
    const location = useLocation();
    const pathname = location.pathname;
    const isVnRoute = pathname.includes('/vn/');
    const isMapRoute = pathname === '/map' || /^\/city\/[^/]+\/map$/.test(pathname);
    const isScannerRoute = pathname === '/scanner' || pathname.startsWith('/scanner/');
    const shouldRenderMobileTopSpacer = !(isMapRoute || isScannerRoute);

    // Hide navbar on VN pages logic?
    // User requested "redesign HomePage and Navbar".
    // Typically VN plays in full screen.
    // But let's keep it simple first.
    // If route starts with /vn/, maybe hide? 
    // Usually Visual Novels want immersion.
    // Let's hide on /vn/ routes.
    if (isVnRoute) return null;

    return (
        <>
            {shouldRenderMobileTopSpacer && (
                <div
                    aria-hidden="true"
                    className="md:hidden"
                    style={{ height: 'calc(max(env(safe-area-inset-top), 0.75rem) + 2.75rem)' }}
                />
            )}

            <div
                className="fixed left-1/2 -translate-x-1/2 z-50 md:hidden"
                style={{ top: 'max(env(safe-area-inset-top), 0.75rem)' }}
            >
                <div className="bg-stone-900/80 border border-stone-700/80 rounded-full px-2 py-1 shadow-lg backdrop-blur-sm">
                    <LanguageSwitcher />
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 hidden md:flex items-center justify-center px-4">
                {/* Desktop/Tablet View - Centered Floating or just same logic? */}
                {/* For now, let's use the same layout for simplicity as "Phone format" is priority, 
                   but usually desktop has it at top.
                   However, let's stick to the requested "Phone format" focus. 
                   I will make it a bottom bar for mobile (default) and valid for desktop too for now.
               */}
                <div className="flex items-center justify-around w-full max-w-md mx-auto h-full">
                    <NavItem to="/" icon={Home} label={t('nav.home')} isActive={pathname === '/'} />
                    <NavItem to="/map" icon={Map} label={t('nav.map')} isActive={pathname === '/map'} />
                    <NavItem to="/character" icon={User} label={t('nav.dossier')} isActive={pathname === '/character'} />
                    <NavItem to="/scanner" icon={QrCode} label={t('nav.scanner')} isActive={pathname === '/scanner'} />
                    <NavItem to="/settings" icon={Settings} label={t('nav.settings')} isActive={pathname === '/settings'} />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <LanguageSwitcher />
                </div>
            </nav>

            {/* Mobile Bottom Navigation - default visible */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-[safe-area-inset-bottom+4rem] pb-[safe-area-inset-bottom] bg-stone-950/95 backdrop-blur-md border-t border-stone-800 flex md:hidden items-center px-2">
                <div className="flex items-center justify-between w-full h-16">
                    <NavItem to="/" icon={Home} label={t('nav.home')} isActive={pathname === '/'} />
                    <NavItem to="/map" icon={Map} label={t('nav.map')} isActive={pathname === '/map'} />
                    <NavItem to="/character" icon={User} label={t('nav.dossier')} isActive={pathname === '/character'} />
                    <NavItem to="/scanner" icon={QrCode} label={t('nav.scanner')} isActive={pathname === '/scanner'} />
                    {/* <NavItem to="/developer" icon={Terminal} label="Debug" isActive={pathname === '/developer'} /> */}
                    {/* Only show debug if enabled? Or just put it there. User asked for it. */}
                    <Link
                        to="/developer"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${pathname === '/developer' ? 'text-red-500' : 'text-stone-600 hover:text-stone-400'
                            }`}
                    >
                        <Terminal size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.devTools')}</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};
