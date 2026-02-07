import { useMemo, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { InventoryGrid } from '../../../entities/inventory/ui/InventoryGrid';
import type { InventorySlot } from '../../../entities/inventory/model/types';
import { useInventoryStore } from '../../../entities/inventory/model/store';
import { fromSharedItem } from '../../../entities/inventory/model/types';
import {
    ITEM_REGISTRY,
    getMerchantAccessResult,
    getMerchantBuyPrice,
    getMerchantDefinition,
    getMerchantSellPrice,
    getMerchantStock
} from '@repo/shared/data/items';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useWorldEngineStore } from '@/features/detective/engine/store';
import { useQuestStore } from '@/features/quests/store';
import { UserRound, X } from 'lucide-react';

interface MerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
    merchantId?: string;
    merchantName?: string;
}

const buildMerchantStock = (merchantId: string, questStages: Record<string, string>): InventorySlot[] => {
    const merchant = getMerchantDefinition(merchantId);
    const stock = getMerchantStock(merchant, questStages);

    return stock
        .map((entry) => {
            const itemDef = ITEM_REGISTRY[entry.itemId];
            if (!itemDef) return null;

            return {
                itemId: entry.itemId,
                quantity: entry.quantity,
                item: fromSharedItem(itemDef)
            };
        })
        .filter((slot): slot is InventorySlot => slot !== null);
};

const computeStockSessionKey = (merchantId: string, questStages: Record<string, string>): string => {
    const stageSignature = Object.entries(questStages)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([questId, stage]) => `${questId}:${stage}`)
        .join('|');
    return `${merchantId}|${stageSignature}`;
};

const applyPurchasedStock = (
    baseStock: InventorySlot[],
    purchasedByItemId: Record<string, number>
): InventorySlot[] =>
    baseStock
        .map((slot) => ({
            ...slot,
            quantity: slot.quantity - (purchasedByItemId[slot.itemId] ?? 0)
        }))
        .filter((slot) => slot.quantity > 0);

