import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '../entities/inventory/model/store';
import { Button } from '../shared/ui/Button';

export const HomePage = () => {
    const navigate = useNavigate();
    const setGameMode = useInventoryStore(state => state.setGameMode);

    const startDetectiveMode = () => {
        setGameMode('detective');
        navigate('/map');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 gap-8">
            <h1 className="text-4xl font-bold mb-8 text-[#d4c5a3] font-serif">Grezwanderer 4</h1>

            <div className="max-w-2xl w-full">
                {/* Detective Mode Card */}
                <div className="bg-[#1a1612] p-8 rounded-xl border border-[#d4c5a3] shadow-2xl hover:border-amber-500 transition-all flex flex-col items-center gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <h2 className="text-3xl font-serif font-bold text-[#d4c5a3]">Archiv: Freiburg 1905</h2>
                    <p className="text-center text-[#8c7b6c] font-serif italic text-lg">Investigate the cold cases of the past. Logic is your weapon.</p>
                    <Button
                        onClick={startDetectiveMode}
                        className="w-full h-14 bg-[#8c7b6c] hover:bg-[#a69584] text-[#1a1612] font-serif font-bold border border-[#d4c5a3] text-xl"
                    >
                        Open Case File
                    </Button>
                </div>
            </div>

            <div className="mt-12 flex gap-4 text-sm text-slate-500">
                <button onClick={() => navigate('/scanner')} className="hover:text-blue-400">QR Scanner</button>
                <span>•</span>
                <button onClick={() => navigate('/settings')} className="hover:text-blue-400">Settings</button>
            </div>
        </div>
    );
};
