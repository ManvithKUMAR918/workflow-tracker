"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { NewProjectDialog } from "@/components/modals/new-project-dialog";
import { ProjectDetailSheet } from "@/components/modals/project-detail-sheet";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarWidth(0);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const observer = new MutationObserver(() => {
      if (window.innerWidth >= 1024) {
        const sidebar = document.querySelector("aside:not(.lg\\:hidden)");
        if (sidebar) {
          setSidebarWidth((sidebar as HTMLElement).offsetWidth);
        }
      }
    });

    const sidebar = document.querySelector("aside");
    if (sidebar) {
      if (window.innerWidth >= 1024) {
        setSidebarWidth(sidebar.offsetWidth);
      }
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 animate-pulse" />
          <p className="text-sm text-slate-500">Loading FlowTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-300 min-w-0"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
      <NewProjectDialog />
      <ProjectDetailSheet />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.005 260)",
            border: "1px solid oklch(0.25 0.005 260)",
            color: "oklch(0.9 0 0)",
          },
        }}
      />
    </div>
  );
}
