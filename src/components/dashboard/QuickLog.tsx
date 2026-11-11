import { Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { ShipType } from '../../types';
import { formatUsd, todayIso } from '../../utils/date';

type Mode = 'hours' | 'income' | 'ship';

const SHIP_LABEL: Record<ShipType, string> = { post: 'Bài viết', demo: 'Demo', template: 'Template' };

export const QuickLog = () => {
  const { hourLogs, incomes, ships, addHourLog, addIncome, addShip, removeHourLog, removeIncome, removeShip } = useAppStore();
  const [mode, setMode] = useState<Mode>('hours');
  const [date, setDate] = useState(todayIso());
  const [num, setNum] = useState('');
  const [text, setText] = useState('');
  const [shipType, setShipType] = useState<ShipType>('post');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(num);
    if (mode === 'hours' && n > 0) addHourLog(date, n, text.trim());
    if (mode === 'income' && n > 0) addIncome(date, n, text.trim() || 'Không ghi nguồn');
    if (mode === 'ship' && text.trim()) addShip(date, shipType, text.trim());
    setNum('');
    setText('');
  };

  const recent =
    mode === 'hours'
      ? hourLogs.slice(0, 5).map((h) => ({ id: h.id, left: `${h.date} · ${h.hours}h`, right: h.note, remove: removeHourLog }))
      : mode === 'income'
        ? incomes.slice(0, 5).map((i) => ({ id: i.id, left: `${i.date} · ${formatUsd(i.amountUsd)}`, right: i.source, remove: removeIncome }))
        : ships.slice(0, 5).map((s) => ({ id: s.id, left: `${s.date} · ${SHIP_LABEL[s.type]}`, right: s.title, remove: removeShip }));

  return (
    <div className="card">
      <h2 className="mb-3 font-semibold text-white">Ghi nhanh</h2>
      <div className="mb-4 flex gap-2">
        {(['hours', 'income', 'ship'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={mode === m ? 'btn-primary' : 'btn-ghost'}
          >
            {m === 'hours' ? 'Giờ học' : m === 'income' ? 'Thu nhập' : 'Ship'}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        {mode === 'ship' ? (
          <select className="input" value={shipType} onChange={(e) => setShipType(e.target.value as ShipType)}>
            <option value="post">Bài viết</option>
            <option value="demo">Demo</option>
            <option value="template">Template</option>
          </select>
        ) : (
          <input
            type="number"
            min={0}
            step={mode === 'hours' ? 0.25 : 1}
            className="input"
            placeholder={mode === 'hours' ? 'Số giờ, ví dụ 1.5' : 'Số tiền USD (1 USD ≈ 26.000 đ)'}
            value={num}
            onChange={(e) => setNum(e.target.value)}
          />
        )}
        <input
          className="input sm:col-span-2"
          placeholder={mode === 'hours' ? 'Đã làm gì?' : mode === 'income' ? 'Nguồn: agency, Fiverr, khách lẻ...' : 'Tiêu đề bài viết / demo / template'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-primary sm:col-span-2">Lưu</button>
      </form>
      <ul className="mt-4 divide-y divide-slate-800 text-sm">
        {recent.length === 0 && <li className="py-2 text-slate-500">Chưa có mục nào.</li>}
        {recent.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 py-2">
            <span className="text-slate-300">{r.left}</span>
            <span className="flex-1 truncate text-slate-500">{r.right}</span>
            <button type="button" aria-label="Xóa" onClick={() => r.remove(r.id)} className="text-slate-500 hover:text-rose-400">
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
