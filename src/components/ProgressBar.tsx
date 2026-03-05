import { motion } from "motion/react";
import { ReactNode } from "react";

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  icon?: ReactNode;
}

export function ProgressBar({ label, value, color, icon }: ProgressBarProps) {
  // Clamp value between 0 and 100 for display
  const displayValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full mb-4 group">
      <div className="flex justify-between items-center mb-1 text-xs uppercase tracking-wider font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-bold">{displayValue}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800 backdrop-blur-sm">
        <motion.div
          className={`h-full ${color} shadow-[0_0_10px_currentColor]`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </div>
    </div>
  );
}
