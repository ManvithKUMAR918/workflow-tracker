"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/project-store";
import { toast } from "sonner";
import {
  FolderPlus,
  DollarSign,
  Calendar,
  User,
  FileText,
  Briefcase,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  clientName: "",
  description: "",
  budget: "",
  deadline: "",
};

export function NewProjectDialog() {
  const isOpen = useProjectStore((s) => s.isNewProjectOpen);
  const setIsOpen = useProjectStore((s) => s.setIsNewProjectOpen);
  const addProject = useProjectStore((s) => s.addProject);

  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...EMPTY_FORM });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.clientName.trim())
      newErrors.clientName = "Client name is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (formData.budget && isNaN(Number(formData.budget)))
      newErrors.budget = "Budget must be a valid number";
    if (Number(formData.budget) < 0)
      newErrors.budget = "Budget cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    addProject({
      name: formData.name.trim(),
      clientName: formData.clientName.trim(),
      description: formData.description.trim(),
      budget: Number(formData.budget) || 0,
      deadline: formData.deadline,
    });

    const projectName = formData.name.trim();
    setFormData({ ...EMPTY_FORM });
    setErrors({});
    setIsSubmitting(false);
    setIsOpen(false);
    toast.success("Project created successfully!", {
      description: `"${projectName}" has been added to the Requirement stage.`,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ ...EMPTY_FORM });
    setErrors({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
              <FolderPlus className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <DialogTitle>New Project</DialogTitle>
              <DialogDescription>
                Create a new project. It will start in the Requirement stage.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="project-name"
              className="text-xs font-medium text-slate-400 flex items-center gap-1.5"
            >
              <Briefcase className="h-3 w-3" /> Project Name{" "}
              <span className="text-red-400">*</span>
            </label>
            <Input
              id="project-name"
              placeholder="E.g. E-Commerce Platform Redesign"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              autoFocus
              className={errors.name ? "border-red-500/50 focus-visible:ring-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="client-name"
              className="text-xs font-medium text-slate-400 flex items-center gap-1.5"
            >
              <User className="h-3 w-3" /> Client Name{" "}
              <span className="text-red-400">*</span>
            </label>
            <Input
              id="client-name"
              placeholder="E.g. Acme Corp."
              value={formData.clientName}
              onChange={(e) => handleFieldChange("clientName", e.target.value)}
              className={errors.clientName ? "border-red-500/50 focus-visible:ring-red-500" : ""}
            />
            {errors.clientName && (
              <p className="text-xs text-red-400">{errors.clientName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-xs font-medium text-slate-400 flex items-center gap-1.5"
            >
              <FileText className="h-3 w-3" /> Description
            </label>
            <Textarea
              id="description"
              placeholder="Brief project description..."
              value={formData.description}
              onChange={(e) =>
                handleFieldChange("description", e.target.value)
              }
              rows={3}
            />
          </div>

          {/* Budget + Deadline Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="budget"
                className="text-xs font-medium text-slate-400 flex items-center gap-1.5"
              >
                <DollarSign className="h-3 w-3" /> Budget (USD)
              </label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="1000"
                placeholder="50000"
                value={formData.budget}
                onChange={(e) => handleFieldChange("budget", e.target.value)}
                className={errors.budget ? "border-red-500/50 focus-visible:ring-red-500" : ""}
              />
              {errors.budget && (
                <p className="text-xs text-red-400">{errors.budget}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="deadline"
                className="text-xs font-medium text-slate-400 flex items-center gap-1.5"
              >
                <Calendar className="h-3 w-3" /> Deadline{" "}
                <span className="text-red-400">*</span>
              </label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleFieldChange("deadline", e.target.value)}
                className={errors.deadline ? "border-red-500/50 focus-visible:ring-red-500" : ""}
              />
              {errors.deadline && (
                <p className="text-xs text-red-400">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
