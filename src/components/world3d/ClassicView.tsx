import { ArrowRight } from 'lucide-react';
import { PHASES } from '../../data/mockData';
import { useProgress } from '../../hooks/useProgress';

const FLOOR_NAMES = ['Workshop', 'Automation Lab', 'Commercial Vault', 'Summit'];

/** Chế độ 2D Classic: ngọn tháp hiển thị dạng thẻ, không dùng WebGL. */
export const ClassicView = () => {
  const { phaseProgress } = useProgress();

  return (
    <div className="flex flex-col-reverse gap-3">
      {PHASES.map((phase, i) => {
        const pp = phaseProgress.at(i);
        const pct = pp && pp.total ? Math.round((pp.done / pp.total) * 100) : 0;
        return (
          <div key={phase.id} className="card flex flex-wrap items-center gap-4" style={{ marginLeft: `${i * 4}%`, marginRight: `${i * 4}%` }}>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-bold text-white">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400">
                Tầng {i + 1} · {FLOOR_NAMES.at(i)} · {phase.days}
              </p>
              <p className="font-semibold text-white">{phase.gate}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <a href="#roadmap" className="btn-ghost">
              {pct}% <ArrowRight size={14} />
            </a>
          </div>
        );
      })}
    </div>
  );
};
