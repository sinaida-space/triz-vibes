"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildProjectMap } from "@/lib/triz/formatters";
import type { ProjectEvent, ProjectSession, ProjectStatus, ProjectType } from "@/lib/triz/types";
import { maxStatus } from "./transitions";

type ProjectPatch = Partial<ProjectSession> & { status?: ProjectStatus };

interface ProjectStore {
  projects: ProjectSession[];
  events: ProjectEvent[];
  createProject: (input: { title: string; rawProblem: string; projectType?: ProjectType }) => string;
  updateProject: (id: string, patch: ProjectPatch, eventType?: ProjectEvent["eventType"]) => void;
  getProject: (id: string) => ProjectSession | undefined;
  deleteProject: (id: string) => void;
  exportProject: (id: string) => void;
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      events: [],
      createProject: ({ title, rawProblem, projectType }) => {
        const timestamp = now();
        const id = makeId();
        const project: ProjectSession = {
          id,
          title,
          rawProblem,
          projectType,
          status: "draft",
          createdAt: timestamp,
          updatedAt: timestamp
        };
        const event: ProjectEvent = {
          id: makeId(),
          projectId: id,
          eventType: "project_created",
          payload: { title, projectType },
          createdAt: timestamp
        };
        set((state) => ({ projects: [project, ...state.projects], events: [event, ...state.events] }));
        return id;
      },
      updateProject: (id, patch, eventType) => {
        const timestamp = now();
        set((state) => {
          const projects = state.projects.map((project) => {
            if (project.id !== id) return project;
            const nextStatus = patch.status ? maxStatus(project.status, patch.status) : project.status;
            return { ...project, ...patch, status: nextStatus, updatedAt: timestamp };
          });
          const event = eventType
            ? {
                id: makeId(),
                projectId: id,
                eventType,
                payload: patch,
                createdAt: timestamp
              }
            : undefined;
          return { projects, events: event ? [event, ...state.events] : state.events };
        });
      },
      getProject: (id) => get().projects.find((project) => project.id === id),
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          events: state.events.filter((event) => event.projectId !== id)
        }));
      },
      exportProject: (id) => {
        const project = get().getProject(id);
        if (!project) return;
        get().updateProject(id, { status: "exported", exportMap: buildProjectMap(project) }, "project_exported");
      }
    }),
    {
      name: "protivorechie.projects",
      partialize: (state) => ({ projects: state.projects, events: state.events })
    }
  )
);
