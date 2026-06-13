import { useState } from "react";
import type { AnswerKey, CaseAnswerOptions, CaseSolution } from "@/lib/cases/types";

interface Props {
  options: CaseAnswerOptions;
  current: Partial<CaseSolution>;
  onChange: (answers: Partial<CaseSolution>) => void;
  onSubmit: () => void;
}

const CATEGORIES: { key: AnswerKey; label: string; opt: keyof CaseAnswerOptions }[] = [
  { key: "suspect", label: "The Killer", opt: "suspects" },
  { key: "motive", label: "Motive", opt: "motives" },
  { key: "weapon", label: "Weapon", opt: "weapons" },
  { key: "location", label: "Location", opt: "locations" },
  { key: "time", label: "Time", opt: "times" },
];

export function AnswerBoard({ options, current, onChange, onSubmit }: Props) {
  const [open, setOpen] = useState(true);
  const filled = CATEGORIES.every((c) => current[c.key]);

  function pick(key: AnswerKey, value: string) {
    onChange({ ...current, [key]: value });
  }

  return (
    <div className="paper-bg p-5 md:p-7 relative">
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-3 right-4 typewriter text-xs text-sepia tracking-widest hover:text-sienna"
      >
        {open ? "[ HIDE ]" : "[ SHOW ]"}
      </button>
      <h3 className="font-display text-2xl text-ink mb-1">Deduction Board</h3>
      <p className="typewriter text-xs text-sepia mb-5">
        Pin one card from each row. Solve all five to close the case.
      </p>

      {open && (
        <>
          <div className="space-y-5">
            {CATEGORIES.map((cat) => (
              <div key={cat.key}>
                <div className="font-display text-sm text-sienna uppercase tracking-widest mb-2">
                  {cat.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {options[cat.opt].map((opt) => {
                    const active = current[cat.key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => pick(cat.key, opt)}
                        className={`typewriter text-sm px-3 py-2 border-2 transition ${
                          active
                            ? "bg-sienna text-cream border-sienna shadow-md -rotate-1"
                            : "bg-cream/70 border-border text-ink hover:border-sienna hover:bg-cream"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={!filled}
            onClick={onSubmit}
            className="mt-7 w-full typewriter tracking-[0.3em] text-sm py-3 bg-charcoal text-cream hover:bg-sienna disabled:opacity-40 disabled:cursor-not-allowed"
          >
            SUBMIT FINAL THEORY
          </button>
        </>
      )}
    </div>
  );
}
