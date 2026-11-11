import { CheckCircle2, Circle, Moon } from 'lucide-react';
import { WEEKLY_RHYTHM } from '../../data/mockData';
import { useProgress } from '../../hooks/useProgress';
import { useAppStore } from '../../store/useAppStore';
import { weekStart, weekdayIndex } from '../../utils/date';

export const WeeklyRhythm = () => {
  const rhythmChecks = useAppStore((s) => s.rhythmChecks);
  const toggle = useAppStore((s) => s.toggleRhythm);
  const { hoursThisWeek } = useProgress();
  const week = weekStart();
  const today = weekdayIndex();
  const workDays = WEEKLY_RHYTHM.filter((d) => !d.isRest);
  const doneDays = workDays.filter((d) => rhythmChecks[`${week}-${d.dayIndex}`]).length;

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold text-white">Nhịp làm việc tuần</h2>
          <p className="text-xs text-slate-400">Tuần bắt đầu {week} · {doneDays}/{workDays.length} buổi · {hoursThisWeek}h đã log (mục tiêu 10–15h)</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
        {WEEKLY_RHYTHM.map((d) => {
          const key = `${week}-${d.dayIndex}`;
          const checked = Boolean(rhythmChecks[key]);
          const isToday = d.dayIndex === today;
          return (
            <button
              key={d.dayIndex}
              type="button"
              disabled={d.isRest}
              onClick={() => toggle(key)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                isToday ? 'border-cyan-400' : 'border-slate-800'
              } ${checked ? 'bg-emerald-500/10' : 'bg-navy-800/60'} ${d.isRest ? 'cursor-default opacity-60' : 'hover:border-slate-600'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{d.label}</span>
                {d.isRest ? (
                  <Moon size={16} className="text-slate-500" />
                ) : checked ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <Circle size={16} className="text-slate-600" />
                )}
              </div>
              <p className="mt-1 text-xs font-medium text-cyan-300">{d.hours}</p>
              <p className="mt-1 text-xs text-slate-400">{d.focus}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
