import { Clock, DollarSign, Rocket, Target } from 'lucide-react';
import { PHASES } from '../../data/mockData';
import { useProgress } from '../../hooks/useProgress';
import { formatUsd } from '../../utils/date';
import { SectionHeader } from '../common/SectionHeader';
import { IncomeChart } from './IncomeChart';
import { QuickLog } from './QuickLog';
import { SkillRadar } from './SkillRadar';
import { StatCard } from './StatCard';

export const Dashboard = () => {
  const p = useProgress();

  return (
    <div>
      <SectionHeader
        title="Dashboard tổng quan"
        subtitle={`Ngày ${p.dayNumber} · ${p.xp}/${p.xpTotal} XP · Mục tiêu: $300/tháng trước ngày 90, $1.000+/tháng ở tháng 4–6`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Target}
          label="Tiến độ 90 ngày"
          value={`${p.progressPct}%`}
          hint={`${p.doneCount}/${p.totalCount} milestone`}
          progress={p.progressPct}
          accent="bg-indigo-500/15 text-indigo-300"
        />
        <StatCard
          icon={Clock}
          label="Giờ tuần này"
          value={`${p.hoursThisWeek}h`}
          hint={`Mục tiêu 10–15h · tổng ${p.hoursTotal}h`}
          progress={(p.hoursThisWeek / 12) * 100}
          accent="bg-cyan-500/15 text-cyan-300"
        />
        <StatCard
          icon={DollarSign}
          label="Thu nhập YTD"
          value={formatUsd(p.incomeYtd)}
          hint="$0 → $300 → $1.000+"
          progress={(p.incomeYtd / 1000) * 100}
          accent="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          icon={Rocket}
          label="Đã ship công khai"
          value={String(p.shipCount)}
          hint="Bài viết · Demo · Template"
          accent="bg-amber-500/15 text-amber-300"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <IncomeChart />
        </div>
        <SkillRadar />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-1">
          <h2 className="mb-3 font-semibold text-white">Cổng KPI</h2>
          <ul className="space-y-3">
            {PHASES.map((phase) => {
              const pp = p.phaseProgress.find((x) => x.id === phase.id);
              const pct = pp ? Math.round((pp.done / pp.total) * 100) : 0;
              return (
                <li key={phase.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-200">{phase.name}</span>
                    <span className="text-slate-400">{pct}%</span>
                  </div>
                  <p className="text-xs text-slate-500">{phase.gate}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="xl:col-span-2">
          <QuickLog />
        </div>
      </div>
    </div>
  );
};
