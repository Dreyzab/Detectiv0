import { create } from 'zustand';

interface MerchantUiState {
    isOpen: boolean;
    merchantId: string;
    openMerchant: (merchantId?: string) => void;
    closeMerchant: () => void;
}

export const useMerchantUiStore = create<MerchantUiState>((set) => ({
    isOpen: false,
    merchantId: 'the_fence',
    openMerchant: (merchantId = 'the_fence') => set({
        isOpen: true,
        merchantId
    }),
    closeMerchant: () => set({
        isOpen: false
    })
}));

