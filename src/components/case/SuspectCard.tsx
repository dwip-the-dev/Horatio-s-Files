import type { Suspect } from "@/lib/cases/types";
import { User } from "lucide-react";

export function SuspectCard({ suspect, idx }: { suspect: Suspect; idx: number }) {
  const rot = (idx % 2 === 0 ? -1 : 1) * (1 + (idx % 3) * 0.4);
  return (
    <div className="paper-bg p-4 relative min-h-[180px]" style={{ transform: `rotate(${rot}deg)` }}>
      <div className="tape -top-3 left-4" />
      <div className="flex items-start gap-3">
        <div className="w-14 h-16 bg-aged border border-sepia/40 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-sepia" />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg text-ink leading-tight">{suspect.name}</div>
          <div className="typewriter text-xs text-sepia mt-0.5">
            {suspect.age} · {suspect.occupation}
          </div>
        </div>
      </div>
      <p className="typewriter text-xs text-charcoal mt-3 leading-relaxed">{suspect.relation}</p>
    </div>
  );
}
