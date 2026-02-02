
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useBattleStore } from './store';
import { SCENARIOS, CARD_REGISTRY } from './constants';
import { UnitStatus } from './components/UnitStatus';
import { Card } from './components/Card';
import { Swords, RotateCcw, Play, ArrowUp } from 'lucide-react';
import { VisualEvent } from './types';

// --- Sound Utility ---
const playSynthSound = (type: VisualEvent['type']) => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter(); // Added filter for atmospheric control
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'damage') {
        // "The Impact" - A low, dull thud. Like a heavy book slamming shut.
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now); // Muffle the harshness
        
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15); // Quick drop in pitch
        
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.25);

    } else if (type === 'block') {
        // "The Deflect" - A sharp mechanical click. Like a revolver hammer or typewriter key.
        osc.type = 'square'; // Square wave for mechanical click
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now); // Focus on high mids
        
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05); // Very fast drop
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05); // Short duration
        
        osc.start(now);
        osc.stop(now + 0.1);

    } else if (type === 'heal') {
        // "Composure" - A warm, subtle swell. Calm and jazzy.
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc.frequency.setValueAtTime(146.83, now); // D3
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.3); // Slow attack
        gain.gain.linearRampToValueAtTime(0, now + 0.8);  // Slow decay
        
        osc.start(now);
        osc.stop(now + 1.0);

    } else if (type === 'buff') {
        // "The Clue" - A mysterious high shimmer.
        osc.type = 'triangle';
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);
        
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.linearRampToValueAtTime(1760, now + 0.2); // Slide up to A6
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }
};

// --- Floating Text Component ---
const FloatingText: React.FC<{ event: VisualEvent; onComplete: () => void }> = ({ event, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1200); // Duration of animation
        // Play sound on mount
        playSynthSound(event.type);
        return () => clearTimeout(timer);
    }, [event, onComplete]);

    let color = 'text-white';
    let icon = '';
    if (event.type === 'damage') { color = 'text-red-500'; icon = '-'; }
    if (event.type === 'heal') { color = 'text-green-400'; icon = '+'; }
    if (event.type === 'block') { color = 'text-blue-400'; icon = ''; }
    if (event.type === 'buff') { color = 'text-yellow-400'; icon = ''; }

    const isOpponent = event.target === 'opponent';
    
    // Position Logic (Simple approximate positions)
    const style: React.CSSProperties = isOpponent 
        ? { top: '30%', right: '25%' } 
        : { bottom: '35%', left: '25%' };

    return (
        <div 
            className={`absolute z-50 pointer-events-none font-display font-bold text-4xl drop-shadow-lg ${color} animate-float-up`}
            style={style}
        >
            {icon}{event.value}
        </div>
    );
};


interface DragState {
  index: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  startWidth: number;
}

const PLAY_THRESHOLD_RATIO = 0.6; // Top 60% of the screen triggers the card

