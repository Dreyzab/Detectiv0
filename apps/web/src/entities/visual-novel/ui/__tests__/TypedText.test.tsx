// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TypedText } from '../TypedText';

describe('TypedText Component', () => {
    it('renders plain text correctly', () => {
        render(<TypedText text="Hello World" speed={0} />);
        expect(screen.getByText('Hello World')).toBeDefined();
    });

    it('parses [[Note]] syntax correctly', () => {
        const handleInteract = vi.fn();
        render(<TypedText text="This is a [[Clue]] hidden." speed={0} onInteract={handleInteract} />);

        const clue = screen.getByText('Clue');
        expect(clue).toBeDefined();
        // Check for styling class text-yellow-200 (Note default)
        expect(clue.className).toContain('text-yellow-200');

        fireEvent.click(clue);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'note',
            text: 'Clue',
            payload: 'Clue'
        }));
    });

    it('parses [[id|Clue]] syntax correctly', () => {
        const handleInteract = vi.fn();
        render(<TypedText text="Found [[ev_gun|Revolver]] on floor." speed={0} onInteract={handleInteract} />);

        const evidence = screen.getByText('Revolver');
        expect(evidence).toBeDefined();
        expect(evidence.className).toContain('text-amber-400'); // Clue style

        fireEvent.click(evidence);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'clue',
            text: 'Revolver',
            payload: 'ev_gun'
        }));
    });

    it('handles mixed content and broken tags gracefully', () => {
        // "[[Broken" should be plain text because regex expects closing brackets
        // Actually my regex `\[\[(.*?)(?:\|(.*?))?\]\]` is non-greedy, so it waits for ]]
        // If no closing ]], it won't match.
        // Let's test: "This is [[broken" -> Should be plain text "This is [[broken"

        render(<TypedText text="This is [[broken and [[Valid]]" speed={0} />);

        expect(screen.getByText('Valid')).toBeDefined();
        // "This is [[broken and " should be plain text
        // But testing exact text might be tricky with partial token rendering if regex fails to match [[broken
        // The regex will skip [[broken and match [[Valid]].
        // So text before Valid is "This is [[broken and "
        expect(screen.getByText((content) => content.includes('This is [[broken'))).toBeDefined();
    });
});
