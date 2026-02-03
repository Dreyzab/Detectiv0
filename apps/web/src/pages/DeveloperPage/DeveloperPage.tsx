
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Database, RefreshCw, Scroll, CheckSquare, Play, Trash2, Save, User, UserPlus, Layers } from 'lucide-react';
import { useQuestStore } from '@/features/quests/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useInventoryStore } from '@/entities/inventory/model/store';
import { type LayerKey, type LayerValues, LAYER_DEFINITIONS, getLayerDefaults, getLayerValues, layerVarName, resetLayerOverrides, setLayerValue } from '@/shared/lib/layers';
import type { MapPoint } from '@repo/shared';
import type { ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEV_DASHBOARD_ENABLED = import.meta.env.VITE_ENABLE_DEV_DASHBOARD === 'true';
const DEV_ADMIN_TOKEN = import.meta.env.VITE_DEV_ADMIN_TOKEN;
import { getLocalizedText } from '@/features/quests/utils';

export const DeveloperPage = () => {
    const [activeTab, setActiveTab] = useState<'points' | 'quests' | 'system' | 'layers'>('points');

    if (!DEV_DASHBOARD_ENABLED) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] font-sans pt-20 px-8">
                <div className="max-w-xl mx-auto text-center space-y-3">
                    <h1 className="text-2xl font-bold text-[#ca8a04]">Developer tools disabled</h1>
                    <p className="text-sm text-gray-500">
                        Set VITE_ENABLE_DEV_DASHBOARD=true to enable this page.
                    </p>
                </div>
            </div>
        );
    }

    if (!DEV_ADMIN_TOKEN) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] font-sans pt-20 px-8">
                <div className="max-w-xl mx-auto text-center space-y-3">
                    <h1 className="text-2xl font-bold text-[#ca8a04]">Admin token missing</h1>
                    <p className="text-sm text-gray-500">
                        Set VITE_DEV_ADMIN_TOKEN to access protected admin endpoints.
                    </p>
                </div>
            </div>
        );
    }

    const adminHeaders = { Authorization: `Bearer ${DEV_ADMIN_TOKEN}` };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] font-sans pt-20 px-8">
            <header className="mb-8 flex items-center justify-between border-b border-[#333] pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#ca8a04]">Developer Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Database Management & Debug Tools</p>
                </div>
                <div className="flex space-x-2">
                    <TabButton
                        active={activeTab === 'points'}
                        onClick={() => setActiveTab('points')}
                        icon={<Database size={16} />}
                        label="Map Points"
                    />
                    <TabButton
                        active={activeTab === 'quests'}
                        onClick={() => setActiveTab('quests')}
                        icon={<Scroll size={16} />}
                        label="Quests"
                    />
                    <TabButton
                        active={activeTab === 'layers'}
                        onClick={() => setActiveTab('layers')}
                        icon={<Layers size={16} />}
                        label="Layers"
                    />
                    <TabButton
                        active={activeTab === 'system'}
                        onClick={() => setActiveTab('system')}
                        icon={<AlertCircle size={16} />}
                        label="System Actions"
                    />
                </div>
            </header>

            <main>
                {activeTab === 'points' && <MapPointsTab adminHeaders={adminHeaders} />}
                {activeTab === 'quests' && <QuestsTab />}
                {activeTab === 'layers' && <LayersTab />}
                {activeTab === 'system' && <SystemTab adminHeaders={adminHeaders} />}
            </main>
        </div>
    );
};

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
            active
                ? "bg-[#ca8a04] text-black font-semibold"
                : "bg-[#2a2a2a] hover:bg-[#333] text-gray-300"
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// --- TABS ---

