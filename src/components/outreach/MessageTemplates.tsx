import { useState, type ChangeEvent } from 'react';
import { MESSAGE_TEMPLATES } from '../../data/mockData';
import { CopyButton } from '../common/CopyButton';

interface Vars {
  myName: string;
  recipient: string;
  demoLink: string;
  painPoint: string;
}

const fill = (body: string, vars: Vars) =>
  body.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = vars[key as keyof Vars];
    return value ? value : match;
  });

export const MessageTemplates = () => {
  const [vars, setVars] = useState<Vars>({ myName: '', recipient: '', demoLink: '', painPoint: 'lịch học và học phí' });
  const update = (key: keyof Vars) => (e: ChangeEvent<HTMLInputElement>) => setVars((v) => ({ ...v, [key]: e.target.value }));

  return (
    <div className="card">
      <h2 className="font-semibold text-white">Mẫu tin nhắn tìm khách (không cần gọi điện)</h2>
      <p className="mb-4 text-xs text-slate-400">Điền biến số một lần, cả 3 mẫu tự cập nhật. Gửi từng người, không gửi hàng loạt.</p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Tên bạn</label>
          <input className="input" value={vars.myName} onChange={update('myName')} placeholder="Ví dụ: Minh" />
        </div>
        <div>
          <label className="label">Người nhận / tên doanh nghiệp</label>
          <input className="input" value={vars.recipient} onChange={update('recipient')} placeholder="Ví dụ: Anh Tuấn / Trung tâm ABC" />
        </div>
        <div>
          <label className="label">Link video demo</label>
          <input className="input" value={vars.demoLink} onChange={update('demoLink')} placeholder="https://www.loom.com/share/..." />
        </div>
        <div>
          <label className="label">Câu hỏi khách hay hỏi</label>
          <input className="input" value={vars.painPoint} onChange={update('painPoint')} />
        </div>
      </div>
      <div className="space-y-3">
        {MESSAGE_TEMPLATES.map((t) => {
          const text = fill(t.body, vars);
          return (
            <div key={t.id} className="rounded-xl border border-slate-800 bg-navy-800/60 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.channel}</p>
                </div>
                <CopyButton text={text} />
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
