import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { TasksProvider } from "@/hooks/useTasks";
import { ProjectsProvider } from "@/hooks/useProjects";

export const metadata: Metadata = {
  title: "Pyramid — Task Management",
  description: "Organize tasks and projects with your team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface text-text">
        <ThemeProvider>
          <AuthProvider>
            <TasksProvider>
              <ProjectsProvider>{children}</ProjectsProvider>
            </TasksProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
