import { Box, Calculator, Database, KanbanSquare, LayoutDashboard, Map, MessageSquareText, Zap } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import type { SectionId } from '../../types';

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'world', label: 'Không gian 3D', icon: Box },
  { id: 'roadmap', label: 'Lộ trình 30-60-90', icon: Map },
  { id: 'board', label: 'Sprint & Lịch tuần', icon: KanbanSquare },
  { id: 'outreach', label: 'Tin nhắn & Prompt', icon: MessageSquareText },
  { id: 'pricing', label: 'Gói dịch vụ & Giá', icon: Calculator },
  { id: 'data', label: 'Dữ liệu', icon: Database },
];

interface Props {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export const Sidebar = ({ active, onChange }: Props) => {
  const { progressPct, dayNumber } = useProgress();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-navy-900 p-4 lg:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AI Automation</p>
            <p className="text-xs text-slate-400">Execution Hub</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active === id ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-slate-800 bg-navy-800 p-4">
          <p className="text-xs text-slate-400">Ngày thứ</p>
          <p className="text-2xl font-bold text-white">{dayNumber}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">{progressPct}% lộ trình 90 ngày</p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-slate-800 bg-navy-900/95 py-2 backdrop-blur lg:hidden">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-0.5 px-2 text-[10px] ${active === id ? 'text-indigo-300' : 'text-slate-500'}`}
          >
            <Icon size={20} />
            {label.split(' ')[0]}
          </button>
        ))}
      </nav>
    </>
  );
};
