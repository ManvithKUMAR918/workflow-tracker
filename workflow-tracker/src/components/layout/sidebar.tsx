"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/project-store";
import { WORKFLOW_STAGES, STAGE_COLORS } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/board", label: "Board", icon: Kanban },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const getStageDistribution = useProjectStore((s) => s.getStageDistribution);
  const isMobileSidebarOpen = useProjectStore((s) => s.isMobileSidebarOpen);
  const setIsMobileSidebarOpen = useProjectStore((s) => s.setIsMobileSidebarOpen);
  const distribution = getStageDistribution();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname, setIsMobileSidebarOpen]);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen, setIsMobileSidebarOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-800/60 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-slate-100">
                FlowTrack
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Project Manager
              </p>
            </div>
          )}
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden flex items-center justify-center h-7 w-7 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <div className={cn("mb-3", collapsed ? "px-0" : "px-2")}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Navigation
            </p>
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-1",
                  isActive
                    ? "bg-blue-500/10 text-blue-400 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0",
                    isActive && "text-blue-400"
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Stage Overview */}
        {!collapsed && (
          <div className="px-2 mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Workflow Stages
            </p>
            <div className="space-y-1.5">
              {WORKFLOW_STAGES.map((stage) => (
                <div
                  key={stage}
                  className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: STAGE_COLORS[stage].accent,
                      }}
                    />
                    <span className="text-slate-400">{stage}</span>
                  </div>
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      STAGE_COLORS[stage].bg,
                      STAGE_COLORS[stage].text
                    )}
                  >
                    {distribution[stage]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <Layers className="h-4 w-4 text-slate-500" />
            {WORKFLOW_STAGES.map((stage) => (
              <div
                key={stage}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
                style={{
                  backgroundColor: STAGE_COLORS[stage].accent + "20",
                  color: STAGE_COLORS[stage].accent,
                }}
                title={`${stage}: ${distribution[stage]}`}
              >
                {distribution[stage]}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Collapse Toggle — desktop only */}
      <div className="hidden lg:block border-t border-slate-800/60 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-40 h-full flex-col border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-50 h-full w-[280px] flex flex-col border-r border-slate-800/60 bg-slate-950 animate-slide-in-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
