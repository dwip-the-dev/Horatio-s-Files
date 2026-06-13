import type { CaseProgress } from "./cases/types";

const KEY = (caseId: string) => `horatio:case:${caseId}`;

const empty = (): CaseProgress => ({
  unlocked: [],
  answers: {},
  attempts: 0,
  bestScore: 0,
  solved: false,
});

export function loadProgress(caseId: string): CaseProgress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY(caseId));
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(caseId: string, p: CaseProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(caseId), JSON.stringify(p));
}

export function resetProgress(caseId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY(caseId));
}
