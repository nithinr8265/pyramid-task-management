"use client";

import { createContext, useContext } from "react";

interface SidebarCollapsedValue {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const SidebarCollapsedContext = createContext<SidebarCollapsedValue>({
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebarCollapsed() {
  return useContext(SidebarCollapsedContext);
}
