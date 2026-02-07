import React, { useState } from 'react';
import { useInventoryStore } from '../../entities/inventory/model/store';
import { InventoryGrid } from '../../entities/inventory/ui/InventoryGrid';
import type { InventorySlot } from '../../entities/inventory/model/types';
import { createItem } from '../../entities/inventory/model/types';
import { MerchantModal } from '../../features/merchant/ui/MerchantModal';

export const InventoryPage = () => {
    const { items, money, addItem, removeItem } = useInventoryStore();
    const [selectedSlot, setSelectedSlot] = useState<InventorySlot | null>(null);
    const [showMerchant, setShowMerchant] = useState(false);

    // Initial mock data for testing if empty
    React.useEffect(() => {
        if (items.length === 0) {
            addItem(createItem({ id: 'key', name: 'Rusty Key', description: 'Opens the old basement door.', type: 'key_item', icon: '🔑', value: 0 }));
            addItem(createItem({ id: 'coin', name: 'Strange Coin', description: 'An old coin with unknown symbols.', type: 'clue', icon: '🪙', value: 50 }));
            addItem(createItem({ id: 'cig', name: 'Half-smoked Cigarette', description: 'Found at the scene. Brand: "Gitanes".', type: 'clue', icon: '🚬', value: 0 }));
            addItem(createItem({ id: 'bread', name: 'Stale Bread', description: 'Better than nothing.', type: 'consumable', icon: '🥖', value: 2, stackable: true }), 3);
        }
    }, []);

    const handleItemClick = (slot: InventorySlot) => {
        setSelectedSlot(slot);
    };

    const handleCloseDetail = () => {
        setSelectedSlot(null);
    };

    return (
        <div className="min-h-screen bg-stone-100 relative overflow-hidden flex flex-col pt-16 font-body">
            {/* Background Texture (CSS layer) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

            <div className="container mx-auto max-w-5xl px-4 relative z-10 flex-1 flex flex-col">

                {/* Header Section */}
                <div className="flex justify-between items-end mb-8 border-b-2 border-stone-800 pb-2">
                    <h1 className="font-heading text-5xl text-stone-900 tracking-tighter uppercase transform -rotate-1 origin-bottom-left">
                        Evidence & Flotsam
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowMerchant(true)}
                            className="font-mono text-sm uppercase bg-stone-800 text-amber-500 px-3 py-1 hover:bg-stone-900 transition-colors"
                        >
                            Open Fence
                        </button>
                        <div className="font-mono text-xl text-stone-700 -rotate-2 bg-white/50 px-3 py-1 border border-stone-300 shadow-sm">
                            Reichsmarks: <span className="font-bold text-orange-700">{money}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Grid + Detail View */}
                <div className="flex-1 flex gap-8 relative">

                    {/* Inventory Grid */}
                    <div className="flex-1 bg-stone-50/50 rounded-sm border border-stone-200 shadow-inner min-h-[60vh]">
                        <InventoryGrid
                            items={items}
                            onItemClick={handleItemClick}
                            selectedItemId={selectedSlot?.itemId}
                        />
                    </div>

                    {/* Detail Overlay / Sidebar (Paperclip Note style) */}
                    {selectedSlot && (
                        <div className="absolute top-10 right-10 md:relative md:top-0 md:right-0 w-80 z-30 perspective-1000">
                            <div className="bg-[#fefce8] p-6 shadow-2xl transform rotate-2 border border-stone-300 relative animate-in slide-in-from-right duration-300" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Paperclip visual */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-zinc-300 rounded-full border-2 border-zinc-400 z-40" />

                                <div className="mb-4 flex flex-col items-center">
                                    <div className="text-6xl mb-2">{selectedSlot.item.icon}</div>
                                    <h2 className="font-heading text-2xl text-center leading-none">{selectedSlot.item.name}</h2>
                                    <span className="font-mono text-xs uppercase tracking-widest text-stone-500 mt-1">{selectedSlot.item.type}</span>
                                </div>

                                <p className="font-mono text-sm text-stone-800 leading-relaxed mb-6 border-t border-b border-stone-200 py-4 my-4">
                                    {selectedSlot.item.description}
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button className="w-full py-2 bg-stone-800 text-stone-100 font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors shadow-lg active:translate-y-0.5">
                                        Use / Inspect
                                    </button>
                                    <button
                                        className="w-full py-2 border-2 border-red-800/30 text-red-900 font-bold uppercase tracking-widest hover:bg-red-50 hover:border-red-800 transition-colors"
                                        onClick={() => {
                                            removeItem(selectedSlot.itemId);
                                            setSelectedSlot(null);
                                        }}
                                    >
                                        Discard
                                    </button>
                                </div>

                                <button
                                    onClick={handleCloseDetail}
                                    className="absolute top-2 right-2 text-stone-400 hover:text-stone-800"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <MerchantModal isOpen={showMerchant} onClose={() => setShowMerchant(false)} />
        </div>
    );
};
