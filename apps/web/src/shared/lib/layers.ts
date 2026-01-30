export const LAYER_DEFINITIONS = [
    {
        key: 'map-base',
        label: 'Map base',
        group: 'Map',
        defaultValue: 0,
        description: 'Map container and markers',
    },
    {
        key: 'map-texture',
        label: 'Map texture overlay',
        group: 'Map',
        defaultValue: 50,
        description: 'Paper texture overlay above the map',
    },
    {
        key: 'map-pin-backdrop',
        label: 'Pin backdrop',
        group: 'Map Pin',
        defaultValue: -1,
        description: 'Dark contrast halo behind active pin',
    },
    {
        key: 'map-pin-ring',
        label: 'Pin ring',
        group: 'Map Pin',
        defaultValue: 0,
        description: 'Rotating focus ring',
    },
    {
        key: 'map-pin-marker',
        label: 'Pin marker',
        group: 'Map Pin',
        defaultValue: 10,
        description: 'Marker icon or photo',
    },
    {
        key: 'map-pin-pointer',
        label: 'Pin pointer',
        group: 'Map Pin',
        defaultValue: 20,
        description: 'Floating chevron pointer',
    },
    {
        key: 'map-pin-stamp',
        label: 'Pin stamp',
        group: 'Map Pin',
        defaultValue: 20,
        description: 'Investigated stamp overlay',
    },
    {
        key: 'map-pin-tooltip',
        label: 'Pin tooltip',
        group: 'Map Pin',
        defaultValue: 30,
        description: 'Marker hover tooltip',
    },
] as const;

export type LayerKey = (typeof LAYER_DEFINITIONS)[number]['key'];
export type LayerValues = Record<LayerKey, number>;

const STORAGE_KEY = 'debug_layer_overrides';
const IS_BROWSER = typeof window !== 'undefined' && typeof document !== 'undefined';

const DEFAULT_LAYER_VALUES = LAYER_DEFINITIONS.reduce((acc, def) => {
    acc[def.key] = def.defaultValue;
    return acc;
}, {} as LayerValues);

export const layerVarName = (key: LayerKey) => `--z-${key}`;

export const getLayerDefaults = (): LayerValues => ({ ...DEFAULT_LAYER_VALUES });

const sanitizeOverrides = (value: unknown): Partial<LayerValues> => {
    if (!value || typeof value !== 'object') return {};

    const input = value as Record<string, unknown>;
    const overrides: Partial<LayerValues> = {};

    LAYER_DEFINITIONS.forEach((def) => {
        const raw = input[def.key];
        if (typeof raw === 'number' && Number.isFinite(raw)) {
            overrides[def.key] = raw;
        }
    });

    return overrides;
};

export const loadLayerOverrides = (): Partial<LayerValues> => {
    if (!IS_BROWSER) return {};

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return sanitizeOverrides(JSON.parse(raw));
    } catch {
        return {};
    }
};

export const getLayerValues = (): LayerValues => {
    const overrides = loadLayerOverrides();
    return { ...DEFAULT_LAYER_VALUES, ...overrides };
};

export const applyLayerValues = (values: LayerValues) => {
    if (!IS_BROWSER) return;

    const root = document.documentElement;
    LAYER_DEFINITIONS.forEach((def) => {
        root.style.setProperty(layerVarName(def.key), String(values[def.key]));
    });
};

const saveOverrides = (overrides: Partial<LayerValues>) => {
    if (!IS_BROWSER) return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
        // Ignore storage write failures (private mode, quota, etc.)
    }
};

export const setLayerValue = (key: LayerKey, value: number) => {
    const overrides = loadLayerOverrides();
    overrides[key] = value;
    saveOverrides(overrides);
    applyLayerValues({ ...DEFAULT_LAYER_VALUES, ...overrides });
};

export const resetLayerOverrides = () => {
    if (!IS_BROWSER) return;

    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore storage failures
    }

    applyLayerValues({ ...DEFAULT_LAYER_VALUES });
};

export const initLayerVars = () => {
    applyLayerValues(getLayerValues());
};
