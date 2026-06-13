import type { CaseDocument } from "@/lib/cases/types";
import { useState } from "react";
import { Lock, X } from "lucide-react";

interface Props {
  doc: CaseDocument | null;
  unlocked: boolean;
  onClose: () => void;
  onUnlock: (id: string) => void;
}

export function DocumentModal({ doc, unlocked, onClose, onUnlock }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (!doc) return null;

  const isLocked = !!doc.password && !unlocked;

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!doc) return;
    if (input.trim() === doc.password) {
      onUnlock(doc.id);
      setInput("");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-10"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-charcoal text-cream rounded-full p-2 shadow-lg hover:bg-sienna"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isLocked ? (
          <div className="paper-bg p-10 text-center">
            <Lock className="w-12 h-12 mx-auto text-sienna mb-4" />
            <h2 className="font-display text-3xl text-ink mb-2">{doc.title}</h2>
            <p className="typewriter text-sm text-sepia mb-6 max-w-md mx-auto">
              This document is sealed. A passcode is required.
            </p>
            <form onSubmit={tryUnlock} className="flex gap-2 max-w-xs mx-auto">
              <input
                inputMode="numeric"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter code"
                className={`flex-1 typewriter tracking-[0.4em] text-center text-lg px-3 py-2 bg-cream border-2 border-border focus:outline-none focus:border-sienna ${
                  error ? "animate-shake border-destructive" : ""
                }`}
              />
              <button
                type="submit"
                className="typewriter text-sm tracking-widest px-4 py-2 bg-sienna text-cream hover:bg-stamp"
              >
                UNLOCK
              </button>
            </form>
            {error && <p className="typewriter text-xs text-destructive mt-3">INCORRECT CODE</p>}
          </div>
        ) : (
          <DocumentBody doc={doc} />
        )}
      </div>
    </div>
  );
}

function DocumentBody({ doc }: { doc: CaseDocument }) {
  if (doc.kind === "newspaper") {
    return (
      <article className="paper-bg p-8 md:p-12 newspaper text-ink">
        <header className="border-b-4 border-double border-ink pb-3 mb-6 text-center">
          <h1 className="font-display text-5xl tracking-tight">{doc.title}</h1>
          {doc.subtitle && (
            <p className="typewriter text-xs tracking-[0.3em] mt-2 text-sepia uppercase">
              {doc.subtitle}
            </p>
          )}
        </header>
        <div className="columns-1 md:columns-2 gap-8 [column-rule:1px_solid_var(--color-sepia)]">
          {doc.sections.map((s, i) => (
            <section key={i} className="mb-5 break-inside-avoid">
              {s.heading && (
                <h3 className="font-display text-2xl mb-2 leading-tight">{s.heading}</h3>
              )}
              <p className="text-[0.95rem] leading-relaxed whitespace-pre-line text-justify">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    );
  }

  if (doc.kind === "postit") {
    return (
      <div className="flex justify-center py-8">
        <div
          className="postit bg-postit-yellow max-w-sm whitespace-pre-line"
          style={{ transform: "rotate(-3deg)" }}
        >
          {doc.sections.map((s, i) => (
            <p key={i}>{s.body}</p>
          ))}
        </div>
      </div>
    );
  }

  if (doc.kind === "letter") {
    return (
      <article className="paper-bg p-8 md:p-12 text-ink relative">
        <div className="tape -top-3 left-1/4" />
        <div className="tape -top-3 right-1/4" />
        <h2 className="font-display text-3xl mb-2">{doc.title}</h2>
        {doc.subtitle && (
          <p className="typewriter text-xs text-sepia mb-6 tracking-widest">{doc.subtitle}</p>
        )}
        <div className="space-y-5 handwritten text-2xl leading-relaxed">
          {doc.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h3 className="font-display text-xl text-sienna mb-2">{s.heading}</h3>}
              <p className="whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    );
  }

  if (doc.kind === "phone" || doc.kind === "ledger") {
    return (
      <article className="paper-bg p-8 md:p-12 text-ink">
        <h2 className="font-display text-3xl mb-1">{doc.title}</h2>
        {doc.subtitle && (
          <p className="typewriter text-xs text-sepia mb-6 tracking-widest">{doc.subtitle}</p>
        )}
        <div className="space-y-6 typewriter text-sm leading-relaxed">
          {doc.sections.map((s, i) => (
            <section key={i} className="border-l-2 border-sienna pl-4">
              {s.heading && (
                <h3 className="font-display text-lg mb-2 text-sienna tracking-wide">{s.heading}</h3>
              )}
              <p className="whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    );
  }

  // police, witness, diary — typewritten file
  return (
    <article className="paper-bg p-8 md:p-12 text-ink relative">
      <div className="absolute top-4 right-6 stamp">
        {doc.kind === "police" ? "Confidential" : doc.kind === "witness" ? "Sworn" : "Private"}
      </div>
      <h2 className="font-display text-3xl mb-1 pr-32">{doc.title}</h2>
      {doc.subtitle && (
        <p className="typewriter text-xs text-sepia mb-6 tracking-widest">{doc.subtitle}</p>
      )}
      <div className="space-y-5 typewriter text-[0.95rem] leading-7">
        {doc.sections.map((s, i) => (
          <section key={i}>
            {s.heading && (
              <h3 className="font-display text-lg uppercase tracking-widest text-sienna mb-2">
                {s.heading}
              </h3>
            )}
            <p className="whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
