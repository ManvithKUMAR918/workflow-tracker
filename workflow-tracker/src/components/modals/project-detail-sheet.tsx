"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Clock,
  StickyNote,
  Send,
  AlertTriangle,
  Pencil,
  X,
  Check,
  FileText,
  Briefcase,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useProjectStore } from "@/store/project-store";
import {
  STAGE_COLORS,
  WORKFLOW_STAGES,
  type WorkflowStage,
} from "@/lib/types";
import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeDate,
  isOverdue,
} from "@/lib/utils";
import { toast } from "sonner";

export function ProjectDetailSheet() {
  const isOpen = useProjectStore((s) => s.isDetailOpen);
  const setIsOpen = useProjectStore((s) => s.setIsDetailOpen);
  const selectedId = useProjectStore((s) => s.selectedProjectId);
  const getProjectById = useProjectStore((s) => s.getProjectById);
  const moveProjectForward = useProjectStore((s) => s.moveProjectForward);
  const moveProjectBackward = useProjectStore((s) => s.moveProjectBackward);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const addNote = useProjectStore((s) => s.addNote);
  const deleteNote = useProjectStore((s) => s.deleteNote);

  const [noteContent, setNoteContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    clientName: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const project = selectedId ? getProjectById(selectedId) : undefined;

  if (!project) return null;

  const stageIndex = WORKFLOW_STAGES.indexOf(project.stage);
  const progress = ((stageIndex + 1) / WORKFLOW_STAGES.length) * 100;
  const canMoveForward = stageIndex < WORKFLOW_STAGES.length - 1;
  const canMoveBackward = stageIndex > 0;
  const overdue = isOverdue(project.deadline);
  const colors = STAGE_COLORS[project.stage];

  const handleStartEdit = () => {
    setEditData({
      name: project.name,
      clientName: project.clientName,
      description: project.description,
      budget: String(project.budget),
      deadline: project.deadline,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editData.name.trim() || !editData.clientName.trim()) {
      toast.error("Name and client are required");
      return;
    }
    updateProject(project.id, {
      name: editData.name.trim(),
      clientName: editData.clientName.trim(),
      description: editData.description.trim(),
      budget: Number(editData.budget) || 0,
      deadline: editData.deadline,
    });
    setIsEditing(false);
    toast.success("Project updated");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote(project.id, noteContent.trim());
    setNoteContent("");
    toast.success("Note added");
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(project.id, noteId);
    toast.success("Note deleted");
  };

  const handleDelete = () => {
    deleteProject(project.id);
    setIsOpen(false);
    setShowDeleteConfirm(false);
    setIsEditing(false);
    toast.success("Project deleted", {
      description: `"${project.name}" has been removed.`,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowDeleteConfirm(false);
    setIsEditing(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent onClose={handleClose} className="flex flex-col">
        <SheetHeader className="pr-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <Badge
                className={cn(colors.bg, colors.text, colors.border)}
              >
                {project.stage}
              </Badge>
            </div>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStartEdit}
                className="h-7 w-7 text-slate-400 hover:text-slate-200"
                title="Edit project"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="text-lg font-semibold"
              placeholder="Project name"
            />
          ) : (
            <SheetTitle className="text-xl leading-tight">
              {project.name}
            </SheetTitle>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 mt-4">
          {/* Edit Mode Toolbar */}
          {isEditing && (
            <div className="flex gap-2 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <div className="flex-1 text-xs text-blue-300 flex items-center gap-1.5">
                <Pencil className="h-3 w-3" /> Editing mode
              </div>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 gap-1 text-xs text-slate-400">
                <X className="h-3 w-3" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} className="h-7 gap-1 text-xs bg-blue-600 hover:bg-blue-700">
                <Check className="h-3 w-3" /> Save
              </Button>
            </div>
          )}

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-xs font-bold text-slate-300">
                {stageIndex + 1} / {WORKFLOW_STAGES.length}
              </span>
            </div>
            <Progress value={progress} />
            {/* Stage Timeline */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const isCompleted = idx < stageIndex;
                const isCurrent = idx === stageIndex;
                const stageColor = STAGE_COLORS[stage];
                return (
                  <div key={stage} className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "h-2 w-full rounded-full transition-colors",
                        isCompleted
                          ? "bg-gradient-to-r from-blue-500 to-violet-500"
                          : isCurrent
                          ? ""
                          : "bg-slate-800"
                      )}
                      style={
                        isCurrent
                          ? { backgroundColor: stageColor.accent }
                          : undefined
                      }
                    />
                    <span
                      className={cn(
                        "text-[9px] mt-1.5 font-medium",
                        isCurrent ? "text-slate-200" : isCompleted ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      {stage.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canMoveBackward}
              onClick={() => {
                moveProjectBackward(project.id);
                toast.success(`Moved to ${WORKFLOW_STAGES[stageIndex - 1]}`);
              }}
              className="flex-1 gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {canMoveBackward ? WORKFLOW_STAGES[stageIndex - 1] : "Start"}
            </Button>
            <Button
              size="sm"
              disabled={!canMoveForward}
              onClick={() => {
                moveProjectForward(project.id);
                toast.success(`Moved to ${WORKFLOW_STAGES[stageIndex + 1]}`);
              }}
              className="flex-1 gap-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              {canMoveForward ? WORKFLOW_STAGES[stageIndex + 1] : "Done"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Project Info */}
          <div className="rounded-lg border border-slate-800/60 bg-slate-800/20 p-4 space-y-3">
            {isEditing ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <User className="h-3 w-3" /> Client
                  </label>
                  <Input
                    value={editData.clientName}
                    onChange={(e) => setEditData({ ...editData, clientName: e.target.value })}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Budget (USD)
                  </label>
                  <Input
                    type="number"
                    value={editData.budget}
                    onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
                    placeholder="Budget"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Deadline
                  </label>
                  <Input
                    type="date"
                    value={editData.deadline}
                    onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Client</p>
                    <p className="text-sm text-slate-200">{project.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Budget</p>
                    <p className="text-sm text-slate-200">
                      {formatCurrency(project.budget)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Deadline</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-200">
                        {formatDate(project.deadline)}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-medium px-1.5 py-0.5 rounded",
                          overdue
                            ? "bg-red-500/10 text-red-400"
                            : "bg-slate-700/50 text-slate-400"
                        )}
                      >
                        {formatRelativeDate(project.deadline)}
                      </span>
                      {overdue && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Created</p>
                    <p className="text-sm text-slate-200">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Description
            </h4>
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Project description..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StickyNote className="h-3.5 w-3.5 text-slate-500" />
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Notes ({project.notes.length})
              </h4>
            </div>

            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                id="add-note"
                placeholder="Add a quick note... (Ctrl+Enter to send)"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={2}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleAddNote();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="shrink-0 self-end bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Notes List */}
            {project.notes.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-4">
                No notes yet. Add your first note above.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {project.notes.map((note) => (
                  <div
                    key={note.id}
                    className="group/note rounded-lg border border-slate-800/40 bg-slate-800/20 p-3 relative"
                  >
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover/note:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700/50 text-slate-500 hover:text-red-400 cursor-pointer"
                      title="Delete note"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-sm text-slate-300 pr-6">{note.content}</p>
                    <p className="text-[10px] text-slate-600 mt-2">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="border-t border-slate-800/60 pt-4">
            {showDeleteConfirm ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                <p className="text-sm text-red-300 font-medium">
                  Are you sure you want to delete this project?
                </p>
                <p className="text-xs text-slate-500">
                  This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="flex-1 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Project
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
