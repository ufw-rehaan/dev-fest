import { Suspense } from "react";
import CommitDeskApp from "@/components/CommitDeskApp";

function LoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading CommitDesk…</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CommitDeskApp />
    </Suspense>
  );
}
