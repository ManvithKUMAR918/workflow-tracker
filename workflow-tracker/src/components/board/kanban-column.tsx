"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { STAGE_COLORS, type WorkflowStage, type Project } from "@/lib/types";
import { ProjectCard } from "./project-card";

interface KanbanColumnProps {
  stage: WorkflowStage;
  projects: Project[];
  onDrop: (projectId: string, stage: WorkflowStage) => void;
}

export function KanbanColumn({ stage, projects, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set false if leaving the column, not entering a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const projectId = e.dataTransfer.getData("text/plain");
    if (projectId) {
      onDrop(projectId, stage);
    }
  };

  const colors = STAGE_COLORS[stage];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-slate-900/30 backdrop-blur-sm transition-all duration-200 min-w-[280px] max-w-[320px] w-full",
        isDragOver
          ? "border-blue-500/40 bg-blue-500/5 shadow-lg shadow-blue-500/10"
          : "border-slate-800/40"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <h3 className="text-sm font-semibold text-slate-200">{stage}</h3>
        </div>
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold px-1.5",
            colors.bg,
            colors.text
          )}
        >
          {projects.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3 pt-0 min-h-[200px] max-h-[calc(100vh-240px)]">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: colors.accent + "15",
              }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: colors.accent + "40" }}
              />
            </div>
            <p className="text-xs text-slate-600">
              No projects in {stage.toLowerCase()}
            </p>
            <p className="text-[10px] text-slate-700 mt-0.5">
              Drag a project here
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
