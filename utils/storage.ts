import { SplitState } from "@types/index";

const STORAGE_KEY = "split-sprite-state-v1";

export function loadState(): SplitState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SplitState;
  } catch {
    return null;
  }
}

export function saveState(state: SplitState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

