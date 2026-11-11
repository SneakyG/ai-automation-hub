import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { CATEGORY_META } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { Category, TaskStatus } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'In Progress' },
  { id: 'done', label: 'Completed' },
];

const ORDER: TaskStatus[] = ['todo', 'doing', 'done'];

export const KanbanBoard = () => {
  const { tasks, addTask, moveTask, removeTask } = useAppStore();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<Category>('build');
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), tag);
    setTitle('');
  };

  const shift = (id: string, current: TaskStatus, dir: -1 | 1) => {
    const next = ORDER[ORDER.indexOf(current) + dir];
    if (next) moveTask(id, next);
  };

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.tag === filter);

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-white">Kanban Sprint</h2>
        <div className="flex flex-wrap gap-1">
          {(['all', ...Object.keys(CATEGORY_META)] as (Category | 'all')[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-xs ${filter === c ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {c === 'all' ? 'Tất cả' : CATEGORY_META[c].label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="mb-4 flex flex-wrap gap-2">
        <input className="input flex-1" placeholder="Task mới, ví dụ: Quay Loom demo Lead Inbox" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="input w-auto" value={tag} onChange={(e) => setTag(e.target.value as Category)}>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Thêm
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = visible.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="rounded-xl bg-navy-800/60 p-3">
              <p className="mb-3 flex justify-between text-sm font-semibold text-slate-300">
                {col.label}
                <span className="text-slate-500">{items.length}</span>
              </p>
              <div className="space-y-2">
                <AnimatePresence>
                  {items.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="rounded-lg border border-slate-700 bg-navy-900 p-3"
                    >
                      <p className={`text-sm ${t.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{t.title}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <CategoryBadge category={t.tag} />
                        <div className="flex gap-1 text-slate-500">
                          <button type="button" aria-label="Lùi cột" disabled={t.status === 'todo'} onClick={() => shift(t.id, t.status, -1)} className="hover:text-slate-200 disabled:opacity-30">
                            <ArrowLeft size={15} />
                          </button>
                          <button type="button" aria-label="Sang cột sau" disabled={t.status === 'done'} onClick={() => shift(t.id, t.status, 1)} className="hover:text-slate-200 disabled:opacity-30">
                            <ArrowRight size={15} />
                          </button>
                          <button type="button" aria-label="Xóa task" onClick={() => removeTask(t.id)} className="hover:text-rose-400">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && <p className="py-4 text-center text-xs text-slate-600">Trống</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
