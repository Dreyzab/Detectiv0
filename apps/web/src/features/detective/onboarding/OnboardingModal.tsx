
import React, { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { useVNStore } from '@/entities/visual-novel/model/store';
import { DETECTIVE_UI } from '@/features/detective/locales';
import { asLocale } from '@/features/quests/utils';

interface OnboardingModalProps {
    onComplete: (name: string) => void
    onCancel: () => void
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onCancel }) => {
    const [name, setName] = useState('')
    const [touched, setTouched] = useState(false)
    const { locale } = useVNStore();
    const ui = DETECTIVE_UI[asLocale(locale)];

    const handleSubmit = () => {
        if (!name.trim()) {
            setTouched(true)
            return
        }
        onComplete(name.trim())
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
            {/* Card Container - CSS Paper Style */}
            <div className={cn(
                "relative w-full max-w-xl shadow-2xl overflow-hidden transform transition-all border border-[#2a2420]/10",
                "bg-[#fdfaf5]", // Base Paper Color
                // Subtle grain texture
                "before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-50 before:mix-blend-multiply before:pointer-events-none"
            )}>

                {/* Decorative Top Border (Telegraph style) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2a2420] via-transparent to-[#2a2420] opacity-90"></div>

                {/* Telegraph pattern divider */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-repeating-linear-gradient-45 from-[#2a2420] via-[#2a2420] to-transparent bg-[length:10px_10px] opacity-10"></div>

                <div className="p-10 md:p-12 relative z-10 flex flex-col items-center text-center">

                    {/* "URGENT" Stamp */}
                    <div className="absolute top-8 right-8 mix-blend-multiply opacity-80 transform rotate-12 pointer-events-none select-none">
                        <div className="border-4 border-red-800 rounded px-2 py-1">
                            <span className="text-red-800 font-bold font-serif text-sm uppercase tracking-[0.2em]">URGENT</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8 border-b-2 border-[#2a2420] w-full pb-4">
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-[#2a2420] tracking-tight uppercase mb-2">
                            Telegram
                        </h1>
                        <div className="flex justify-between w-full font-mono text-xs uppercase tracking-widest text-[#5c554f]">
                            <span>NO. 724-B</span>
                            <span>ORIGIN: BERLIN</span>
                            <span>DATE: 14 OCT 1905</span>
                        </div>
                    </div>

                    {/* Typewriter Body */}
                    <div className="font-mono text-[#2a2420] text-sm md:text-base leading-relaxed text-left w-full space-y-4 mb-8">
                        <p>
                            <strong className="bg-[#2a2420] text-[#fdfaf5] px-1">STOP.</strong> {ui.onboarding_telegram_message}
                        </p>
                        <p className="pt-2 italic text-[#5c554f]">
                            IDENTIFY YOURSELF FOR CLEARANCE BELOW.
                        </p>
                    </div>

                    {/* Input Field (Handwritten Style) */}
                    <div className="w-full relative group mb-10">
                        <label htmlFor="inspector-name" className="sr-only">Inspector Name Signature</label>
                        <input
                            id="inspector-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (touched) setTouched(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit()
                            }}
                            placeholder="Sign Name Here..."
                            className={cn(
                                "w-full bg-transparent border-b-2 border-[#a8a29e] text-[#1a1612] text-3xl font-serif italic text-center py-3 focus:outline-none focus:border-[#8b2323] transition-colors placeholder:text-[#d6d3ce]",
                                "placeholder:italic placeholder:opacity-50",
                                touched && !name.trim() && "border-red-500 placeholder:text-red-300"
                            )}
                            autoFocus
                        />
                        {touched && !name.trim() && (
                            <span className="absolute -bottom-6 left-0 right-0 text-xs text-red-600 font-mono uppercase tracking-widest animate-pulse">
                                Signature Required
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-5 border-2 border-[#d4c5a3] text-[#8b7e66] font-bold uppercase tracking-[0.15em] hover:bg-[#ebe5d5] hover:text-[#5c554f] transition-all text-base active:scale-95"
                        >
                            Refuse
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-[2] py-5 bg-[#2a2420] text-[#fdfaf5] font-bold uppercase tracking-[0.15em] shadow-lg hover:bg-[#403630] active:translate-y-[1px] active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2 group"
                        >
                            <span>{ui.onboarding_ack}</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                {/* Bottom decorative footer */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#e6ded1] border-t border-[#d4c5a3] flex items-center justify-center">
                    <span className="text-[10px] text-[#8b7e66] font-mono tracking-[0.3em] uppercase">Official Document • Do Not Discard</span>
                </div>
            </div>
        </div>
    )
}
