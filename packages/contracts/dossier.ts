import type { PointStateEnum } from '@repo/shared';

export type DossierEntryType = 'note' | 'clue' | 'fact' | 'profile' | 'document' | 'intel';
export type DossierCheckState = 'passed' | 'failed' | 'locked';

export interface DossierEntrySnapshot {
    id: string;
    type: DossierEntryType;
    title: string;
    content: string;
    isLocked: boolean;
    packId: string;
    timestamp: number;
    refId?: string;
}

export interface DossierEvidenceSnapshot {
    id: string;
    name: string;
    description: string;
    icon?: string;
    packId: string;
}

export interface DossierSnapshot {
    entries: DossierEntrySnapshot[];
    evidence: DossierEvidenceSnapshot[];
    unlockedDeductions: string[];
    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;
    checkStates: Record<string, DossierCheckState>;
    xp: number;
    level: number;
    devPoints: number;
    traits: string[];
    voiceStats: Record<string, number>;
    voiceXp: Record<string, number>;
}

export interface DossierSnapshotResponse {
    success: boolean;
    snapshot?: DossierSnapshot;
    error?: string;
}

export interface SaveDossierSnapshotRequest {
    snapshot: DossierSnapshot;
}

export interface SaveDossierSnapshotResponse {
    success: boolean;
    snapshot?: DossierSnapshot;
    error?: string;
}
