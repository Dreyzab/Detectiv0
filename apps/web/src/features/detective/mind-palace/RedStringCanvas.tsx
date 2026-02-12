import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface StringConnection {
    id: string;
    from: string;
    to: string;
}

interface NodePosition {
    x: number;
    y: number;
}

interface RedStringCanvasProps {
    connections: StringConnection[];
    nodeRefs: Record<string, React.RefObject<HTMLDivElement | null>>;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const RedStringCanvas = ({ connections, nodeRefs, containerRef }: RedStringCanvasProps) => {
    const [positions, setPositions] = useState<Record<string, NodePosition>>({});

    const recalculate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newPositions: Record<string, NodePosition> = {};

        Object.entries(nodeRefs).forEach(([id, ref]) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            newPositions[id] = {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2
            };
        });

        setPositions(newPositions);
    }, [nodeRefs, containerRef]);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            recalculate();
        });

        const observer = new ResizeObserver(recalculate);
        if (containerRef.current) observer.observe(containerRef.current);

        window.addEventListener('resize', recalculate);
        return () => {
            window.cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('resize', recalculate);
        };
    }, [recalculate, containerRef]);

    // Recalculate when connections change (new deduction solved)
    useEffect(() => {
        const timer = setTimeout(recalculate, 100);
        return () => clearTimeout(timer);
    }, [connections, recalculate]);

    if (connections.length === 0) return null;

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <filter id="string-shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3" />
                </filter>
            </defs>

            {connections.map((conn) => {
                const fromPos = positions[conn.from];
                const toPos = positions[conn.to];
                if (!fromPos || !toPos) return null;

                // Quadratic bezier for slight curve
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                const dx = toPos.x - fromPos.x;
                const dy = toPos.y - fromPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const offset = Math.min(dist * 0.15, 30);
                const cpX = midX + (dy / dist) * offset;
                const cpY = midY - (dx / dist) * offset;

                const pathD = `M ${fromPos.x} ${fromPos.y} Q ${cpX} ${cpY} ${toPos.x} ${toPos.y}`;

                return (
                    <motion.path
                        key={conn.id}
                        d={pathD}
                        fill="none"
                        stroke="#c41e3a"
                        strokeWidth={2}
                        strokeLinecap="round"
                        filter="url(#string-shadow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.85 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                );
            })}

            {/* Pin dots at endpoints */}
            {connections.map((conn) => {
                const fromPos = positions[conn.from];
                const toPos = positions[conn.to];
                if (!fromPos || !toPos) return null;

                return (
                    <g key={`pins-${conn.id}`}>
                        <circle cx={fromPos.x} cy={fromPos.y} r={3} fill="#8b1a1a" opacity={0.7} />
                        <circle cx={toPos.x} cy={toPos.y} r={3} fill="#8b1a1a" opacity={0.7} />
                    </g>
                );
            })}
        </svg>
    );
};
