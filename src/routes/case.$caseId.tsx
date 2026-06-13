import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getCase } from "@/lib/cases";
import { loadProgress, saveProgress, resetProgress } from "@/lib/storage";
import type { CaseDocument, CaseProgress, CaseSolution, DetectiveCase } from "@/lib/cases/types";
import { DocumentThumb } from "@/components/case/DocumentThumb";
import { DocumentModal } from "@/components/case/DocumentModal";
import { AnswerBoard } from "@/components/case/AnswerBoard";
import { SuspectCard } from "@/components/case/SuspectCard";

export const Route = createFileRoute("/case/$caseId")({
  loader: ({ params }: { params: { caseId: string } }): { detective: DetectiveCase } => {
    const c = getCase(params.caseId);
    if (!c) throw notFound();
    return { detective: c };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.detective.title} — Horatio's Files` },
      { name: "description", content: loaderData?.detective.tagline ?? "" },
    ],
  }),
  component: CasePage,
});

function CasePage() {
  const { detective } = Route.useLoaderData() as { detective: DetectiveCase };
  const [progress, setProgress] = useState<CaseProgress>(() => ({
    unlocked: [],
    answers: {},
    attempts: 0,
    bestScore: 0,
    solved: false,
  }));
  const [hydrated, setHydrated] = useState(false);
  const [openDocId, setOpenDocId] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; solved: boolean } | null>(null);

  useEffect(() => {
    setProgress(loadProgress(detective.id));
    setHydrated(true);
  }, [detective.id]);

  useEffect(() => {
    if (hydrated) saveProgress(detective.id, progress);
  }, [progress, hydrated, detective.id]);

  const unlockedSet = useMemo(() => new Set(progress.unlocked), [progress.unlocked]);
  const openDoc: CaseDocument | null = openDocId
    ? (detective.documents.find((d) => d.id === openDocId) ?? null)
    : null;

  function unlock(id: string) {
    setProgress((p) => (p.unlocked.includes(id) ? p : { ...p, unlocked: [...p.unlocked, id] }));
  }

  function setAnswers(answers: Partial<CaseSolution>) {
    setProgress((p) => ({ ...p, answers }));
  }

  function submit() {
    const a = progress.answers;
    const s = detective.solution;
    let score = 0;
    (Object.keys(s) as (keyof CaseSolution)[]).forEach((k) => {
      if (a[k] === s[k]) score++;
    });
    const solved = score === 5;
    setProgress((p) => ({
      ...p,
      attempts: p.attempts + 1,
      bestScore: Math.max(p.bestScore, score),
      solved: p.solved || solved,
    }));
    setResult({ score, solved });
  }

  function reset() {
    if (!confirm("Reset all progress for this case?")) return;
    resetProgress(detective.id);
    setProgress({
      unlocked: [],
      answers: {},
      attempts: 0,
      bestScore: 0,
      solved: false,
    });
    setResult(null);
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="typewriter text-xs tracking-widest text-sepia hover:text-sienna inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> CASE DRAWER
        </Link>
        <button
          onClick={reset}
          className="typewriter text-xs tracking-widest text-sepia hover:text-destructive inline-flex items-center gap-2"
        >
          <RotateCcw className="w-3 h-3" /> RESET
        </button>
      </div>

      <header className="paper-bg p-6 md:p-8 mb-8 relative">
        <div className="absolute top-4 right-6 stamp">{detective.number}</div>
        <p className="typewriter text-xs text-sepia tracking-widest">{detective.date}</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-1">{detective.title}</h1>
        <p className="newspaper italic text-charcoal/80 mt-2 max-w-2xl">{detective.tagline}</p>
        <p className="typewriter text-sm text-ink mt-4 max-w-3xl leading-relaxed">
          {detective.briefing}
        </p>
        <div className="typewriter text-xs text-sepia mt-4">
          Victim: <span className="text-ink">{detective.victim}</span>
          {progress.attempts > 0 && (
            <span className="ml-4">
              Best: <span className="text-ink">{progress.bestScore}/5</span> · Attempts:{" "}
              <span className="text-ink">{progress.attempts}</span>
            </span>
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl text-ink mb-4 border-b border-sepia/40 pb-2">
              Persons of Interest
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {detective.suspects.map((s, i) => (
                <SuspectCard key={s.id} suspect={s} idx={i} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-4 border-b border-sepia/40 pb-2">
              Evidence on the Desk
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 pt-3">
              {detective.documents.map((d) => (
                <DocumentThumb
                  key={d.id}
                  doc={d}
                  unlocked={unlockedSet.has(d.id)}
                  onClick={() => setOpenDocId(d.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AnswerBoard
            options={detective.options}
            current={progress.answers}
            onChange={setAnswers}
            onSubmit={submit}
          />
        </aside>
      </div>

      <DocumentModal
        doc={openDoc}
        unlocked={openDoc ? unlockedSet.has(openDoc.id) : false}
        onClose={() => setOpenDocId(null)}
        onUnlock={unlock}
      />

      {result && (
        <ResultOverlay result={result} victim={detective.victim} onClose={() => setResult(null)} />
      )}
    </div>
  );
}

function ResultOverlay({
  result,
  victim,
  onClose,
}: {
  result: { score: number; solved: boolean };
  victim: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/85 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="paper-bg p-10 max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="typewriter text-xs tracking-[0.4em] text-sepia">THEORY SUBMITTED</p>
        <div className="font-display text-7xl text-sienna mt-3">{result.score}/5</div>
        {result.solved ? (
          <>
            <div className="stamp mt-5 mx-auto inline-block">CASE CLOSED</div>
            <p className="newspaper italic mt-4 text-ink">
              You have named the killer of {victim}. Justice, of a sort.
            </p>
          </>
        ) : (
          <p className="newspaper italic mt-5 text-ink">
            Not enough. The file stays open. Re-read the papers — something was staring you in the
            face.
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-6 typewriter tracking-widest text-sm px-6 py-2 bg-charcoal text-cream hover:bg-sienna"
        >
          BACK TO THE DESK
        </button>
      </div>
    </div>
  );
}
