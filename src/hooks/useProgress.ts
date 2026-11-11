import { useMemo } from 'react';
import { INCOME_TARGETS, PHASES } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { daysBetween, monthOffset, weekStart } from '../utils/date';

export const useProgress = () => {
  const completed = useAppStore((s) => s.completed);
  const hourLogs = useAppStore((s) => s.hourLogs);
  const incomes = useAppStore((s) => s.incomes);
  const ships = useAppStore((s) => s.ships);
  const startDate = useAppStore((s) => s.startDate);

  return useMemo(() => {
    const roadmapMilestones = PHASES.filter((p) => p.id !== 'p4').flatMap((p) => p.milestones);
    const allMilestones = PHASES.flatMap((p) => p.milestones);
    const doneCount = roadmapMilestones.filter((m) => completed[m.id]).length;
    const progressPct = Math.round((doneCount / roadmapMilestones.length) * 100);
    const xp = allMilestones.filter((m) => completed[m.id]).reduce((sum, m) => sum + m.xp, 0);
    const xpTotal = allMilestones.reduce((sum, m) => sum + m.xp, 0);

    const monday = weekStart();
    const hoursThisWeek = hourLogs.filter((h) => h.date >= monday).reduce((s, h) => s + h.hours, 0);
    const hoursTotal = hourLogs.reduce((s, h) => s + h.hours, 0);

    const year = String(new Date().getFullYear());
    const incomeYtd = incomes.filter((i) => i.date.startsWith(year)).reduce((s, i) => s + i.amountUsd, 0);

    const actualByMonth = INCOME_TARGETS.map((_, idx) =>
      incomes.filter((i) => monthOffset(startDate, i.date) === idx).reduce((s, i) => s + i.amountUsd, 0),
    );

    const phaseProgress = PHASES.map((p) => ({
      id: p.id,
      done: p.milestones.filter((m) => completed[m.id]).length,
      total: p.milestones.length,
    }));

    const dayNumber = Math.max(1, daysBetween(startDate) + 1);

    return {
      progressPct,
      doneCount,
      totalCount: roadmapMilestones.length,
      xp,
      xpTotal,
      hoursThisWeek,
      hoursTotal,
      incomeYtd,
      actualByMonth,
      shipCount: ships.length,
      phaseProgress,
      dayNumber,
    };
  }, [completed, hourLogs, incomes, ships, startDate]);
};