const QuestsTab = () => {
    const { quests, userQuests, startQuest, forceCompleteQuest } = useQuestStore();

    // Sort quests: Active first, then by ID
    const sortedQuests = Object.values(quests).sort((a, b) => {
        const uQA = userQuests[a.id];
        const uQB = userQuests[b.id];
        if (uQA?.status === 'active' && uQB?.status !== 'active') return -1;
        if (uQA?.status !== 'active' && uQB?.status === 'active') return 1;
        return a.id.localeCompare(b.id);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Quest Registry ({Object.keys(quests).length})</h2>
                <button
                    onClick={() => {
                        if (window.confirm('Reset all quests?')) {
                            useQuestStore.getState().resetQuests();
                        }
                    }}
                    className="p-2 hover:bg-[#333] rounded text-red-500 hover:text-red-400"
                    title="Reset All Quests"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedQuests.map(quest => {
                    const userState = userQuests[quest.id];
                    const isActive = userState?.status === 'active';
                    const isCompleted = userState?.status === 'completed';

                    return (
                        <div key={quest.id} className={cn(
                            "border rounded-lg p-4 relative overflow-hidden",
                            isActive ? "border-[#ca8a04] bg-[#2a2a2a]" :
                                isCompleted ? "border-green-900/30 bg-green-900/10 opacity-70" : "border-[#333] bg-[#202020]"
                        )}>
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 text-xs font-mono uppercase">
                                {isActive && <span className="text-[#ca8a04] flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Active</span>}
                                {isCompleted && <span className="text-green-500 flex items-center gap-1"><CheckSquare size={12} /> Completed</span>}
                                {!userState && <span className="text-gray-500">Not Started</span>}
                            </div>

                            <h3 className="font-bold text-lg text-gray-200">{getLocalizedText(quest.title, 'en')}</h3>
                            <p className="text-xs text-gray-500 font-mono mb-2">{quest.id}</p>
                            <p className="text-sm text-gray-400 mb-4">{getLocalizedText(quest.description, 'en')}</p>

                            {/* Objectives */}
                            <div className="space-y-1 mb-4 bg-black/20 p-2 rounded">
                                {quest.objectives.map(obj => {
                                    const isDone = userState?.completedObjectiveIds?.includes(obj.id);
                                    return (
                                        <div key={obj.id} className="flex items-center gap-2 text-xs">
                                            <div className={cn("w-2 h-2 rounded-full", isDone ? "bg-green-500" : "bg-gray-600")} />
                                            <span className={cn(isDone ? "text-gray-500 line-through" : "text-gray-300")}>
                                                {getLocalizedText(obj.text, 'en')}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 border-t border-white/10 pt-4">
                                {!userState && (
                                    <button
                                        onClick={() => startQuest(quest.id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded text-xs"
                                    >
                                        <Play size={14} /> Start Quest
                                    </button>
                                )}
                                {isActive && (
                                    <button
                                        onClick={() => forceCompleteQuest(quest.id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded text-xs"
                                    >
                                        <CheckSquare size={14} /> Force Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MapPointsTab = ({ adminHeaders }: { adminHeaders: Record<string, string> }) => {
    const { data: points, isLoading, refetch } = useQuery({
        queryKey: ['admin', 'points'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/admin/points`, { headers: adminHeaders });
            if (!res.ok) throw new Error("Failed to fetch points");
            return res.json() as Promise<MapPoint[]>;
        }
    });

    const [editingPoint, setEditingPoint] = useState<MapPoint | null>(null);

    if (isLoading) return <div>Loading database...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Map Points ({points?.length})</h2>
                <button onClick={() => refetch()} className="p-2 hover:bg-[#333] rounded"><RefreshCw size={16} /></button>
            </div>

            <div className="overflow-x-auto border border-[#333] rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#252525] text-gray-400">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Bindings</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {points?.map((p) => (
                            <tr key={p.id} className="hover:bg-[#2a2a2a]">
                                <td className="p-3 font-mono text-xs text-gray-500">{p.id}</td>
                                <td className="p-3 font-medium text-[#ca8a04]">{p.title}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 bg-[#333] rounded text-xs">{p.category}</span>
                                </td>
                                <td className="p-3 text-xs text-gray-500 truncate max-w-[150px]">{p.image}</td>
                                <td className="p-3 text-xs font-mono text-gray-500 truncate max-w-[200px]">
                                    {typeof p.bindings === 'string' ? p.bindings : JSON.stringify(p.bindings)}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setEditingPoint(p)}
                                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingPoint && (
                <EditPointModal
                    point={editingPoint}
                    adminHeaders={adminHeaders}
                    onClose={() => setEditingPoint(null)}
                    onSave={() => { setEditingPoint(null); refetch(); }}
                />
            )}
        </div>
    );
};

const SystemTab = ({ adminHeaders }: { adminHeaders: Record<string, string> }) => {
    const { xp, level, flags, resetDossier, grantXp } = useDossierStore();
    const { resetQuests } = useQuestStore();

    const handleReset = async () => {
        if (!window.confirm("ARE YOU SURE? This will wipe ALL user progress (visited points, unlocked clues, quests, XP).")) return;

        try {
            // 1. Reset Server Data
            await fetch(`${API_URL}/admin/progress`, { method: 'DELETE', headers: adminHeaders });

            // 2. Reset Local Stores
            resetDossier();
            resetQuests();

            alert("Progress wiped (Server + Client). Refresh page to be safe.");
            window.location.reload();
        } catch {
            alert("Failed to wipe progress");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                {/* Progression Debug */}
                <div className="border border-[#333] bg-[#222] p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-[#ca8a04] flex items-center gap-2 mb-4">
                        <CheckSquare /> Progression Debug
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-[#111] rounded">
                            <span className="text-gray-400">Current Level</span>
                            <span className="font-mono text-xl">{level} <span className="text-sm text-gray-600">(XP: {xp})</span></span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => grantXp(100)} className="flex-1 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 p-2 rounded text-sm">+100 XP</button>
                            <button onClick={() => grantXp(1000)} className="flex-1 bg-purple-900/30 text-purple-400 hover:bg-purple-900/50 p-2 rounded text-sm">+1000 XP</button>
                        </div>
                    </div>
                </div>

                {/* Flags Debug */}
                <div className="border border-[#333] bg-[#222] p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-300 mb-4">Flags State</h3>
                    <div className="bg-[#111] p-2 rounded font-mono text-xs text-gray-500 h-40 overflow-y-auto">
                        {Object.entries(flags).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                                <span>{k}</span>
                                <span className={v ? "text-green-500" : "text-red-500"}>{String(v)}</span>
                            </div>
                        ))}
                        {Object.keys(flags).length === 0 && <div className="text-center italic opacity-50 pt-10">No flags set</div>}
                    </div>
                </div>
            </div>

            <div className="border border-red-900/50 bg-red-900/10 p-6 rounded-lg h-fit">
                <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                    <AlertCircle /> Danger Zone
                </h3>
                <p className="mt-2 text-gray-400 text-sm">Destructive actions. Use with caution.</p>

                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#111] rounded border border-[#333]">
                        <div>
                            <div className="font-semibold">Factory Reset Progress</div>
                            <div className="text-xs text-gray-500">Clears `user_map_point_states` table. Map content is safe.</div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Wipe Progress
                        </button>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-[#111] rounded border border-[#333]">
                        <div>
                            <div className="font-semibold text-red-400">Delete Player Identity</div>
                            <div className="text-xs text-gray-500">Clears `playerName`. Will trigger Onboarding on reload.</div>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Delete player identity? This will trigger onboarding.')) {
                                    useInventoryStore.getState().setPlayerName('');
                                    window.location.reload();
                                }
                            }}
                            className="bg-red-900/50 hover:bg-red-900 text-red-200 px-4 py-2 rounded flex items-center gap-2"
                        >
                            <User size={16} /> Delete Player
                        </button>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-[#111] rounded border border-[#333]">
                        <div>
                            <div className="font-semibold text-blue-400">Create Test Player</div>
                            <div className="text-xs text-gray-500">Sets `playerName` to "Inspector Dev". Skips Onboarding.</div>
                        </div>
                        <button
                            onClick={() => {
                                useInventoryStore.getState().setPlayerName('Inspector Dev');
                                window.location.reload();
                            }}
                            className="bg-blue-900/50 hover:bg-blue-900 text-blue-200 px-4 py-2 rounded flex items-center gap-2"
                        >
                            <UserPlus size={16} /> Create Dev
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

type LayerDefinition = (typeof LAYER_DEFINITIONS)[number];

const LayersTab = () => {
    const [values, setValues] = useState<LayerValues>(() => getLayerValues());

    const groups = LAYER_DEFINITIONS.reduce((acc, def) => {
        if (!acc[def.group]) {
            acc[def.group] = [];
        }
        acc[def.group].push(def);
        return acc;
    }, {} as Record<string, LayerDefinition[]>);

    const handleChange = (key: LayerKey, nextValue: number) => {
        if (Number.isNaN(nextValue)) return;

        setValues((prev) => ({ ...prev, [key]: nextValue }));
        setLayerValue(key, nextValue);
    };

    const handleReset = () => {
        resetLayerOverrides();
        setValues(getLayerDefaults());
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Layer Control</h2>
                <button
                    onClick={handleReset}
                    className="px-3 py-2 text-xs uppercase tracking-wider bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded"
                >
                    Reset to defaults
                </button>
            </div>

            <div className="text-xs text-gray-500">
                Changes apply immediately and persist in localStorage (debug_layer_overrides).
            </div>

            {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#ca8a04]">{group}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => (
                            <div key={item.key} className="border border-[#333] bg-[#202020] rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-semibold text-gray-200">{item.label}</div>
                                        {item.description && (
                                            <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                        )}
                                        <div className="text-[10px] text-gray-600 font-mono mt-2">
                                            {layerVarName(item.key)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <input
                                            type="number"
                                            className="w-20 bg-[#111] border border-[#333] rounded px-2 py-1 text-sm text-gray-200"
                                            value={values[item.key]}
                                            onChange={(event) => {
                                                const nextValue = Number(event.target.value);
                                                if (Number.isNaN(nextValue)) return;
                                                handleChange(item.key, nextValue);
                                            }}
                                        />
                                        <div className="text-[10px] text-gray-500">default: {item.defaultValue}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface EditPointModalProps {
    point: MapPoint;
    onClose: () => void;
    onSave: () => void;
    adminHeaders: Record<string, string>;
}

const EditPointModal = ({ point, onClose, onSave, adminHeaders }: EditPointModalProps) => {
    const [formData, setFormData] = useState({
        title: point.title,
        description: point.description || '',
        category: point.category,
        image: point.image || '',
        bindings: typeof point.bindings === 'string' ? point.bindings : JSON.stringify(point.bindings, null, 2)
    });

    // Validation state
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleSave = async () => {
        // Validate JSON
        try {
            JSON.parse(formData.bindings);
            setJsonError(null);
        } catch (e: unknown) {
            setJsonError((e as Error).message);
            return;
        }

        const res = await fetch(`${API_URL}/admin/point/${point.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...adminHeaders },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            onSave();
        } else {
            alert("Failed to save");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-lg border border-[#333] shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#333] flex justify-between items-center">
                    <h3 className="font-bold text-lg">Edit <span className="font-mono text-[#ca8a04]">{point.id}</span></h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <LabelInput label="Title" value={formData.title} onChange={(v: string) => setFormData({ ...formData, title: v })} />
                        <LabelInput label="Category" value={formData.category} onChange={(v: string) => setFormData({ ...formData, category: v as MapPoint['category'] })} />
                    </div>

                    <LabelInput label="Image Path" value={formData.image} onChange={(v: string) => setFormData({ ...formData, image: v })} />
                    <LabelInput label="Description" value={formData.description} textArea onChange={(v: string) => setFormData({ ...formData, description: v })} />

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Bindings (JSON)</label>
                        <textarea
                            className={cn(
                                "w-full bg-[#111] border rounded p-2 font-mono text-xs h-40 focus:outline-none focus:border-[#ca8a04]",
                                jsonError ? "border-red-500" : "border-[#333]"
                            )}
                            value={formData.bindings}
                            onChange={(e) => {
                                setFormData({ ...formData, bindings: e.target.value });
                                setJsonError(null);
                            }}
                        />
                        {jsonError && <div className="text-red-500 text-xs mt-1">{jsonError}</div>}
                    </div>
                </div>

                <div className="p-4 border-t border-[#333] flex justify-end gap-2 bg-[#252525]">
                    <button onClick={onClose} className="px-4 py-2 hover:bg-[#333] rounded">Cancel</button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#ca8a04] text-black font-bold rounded hover:bg-[#b07803] flex items-center gap-2"
                        disabled={!!jsonError}
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LabelInputProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    textArea?: boolean;
}

const LabelInput = ({ label, value, onChange, textArea }: LabelInputProps) => (
    <div>
        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</label>
        {textArea ? (
            <textarea
                className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm focus:outline-none focus:border-[#ca8a04]"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            <input
                className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm focus:outline-none focus:border-[#ca8a04]"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        )}
    </div>
);
