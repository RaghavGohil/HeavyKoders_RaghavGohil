"use client";

import React, { ReactNode } from "react";

interface ChangeProps {
  value: number;
  positive: boolean;
}

interface StatProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: ChangeProps | null;
}

const Stat: React.FC<StatProps> = ({ icon, label, value, change = null }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white text-xl font-semibold">{value}</p>
        {change && (
          <p className={`text-xs ${change.positive ? "text-emerald-400" : "text-rose-400"} flex items-center`}>
            <span>{change.positive ? "↑" : "↓"} {Math.abs(change.value)}%</span>
            <span className="ml-1 text-slate-400">from last period</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Stat;
