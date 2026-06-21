import { Loader2 } from "lucide-react";

/** Lightweight fallback while lazy-loaded dashboard/tab panels load. */
export default function TabPanelFallback() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
    </div>
  );
}
