import { useAppStore } from '../store/useAppStore';
import { translations, Translations } from './translations';
import { Language } from '../types';

// Thin hook — reads language from global Zustand store.
// Language persists across sessions via AsyncStorage (handled in store).
export function useTranslation(): { t: Translations; lang: Language } {
  const lang = useAppStore((s) => s.language);
  return { t: translations[lang], lang };
}