"use client";

import React from "react";
import { FolderPlus, SearchX, X } from "lucide-react";
import { KanbanColumn } from "@/components/board/kanban-column";
import { useProjectStore } from "@/store/project-store";
import { WORKFLOW_STAGES, type WorkflowStage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BoardPage() {
  const getProjectsByStage = useProjectStore((s) => s.getProjectsByStage);
  const getFilteredProjects = useProjectStore((s) => s.getFilteredProjects);
  const moveProjectToStage = useProjectStore((s) => s.moveProjectToStage);
  const projects = useProjectStore((s) => s.projects);
  const setIsNewProjectOpen = useProjectStore((s) => s.setIsNewProjectOpen);
  const hasActiveFilters = useProjectStore((s) => s.hasActiveFilters);
  const clearFilters = useProjectStore((s) => s.clearFilters);

  const filteredProjects = getFilteredProjects();
  const filtersActive = hasActiveFilters();

  const handleDrop = (projectId: string, targetStage: WorkflowStage) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.stage !== targetStage) {
      moveProjectToStage(projectId, targetStage);
      toast.success(`Moved "${project.name}" to ${targetStage}`);
    }
  };

  // Truly no projects at all
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
          <FolderPlus className="h-8 w-8 text-slate-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-300 mb-1">
          No projects yet
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          Add your first project to see it on the board. Drag and drop between
          stages to track progress.
        </p>
        <Button
          onClick={() => setIsNewProjectOpen(true)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
        >
          <FolderPlus className="h-4 w-4" />
          Add Your First Project
        </Button>
      </div>
    );
  }

  // Filters active but no matching results
  if (filteredProjects.length === 0 && filtersActive) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Board
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Drag and drop projects between stages to track workflow progress
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
            <SearchX className="h-8 w-8 text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-300 mb-1">
            No projects match your filters
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Try adjusting your search query or filters to find what you&apos;re looking for.
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Board
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Drag and drop projects between stages to track workflow progress
            {filtersActive && (
              <span className="ml-2 text-blue-400">
                ({filteredProjects.length} of {projects.length} shown)
              </span>
            )}
          </p>
        </div>
        {filtersActive && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            <X className="h-3 w-3" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {WORKFLOW_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            projects={getProjectsByStage(stage)}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
