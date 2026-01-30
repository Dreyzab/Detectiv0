import { DetectiveMarker } from './DetectiveMarker';
import { NotebookWidget } from '@/features/detective/notebook/NotebookWidget';

export const DetectiveModeLayer = () => {
    return (
        <>
            <DetectiveMarker />
            <NotebookWidget />

            {/* 
        Vintage Overlay Filter
        Using a CSS-based approach on the map container in parent is often better, 
        but we can also add distinct layers if needed. 
        For now, this component will handle specific detective layer sources.
      */}
        </>
    );
};