const BattlePage: React.FC = () => {
  const { 
    scenario, 
    player, 
    opponent, 
    turnPhase, 
    log, 
    visualQueue,
    initializeBattle, 
    playCard, 
    endTurn,
    resetGame,
    dismissVisualEvent
  } = useBattleStore();

  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  // Initialize with first scenario if not running
  useEffect(() => {
    if (!scenario) {
      // Auto-start first scenario for demo
      // initializeBattle(SCENARIOS[0]);
    }
  }, [scenario, initializeBattle]);

  // Global Pointer Events for Dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      
      const newDragState = {
        ...dragRef.current,
        currentX: e.clientX,
        currentY: e.clientY
      };
      
      dragRef.current = newDragState;
      setDragState(newDragState);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragRef.current) return;
      
      const { startX, startY, currentX, currentY, index } = dragRef.current;
      
      const dist = Math.hypot(currentX - startX, currentY - startY);
      const playThreshold = window.innerHeight * PLAY_THRESHOLD_RATIO;
      const isAboveThreshold = currentY < playThreshold;

      // Play if dragged above threshold OR if clicked (minimal movement)
      if (isAboveThreshold) {
        playCard(index);
      } else if (dist < 10) {
        playCard(index);
      }

      setDragState(null);
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [playCard]);

  const handleCardPointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow left click
    if (e.button !== 0) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const newDragState: DragState = {
      index,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      offsetX,
      offsetY,
      startWidth: rect.width
    };

    setDragState(newDragState);
    dragRef.current = newDragState;
    
    try {
        target.releasePointerCapture(e.pointerId);
    } catch (err) {
        // Ignore
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 select-none">
        <h1 className="text-5xl font-display font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600">
          DIALOGUE DUELS
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {SCENARIOS.map(s => (
                <button 
                    key={s.id}
                    onClick={() => initializeBattle(s)}
                    className="group bg-slate-900 border border-slate-700 p-8 rounded-2xl hover:border-blue-500 transition-all text-left relative overflow-hidden hover:shadow-2xl hover:shadow-blue-900/20"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-2xl font-bold mb-2 font-display">{s.title}</h3>
                    <p className="text-slate-400 mb-4">{s.difficulty} Encounter</p>
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                        <Swords size={16} />
                        <span>Start Duel</span>
                    </div>
                </button>
            ))}
        </div>
      </div>
    );
  }

  const isPlayerTurn = turnPhase === 'player_action';
  const nextMoveCard = opponent.nextMoveId ? CARD_REGISTRY[opponent.nextMoveId] : null;

  const playThresholdPx = typeof window !== 'undefined' ? window.innerHeight * PLAY_THRESHOLD_RATIO : 0;
  const isDraggingAboveThreshold = dragState && dragState.currentY < playThresholdPx;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col font-sans relative select-none touch-none">
        <style>{`
            @keyframes float-up {
                0% { opacity: 0; transform: translateY(0) scale(0.5); }
                20% { opacity: 1; transform: translateY(-20px) scale(1.2); }
                80% { opacity: 1; transform: translateY(-60px) scale(1); }
                100% { opacity: 0; transform: translateY(-80px) scale(0.8); }
            }
            .animate-float-up {
                animation: float-up 1.2s ease-out forwards;
            }
        `}</style>

        {/* Background Ambient */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Visual Effects Layer */}
        {visualQueue.map(event => (
            <FloatingText 
                key={event.id} 
                event={event} 
                onComplete={() => dismissVisualEvent(event.id)} 
            />
        ))}

        {/* Drop Zone Visual Indicator */}
        <div 
            className={`absolute top-0 left-0 w-full transition-all duration-300 pointer-events-none z-0
                ${dragState ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ 
                height: `${PLAY_THRESHOLD_RATIO * 100}%`,
                background: isDraggingAboveThreshold 
                    ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.0))' 
                    : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent)' 
            }}
        >
            <div className={`absolute bottom-0 w-full flex justify-center pb-4 transition-transform duration-300 ${isDraggingAboveThreshold ? '-translate-y-2 scale-110' : ''}`}>
                 <span className={`text-sm uppercase tracking-widest font-display flex items-center gap-2 ${isDraggingAboveThreshold ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                    <ArrowUp size={16} className={isDraggingAboveThreshold ? 'animate-bounce' : ''} /> 
                    {isDraggingAboveThreshold ? 'Release to Play' : 'Drag Here'}
                 </span>
            </div>
            <div className={`absolute bottom-0 w-full border-b border-dashed transition-colors duration-300 ${isDraggingAboveThreshold ? 'border-blue-500/50' : 'border-slate-700/50'}`} />
        </div>

        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-20">
            <div className="font-display font-bold tracking-widest text-slate-500">
                SCENARIO: <span className="text-white">{scenario.title}</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                    <RotateCcw size={20} />
                </button>
            </div>
        </header>

        {/* Battle Arena */}
        <main className="flex-1 flex flex-col relative z-10">
            
            {/* Opponent Area */}
            <div className="flex-1 flex items-center justify-center pt-8 pb-4 relative">
                <div className="max-w-4xl w-full flex justify-end px-12">
                     <UnitStatus 
                        entity={opponent} 
                        isOpponent 
                        intention={opponent.nextMoveId} 
                    />
                </div>
                
                {/* Intention Bubble */}
                {nextMoveCard && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mt-[-20px] bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-lg backdrop-blur text-sm flex flex-col items-center gap-1 shadow-xl">
                        <span className="text-xs text-slate-400 uppercase tracking-widest">Enemy Intent</span>
                        <span className="font-bold text-red-400 flex items-center gap-2">
                            {nextMoveCard.name}
                            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-600">
                                {nextMoveCard.effects[0].type.toUpperCase()} {nextMoveCard.effects[0].value}
                            </span>
                        </span>
                    </div>
                )}
            </div>

            {/* Mid Section: Log & Turn Indicator */}
            <div className="h-32 flex items-center justify-between px-12 pointer-events-none">
                 {/* Battle Log (Recent) */}
                 <div className="w-80 h-full overflow-hidden flex flex-col justify-end text-sm space-y-1 opacity-70 mask-image-b">
                    {log.slice(-3).map((l, i) => (
                        <div key={i} className="bg-black/50 px-3 py-1 rounded border-l-2 border-slate-600 text-slate-300">
                            {l}
                        </div>
                    ))}
                 </div>
                 
                 {/* Turn Status */}
                 <div className="text-center">
                    {turnPhase === 'player_action' && <div className="text-blue-400 font-display text-xl tracking-widest animate-pulse">YOUR TURN</div>}
                    {turnPhase === 'opponent_turn' && <div className="text-red-500 font-display text-xl tracking-widest">OPPONENT ACTING...</div>}
                    {turnPhase === 'victory' && <div className="text-green-400 font-display text-4xl tracking-widest font-bold">VICTORY</div>}
                    {turnPhase === 'defeat' && <div className="text-red-600 font-display text-4xl tracking-widest font-bold">DEFEAT</div>}
                 </div>

                 <div className="w-80" /> {/* Spacer */}
            </div>

            {/* Player Area */}
            <div className="flex-1 flex flex-col justify-end pb-8">
                {/* Player Stats Bar */}
                <div className="max-w-4xl w-full mx-auto flex items-end justify-between px-12 mb-6">
                    <UnitStatus entity={player} />
                    
                    {/* AP Display */}
                    <div className="flex flex-col items-center gap-1 mb-2">
                        <div className="flex gap-1">
                            {Array.from({ length: player.maxAP }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-4 h-8 rounded-sm transition-all duration-300 ${i < player.currentAP ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-slate-800 border border-slate-700'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500 tracking-widest">ACTIONS</span>
                    </div>

                    <button 
                        onClick={endTurn}
                        disabled={!isPlayerTurn}
                        className={`
                            px-8 py-4 rounded-xl font-display font-bold tracking-wider text-lg transition-all
                            flex items-center gap-3
                            ${isPlayerTurn 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 active:translate-y-0' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        END TURN
                        <Play size={20} className={isPlayerTurn ? "" : "opacity-0"} />
                    </button>
                </div>

                {/* Hand */}
                <div className="h-64 flex items-center justify-center perspective-1000 relative z-20">
                    <div className="flex items-end justify-center -space-x-4 hover:space-x-1 transition-all duration-300 px-8 pb-4">
                        {player.hand.map((card, idx) => {
                            const isBeingDragged = dragState?.index === idx;
                            return (
                                <div 
                                    key={`${card.id}-${idx}`} 
                                    className={`transition-transform duration-300 origin-bottom ${isBeingDragged ? 'opacity-0 pointer-events-none' : 'hover:-translate-y-8 hover:z-20'}`}
                                    style={{
                                        transform: `rotate(${(idx - (player.hand.length - 1) / 2) * 3}deg) translateY(${Math.abs(idx - (player.hand.length - 1) / 2) * 5}px)`
                                    }}
                                >
                                    <Card 
                                        card={card} 
                                        isPlayable={isPlayerTurn && player.currentAP >= card.cost}
                                        onPointerDown={(e) => handleCardPointerDown(idx, e)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </main>

        {/* Dragged Card Overlay */}
        {dragState && player.hand[dragState.index] && (
            <div 
                className="fixed z-50 pointer-events-none shadow-2xl transition-transform duration-75"
                style={{
                    left: dragState.currentX - dragState.offsetX,
                    top: dragState.currentY - dragState.offsetY,
                    transform: `scale(${isDraggingAboveThreshold ? 1.1 : 1}) rotate(${ (dragState.currentX - dragState.startX) * 0.05 }deg)`,
                }}
            >
                <Card 
                    card={player.hand[dragState.index]} 
                    isPlayable={true}
                    className={`shadow-2xl ${isDraggingAboveThreshold ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black' : ''}`}
                />
            </div>
        )}

        {/* Overlay for Win/Loss */}
        {(turnPhase === 'victory' || turnPhase === 'defeat') && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 max-w-md w-full text-center shadow-2xl">
                    <h2 className={`text-4xl font-display font-bold mb-4 ${turnPhase === 'victory' ? 'text-green-400' : 'text-red-500'}`}>
                        {turnPhase === 'victory' ? 'ARGUMENT WON' : 'ARGUMENT LOST'}
                    </h2>
                    <p className="text-slate-400 mb-8">
                        {turnPhase === 'victory' 
                            ? "You've successfully deconstructed their worldview." 
                            : "Your logic failed you. Try a different angle."}
                    </p>
                    <button 
                        onClick={resetGame}
                        className="w-full py-4 bg-white text-black font-bold font-display hover:bg-slate-200 transition-colors rounded-lg"
                    >
                        RETURN TO MENU
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default BattlePage;
