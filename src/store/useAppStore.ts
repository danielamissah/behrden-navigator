import { create } from 'zustand';
import { Language, UserProgress, ProcedureStatus } from '../types';

interface UserLocation {
  lat: number;
  lng: number;
}

interface AppState {
  language: Language;
  progress: Record<string, UserProgress>;
  userLocation: UserLocation | null;
  setLanguage: (lang: Language) => void;
  setUserLocation: (location: UserLocation) => void;
  startProcedure: (procedureId: string) => void;
  completeStep: (procedureId: string, stepId: string) => void;
  uncompleteStep: (procedureId: string, stepId: string) => void;
  completeProcedure: (procedureId: string) => void;
  resetProcedure: (procedureId: string) => void;
  clearAllProgress: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'en',
  progress: {},
  userLocation: null,

  setLanguage: (language) => set({ language }),
  setUserLocation: (userLocation) => set({ userLocation }),

  startProcedure: (procedureId) => {
    const existing = get().progress[procedureId];
    if (existing) return;
    set((state) => ({
      progress: {
        ...state.progress,
        [procedureId]: {
          procedure_id: procedureId,
          status: 'in_progress',
          completed_steps: [],
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    }));
  },

  completeStep: (procedureId, stepId) => {
    set((state) => {
      const existing = state.progress[procedureId] || {
        procedure_id: procedureId,
        status: 'in_progress' as ProcedureStatus,
        completed_steps: [],
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const completedSteps = Array.from(new Set([...existing.completed_steps, stepId]));
      return {
        progress: {
          ...state.progress,
          [procedureId]: {
            ...existing,
            completed_steps: completedSteps,
            status: 'in_progress',
            updated_at: new Date().toISOString(),
          },
        },
      };
    });
  },

  uncompleteStep: (procedureId, stepId) => {
    set((state) => {
      const existing = state.progress[procedureId];
      if (!existing) return state;
      return {
        progress: {
          ...state.progress,
          [procedureId]: {
            ...existing,
            completed_steps: existing.completed_steps.filter((id) => id !== stepId),
            updated_at: new Date().toISOString(),
          },
        },
      };
    });
  },

  completeProcedure: (procedureId) => {
    set((state) => ({
      progress: {
        ...state.progress,
        [procedureId]: {
          ...state.progress[procedureId],
          status: 'completed',
          updated_at: new Date().toISOString(),
        },
      },
    }));
  },

  resetProcedure: (procedureId) => {
    set((state) => {
      const next = { ...state.progress };
      delete next[procedureId];
      return { progress: next };
    });
  },

  clearAllProgress: () => set({ progress: {} }),
}));