
import { useEffect } from 'react';
import { useDossierStore } from '../detective/dossier/store';
import { useQuestStore } from './store';
import { QUESTS } from './data';

export const useQuestEngine = () => {
    const flags = useDossierStore(state => state.flags);
    const { registerQuest, startQuest, evaluateQuests } = useQuestStore();

    // 1. Initial Setup (Register Quests)
    useEffect(() => {
        // Load static quests
        Object.values(QUESTS).forEach(quest => {
            registerQuest(quest);
        });

        // Auto-start Case 01 for prototype
        startQuest('case01_act1');
    }, [registerQuest, startQuest]);

    // 2. React to Flags
    useEffect(() => {
        evaluateQuests(flags);
    }, [flags, evaluateQuests]);
};
