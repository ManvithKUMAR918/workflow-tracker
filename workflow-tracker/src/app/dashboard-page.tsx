"use client";

import React from "react";
import {
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign,
  FolderPlus,
  Activity,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StageDistribution } from "@/components/dashboard/stage-distribution";
import { DeadlineList } from "@/components/dashboard/deadline-list";
import { useProjectStore } from "@/store/project-store";
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STAGE_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const getActiveProjectCount = useProjectStore((s) => s.getActiveProjectCount);
  const getUpcomingDeadlines = useProjectStore((s) => s.getUpcomingDeadlines);
  const getRecentActivity = useProjectStore((s) => s.getRecentActivity);
  const setIsNewProjectOpen = useProjectStore((s) => s.setIsNewProjectOpen);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const setIsDetailOpen = useProjectStore((s) => s.setIsDetailOpen);

  const activeCount = getActiveProjectCount();
  const upcomingCount = getUpcomingDeadlines(14).length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalProjects = projects.length;
  const recentProjects = getRecentActivity();

  if (totalProjects === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
          <FolderPlus className="h-8 w-8 text-slate-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-300 mb-1">
          No projects yet
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          Get started by creating your first project. Track it through every
          stage of your workflow.
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

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your project pipeline
          </p>
        </div>
        <Button
          onClick={() => setIsNewProjectOpen(true)}
          variant="outline"
          className="gap-2 hidden sm:flex"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Projects"
          value={totalProjects}
          subtitle="Across all stages"
          icon={<Briefcase className="h-5 w-5" />}
          accentColor="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Active Projects"
          value={activeCount}
          subtitle="Excluding support"
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="from-violet-500 to-purple-500"
        />
        <MetricCard
          title="Upcoming Deadlines"
          value={upcomingCount}
          subtitle="Within 14 days"
          icon={<Clock className="h-5 w-5" />}
          accentColor="from-amber-500 to-orange-500"
        />
        <MetricCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          subtitle="Combined project value"
          icon={<DollarSign className="h-5 w-5" />}
          accentColor="from-emerald-500 to-teal-500"
        />
      </div>

      {/* Stage Distribution + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StageDistribution />
        <DeadlineList />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-5 backdrop-blur-sm animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Recent Activity
          </h3>
        </div>
        <div className="space-y-2">
          {recentProjects.map((project) => {
            const colors = STAGE_COLORS[project.stage];
            return (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setIsDetailOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 hover:bg-slate-800/50 cursor-pointer"
              >
                <div
                  className="h-8 w-1 rounded-full shrink-0"
                  style={{ backgroundColor: colors.accent }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-slate-500">{project.clientName}</p>
                </div>
                <Badge className={cn(colors.bg, colors.text, colors.border, "text-[10px]")}>
                  {project.stage}
                </Badge>
                <span className="text-[10px] text-slate-600 shrink-0">
                  {formatDate(project.updatedAt)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
