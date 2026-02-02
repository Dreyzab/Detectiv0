
import { create } from 'zustand';
import { produce } from 'immer';
import { CardDefinition, BattleScenario, PlayerEntity, OpponentEntity, TurnPhase, CardEffect, VisualEvent } from './types';
import { CARD_REGISTRY } from './constants';

interface BattleState {
  scenario: BattleScenario | null;
  turnPhase: TurnPhase;
  turnCount: number;
  log: string[];
  visualQueue: VisualEvent[];
  
  player: PlayerEntity;
  opponent: OpponentEntity;
  
  // Actions
  initializeBattle: (scenario: BattleScenario) => void;
  playCard: (cardIndex: number) => void;
  endTurn: () => void;
  resetGame: () => void;
  dismissVisualEvent: (id: string) => void;
}

const SHUFFLE = (array: any[]) => array.sort(() => Math.random() - 0.5);

const INITIAL_PLAYER: PlayerEntity = {
  id: 'player',
  name: 'Detective',
  avatar: 'https://picsum.photos/200/200?random=99',
  currentResolve: 30,
  maxResolve: 30,
  block: 0,
  currentAP: 3,
  maxAP: 3,
  hand: [],
  deck: [],
  discardPile: []
};

const INITIAL_OPPONENT: OpponentEntity = {
  id: 'opp',
  name: 'Opponent',
  avatar: '',
  currentResolve: 20,
  maxResolve: 20,
  block: 0,
  deck: []
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBattleStore = create<BattleState>((set, get) => ({
  scenario: null,
  turnPhase: 'player_start',
  turnCount: 1,
  log: [],
  visualQueue: [],
  player: INITIAL_PLAYER,
  opponent: INITIAL_OPPONENT,

  initializeBattle: (scenario) => {
    const deck = scenario.playerStartingDeck
      .map(id => CARD_REGISTRY[id])
      .filter(Boolean);
    
    const shuffledDeck = SHUFFLE([...deck]);
    const hand = shuffledDeck.splice(0, 5);

    const oppDeck = scenario.opponentDeck;
    const nextMoveId = oppDeck[Math.floor(Math.random() * oppDeck.length)];

    set({
      scenario,
      turnPhase: 'player_action',
      turnCount: 1,
      log: [`Battle started against ${scenario.opponentName}.`],
      visualQueue: [],
      player: {
        ...INITIAL_PLAYER,
        currentResolve: scenario.playerStartingResolve,
        maxResolve: scenario.playerStartingResolve,
        maxAP: scenario.playerActionPoints,
        currentAP: scenario.playerActionPoints,
        deck: shuffledDeck,
        hand: hand,
        discardPile: [],
      },
      opponent: {
        ...INITIAL_OPPONENT,
        name: scenario.opponentName,
        avatar: scenario.opponentAvatar,
        currentResolve: scenario.opponentResolve,
        maxResolve: scenario.opponentResolve,
        deck: scenario.opponentDeck,
        nextMoveId: nextMoveId
      }
    });
  },

  playCard: (cardIndex) => {
    const { player, opponent, turnPhase } = get();

    if (turnPhase !== 'player_action') return;

    const card = player.hand[cardIndex];
    if (!card) return;
    if (player.currentAP < card.cost) {
      return;
    }

    set(produce((state: BattleState) => {
        state.player.currentAP -= card.cost;
        state.player.hand.splice(cardIndex, 1);
        // Note: We don't push to discardPile yet. We wait until effects resolve.
        // This prevents reshuffling the currently played card if the deck runs out during a draw effect.
        
        state.log.push(`Player used ${card.name}.`);

        card.effects.forEach(effect => {
            if (effect.type === 'damage') {
                let damage = effect.value;
                if (state.opponent.block > 0) {
                    const absorb = Math.min(state.opponent.block, damage);
                    state.opponent.block -= absorb;
                    damage -= absorb;
                    
                    // Visual for Block hit
                    state.visualQueue.push({
                        id: generateId(),
                        type: 'block',
                        value: 'Blocked',
                        target: 'opponent'
                    });
                }
                
                state.opponent.currentResolve = Math.max(0, state.opponent.currentResolve - damage);
                
                if (damage > 0) {
                    state.visualQueue.push({
                        id: generateId(),
                        type: 'damage',
                        value: damage,
                        target: 'opponent'
                    });
                }
            } else if (effect.type === 'block') {
                state.player.block += effect.value;
                state.visualQueue.push({
                    id: generateId(),
                    type: 'buff',
                    value: `+${effect.value} Block`,
                    target: 'player'
                });
            } else if (effect.type === 'heal') {
                const healAmt = Math.min(state.player.maxResolve - state.player.currentResolve, effect.value);
                state.player.currentResolve += healAmt;
                if (healAmt > 0) {
                    state.visualQueue.push({
                        id: generateId(),
                        type: 'heal',
                        value: healAmt,
                        target: 'player'
                    });
                }
            } else if (effect.type === 'gain_ap') {
                state.player.currentAP += effect.value;
                 state.visualQueue.push({
                    id: generateId(),
                    type: 'buff',
                    value: `+${effect.value} AP`,
                    target: 'player'
                });
            } else if (effect.type === 'draw') {
                let cardsDrawn = 0;
                for (let i=0; i<effect.value; i++) {
                    if (state.player.deck.length === 0) {
                        if (state.player.discardPile.length > 0) {
                            state.player.deck = SHUFFLE([...state.player.discardPile]);
                            state.player.discardPile = [];
                            state.log.push("Deck reshuffled from discard pile.");
                        } else {
                            break;
                        }
                    }
                    if (state.player.deck.length > 0) {
                        state.player.hand.push(state.player.deck.shift()!);
                        cardsDrawn++;
                    }
                }
                if (cardsDrawn > 0) {
                    state.visualQueue.push({
                        id: generateId(),
                        type: 'buff',
                        value: `+${cardsDrawn} Card${cardsDrawn > 1 ? 's' : ''}`,
                        target: 'player'
                    });
                }
            }
        });

        // Add to discard pile AFTER effects are processed
        state.player.discardPile.push(card);

        if (state.opponent.currentResolve <= 0) {
            state.turnPhase = 'victory';
            state.log.push("Opponent's resolve broken! You win!");
        }
    }));
  },

  endTurn: () => {
    const { turnPhase } = get();
    if (turnPhase !== 'player_action') return;

    set(produce((state: BattleState) => {
        state.turnPhase = 'opponent_turn';
        state.log.push("Player turn ended.");
        state.player.block = 0; 
    }));

    setTimeout(() => {
        const { opponent } = get();
        if (get().turnPhase !== 'opponent_turn') return; 

        const moveId = opponent.nextMoveId;
        if (moveId && CARD_REGISTRY[moveId]) {
            const card = CARD_REGISTRY[moveId];
            
            set(produce((state: BattleState) => {
                 state.log.push(`${state.opponent.name} used ${card.name}.`);
                 
                 card.effects.forEach(effect => {
                    if (effect.type === 'damage') {
                        let damage = effect.value;
                        if (state.player.block > 0) {
                            const absorb = Math.min(state.player.block, damage);
                            state.player.block -= absorb;
                            damage -= absorb;
                             state.visualQueue.push({
                                id: generateId(),
                                type: 'block',
                                value: 'Blocked',
                                target: 'player'
                            });
                        }
                        state.player.currentResolve = Math.max(0, state.player.currentResolve - damage);
                        if (damage > 0) {
                            state.visualQueue.push({
                                id: generateId(),
                                type: 'damage',
                                value: damage,
                                target: 'player'
                            });
                        }
                    } else if (effect.type === 'block') {
                        state.opponent.block += effect.value;
                         state.visualQueue.push({
                                id: generateId(),
                                type: 'buff',
                                value: `+${effect.value} Block`,
                                target: 'opponent'
                            });
                    } else if (effect.type === 'heal') {
                        const healAmt = Math.min(state.opponent.maxResolve - state.opponent.currentResolve, effect.value);
                        state.opponent.currentResolve += healAmt;
                         if (healAmt > 0) {
                            state.visualQueue.push({
                                id: generateId(),
                                type: 'heal',
                                value: healAmt,
                                target: 'opponent'
                            });
                        }
                    }
                 });

                 if (state.player.currentResolve <= 0) {
                    state.turnPhase = 'defeat';
                    state.log.push("Your resolve is broken. You lose.");
                    return;
                 }
            }));
        }

        if (get().turnPhase === 'defeat') return;

        setTimeout(() => {
             set(produce((state: BattleState) => {
                state.turnPhase = 'player_action';
                state.turnCount += 1;
                state.log.push(`Turn ${state.turnCount} started.`);
                state.opponent.block = 0;
                state.player.currentAP = state.player.maxAP;

                const oppDeck = state.opponent.deck;
                state.opponent.nextMoveId = oppDeck[Math.floor(Math.random() * oppDeck.length)];

                const cardsToDraw = 2;
                for (let i=0; i<cardsToDraw; i++) {
                    if (state.player.deck.length === 0) {
                        if (state.player.discardPile.length > 0) {
                            state.player.deck = SHUFFLE([...state.player.discardPile]);
                            state.player.discardPile = [];
                            state.log.push("Deck reshuffled.");
                        }
                    }
                    if (state.player.deck.length > 0) {
                        state.player.hand.push(state.player.deck.shift()!);
                    }
                }
             }));
        }, 1000);

    }, 1000);
  },

  dismissVisualEvent: (id: string) => {
      set(produce((state: BattleState) => {
          const idx = state.visualQueue.findIndex(e => e.id === id);
          if (idx !== -1) state.visualQueue.splice(idx, 1);
      }));
  },

  resetGame: () => {
    set({ scenario: null, turnPhase: 'player_start', log: [], visualQueue: [] });
  }
}));
