import { useState, type FormEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Milestone } from '../../types';
import { isValidHttpUrl, sourceFromUrl } from '../../utils/guide';

interface Props {
  milestone: Milestone;
  onDone: () => void;
}

export const GuideEditor = ({ milestone, onDone }: Props) => {
  const custom = useAppStore((s) => s.customGuides[milestone.id]);
  const setCustomGuide = useAppStore((s) => s.setCustomGuide);
  const removeCustomGuide = useAppStore((s) => s.removeCustomGuide);
  const [url, setUrl] = useState(custom?.url ?? '');
  const [title, setTitle] = useState(custom?.title ?? '');
  const [error, setError] = useState('');
  const valid = isValidHttpUrl(url);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError('Link không hợp lệ. Dán link bắt đầu bằng https://');
      return;
    }
    setCustomGuide(milestone.id, url, title || `Tài liệu: ${milestone.title}`);
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl border border-slate-700 bg-navy-800/60 p-3">
      <div>
        <label className="label" htmlFor={`g-url-${milestone.id}`}>Link tài liệu (docs, bài viết, help center)</label>
        <input
          id={`g-url-${milestone.id}`}
          className="input"
          placeholder="https://docs.n8n.io/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
        />
        {url && valid && <p className="mt-1 text-xs text-slate-400">Nguồn: {sourceFromUrl(url)}</p>}
        {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
      </div>
      <div>
        <label className="label" htmlFor={`g-title-${milestone.id}`}>Tiêu đề tài liệu</label>
        <input
          id={`g-title-${milestone.id}`}
          className="input"
          placeholder="Ví dụ: n8n AI Agent Node Documentation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">Lưu tài liệu</button>
        <button type="button" className="btn-ghost" onClick={onDone}>Hủy</button>
        {custom && (
          <button
            type="button"
            className="btn-ghost text-rose-300"
            onClick={() => {
              removeCustomGuide(milestone.id);
              onDone();
            }}
          >
            {milestone.guideUrl ? 'Xóa, dùng lại tài liệu mẫu' : 'Xóa tài liệu'}
          </button>
        )}
      </div>
    </form>
  );
};
