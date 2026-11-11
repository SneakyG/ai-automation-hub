import { Download, RotateCcw, Upload } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { isAppData, pickData, useAppStore } from '../../store/useAppStore';
import { todayIso } from '../../utils/date';
import { CopyButton } from './CopyButton';
import { SectionHeader } from './SectionHeader';

export const DataManager = () => {
  const state = useAppStore();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const json = JSON.stringify(pickData(state), null, 2);

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-automation-hub-${todayIso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const applyImport = (raw: string) => {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isAppData(parsed)) throw new Error('Sai cấu trúc');
      state.importData(parsed);
      setMessage({ ok: true, text: 'Đã nhập dữ liệu thành công.' });
      setImportText('');
    } catch {
      setMessage({ ok: false, text: 'File/JSON không hợp lệ. Hãy dùng đúng file đã xuất từ ứng dụng này.' });
    }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyImport(await file.text());
    e.target.value = '';
  };

  return (
    <div>
      <SectionHeader title="Dữ liệu & sao lưu" subtitle="Tiến độ tự lưu trong localStorage của trình duyệt này. Xuất JSON định kỳ để không mất dữ liệu." />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold text-white">Ngày bắt đầu lộ trình</h2>
          <input type="date" className="input w-48" value={state.startDate} onChange={(e) => state.setStartDate(e.target.value)} />
          <p className="mt-2 text-xs text-slate-400">Dùng để tính "Ngày thứ N" và gom thu nhập theo tháng trên biểu đồ.</p>

          <h2 className="mb-3 mt-6 font-semibold text-white">Xuất dữ liệu</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={download}>
              <Download size={16} /> Tải file JSON
            </button>
            <CopyButton text={json} label="Copy JSON" />
          </div>

          <h2 className="mb-3 mt-6 font-semibold text-white">Đặt lại</h2>
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-rose-300">Xóa toàn bộ tiến độ? Không thể hoàn tác.</span>
              <button
                type="button"
                className="btn bg-rose-500 text-white hover:bg-rose-400"
                onClick={() => {
                  state.resetAll();
                  setConfirmReset(false);
                  setMessage({ ok: true, text: 'Đã đặt lại dữ liệu.' });
                }}
              >
                Xóa hết
              </button>
              <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>Hủy</button>
            </div>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={16} /> Đặt lại từ đầu
            </button>
          )}
        </div>

        <div className="card">
          <h2 className="mb-3 font-semibold text-white">Nhập dữ liệu</h2>
          <label className="btn-ghost cursor-pointer">
            <Upload size={16} /> Chọn file JSON
            <input type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
          </label>
          <p className="my-3 text-xs text-slate-500">hoặc dán nội dung JSON:</p>
          <textarea className="input h-40 font-mono text-xs" value={importText} onChange={(e) => setImportText(e.target.value)} />
          <button type="button" className="btn-primary mt-3" disabled={!importText.trim()} onClick={() => applyImport(importText)}>
            Nhập từ văn bản
          </button>
          {message && <p className={`mt-3 text-sm ${message.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{message.text}</p>}
        </div>
      </div>
    </div>
  );
};
