import type { ProjectEvent, ProjectSession } from "@/lib/triz/types";

export const PROJECTS_KEY = "protivorechie.projects";
export const EVENTS_KEY = "protivorechie.events";

export function readProjects(): ProjectSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as ProjectSession[]) : [];
  } catch {
    return [];
  }
}

export function writeProjects(projects: ProjectSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function readEvents(): ProjectEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as ProjectEvent[]) : [];
  } catch {
    return [];
  }
}

export function writeEvents(events: ProjectEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}
