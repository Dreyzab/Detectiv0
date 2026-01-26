import { lineString, along, length } from '@turf/turf';

export interface Position {
    lat: number;
    lng: number;
}

export const interpolatePosition = (
    start: Position,
    end: Position,
    startTime: number,
    duration: number
): Position => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) return end;
    if (progress <= 0) return start;

    const line = lineString([
        [start.lng, start.lat],
        [end.lng, end.lat],
    ]);

    const totalDistance = length(line, { units: 'kilometers' });
    const traveledDistance = totalDistance * progress;

    const currentPoint = along(line, traveledDistance, { units: 'kilometers' });
    const [lng, lat] = currentPoint.geometry.coordinates;

    return { lat, lng };
};
