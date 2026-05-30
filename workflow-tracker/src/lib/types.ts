export const WORKFLOW_STAGES = [
  "Requirement",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Support",
] as const;

export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

export interface ProjectNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  budget: number;
  deadline: string;
  stage: WorkflowStage;
  notes: ProjectNote[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalActive: number;
  byStage: Record<WorkflowStage, number>;
  upcomingDeadlines: number;
}

export const STAGE_COLORS: Record<WorkflowStage, { bg: string; text: string; border: string; accent: string }> = {
  Requirement: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    accent: "#3b82f6",
  },
  Design: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30",
    accent: "#8b5cf6",
  },
  Development: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    accent: "#f59e0b",
  },
  Testing: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    accent: "#f97316",
  },
  Deployment: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    accent: "#10b981",
  },
  Support: {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    accent: "#64748b",
  },
};

export const STAGE_INDEX: Record<WorkflowStage, number> = {
  Requirement: 0,
  Design: 1,
  Development: 2,
  Testing: 3,
  Deployment: 4,
  Support: 5,
};
