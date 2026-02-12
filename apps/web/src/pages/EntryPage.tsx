import { Navigate, useParams } from 'react-router-dom';
import { DEFAULT_PACK_ID, PACK_META, getPackMeta } from '@repo/shared/data/pack-meta';
import { KarlsruheEntryPage } from '@/pages/KarlsruheEntryPage';

export const EntryPage = () => {
    const { packId } = useParams<{ packId?: string }>();

    const knownPack = typeof packId === 'string' && Object.prototype.hasOwnProperty.call(PACK_META, packId);
    if (!knownPack) {
        return <Navigate to="/" replace />;
    }

    const packMeta = getPackMeta(packId);

    if (packMeta.packId === DEFAULT_PACK_ID) {
        return <Navigate to="/" replace />;
    }

    if (packMeta.packId === 'ka1905') {
        return <KarlsruheEntryPage packId={packMeta.packId} />;
    }

    return <Navigate to="/" replace />;
};
