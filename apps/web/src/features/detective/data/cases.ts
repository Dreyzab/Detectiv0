
import type { DirectiveCase, NarrativeThread } from '@repo/shared';

export const DETECTIVE_CASES: Record<string, DirectiveCase> = {
    'case_01_bank': {
        id: 'case_01_bank',
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
        caseId: 'case_01_bank',
        sourcePointId: 'loc_hbf',
        targetPointId: 'loc_freiburg_bank',
        // style: 'solid', // TODO: Add to shared type
        condition: { type: 'quest_past_stage', questId: 'case01', stage: 'briefing' }
    },
    // Thread 2: Bank -> Archive
    {
        id: 'thread_02_archive',
        caseId: 'case_01_bank',
        sourcePointId: 'loc_freiburg_bank',
        targetPointId: 'loc_rathaus',
        // style: 'dashed',
        condition: {
            type: 'logic_and',
            conditions: [
                { type: 'quest_past_stage', questId: 'case01', stage: 'leads_open' },
                { type: 'flag_is', flagId: 'archive_casefile_complete', value: false }
            ]
        }
    },
    // Thread 3: Archive -> Warehouse
    {
        id: 'thread_03_warehouse',
        caseId: 'case_01_bank',
        sourcePointId: 'loc_rathaus',
        targetPointId: 'loc_freiburg_warehouse',
        condition: {
            type: 'logic_and',
            conditions: [
                { type: 'flag_is', flagId: 'archive_casefile_complete', value: true },
                { type: 'flag_is', flagId: 'case_resolved', value: false }
            ]
        }
    }
];

