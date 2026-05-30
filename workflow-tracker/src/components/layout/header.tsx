"use client";

import React, { useEffect, useCallback } from "react";
import { Search, Plus, SlidersHorizontal, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useProjectStore } from "@/store/project-store";
import { WORKFLOW_STAGES } from "@/lib/types";

export function Header() {
  const searchQuery = useProjectStore((s) => s.searchQuery);
  const filterClient = useProjectStore((s) => s.filterClient);
  const filterStage = useProjectStore((s) => s.filterStage);
  const setSearchQuery = useProjectStore((s) => s.setSearchQuery);
  const setFilterClient = useProjectStore((s) => s.setFilterClient);
  const setFilterStage = useProjectStore((s) => s.setFilterStage);
  const setIsNewProjectOpen = useProjectStore((s) => s.setIsNewProjectOpen);
  const getUniqueClients = useProjectStore((s) => s.getUniqueClients);
  const hasActiveFilters = useProjectStore((s) => s.hasActiveFilters);
  const clearFilters = useProjectStore((s) => s.clearFilters);
  const setIsMobileSidebarOpen = useProjectStore((s) => s.setIsMobileSidebarOpen);

  const clients = getUniqueClients();
  const filtersActive = hasActiveFilters();

  // Global keyboard shortcut: Ctrl+K to focus search, Ctrl+N for new project
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("search-projects");
        searchInput?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setIsNewProjectOpen(true);
      }
    },
    [setIsNewProjectOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-800/60 bg-slate-950/60 px-4 sm:px-6 backdrop-blur-xl">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          id="search-projects"
          placeholder="Search projects... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900/50 border-slate-800 h-9 pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filters + New Project */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          <Select
            id="filter-client"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            placeholder="All Clients"
            options={clients.map((c) => ({ value: c, label: c }))}
            className="w-[160px]"
          />
          <Select
            id="filter-stage"
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            placeholder="All Stages"
            options={WORKFLOW_STAGES.map((s) => ({ value: s, label: s }))}
            className="w-[150px]"
          />
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-500/10 transition-colors cursor-pointer"
              title="Clear all filters"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
        <Button
          id="new-project-btn"
          onClick={() => setIsNewProjectOpen(true)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20 h-9"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Project</span>
        </Button>
      </div>
    </header>
  );
}
