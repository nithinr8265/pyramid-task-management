"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { Project } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { initialProjects } from "@/data/projects";

interface ProjectsContextValue {
  projects: Project[];
  hydrated: boolean;
  getProject: (id: string) => Project | undefined;
  addProject: (name: string) => Project;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function makeId(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
    .toString(36)
    .slice(-5)}`;
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects, hydrated] = useLocalStorage<Project[]>(
    STORAGE_KEYS.projects,
    initialProjects
  );

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const addProject = useCallback(
    (name: string) => {
      const project: Project = {
        id: makeId(name),
        name,
        priority: "no-priority",
        leadId: "admin",
      };
      setProjects((prev) => [...prev, project]);
      return project;
    },
    [setProjects]
  );

  const value = useMemo(
    () => ({ projects, hydrated, getProject, addProject }),
    [projects, hydrated, getProject, addProject]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx)
    throw new Error("useProjects must be used within a ProjectsProvider");
  return ctx;
}
