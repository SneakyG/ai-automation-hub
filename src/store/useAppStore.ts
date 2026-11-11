import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_SKILLS, STARTER_TASKS } from '../data/mockData';
import type { AppData, Category, CustomVideo, ShipType, SkillKey, TaskStatus } from '../types';
import { todayIso, uid } from '../utils/date';

interface AppActions {
  setStartDate: (date: string) => void;
  toggleMilestone: (id: string) => void;
  setCustomVideo: (id: string, url: string, title: string) => void;
  removeCustomVideo: (id: string) => void;
  setCustomGuide: (id: string, url: string, title: string) => void;
  removeCustomGuide: (id: string) => void;
  addTask: (title: string, tag: Category) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  addHourLog: (date: string, hours: number, note: string) => void;
  removeHourLog: (id: string) => void;
  addIncome: (date: string, amountUsd: number, source: string) => void;
  removeIncome: (id: string) => void;
  addShip: (date: string, type: ShipType, title: string) => void;
  removeShip: (id: string) => void;
  setSkill: (key: SkillKey, value: number) => void;
  toggleRhythm: (key: string) => void;
  importData: (data: AppData) => void;
  resetAll: () => void;
}

export type AppState = AppData & AppActions;

const initialData = (): AppData => ({
  startDate: todayIso(),
  completed: {},
  customVideos: {},
  customGuides: {},
  tasks: STARTER_TASKS.map((t) => ({ id: uid(), title: t.title, tag: t.tag, status: 'todo' as const, createdAt: todayIso() })),
  hourLogs: [],
  incomes: [],
  ships: [],
  skills: { ...DEFAULT_SKILLS },
  rhythmChecks: {},
});

export const pickData = (s: AppState): AppData => ({
  startDate: s.startDate,
  completed: s.completed,
  customVideos: s.customVideos,
  customGuides: s.customGuides,
  tasks: s.tasks,
  hourLogs: s.hourLogs,
  incomes: s.incomes,
  ships: s.ships,
  skills: s.skills,
  rhythmChecks: s.rhythmChecks,
});

/** Bản v1 lưu link Loom trong `loomLinks`; chuyển sang `customVideos`. */
export const migrateData = (persisted: unknown, version: number): AppData => {
  const data = (persisted ?? {}) as Partial<AppData> & { loomLinks?: Record<string, string> };
  const customVideos: Record<string, CustomVideo> = { ...(data.customVideos ?? {}) };
  if (version < 2 && data.loomLinks) {
    Object.entries(data.loomLinks).forEach(([id, url]) => {
      if (url && !customVideos[id]) customVideos[id] = { url, title: 'Video Loom của tôi', updatedAt: todayIso() };
    });
  }
  const { loomLinks: _legacy, ...rest } = data;
  void _legacy;
  return { ...initialData(), ...rest, customVideos, customGuides: { ...(data.customGuides ?? {}) } };
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialData(),
      setStartDate: (date) => set({ startDate: date }),
      toggleMilestone: (id) => set((s) => ({ completed: { ...s.completed, [id]: !s.completed[id] } })),
      setCustomVideo: (id, url, title) =>
        set((s) => ({ customVideos: { ...s.customVideos, [id]: { url: url.trim(), title: title.trim(), updatedAt: todayIso() } } })),
      removeCustomVideo: (id) =>
        set((s) => {
          const next = { ...s.customVideos };
          delete next[id];
          return { customVideos: next };
        }),
      setCustomGuide: (id, url, title) =>
        set((s) => ({ customGuides: { ...s.customGuides, [id]: { url: url.trim(), title: title.trim(), updatedAt: todayIso() } } })),
      removeCustomGuide: (id) =>
        set((s) => {
          const next = { ...s.customGuides };
          delete next[id];
          return { customGuides: next };
        }),
      addTask: (title, tag) =>
        set((s) => ({ tasks: [...s.tasks, { id: uid(), title, tag, status: 'todo' as const, createdAt: todayIso() }] })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      addHourLog: (date, hours, note) =>
        set((s) => ({ hourLogs: [{ id: uid(), date, hours, note }, ...s.hourLogs] })),
      removeHourLog: (id) => set((s) => ({ hourLogs: s.hourLogs.filter((h) => h.id !== id) })),
      addIncome: (date, amountUsd, source) =>
        set((s) => ({ incomes: [{ id: uid(), date, amountUsd, source }, ...s.incomes] })),
      removeIncome: (id) => set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),
      addShip: (date, type, title) => set((s) => ({ ships: [{ id: uid(), date, type, title }, ...s.ships] })),
      removeShip: (id) => set((s) => ({ ships: s.ships.filter((x) => x.id !== id) })),
      setSkill: (key, value) => set((s) => ({ skills: { ...s.skills, [key]: value } })),
      toggleRhythm: (key) => set((s) => ({ rhythmChecks: { ...s.rhythmChecks, [key]: !s.rhythmChecks[key] } })),
      importData: (data) => set(migrateData(data, 'customVideos' in data ? 2 : 1)),
      resetAll: () => set(initialData()),
    }),
    {
      name: 'ai-automation-hub-v1',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => pickData(s),
      migrate: (persisted, version) => migrateData(persisted, version) as AppState,
    },
  ),
);

export const isAppData = (value: unknown): value is AppData => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.startDate === 'string' &&
    typeof v.completed === 'object' &&
    Array.isArray(v.tasks) &&
    Array.isArray(v.hourLogs) &&
    Array.isArray(v.incomes) &&
    Array.isArray(v.ships) &&
    typeof v.skills === 'object'
  );
};
