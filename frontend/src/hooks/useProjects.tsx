"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Project } from "@/types";
import { api } from "@/lib/api";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get<Project[]>("/projects")
      .then((data) => {
        if (isMounted) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      })
      .finally(() => {
        if (isMounted) {
          setHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const addProject = useCallback((name: string) => {
    const tempId = makeId(name);
    const tempProject: Project = {
      id: tempId,
      name,
      priority: "no-priority",
      leadId: "admin",
    };

    setProjects((prev) => [...prev, tempProject]);

    api
      .post<Project>("/projects", { name })
      .then((createdProject) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === tempId ? createdProject : p))
        );
      })
      .catch((err) => {
        console.error("Failed to create project on server:", err);
      });

    return tempProject;
  }, []);

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
