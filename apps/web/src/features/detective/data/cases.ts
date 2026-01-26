
import type { DirectiveCase, NarrativeThread } from '@repo/shared';

export const DETECTIVE_CASES: Record<string, DirectiveCase> = {
    'case_01': {
        id: 'case_01',
        title: 'Case 1: The Robbery',
        description: 'Investigation of the Bankhaus Krebs robbery.',
        color: '#d4c5a3', // Vintage Paper / Gold
        packId: 'fbg1905'
    }
};

export const NARRATIVE_THREADS: NarrativeThread[] = [
    // Thread 1: Start -> Bank
    {
        id: 'thread_01_start',
        caseId: 'case_01',
        sourcePointId: 'hauptbahnhof',
        targetPointId: 'munsterplatz_bank',
        // style: 'solid', // TODO: Add to shared type
        condition: { type: 'flag_is', flagId: 'case01_started', value: true }
    },
    // Thread 2: Bank -> Archive
    {
        id: 'thread_02_archive',
        caseId: 'case_01',
        sourcePointId: 'munsterplatz_bank',
        targetPointId: 'rathaus_archiv',
        // style: 'dashed',
        condition: { type: 'flag_is', flagId: 'knows_archive_lead', value: true }
    }
];
