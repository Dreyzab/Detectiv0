import { useEffect, useRef, useState } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { interpolatePosition, type Position } from '../../../features/detective/lib/movement';

// Initial position for Freiburg 1905 start
const START_POS: Position = { lat: 47.997791, lng: 7.842609 }; // Hauptbahnhof

export const DetectiveMarker = () => {
    const [pos, setPos] = useState<Position>(START_POS);
    const lastPos = useRef<Position>(START_POS);
    const targetPos = useRef<Position>(START_POS);
    const startTime = useRef<number>(0);
    const animationFrame = useRef<number>(0);

    // Fake movement simulation for demo
    useEffect(() => {
        const moveRandomly = () => {
            const latOffset = (Math.random() - 0.5) * 0.002;
            const lngOffset = (Math.random() - 0.5) * 0.002;

            const newTarget = {
                lat: START_POS.lat + latOffset,
                lng: START_POS.lng + lngOffset
            };

            lastPos.current = targetPos.current; // Previous target becomes new start
            targetPos.current = newTarget;
            startTime.current = Date.now();
        };

        const interval = setInterval(moveRandomly, 5000);
        return () => clearInterval(interval);
    }, []);

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            if (startTime.current === 0) {
                animationFrame.current = requestAnimationFrame(animate);
                return;
            }

            const newPos = interpolatePosition(
                lastPos.current,
                targetPos.current,
                startTime.current,
                2000
            );

            setPos(newPos);
            animationFrame.current = requestAnimationFrame(animate);
        };

        animationFrame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame.current);
    }, []);

    return (
        <Marker longitude={pos.lng} latitude={pos.lat} anchor="bottom">
            <div className="relative group">
                {/* Vintage Player Token */}
                <div className="w-8 h-8 rounded-full border-2 border-[#1a1612] bg-[#f4ebd0] shadow-md flex items-center justify-center z-10 relative">
                    <span className="text-sm">🕵️</span>
                </div>
                {/* Shadow */}
                <div className="absolute -bottom-1 left-1.5 w-5 h-1.5 bg-black/40 blur-[2px] rounded-full" />
            </div>
        </Marker>
    );
};
