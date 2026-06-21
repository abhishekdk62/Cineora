import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import TabPanelFallback from "./TabPanelFallback";

/** Lazy-load dashboard tab panels — only the active tab's JS is fetched. */
export function lazyPanel<P = object>(
  loader: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(loader, {
    loading: () => <TabPanelFallback />,
  });
}
