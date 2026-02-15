import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    isDestructive = false,
}) => {
    const { t } = useTranslation('common');

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className={cn(
                "relative w-full max-w-md shadow-2xl overflow-hidden transform transition-all border border-[#2a2420]/20 rounded-lg",
                "bg-[#fdfaf5]",
                "before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-50 before:mix-blend-multiply before:pointer-events-none"
            )}>
                <div className="p-8 relative z-10 flex flex-col gap-6 text-center">
                    <div>
                        <h2 className={cn(
                            "font-serif text-2xl font-bold mb-2 uppercase tracking-wide",
                            isDestructive ? "text-red-900" : "text-[#2a2420]"
                        )}>
                            {title}
                        </h2>
                        <div className="h-0.5 w-16 bg-[#2a2420]/20 mx-auto mb-4" />
                        <p className="font-serif text-[#5c554f] text-lg leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 border border-[#d4c5a3] text-[#8b7e66] font-bold uppercase tracking-wider hover:bg-[#ebe5d5] hover:text-[#5c554f] transition-all text-sm rounded"
                        >
                            {cancelLabel || t('cancel', 'Cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={cn(
                                "flex-1 py-3 font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-sm rounded text-[#fdfaf5]",
                                isDestructive
                                    ? "bg-red-900 hover:bg-red-800"
                                    : "bg-[#2a2420] hover:bg-[#403630]"
                            )}
                        >
                            {confirmLabel || t('confirm', 'Confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
