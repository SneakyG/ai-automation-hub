import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { INCOME_TARGETS } from '../../data/mockData';
import { useProgress } from '../../hooks/useProgress';

export const IncomeChart = () => {
  const { actualByMonth } = useProgress();
  const data = INCOME_TARGETS.map((t, i) => ({
    month: t.month,
    range: [t.lo, t.hi] as [number, number],
    mid: (t.lo + t.hi) / 2,
    actual: actualByMonth[i],
  }));

  return (
    <div className="card">
      <h2 className="font-semibold text-white">Thu nhập: mục tiêu vs thực tế</h2>
      <p className="mb-4 text-xs text-slate-400">Vùng tím = khoảng mục tiêu thấp–cao (USD). Đường cyan = thu nhập đã ghi, tính theo tháng kể từ ngày bắt đầu.</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: '#0b1120', border: '1px solid #334155', borderRadius: 12 }}
              formatter={(value, name) =>
                Array.isArray(value) ? [`$${value[0]}–$${value[1]}`, 'Mục tiêu'] : [`$${value}`, name === 'actual' ? 'Thực tế' : 'Điểm giữa']
              }
            />
            <ReferenceLine y={1000} stroke="#64748b" strokeDasharray="5 4" label={{ value: 'Đích $1.000', fill: '#94a3b8', fontSize: 11, position: 'insideTopLeft' }} />
            <Area type="monotone" dataKey="range" stroke="#818cf8" fill="#6366f1" fillOpacity={0.25} />
            <Line type="monotone" dataKey="mid" stroke="#818cf8" strokeDasharray="4 4" dot={false} />
            <Line type="monotone" dataKey="actual" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
