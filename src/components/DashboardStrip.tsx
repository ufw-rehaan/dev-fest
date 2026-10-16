"use client";

import { AlertTriangle, CheckCircle2, Clock, Calendar, LayoutDashboard } from "lucide-react";

interface DashboardStripProps {
  stats: {
    total: number;
    open: number;
    overdue: number;
    dueToday: number;
    done: number;
  };
}

interface StatTileProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

function StatTile({ label, value, icon, color, bgColor, borderColor }: StatTileProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} ${borderColor} min-w-0`}>
      <div className={`flex-shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className={`text-xl font-bold leading-none ${color}`}>{value}</p>
        <p className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardStrip({ stats }: DashboardStripProps) {
  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 mr-1">
        <LayoutDashboard size={14} className="text-slate-500" />
        <span className="text-xs font-semibold text-slate-400">Overview</span>
      </div>

      <StatTile
        label="Overdue"
        value={stats.overdue}
        icon={<AlertTriangle size={15} />}
        color="text-red-400"
        bgColor="bg-red-500/5"
        borderColor={stats.overdue > 0 ? "border-red-500/25" : "border-[#1e2330]"}
      />
      <StatTile
        label="Due Today"
        value={stats.dueToday}
        icon={<Calendar size={15} />}
        color={stats.dueToday > 0 ? "text-amber-400" : "text-slate-500"}
        bgColor="bg-amber-500/5"
        borderColor={stats.dueToday > 0 ? "border-amber-500/25" : "border-[#1e2330]"}
      />
      <StatTile
        label="Open"
        value={stats.open}
        icon={<Clock size={15} />}
        color="text-blue-400"
        bgColor="bg-blue-500/5"
        borderColor="border-[#1e2330]"
      />
      <StatTile
        label="Completed"
        value={stats.done}
        icon={<CheckCircle2 size={15} />}
        color="text-emerald-400"
        bgColor="bg-emerald-500/5"
        borderColor="border-[#1e2330]"
      />

      {/* Progress bar */}
      <div className="flex-1 min-w-[100px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-600">Progress</span>
          <span className="text-[10px] text-slate-400 font-mono">{completionPct}%</span>
        </div>
        <div className="h-1.5 bg-[#1e2330] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
