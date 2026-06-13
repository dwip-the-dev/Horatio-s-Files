import type { CaseDocument } from "@/lib/cases/types";
import { Lock } from "lucide-react";

interface Props {
  doc: CaseDocument;
  unlocked: boolean;
  onClick: () => void;
}

const kindLabel: Record<string, string> = {
  newspaper: "Newspaper",
  police: "Police File",
  witness: "Statement",
  letter: "Letter",
  postit: "Note",
  phone: "Phone Log",
  photo: "Photograph",
  ledger: "Ledger",
  diary: "Diary",
};

export function DocumentThumb({ doc, unlocked, onClick }: Props) {
  const isLocked = !!doc.password && !unlocked;
  return (
    <button
      onClick={onClick}
      className="text-left relative paper-bg p-4 min-h-[160px] transition hover:-translate-y-1 hover:shadow-xl"
      style={{ transform: `rotate(${doc.rotation ?? 0}deg)` }}
    >
      <div className="tape -top-3 left-4" />
      <div className="typewriter text-[0.65rem] text-sepia tracking-widest mb-1">
        {kindLabel[doc.kind] ?? "Document"}
      </div>
      <h3 className="font-display text-lg text-ink leading-tight pr-6">{doc.title}</h3>
      {doc.subtitle && <p className="typewriter text-xs text-sepia mt-2">{doc.subtitle}</p>}
      {isLocked && (
        <div className="absolute inset-0 bg-charcoal/85 flex flex-col items-center justify-center text-cream gap-2 rounded">
          <Lock className="w-8 h-8" />
          <div className="typewriter text-xs tracking-widest">SEALED</div>
        </div>
      )}
    </button>
  );
}
