import type {
  CaseAnswerOptions,
  CaseDocument,
  CaseSolution,
  DetectiveCase,
  Suspect,
} from "./types";

type CaseMeta = Omit<DetectiveCase, "suspects" | "options" | "solution" | "documents">;

type StoredDocument = CaseDocument & { order: number };

const caseModules = import.meta.glob("../../../cases/*/case.json", {
  eager: true,
  import: "default",
}) as Record<string, CaseMeta>;

const suspectsModules = import.meta.glob("../../../cases/*/suspects.json", {
  eager: true,
  import: "default",
}) as Record<string, Suspect[]>;

const optionsModules = import.meta.glob("../../../cases/*/options.json", {
  eager: true,
  import: "default",
}) as Record<string, CaseAnswerOptions>;

const solutionModules = import.meta.glob("../../../cases/*/solution.json", {
  eager: true,
  import: "default",
}) as Record<string, CaseSolution>;

const documentModules = import.meta.glob("../../../cases/*/documents/*.json", {
  eager: true,
  import: "default",
}) as Record<string, StoredDocument>;

function getCaseIdFromPath(filePath: string) {
  const match = filePath.match(/cases\/([^/]+)\//);
  if (!match) {
    throw new Error(`Could not derive case id from path: ${filePath}`);
  }
  return match[1];
}

const docsByCase = Object.entries(documentModules).reduce<Record<string, StoredDocument[]>>(
  (acc, [filePath, document]) => {
    const caseId = getCaseIdFromPath(filePath);
    acc[caseId] ??= [];
    acc[caseId].push(document);
    return acc;
  },
  {},
);

export const cases: DetectiveCase[] = Object.entries(caseModules)
  .map(([filePath, meta]) => {
    const caseId = getCaseIdFromPath(filePath);
    const documents = (docsByCase[caseId] ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(({ order: _order, ...document }) => document);

    return {
      ...meta,
      suspects: suspectsModules[filePath.replace("/case.json", "/suspects.json")] ?? [],
      options: optionsModules[filePath.replace("/case.json", "/options.json")],
      solution: solutionModules[filePath.replace("/case.json", "/solution.json")],
      documents,
    };
  })
  .sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));

export function getCase(id: string): DetectiveCase | undefined {
  return cases.find((detective) => detective.id === id);
}
