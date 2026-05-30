"use client";

import React from "react";
import { Clock, AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/project-store";
import { STAGE_COLORS } from "@/lib/types";
import { formatDate, formatRelativeDate, isOverdue, getDaysUntilDeadline } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function DeadlineList() {
  const getUpcomingDeadlines = useProjectStore((s) => s.getUpcomingDeadlines);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const setIsDetailOpen = useProjectStore((s) => s.setIsDetailOpen);
  const deadlines = getUpcomingDeadlines(30);

  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-5 backdrop-blur-sm animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Upcoming Deadlines
        </h3>
        <Calendar className="h-4 w-4 text-slate-600" />
      </div>

      {deadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="h-8 w-8 text-slate-700 mb-2" />
          <p className="text-sm text-slate-500">No upcoming deadlines</p>
          <p className="text-xs text-slate-600">All clear for now!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deadlines.slice(0, 6).map((project) => {
            const overdue = isOverdue(project.deadline);
            const daysLeft = getDaysUntilDeadline(project.deadline);
            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setIsDetailOpen(true);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 hover:bg-slate-800/50 cursor-pointer",
                  overdue && "bg-red-500/5 border border-red-500/10"
                )}
              >
                <div
                  className="h-8 w-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: overdue
                      ? "#ef4444"
                      : STAGE_COLORS[project.stage].accent,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-slate-500">{project.clientName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      overdue
                        ? "text-red-400"
                        : daysLeft <= 7
                        ? "text-amber-400"
                        : "text-slate-400"
                    )}
                  >
                    {formatRelativeDate(project.deadline)}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {formatDate(project.deadline)}
                  </span>
                </div>
                {overdue && (
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
