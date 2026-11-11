import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  progress?: number;
  accent: string;
}

export const StatCard = ({ icon: Icon, label, value, hint, progress, accent }: Props) => (
  <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${accent}`}>
        <Icon size={16} />
      </div>
    </div>
    <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    <p className="mt-1 text-xs text-slate-400">{hint}</p>
    {progress !== undefined && (
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    )}
  </motion.div>
);
