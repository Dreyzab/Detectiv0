// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TypedText } from '../TypedText';

afterEach(() => {
    cleanup();
});

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
        expect(clue.className).toContain('text-primary');

        fireEvent.click(clue);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'note',
            text: 'Clue',
            payload: 'Clue'
        }), expect.anything());
    });

    it('parses [[id|Clue]] syntax correctly', () => {
        const handleInteract = vi.fn();
        render(<TypedText text="Found [[ev_gun|Revolver]] on floor." speed={0} onInteract={handleInteract} />);

        const evidence = screen.getByText('Revolver');
        expect(evidence).toBeDefined();
        expect(evidence.className).toContain('text-accent');

        fireEvent.click(evidence);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'clue',
            text: 'Revolver',
            payload: 'ev_gun'
        }), expect.anything());
    });

    it('parses legacy interactive span note markup', () => {
        const handleInteract = vi.fn();
        render(
            <TypedText
                text={'Sie betreten die <span role="button" data-vn-interactive="true" title="Note">große Halle</span>.'}
                speed={0}
                onInteract={handleInteract}
            />
        );

        const note = screen.getByText('große Halle');
        expect(note).toBeDefined();
        expect(note.getAttribute('role')).toBe('button');

        fireEvent.click(note);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'note',
            text: 'große Halle',
            payload: 'große Halle'
        }), expect.anything());
    });

    it('parses multiline legacy interactive span markup', () => {
        const handleInteract = vi.fn();
        render(
            <TypedText
                text={`Die <span tabindex="0" class="
                        inline-block font-semibold transition-colors px-1 rounded-sm
                        cursor-pointer
                        text-primary font-bold hover:bg-primary/10 border-b border-primary/30 hover:border-primary
                    " title="Note" style="opacity: 1; transform: scale(1.05);" role="button" data-vn-interactive="true">große Halle</span> ist still.`}
                speed={0}
                onInteract={handleInteract}
            />
        );

        const note = screen.getByText('große Halle');
        expect(note).toBeDefined();
        fireEvent.click(note);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'note',
            text: 'große Halle'
        }), expect.anything());
    });

    it('parses legacy interactive span evidence markup', () => {
        const handleInteract = vi.fn();
        render(
            <TypedText
                text={'Found <span role="button" data-vn-interactive="true" title="Evidence" data-vn-payload="ev_torn_fabric">Torn Fabric</span> near the vault.'}
                speed={0}
                onInteract={handleInteract}
            />
        );

        const evidence = screen.getByText('Torn Fabric');
        expect(evidence).toBeDefined();
        expect(evidence.className).toContain('text-accent');

        fireEvent.click(evidence);
        expect(handleInteract).toHaveBeenCalledWith(expect.objectContaining({
            type: 'clue',
            text: 'Torn Fabric',
            payload: 'ev_torn_fabric'
        }), expect.anything());
    });

    it('handles mixed content and broken tags gracefully', () => {
        render(<TypedText text="This is [[broken and [[Valid]]" speed={0} />);

        expect(screen.getByText((content) => content.includes('This is'))).toBeDefined();
        expect(screen.getByText('broken and [[Valid')).toBeDefined();
    });
});
