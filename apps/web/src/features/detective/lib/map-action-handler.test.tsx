/* @vitest-environment jsdom */
import { useEffect, useRef } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import type { MapAction } from '@repo/shared';
import { useMapActionHandler } from './map-action-handler';
import { useDossierStore } from '../dossier/store';
import { useRegionStore } from '@/features/region/model/store';

const ActionProbe = ({ action }: { action: MapAction }) => {
    const { executeAction } = useMapActionHandler();
    const location = useLocation();
    const hasExecuted = useRef(false);

    useEffect(() => {
        if (hasExecuted.current) {
            return;
        }
        hasExecuted.current = true;
        executeAction(action);
    }, [action, executeAction]);

    return <div data-testid="path">{location.pathname}</div>;
};

describe('useMapActionHandler', () => {
    beforeEach(() => {
        useRegionStore.setState({
            activeRegionId: null,
            source: null
        });
        useDossierStore.getState().resetDossier();
    });

    it('handles set_region action and navigates to region map', async () => {
        render(
            <MemoryRouter initialEntries={['/scanner']}>
                <ActionProbe action={{ type: 'set_region', regionId: 'karlsruhe_default' }} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('path').textContent).toBe('/city/ka1905/map');
        });

        expect(useRegionStore.getState().activeRegionId).toBe('karlsruhe_default');
        expect(useDossierStore.getState().activeCaseId).toBe('sandbox_karlsruhe');
    });
});
