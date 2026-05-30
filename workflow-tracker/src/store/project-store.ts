"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project, ProjectNote, WorkflowStage, WORKFLOW_STAGES } from "@/lib/types";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

interface ProjectStore {
  projects: Project[];
  searchQuery: string;
  filterClient: string;
  filterStage: string;
  selectedProjectId: string | null;
  isNewProjectOpen: boolean;
  isDetailOpen: boolean;
  isMobileSidebarOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterClient: (client: string) => void;
  setFilterStage: (stage: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setIsNewProjectOpen: (open: boolean) => void;
  setIsDetailOpen: (open: boolean) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
  clearFilters: () => void;

  addProject: (project: Omit<Project, "id" | "notes" | "createdAt" | "updatedAt" | "stage">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProjectToStage: (id: string, stage: WorkflowStage) => void;
  moveProjectForward: (id: string) => void;
  moveProjectBackward: (id: string) => void;
  addNote: (projectId: string, content: string) => void;
  deleteNote: (projectId: string, noteId: string) => void;

  // Selectors
  getFilteredProjects: () => Project[];
  getProjectsByStage: (stage: WorkflowStage) => Project[];
  getProjectById: (id: string) => Project | undefined;
  getUniqueClients: () => string[];
  getActiveProjectCount: () => number;
  getUpcomingDeadlines: (days?: number) => Project[];
  getStageDistribution: () => Record<WorkflowStage, number>;
  hasActiveFilters: () => boolean;
  getRecentActivity: () => Project[];
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: MOCK_PROJECTS,
      searchQuery: "",
      filterClient: "all",
      filterStage: "all",
      selectedProjectId: null,
      isNewProjectOpen: false,
      isDetailOpen: false,
      isMobileSidebarOpen: false,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterClient: (client) => set({ filterClient: client }),
      setFilterStage: (stage) => set({ filterStage: stage }),
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setIsNewProjectOpen: (open) => set({ isNewProjectOpen: open }),
      setIsDetailOpen: (open) => set({ isDetailOpen: open }),
      setIsMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

      clearFilters: () =>
        set({ searchQuery: "", filterClient: "all", filterStage: "all" }),

      addProject: (projectData) => {
        const now = new Date().toISOString();
        const newProject: Project = {
          ...projectData,
          id: generateId(),
          stage: "Requirement",
          notes: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ projects: [newProject, ...state.projects] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId:
            state.selectedProjectId === id ? null : state.selectedProjectId,
          isDetailOpen:
            state.selectedProjectId === id ? false : state.isDetailOpen,
        }));
      },

      moveProjectToStage: (id, stage) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, stage, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      moveProjectForward: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const currentIndex = WORKFLOW_STAGES.indexOf(project.stage);
        if (currentIndex < WORKFLOW_STAGES.length - 1) {
          get().moveProjectToStage(id, WORKFLOW_STAGES[currentIndex + 1]);
        }
      },

      moveProjectBackward: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const currentIndex = WORKFLOW_STAGES.indexOf(project.stage);
        if (currentIndex > 0) {
          get().moveProjectToStage(id, WORKFLOW_STAGES[currentIndex - 1]);
        }
      },

      addNote: (projectId, content) => {
        const newNote: ProjectNote = {
          id: generateId(),
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  notes: [newNote, ...p.notes],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      deleteNote: (projectId, noteId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  notes: p.notes.filter((n) => n.id !== noteId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      getFilteredProjects: () => {
        const { projects, searchQuery, filterClient, filterStage } = get();
        return projects.filter((p) => {
          const matchesSearch =
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesClient =
            filterClient === "all" || p.clientName === filterClient;
          const matchesStage =
            filterStage === "all" || p.stage === filterStage;
          return matchesSearch && matchesClient && matchesStage;
        });
      },

      getProjectsByStage: (stage) => {
        return get()
          .getFilteredProjects()
          .filter((p) => p.stage === stage);
      },

      getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      getUniqueClients: () => {
        const clients = get().projects.map((p) => p.clientName);
        return [...new Set(clients)].sort();
      },

      getActiveProjectCount: () => {
        return get().projects.filter((p) => p.stage !== "Support").length;
      },

      getUpcomingDeadlines: (days = 14) => {
        const now = new Date();
        const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return get()
          .projects.filter((p) => {
            const deadline = new Date(p.deadline);
            return deadline <= cutoff && p.stage !== "Support";
          })
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
      },

      getStageDistribution: () => {
        const dist = {} as Record<WorkflowStage, number>;
        for (const stage of WORKFLOW_STAGES) {
          dist[stage] = 0;
        }
        for (const p of get().projects) {
          dist[p.stage]++;
        }
        return dist;
      },

      hasActiveFilters: () => {
        const { searchQuery, filterClient, filterStage } = get();
        return searchQuery !== "" || filterClient !== "all" || filterStage !== "all";
      },

      getRecentActivity: () => {
        return [...get().projects]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5);
      },
    }),
    {
      name: "workflow-tracker-projects",
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
