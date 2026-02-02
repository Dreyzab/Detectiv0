import type { CardDefinition } from '@repo/shared';

/**
 * Fisher-Yates shuffle for deck randomization
 */
export function shuffleDeck(deck: CardDefinition[]): CardDefinition[] {
    const result = [...deck];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Draw cards from deck
 */
export function drawCards(
    deck: CardDefinition[],
    count: number
): { drawn: CardDefinition[]; remaining: CardDefinition[] } {
    const drawn = deck.slice(0, count);
    const remaining = deck.slice(count);
    return { drawn, remaining };
}

/**
 * Move card from hand to discard
 */
export function discardCard(
    hand: CardDefinition[],
    discard: CardDefinition[],
    cardId: string
): { hand: CardDefinition[]; discard: CardDefinition[] } {
    const cardIndex = hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return { hand, discard };

    const card = hand[cardIndex];
    const newHand = [...hand];
    newHand.splice(cardIndex, 1);

    return {
        hand: newHand,
        discard: [...discard, card]
    };
}

/**
 * Shuffle discard pile back into deck
 */
export function reshuffleDiscard(
    deck: CardDefinition[],
    discard: CardDefinition[]
): { deck: CardDefinition[]; discard: CardDefinition[] } {
    return {
        deck: shuffleDeck([...deck, ...discard]),
        discard: []
    };
}
