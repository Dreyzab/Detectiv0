import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBattleStore, Card, UnitStatus, FloatingText } from '../../entities/battle';
import { CARD_REGISTRY, BATTLE_SCENARIOS } from '@repo/shared';
import { Swords, RotateCcw, Play, ArrowUp } from 'lucide-react';
import './BattlePage.css';

// ================== DRAG STATE ==================

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

const PLAY_THRESHOLD_RATIO = 0.6;

// ================== BATTLE PAGE ==================

export const BattlePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

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
        resetBattle,
        dismissVisualEvent
    } = useBattleStore();

    const [dragState, setDragState] = useState<DragState | null>(null);
    const dragRef = useRef<DragState | null>(null);

    // Initialize from URL
    useEffect(() => {
        const scenarioId = searchParams.get('scenarioId');
        if (scenarioId && !scenario) {
            initializeBattle(scenarioId);
        }
    }, [searchParams, scenario, initializeBattle]);

    // Global pointer events for dragging
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

        const handlePointerUp = () => {
            if (!dragRef.current) return;

            const { startX, startY, currentX, currentY, index } = dragRef.current;

            const dist = Math.hypot(currentX - startX, currentY - startY);
            const playThreshold = window.innerHeight * PLAY_THRESHOLD_RATIO;
            const isAboveThreshold = currentY < playThreshold;

            // Play if dragged above threshold OR if clicked (minimal movement)
            if (isAboveThreshold || dist < 10) {
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
        } catch {
            // Ignore
        }
    };

    const handleReturn = () => {
        resetBattle();
        navigate('/map');
    };

    // Scenario Selection Screen
    if (!scenario) {
        return (
            <div className="battle-page battle-page--select">
                <h1 className="battle-title">DIALOGUE DUELS</h1>
                <div className="scenario-grid">
                    {BATTLE_SCENARIOS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => initializeBattle(s.id)}
                            className="scenario-card"
                        >
                            <div className="scenario-card__accent" />
                            <h3 className="scenario-card__title">{s.title}</h3>
                            <p className="scenario-card__difficulty">{s.difficulty || 'Normal'} Encounter</p>
                            <div className="scenario-card__action">
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
        <div className="battle-page">
            {/* Background Ambient */}
            <div className="battle-bg battle-bg--gradient" />
            <div className="battle-bg battle-bg--glow-right" />
            <div className="battle-bg battle-bg--glow-left" />

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
                className={`drop-zone ${dragState ? 'drop-zone--active' : ''} ${isDraggingAboveThreshold ? 'drop-zone--ready' : ''}`}
                style={{ height: `${PLAY_THRESHOLD_RATIO * 100}%` }}
            >
                <div className="drop-zone__label">
                    <ArrowUp size={16} className={isDraggingAboveThreshold ? 'animate-bounce' : ''} />
                    {isDraggingAboveThreshold ? 'Release to Play' : 'Drag Here'}
                </div>
                <div className="drop-zone__line" />
            </div>

            {/* Top Bar */}
            <header className="battle-header">
                <div className="battle-header__scenario">
                    SCENARIO: <span>{scenario.title}</span>
                </div>
                <button onClick={resetBattle} className="battle-header__reset">
                    <RotateCcw size={20} />
                </button>
            </header>

            {/* Battle Arena */}
            <main className="battle-arena">

                {/* Opponent Area */}
                <div className="battle-arena__opponent">
                    <div className="battle-arena__opponent-inner">
                        <UnitStatus
                            entity={opponent}
                            isOpponent
                            intention={opponent.nextMoveId}
                        />
                    </div>

                    {/* Intention Bubble */}
                    {nextMoveCard && (
                        <div className="intention-bubble">
                            <span className="intention-bubble__label">Enemy Intent</span>
                            <span className="intention-bubble__move">
                                {nextMoveCard.name}
                                <span className="intention-bubble__effect">
                                    {nextMoveCard.effects[0].type.toUpperCase()} {nextMoveCard.effects[0].value}
                                </span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Mid Section: Log & Turn Indicator */}
                <div className="battle-mid">
                    {/* Battle Log */}
                    <div className="battle-log">
                        {log.slice(-3).map((l, i) => (
                            <div key={i} className="battle-log__entry">{l}</div>
                        ))}
                    </div>

                    {/* Turn Status */}
                    <div className="turn-status">
                        {turnPhase === 'player_action' && <div className="turn-status--player">YOUR TURN</div>}
                        {turnPhase === 'opponent_turn' && <div className="turn-status--opponent">OPPONENT ACTING...</div>}
                        {turnPhase === 'victory' && <div className="turn-status--victory">VICTORY</div>}
                        {turnPhase === 'defeat' && <div className="turn-status--defeat">DEFEAT</div>}
                    </div>

                    <div className="battle-mid__spacer" />
                </div>

                {/* Player Area */}
                <div className="battle-arena__player">
                    {/* Player Stats Bar */}
                    <div className="player-stats">
                        <UnitStatus entity={player} />

                        {/* AP Display */}
                        <div className="ap-display">
                            <div className="ap-display__pips">
                                {Array.from({ length: player.maxAP }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`ap-pip ${i < player.currentAP ? 'ap-pip--active' : ''}`}
                                    />
                                ))}
                            </div>
                            <span className="ap-display__label">ACTIONS</span>
                        </div>

                        <button
                            onClick={endTurn}
                            disabled={!isPlayerTurn}
                            className={`end-turn-btn ${isPlayerTurn ? 'end-turn-btn--active' : ''}`}
                        >
                            END TURN
                            <Play size={20} className={isPlayerTurn ? '' : 'opacity-0'} />
                        </button>
                    </div>

                    {/* Hand */}
                    <div className="card-hand">
                        <div className="card-hand__inner">
                            {player.hand.map((card, idx) => {
                                const isBeingDragged = dragState?.index === idx;
                                const rotation = (idx - (player.hand.length - 1) / 2) * 3;
                                const yOffset = Math.abs(idx - (player.hand.length - 1) / 2) * 5;

                                return (
                                    <div
                                        key={`${card.id}-${idx}`}
                                        className={`card-slot ${isBeingDragged ? 'card-slot--dragging' : ''}`}
                                        style={{
                                            transform: `rotate(${rotation}deg) translateY(${yOffset}px)`
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
                    className="dragged-card"
                    style={{
                        left: dragState.currentX - dragState.offsetX,
                        top: dragState.currentY - dragState.offsetY,
                        transform: `scale(${isDraggingAboveThreshold ? 1.1 : 1}) rotate(${(dragState.currentX - dragState.startX) * 0.05}deg)`,
                    }}
                >
                    <Card
                        card={player.hand[dragState.index]}
                        isPlayable={true}
                        className={isDraggingAboveThreshold ? 'card--ready-to-play' : ''}
                    />
                </div>
            )}

            {/* Overlay for Win/Loss */}
            {(turnPhase === 'victory' || turnPhase === 'defeat') && (
                <div className="battle-overlay">
                    <div className="battle-result">
                        <h2 className={`battle-result__title ${turnPhase === 'victory' ? 'battle-result__title--win' : 'battle-result__title--lose'}`}>
                            {turnPhase === 'victory' ? 'ARGUMENT WON' : 'ARGUMENT LOST'}
                        </h2>
                        <p className="battle-result__desc">
                            {turnPhase === 'victory'
                                ? "You've successfully deconstructed their worldview."
                                : 'Your logic failed you. Try a different angle.'}
                        </p>
                        <button onClick={handleReturn} className="battle-result__btn">
                            RETURN
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BattlePage;
