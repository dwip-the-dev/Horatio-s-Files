import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cases } from "@/lib/cases";
import { loadProgress } from "@/lib/storage";
import { CaseFolder } from "@/components/case/CaseFolder";
import type { CaseProgress } from "@/lib/cases/types";

const PAGE_SIZE = 20;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horatio's Files — Pick a Case" },
      {
        name: "description",
        content: "Browse unsolved cases. Each folder is a mystery you can crack.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [progressMap, setProgressMap] = useState<Record<string, CaseProgress>>({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const m: Record<string, CaseProgress> = {};
    cases.forEach((c) => (m[c.id] = loadProgress(c.id)));
    setProgressMap(m);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) =>
      [c.title, c.number, c.victim, c.tagline, c.date].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className="min-h-screen px-5 py-10 md:py-16 max-w-6xl mx-auto">
      <header className="text-center mb-10 md:mb-14">
        <p className="typewriter text-xs tracking-[0.5em] text-sepia mb-3">
          PRIVATE INVESTIGATIONS · EST. 1922
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ink leading-none">Horatio's Files</h1>
        <p className="newspaper italic text-sepia mt-4 max-w-xl mx-auto">
          A drawer of unsolved cases left to me by the late inspector. Pick a folder. Read every
          paper. Name the killer — only 5 out of 5 closes the file.
        </p>
      </header>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-sepia/40 pb-3">
          <h2 className="font-display text-2xl text-ink">Case Drawer</h2>
          <div className="flex items-center gap-2 bg-cream/60 border-2 border-border px-3 py-2 flex-1 sm:flex-none sm:w-80">
            <Search className="w-4 h-4 text-sepia" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by case, victim, year…"
              className="bg-transparent typewriter text-sm text-ink placeholder:text-sepia/70 outline-none flex-1"
            />
          </div>
          <span className="typewriter text-xs text-sepia tracking-widest">
            {filtered.length} CASES
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="paper-bg p-12 text-center">
            <p className="newspaper italic text-sepia">No file in this drawer matches that name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-6">
            {visible.map((c, i) => (
              <CaseFolder
                key={c.id}
                detective={c}
                progress={
                  progressMap[c.id] ?? {
                    unlocked: [],
                    answers: {},
                    attempts: 0,
                    bestScore: 0,
                    solved: false,
                  }
                }
                rotation={(i % 2 === 0 ? -1 : 1) * (1 + (i % 3) * 0.6)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="typewriter text-xs tracking-widest text-sepia hover:text-sienna inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> PREV
            </button>
            <span className="typewriter text-xs text-sepia tracking-widest">
              PAGE {safePage} OF {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="typewriter text-xs tracking-widest text-sepia hover:text-sienna inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <footer className="text-center mt-20 typewriter text-xs text-sepia tracking-widest">
        ALL PROGRESS SAVED LOCALLY ON THIS MACHINE
      </footer>
    </div>
  );
}
