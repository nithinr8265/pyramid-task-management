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
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40)}-${Date.now().toString(36).slice(-5)}`;
}

/**
 * Convert backend priority values such as:
 * HIGH, MEDIUM, LOW, URGENT
 *
 * into the lowercase values expected by the frontend:
 * high, medium, low, urgent
 */
function normalizeProject(project: Project): Project {
  return {
    ...project,
    priority: project.priority.toLowerCase() as Project["priority"],
  };
}

export function ProjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    api
      .get<Project[]>("/projects")
      .then((data) => {
        if (isMounted) {
          // Convert backend priority values to frontend format
          setProjects(data.map(normalizeProject));
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
        // Normalize the backend response before putting it into state
        const normalizedProject = normalizeProject(createdProject);

        setProjects((prev) =>
          prev.map((p) =>
            p.id === tempId ? normalizedProject : p
          )
        );
      })
      .catch((err) => {
        console.error("Failed to create project on server:", err);
      });

    return tempProject;
  }, []);

  const value = useMemo(
    () => ({
      projects,
      hydrated,
      getProject,
      addProject,
    }),
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

  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }

  return ctx;
}