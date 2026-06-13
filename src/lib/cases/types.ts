export type DocKind =
  | "newspaper"
  | "police"
  | "witness"
  | "letter"
  | "postit"
  | "phone"
  | "photo"
  | "ledger"
  | "diary";

export interface DocSection {
  heading?: string;
  body: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  kind: DocKind;
  /** if set, document is locked behind a numeric password */
  password?: string;
  /** rendered content: array of sections (markdown-lite, line breaks preserved) */
  sections: DocSection[];
  /** optional caption / subtitle */
  subtitle?: string;
  /** optional image placeholder description used as alt + bg label */
  imageLabel?: string;
  /** rotation in deg for desk feel */
  rotation?: number;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relation: string;
}

export interface CaseAnswerOptions {
  suspects: string[];
  motives: string[];
  weapons: string[];
  locations: string[];
  times: string[];
}

export interface CaseSolution {
  suspect: string;
  motive: string;
  weapon: string;
  location: string;
  time: string;
}

export interface DetectiveCase {
  id: string;
  number: string; // CASE-001
  title: string;
  tagline: string;
  victim: string;
  date: string;
  briefing: string;
  suspects: Suspect[];
  options: CaseAnswerOptions;
  solution: CaseSolution;
  documents: CaseDocument[];
}

export type AnswerKey = keyof CaseSolution;

export interface CaseProgress {
  unlocked: string[]; // doc ids
  answers: Partial<CaseSolution>;
  attempts: number;
  bestScore: number;
  solved: boolean;
}
