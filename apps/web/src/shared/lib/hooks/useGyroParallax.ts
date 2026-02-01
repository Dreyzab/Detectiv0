import { useEffect, useState, useRef } from 'react';

interface GyroParallaxOptions {
    enabled?: boolean;
    sensitivity?: number; // Multiplier for movement (default 15)
    smoothing?: number;   // 0-1 Lerp factor (default 0.1 for smooth, 1 for instant)
    maxTilt?: number;     // Max degrees tilt to clamp (default 30)
}

interface GyroState {
    x: number; // Percent offset X (-50 to 50 theoretically, usually clamped lower)
    y: number; // Percent offset Y
    permissionGranted: boolean;
    isSupported: boolean;
}

export function useGyroParallax(options: GyroParallaxOptions = {}) {
    const {
        enabled = true,
        sensitivity = 0.5, // Percent per degree. 20deg * 0.5 = 10%
        smoothing = 0.1,
        maxTilt = 30
    } = options;

    const [state, setState] = useState<GyroState>({
        x: 0,
        y: 0,
        permissionGranted: false,
        isSupported: false
    });

    // Refs for animation loop to avoid react state lag
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        // Check support
        if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
            setTimeout(() => {
                setState(s => ({ ...s, isSupported: true }));
            }, 0);
        }
    }, []);

    // Animation Loop for Smoothing
    useEffect(() => {
        if (!enabled || !state.permissionGranted) return;

        const loop = () => {
            // Lerp: Current += (Target - Current) * Factor
            currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothing;
            currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothing;

            // Round to avoid sub-pixel blurring excessive updates
            const finalX = Math.round(currentRef.current.x * 100) / 100;
            const finalY = Math.round(currentRef.current.y * 100) / 100;

            setState(s => ({ ...s, x: finalX, y: finalY }));
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [enabled, state.permissionGranted, smoothing]);

    // Event Handler
    useEffect(() => {
        if (!enabled) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            // Gamma: Left/Right tilt (-90 to 90)
            // Beta: Front/Back tilt (-180 to 180). We center around sitting position (~45deg?) or just use relative.
            // For simple parallax, we usually just want Gamma for X-pan.

            let gamma = event.gamma || 0;
            let beta = event.beta || 0;

            // Clamp max tilt for usability
            if (gamma > maxTilt) gamma = maxTilt;
            if (gamma < -maxTilt) gamma = -maxTilt;

            // Optional: Clamp beta if we add Y-axis later
            if (beta > maxTilt) beta = maxTilt;
            // ...

            // Calculate Target Offset
            // If phone tilts RIGHT (positive gamma), we want to see MORE of the RIGHT side.
            // So we shift the image LEFT (negative translateX).
            // Wait, "Window" effect:
            // Tilt Left -> Look out left window -> View moves Right?
            // Let's stick to: Tilt Left -> Image moves Right (to show what's on the left).

            targetRef.current.x = gamma * sensitivity;

            // Y-Axis: Often annoying on mobile holding, let's keep it subtle or 0 for now
            // targetRef.current.y = (beta - 45) * sensitivity; // 45deg sitting bias
        };

        if (state.permissionGranted) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [enabled, state.permissionGranted, sensitivity, maxTilt]);

    // Request Permission (iOS 13+)
    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setState(s => ({ ...s, permissionGranted: true }));
                    return true;
                }
            } catch (error) {
                console.error('Gyro permission failed:', error);
            }
            return false;
        } else {
            // Non-iOS 13+ or Android, usually auto-granted or handled by browser
            setState(s => ({ ...s, permissionGranted: true }));
            return true;
        }
    };

    return {
        ...state,
        requestPermission
    };
}
