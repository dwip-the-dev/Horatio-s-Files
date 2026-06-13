import { Link } from "@tanstack/react-router";
import type { DetectiveCase, CaseProgress } from "@/lib/cases/types";
import { FolderClosed } from "lucide-react";

interface Props {
  detective: DetectiveCase;
  progress: CaseProgress;
  rotation?: number;
}

export function CaseFolder({ detective, progress, rotation = 0 }: Props) {
  const status = progress.solved
    ? "SOLVED"
    : progress.attempts > 0
      ? `${progress.bestScore}/5`
      : "UNOPENED";

  return (
    <Link
      to="/case/$caseId"
      params={{ caseId: detective.id }}
      className="block group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative paper-bg folder-tab p-6 pt-10 min-h-[280px] transition-transform group-hover:-translate-y-2 group-hover:rotate-0">
        <div className="tape left-1/2 -translate-x-1/2 -top-3" />
        <div className="absolute top-2 right-3 text-[0.65rem] typewriter text-sepia tracking-widest">
          {detective.number}
        </div>

        <div className="flex items-start gap-3 mb-3">
          <FolderClosed className="w-8 h-8 text-sienna shrink-0 mt-1" />
          <div>
            <h2 className="font-display text-2xl text-ink leading-tight">{detective.title}</h2>
            <p className="typewriter text-xs text-sepia mt-1">{detective.date}</p>
          </div>
        </div>

        <p className="newspaper italic text-sm text-charcoal/80 mb-4 leading-snug">
          {detective.tagline}
        </p>

        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <div className="typewriter text-xs text-sepia">
            Victim: <span className="text-ink">{detective.victim}</span>
          </div>
          <div
            className={
              progress.solved
                ? "stamp"
                : "typewriter text-[0.7rem] px-2 py-1 border border-border bg-cream/60 text-sepia tracking-widest"
            }
          >
            {status}
          </div>
        </div>
      </div>
    </Link>
  );
}
