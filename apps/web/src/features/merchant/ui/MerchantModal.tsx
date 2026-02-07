import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { InventoryGrid } from '../../../entities/inventory/ui/InventoryGrid';
import type { InventorySlot } from '../../../entities/inventory/model/types';
import { useInventoryStore } from '../../../entities/inventory/model/store';
import { createItem } from '../../../entities/inventory/model/types';

interface MerchantModalProps {
    isOpen: boolean;
    onClose: () => void;
    merchantName?: string;
}

// Mock Merchant Data (in real app, this would come from props or a store)
const MERCHANT_ITEMS: InventorySlot[] = [
    { itemId: 'lockpick', quantity: 5, item: createItem({ id: 'lockpick', name: 'Lockpick Set', description: 'Essential for quiet entry.', type: 'resource', icon: '🗝️', value: 80 }) },
    { itemId: 'map_fragment', quantity: 1, item: createItem({ id: 'map_fragment', name: 'Torn Map Fragment', description: 'Shows a hidden tunnel.', type: 'clue', icon: '🗺️', value: 200 }) },
    { itemId: 'whiskey', quantity: 2, item: createItem({ id: 'whiskey', name: 'Cheap Whiskey', description: 'Good for bribes.', type: 'consumable', icon: '🥃', value: 30 }) },
];

export const MerchantModal = ({ isOpen, onClose, merchantName = "The Fence" }: MerchantModalProps) => {
    const { items: playerItems, money, addItem, removeItem, addMoney, removeMoney } = useInventoryStore();

    // State for transaction
    const [merchantStock, setMerchantStock] = useState<InventorySlot[]>(MERCHANT_ITEMS);
    const [selectedPlayerSlot, setSelectedPlayerSlot] = useState<InventorySlot | null>(null);
    const [selectedMerchantSlot, setSelectedMerchantSlot] = useState<InventorySlot | null>(null);

    if (!isOpen) return null;

    const handleBuy = () => {
        if (!selectedMerchantSlot) return;
        const cost = selectedMerchantSlot.item.value;
        if (money >= cost) {
            // Deduct money
            if (removeMoney(cost)) {
                // Add to player
                addItem(selectedMerchantSlot.item);
                // Remove from merchant (mock logic)
                setMerchantStock(prev => {
                    const idx = prev.findIndex(s => s.itemId === selectedMerchantSlot.itemId);
                    if (idx === -1) return prev;
                    const newStock = [...prev];
                    if (newStock[idx].quantity > 1) {
                        newStock[idx].quantity--;
                    } else {
                        newStock.splice(idx, 1);
                    }
                    return newStock;
                });
                setSelectedMerchantSlot(null);
            }
        }
    };

    const handleSell = () => {
        if (!selectedPlayerSlot) return;
        const value = Math.floor(selectedPlayerSlot.item.value * 0.5); // Sell for 50% value

        // Remove from player
        removeItem(selectedPlayerSlot.itemId);
        // Add money
        addMoney(value);
        // Add to merchant (optional, maybe they don't keep what you sell)
        setSelectedPlayerSlot(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#1c1917] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-800 relative">

                {/* Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />

                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-[#2a2420] border-b border-[#3f3832] z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-800 rounded-full border-2 border-amber-700/50 flex items-center justify-center text-3xl shadow-inner">
                            👥
                        </div>
                        <div>
                            <h2 className="font-heading text-3xl text-[#d4c5a3]">{merchantName}</h2>
                            <p className="font-mono text-xs text-amber-700/80 italic">"I've not seen one of these in years..."</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-300 text-xl font-bold px-4">✕</button>
                </div>

                {/* Main Content - Split View */}
                <div className="flex-1 flex overflow-hidden relative z-20">

                    {/* Left: Merchant Stock (BUY) */}
                    <div className="flex-1 bg-[#151210] flex flex-col border-r border-stone-800">
                        <div className="p-4 bg-[#2a2018] border-b border-amber-900/30 flex justify-between items-center">
                            <h3 className="font-serif text-amber-600 font-bold uppercase tracking-widest">Stock</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <InventoryGrid
                                items={merchantStock}
                                onItemClick={(slot) => {
                                    setSelectedMerchantSlot(slot);
                                    setSelectedPlayerSlot(null); // Deselect other side
                                }}
                                selectedItemId={selectedMerchantSlot?.itemId}
                                className="grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                            />
                        </div>
                    </div>

                    {/* Right: Player Inventory (SELL) */}
                    <div className="flex-1 bg-[#24201d] flex flex-col">
                        <div className="p-4 bg-[#322d29] border-b border-stone-700/30 flex justify-between items-center">
                            <h3 className="font-serif text-stone-400 font-bold uppercase tracking-widest">My Evidence</h3>
                            <span className="font-mono text-stone-300">Wallet: <span className="text-amber-500">{money}</span> RM</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <InventoryGrid
                                items={playerItems}
                                onItemClick={(slot) => {
                                    setSelectedPlayerSlot(slot);
                                    setSelectedMerchantSlot(null); // Deselect other side
                                }}
                                selectedItemId={selectedPlayerSlot?.itemId}
                                className="grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Transaction Footer / Action Bar */}
                <div className="p-6 bg-[#161412] border-t border-stone-800 z-30 flex items-center justify-center min-h-[100px]">
                    {selectedMerchantSlot && (
                        <div className="flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
                            <div className="text-right">
                                <div className="text-stone-400 text-sm font-mono">Buying: {selectedMerchantSlot.item.name}</div>
                                <div className="text-amber-600 font-heading text-2xl">-{selectedMerchantSlot.item.value} RM</div>
                            </div>
                            <button
                                onClick={handleBuy}
                                disabled={money < selectedMerchantSlot.item.value}
                                className={cn(
                                    "px-8 py-3 bg-amber-700 text-amber-50 font-heading text-xl uppercase tracking-widest shadow-lg transition-all",
                                    money < selectedMerchantSlot.item.value ? "opacity-50 cursor-not-allowed grayscale" : "hover:bg-amber-600 hover:scale-105 active:scale-95"
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
                                className="px-8 py-3 bg-stone-700 text-stone-100 font-heading text-xl uppercase tracking-widest shadow-lg hover:bg-stone-600 hover:scale-105 active:scale-95 transition-all"
                            >
                                Sell
                            </button>
                            <div className="text-left">
                                <div className="text-stone-400 text-sm font-mono">Selling: {selectedPlayerSlot.item.name}</div>
                                <div className="text-green-700 font-heading text-2xl">+{Math.floor(selectedPlayerSlot.item.value * 0.5)} RM</div>
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
