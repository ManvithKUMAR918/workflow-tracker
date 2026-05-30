"use client";

import React from "react";
import { WORKFLOW_STAGES, STAGE_COLORS, type WorkflowStage } from "@/lib/types";
import { useProjectStore } from "@/store/project-store";

export function StageDistribution() {
  const getStageDistribution = useProjectStore((s) => s.getStageDistribution);
  const projects = useProjectStore((s) => s.projects);
  const distribution = getStageDistribution();
  const total = projects.length || 1;

  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-5 backdrop-blur-sm animate-fade-up">
      <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-4">
        Pipeline Distribution
      </h3>

      {/* Visual Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800 mb-5">
        {WORKFLOW_STAGES.map((stage) => {
          const count = distribution[stage];
          const pct = (count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={stage}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                backgroundColor: STAGE_COLORS[stage].accent,
              }}
              title={`${stage}: ${count}`}
            />
          );
        })}
      </div>

      {/* Stage Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {WORKFLOW_STAGES.map((stage) => (
          <div key={stage} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: STAGE_COLORS[stage].accent }}
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400">{stage}</span>
              <span className="text-xs font-bold text-slate-300">
                {distribution[stage]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
