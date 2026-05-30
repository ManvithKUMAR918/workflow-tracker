"use client";

import React from "react";
import {
  DollarSign,
  Calendar,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatRelativeDate, isOverdue } from "@/lib/utils";
import { STAGE_COLORS, WORKFLOW_STAGES, type Project } from "@/lib/types";
import { useProjectStore } from "@/store/project-store";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const setIsDetailOpen = useProjectStore((s) => s.setIsDetailOpen);
  const moveProjectForward = useProjectStore((s) => s.moveProjectForward);
  const moveProjectBackward = useProjectStore((s) => s.moveProjectBackward);

  const stageIndex = WORKFLOW_STAGES.indexOf(project.stage);
  const canMoveForward = stageIndex < WORKFLOW_STAGES.length - 1;
  const canMoveBackward = stageIndex > 0;
  const overdue = isOverdue(project.deadline);
  const colors = STAGE_COLORS[project.stage];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", project.id);
    e.dataTransfer.effectAllowed = "move";
    (e.currentTarget as HTMLElement).classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("dragging");
  };

  const handleClick = () => {
    setSelectedProjectId(project.id);
    setIsDetailOpen(true);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="project-card group relative rounded-lg border border-slate-800/50 bg-slate-800/30 p-3.5 cursor-pointer hover:bg-slate-800/50 hover:border-slate-700/60 transition-all"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: colors.accent,
      }}
    >
      {/* Drag Handle */}
      <div className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-slate-600" />
      </div>

      {/* Card Content */}
      <div onClick={handleClick}>
        <h4 className="text-sm font-medium text-slate-200 mb-1.5 pr-4 leading-tight">
          {project.name}
        </h4>

        <div className="flex items-center gap-1.5 mb-3">
          <User className="h-3 w-3 text-slate-500" />
          <span className="text-xs text-slate-400">{project.clientName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(project.budget)}</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              overdue ? "text-red-400" : "text-slate-500"
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeDate(project.deadline)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stage Actions */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/30 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canMoveBackward) {
              moveProjectBackward(project.id);
              toast.success(`Moved to ${WORKFLOW_STAGES[stageIndex - 1]}`);
            }
          }}
          disabled={!canMoveBackward}
          className={cn(
            "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md transition-colors cursor-pointer",
            canMoveBackward
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              : "text-slate-700 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
          Prev
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canMoveForward) {
              moveProjectForward(project.id);
              toast.success(`Moved to ${WORKFLOW_STAGES[stageIndex + 1]}`);
            }
          }}
          disabled={!canMoveForward}
          className={cn(
            "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md transition-colors cursor-pointer",
            canMoveForward
              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              : "text-slate-700 cursor-not-allowed"
          )}
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
