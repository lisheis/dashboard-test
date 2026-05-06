import React from 'react';
import { Card } from './Card';
import { cn } from './Card'; // actually importing cn from the same place just to keep it small; better pattern is to extract cn to lib/utils.ts, but keeping simple here.

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass = "text-primary" }) => {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">{title}</span>
        <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold font-mono tracking-tight">{value}</h3>
        {trend && (
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-md",
            trend.isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
          )}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </Card>
  );
};
