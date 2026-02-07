
import { useEffect } from 'react';
import { useDossierStore } from '../detective/dossier/store';
import { useQuestStore } from './store';
import { QUESTS } from './data';

export const useQuestEngine = () => {
    const flags = useDossierStore(state => state.flags);
    const {
        registerQuest,
        startQuest,
        evaluateQuests,
        hydrateFromServer,
        isServerHydrated,
        userQuests
    } = useQuestStore();

    useEffect(() => {
        Object.values(QUESTS).forEach(quest => {
            registerQuest(quest);
        });
    }, [registerQuest]);

    useEffect(() => {
        void hydrateFromServer();
    }, [hydrateFromServer]);

    useEffect(() => {
        if (!isServerHydrated) {
            return;
        }

        if (!userQuests['case01']) {
            startQuest('case01');
        }
    }, [isServerHydrated, startQuest, userQuests]);

    useEffect(() => {
        if (!isServerHydrated) {
            return;
        }
        evaluateQuests(flags);
    }, [flags, evaluateQuests, isServerHydrated]);
};