export const MerchantModal = ({ isOpen, onClose, merchantId = 'the_fence', merchantName }: MerchantModalProps) => {
    const { items: playerItems, money, addItem, removeItem, addMoney, removeMoney } = useInventoryStore();
    const flags = useDossierStore((state) => state.flags);
    const factions = useWorldEngineStore((state) => state.factions);
    const userQuests = useQuestStore((state) => state.userQuests);

    const merchant = useMemo(() => getMerchantDefinition(merchantId), [merchantId]);
    const displayName = merchantName ?? merchant.name;
    const questStages = useMemo(() => {
        const stages: Record<string, string> = {};
        Object.entries(userQuests).forEach(([questId, quest]) => {
            if (quest.stage) {
                stages[questId] = quest.stage;
            }
        });
        return stages;
    }, [userQuests]);

    const factionReputation = useMemo<Record<string, number>>(
        () => Object.fromEntries(factions.map((entry) => [entry.factionId, entry.reputation])),
        [factions]
    );

    const accessResult = useMemo(
        () => getMerchantAccessResult(merchant, { flags, factionReputation }),
        [merchant, flags, factionReputation]
    );
    const isTradeLocked = !accessResult.unlocked;

    const baseMerchantStock = useMemo(
        () => buildMerchantStock(merchant.id, questStages),
        [merchant.id, questStages]
    );
    const stockSessionKey = useMemo(
        () => computeStockSessionKey(merchant.id, questStages),
        [merchant.id, questStages]
    );
    const [purchasesBySession, setPurchasesBySession] = useState<Record<string, Record<string, number>>>({});
    const purchasedForSession = useMemo(
        () => purchasesBySession[stockSessionKey] ?? {},
        [purchasesBySession, stockSessionKey]
    );
    const merchantStock = useMemo(
        () => applyPurchasedStock(baseMerchantStock, purchasedForSession),
        [baseMerchantStock, purchasedForSession]
    );

    const [selectedPlayerItemId, setSelectedPlayerItemId] = useState<string | null>(null);
    const [selectedMerchantItemId, setSelectedMerchantItemId] = useState<string | null>(null);

    const selectedPlayerSlot = playerItems.find((slot) => slot.itemId === selectedPlayerItemId) ?? null;
    const selectedMerchantSlot = merchantStock.find((slot) => slot.itemId === selectedMerchantItemId) ?? null;

    if (!isOpen) return null;

    const buyCost = selectedMerchantSlot ? getMerchantBuyPrice(merchant, selectedMerchantSlot.item.value) : 0;
    const sellValue = selectedPlayerSlot ? getMerchantSellPrice(merchant, selectedPlayerSlot.item.value) : 0;

    const handleBuy = () => {
        if (!selectedMerchantSlot || isTradeLocked) return;
        if (money >= buyCost) {
            if (removeMoney(buyCost)) {
                addItem(selectedMerchantSlot.item);
                setPurchasesBySession((prev) => {
                    const session = prev[stockSessionKey] ?? {};
                    const nextSession = {
                        ...session,
                        [selectedMerchantSlot.itemId]: (session[selectedMerchantSlot.itemId] ?? 0) + 1
                    };
                    return {
                        ...prev,
                        [stockSessionKey]: nextSession
                    };
                });
                setSelectedMerchantItemId(null);
            }
        }
    };

    const handleSell = () => {
        if (!selectedPlayerSlot || isTradeLocked) return;
        removeItem(selectedPlayerSlot.itemId);
        addMoney(sellValue);
        setSelectedPlayerItemId(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#1c1917] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-800 relative">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />

                <div className="flex justify-between items-center p-6 bg-[#2a2420] border-b border-[#3f3832] z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-800 rounded-full border-2 border-amber-700/50 flex items-center justify-center text-3xl shadow-inner">
                            <UserRound size={28} className="text-amber-500/80" />
                        </div>
                        <div>
                            <h2 className="font-heading text-3xl text-[#d4c5a3]">{displayName}</h2>
                            <p className="font-mono text-xs text-amber-700/80 italic">
                                {merchant.roleNote ?? '"I have what you need, for the right price."'}
                            </p>
                            <p className="font-mono text-[10px] text-stone-400 mt-1">
                                Buy x{merchant.economy.buyMultiplier.toFixed(2)} / Sell x{merchant.economy.sellMultiplier.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-300 text-xl font-bold px-4">
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden relative z-20">
                    <div className="flex-1 bg-[#151210] flex flex-col border-r border-stone-800">
                        <div className="p-4 bg-[#2a2018] border-b border-amber-900/30 flex justify-between items-center">
                            <h3 className="font-serif text-amber-600 font-bold uppercase tracking-widest">Stock</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <InventoryGrid
                                items={merchantStock}
                                onItemClick={(slot) => {
                                    setSelectedMerchantItemId(slot.itemId);
                                    setSelectedPlayerItemId(null);
                                }}
                                selectedItemId={selectedMerchantItemId ?? undefined}
                                className="grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                            />
                        </div>
                    </div>

                    <div className="flex-1 bg-[#24201d] flex flex-col">
                        <div className="p-4 bg-[#322d29] border-b border-stone-700/30 flex justify-between items-center">
                            <h3 className="font-serif text-stone-400 font-bold uppercase tracking-widest">My Evidence</h3>
                            <span className="font-mono text-stone-300">Wallet: <span className="text-amber-500">{money}</span> RM</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <InventoryGrid
                                items={playerItems}
                                onItemClick={(slot) => {
                                    setSelectedPlayerItemId(slot.itemId);
                                    setSelectedMerchantItemId(null);
                                }}
                                selectedItemId={selectedPlayerItemId ?? undefined}
                                className="grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#161412] border-t border-stone-800 z-30 flex flex-col items-center justify-center min-h-[100px] gap-3">
                    {isTradeLocked && (
                        <div className="w-full max-w-3xl rounded border border-red-700/40 bg-red-950/40 text-red-200 px-4 py-3 font-mono text-xs uppercase tracking-wide text-center">
                            {accessResult.reason ?? 'This merchant does not trust you yet.'}
                        </div>
                    )}

                    {selectedMerchantSlot && (
                        <div className="flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
                            <div className="text-right">
                                <div className="text-stone-400 text-sm font-mono">Buying: {selectedMerchantSlot.item.name}</div>
                                <div className="text-amber-600 font-heading text-2xl">-{buyCost} RM</div>
                            </div>
                            <button
                                onClick={handleBuy}
                                disabled={isTradeLocked || money < buyCost}
                                className={cn(
                                    'px-8 py-3 bg-amber-700 text-amber-50 font-heading text-xl uppercase tracking-widest shadow-lg transition-all',
                                    isTradeLocked || money < buyCost
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:bg-amber-600 hover:scale-105 active:scale-95'
                                )}
                            >
                                Purchase
                            </button>
                        </div>
                    )}

                    {selectedPlayerSlot && (
                        <div className="flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
                            <button
                                onClick={handleSell}
                                disabled={isTradeLocked}
                                className={cn(
                                    'px-8 py-3 bg-stone-700 text-stone-100 font-heading text-xl uppercase tracking-widest shadow-lg transition-all',
                                    isTradeLocked
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:bg-stone-600 hover:scale-105 active:scale-95'
                                )}
                            >
                                Sell
                            </button>
                            <div className="text-left">
                                <div className="text-stone-400 text-sm font-mono">Selling: {selectedPlayerSlot.item.name}</div>
                                <div className="text-green-700 font-heading text-2xl">+{sellValue} RM</div>
                            </div>
                        </div>
                    )}

                    {!selectedPlayerSlot && !selectedMerchantSlot && (
                        <div className="text-stone-600 font-mono italic">Select an item to trade...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
