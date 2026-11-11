import { useMemo, useState, type ChangeEvent } from 'react';
import { RESOURCE_LINKS, SERVICE_PACKAGES, TOOLS, USD_TO_VND } from '../../data/mockData';
import { formatUsd, formatVnd } from '../../utils/date';
import { SectionHeader } from '../common/SectionHeader';

type Market = 'vn' | 'fiverr';
type Level = 'lo' | 'mid' | 'hi';

const pick = (range: [number, number], level: Level) =>
  level === 'lo' ? range[0] : level === 'hi' ? range[1] : (range[0] + range[1]) / 2;

export const PricingCalculator = () => {
  const [market, setMarket] = useState<Market>('vn');
  const [level, setLevel] = useState<Level>('mid');
  const [rate, setRate] = useState(USD_TO_VND);
  const [qty, setQty] = useState<Record<string, number>>({ 'lead-inbox': 1, chatbot: 0, report: 0, retainer: 1 });
  const [chatbotMaint, setChatbotMaint] = useState(0);

  const rows = useMemo(
    () =>
      SERVICE_PACKAGES.map((p) => {
        const unit = pick(market === 'vn' ? p.vnd : p.usd, level);
        const count = qty[p.id] ?? 0;
        return { ...p, unit, count, subtotal: unit * count };
      }),
    [market, level, qty],
  );

  const chatbot = SERVICE_PACKAGES.find((p) => p.id === 'chatbot');
  const maintRange = market === 'vn' ? chatbot?.monthlyAddOnVnd : chatbot?.monthlyAddOnUsd;
  const maintTotal = maintRange ? pick(maintRange, level) * chatbotMaint : 0;
  const total = rows.reduce((s, r) => s + r.subtotal, 0) + maintTotal;
  const recurring = rows.filter((r) => r.recurring).reduce((s, r) => s + r.subtotal, 0) + maintTotal;
  const totalUsd = market === 'vn' ? total / rate : total;
  const totalVnd = market === 'vn' ? total : total * rate;
  const fmt = market === 'vn' ? formatVnd : formatUsd;

  const setCount = (id: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Number(e.target.value) || 0) }));

  return (
    <div>
      <SectionHeader title="Gói dịch vụ & Bảng tính doanh thu" subtitle="Giá là ước tính cho người mới; kiểm chứng bằng cách hỏi giá 5–10 khách." />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" className={market === 'vn' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMarket('vn')}>Trong nước (VND)</button>
            <button type="button" className={market === 'fiverr' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMarket('fiverr')}>Fiverr (USD)</button>
            <span className="mx-2 w-px bg-slate-800" />
            {(['lo', 'mid', 'hi'] as Level[]).map((l) => (
              <button key={l} type="button" className={level === l ? 'btn-primary' : 'btn-ghost'} onClick={() => setLevel(l)}>
                {l === 'lo' ? 'Giá thấp' : l === 'mid' ? 'Giá giữa' : 'Giá cao'}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="py-2">Gói</th>
                  <th>Giao trong</th>
                  <th>Đơn giá</th>
                  <th className="w-24">Số lượng/tháng</th>
                  <th className="text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 text-slate-100">{r.name}</td>
                    <td className="text-slate-400">{r.delivery}</td>
                    <td className="text-slate-300">{fmt(r.unit)}</td>
                    <td>
                      <input type="number" min={0} className="input py-1" value={r.count} onChange={setCount(r.id)} />
                    </td>
                    <td className="text-right font-medium text-white">{fmt(r.subtotal)}</td>
                  </tr>
                ))}
                {maintRange && (
                  <tr>
                    <td className="py-3 text-slate-100">Phí duy trì chatbot</td>
                    <td className="text-slate-400">Hằng tháng</td>
                    <td className="text-slate-300">{fmt(pick(maintRange, level))}</td>
                    <td>
                      <input type="number" min={0} className="input py-1" value={chatbotMaint} onChange={(e) => setChatbotMaint(Math.max(0, Number(e.target.value) || 0))} />
                    </td>
                    <td className="text-right font-medium text-white">{fmt(maintTotal)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            Tỷ giá quy đổi 1 USD =
            <input type="number" className="input w-28 py-1" value={rate} onChange={(e) => setRate(Number(e.target.value) || USD_TO_VND)} />
            đ
          </div>
        </div>

        <div className="card">
          <p className="text-xs uppercase text-slate-400">Doanh thu dự phóng / tháng</p>
          <p className="mt-2 text-3xl font-bold text-white">{formatUsd(totalUsd)}</p>
          <p className="text-sm text-slate-400">{formatVnd(totalVnd)}</p>
          <p className="mt-3 text-sm text-slate-300">Trong đó định kỳ: <span className="font-semibold text-emerald-300">{fmt(recurring)}</span></p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${Math.min(100, (totalUsd / 1000) * 100)}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {totalUsd >= 1000 ? 'Đã chạm đích $1.000/tháng.' : totalUsd >= 300 ? 'Đã qua cổng $300/tháng.' : `Còn ${formatUsd(300 - totalUsd)} để qua cổng $300.`}
          </p>
          <p className="mt-4 text-xs text-slate-500">Giá cho agency (white-label): thấp hơn giá lẻ 20–30%.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <h2 className="mb-3 font-semibold text-white">Bộ công cụ & chi phí</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="py-2">Công cụ</th>
                  <th>Dùng để</th>
                  <th>Chi phí</th>
                  <th>Bắt đầu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {TOOLS.map((t) => (
                  <tr key={t.name}>
                    <td className="py-2">
                      <a href={t.url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">{t.name}</a>
                    </td>
                    <td className="text-slate-400">{t.purpose}</td>
                    <td className="text-slate-300">{t.cost}</td>
                    <td className="text-slate-400">{t.start}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Tổng khoảng $25/tháng lúc đầu, ~$40/tháng từ ngày 31. Giá thay đổi thường xuyên — kiểm tra lại trước khi trả tiền.</p>
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold text-white">Thư viện tài nguyên</h2>
          <ul className="space-y-2 text-sm">
            {RESOURCE_LINKS.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">{r.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
