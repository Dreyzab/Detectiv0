
import { useDossierStore } from '@/features/detective/dossier/store';
import { DETECTIVE_CASES } from '@/features/detective/data/cases';


export const MapHUD = () => {
    const { activeCaseId, setActiveCase } = useDossierStore();

    const activeCase = activeCaseId ? DETECTIVE_CASES[activeCaseId] : null;

    // Get all available cases (mock for now, could be dynamic based on player progress)
    const availableCases = Object.values(DETECTIVE_CASES);

    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-[#1a1612]/90 border border-[#d4c5a3] p-3 rounded shadow-xl backdrop-blur-sm max-w-sm">
                <label className="text-xs text-[#8c7b6c] uppercase font-bold tracking-wider mb-1 block">
                    Current Investigation
                </label>

                <select
                    className="w-full bg-[#2a241e] text-[#d4c5a3] border border-[#d4c5a3]/30 p-2 font-serif text-sm rounded focus:outline-none focus:border-[#d4c5a3]"
                    value={activeCaseId || ''}
                    onChange={(e) => setActiveCase(e.target.value || null)}
                >
                    <option value="">-- No Active Investigation --</option>
                    {availableCases.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>

                {activeCase && (
                    <div className="mt-2 text-xs text-[#d4c5a3]/80 italic border-t border-[#d4c5a3]/20 pt-2">
                        {activeCase.description}
                    </div>
                )}
            </div>
        </div>
    );
};
