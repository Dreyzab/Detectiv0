export interface QuestSnapshotState {
    questId: string;
    status: 'active' | 'completed' | 'failed';
    stage: string;
    completedObjectiveIds: string[];
    completedAt?: number;
}

export interface QuestSnapshotResponse {
    success: boolean;
    userQuests?: Record<string, QuestSnapshotState>;
    error?: string;
}

export interface SaveQuestSnapshotRequest {
    userQuests: Record<string, QuestSnapshotState>;
}

export interface SaveQuestSnapshotResponse {
    success: boolean;
    userQuests?: Record<string, QuestSnapshotState>;
    error?: string;
}
