import { useState, type FormEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Milestone } from '../../types';
import { resolveVideo } from '../../utils/video';

interface Props {
  milestone: Milestone;
  onDone: () => void;
}

const KIND_LABEL = { youtube: 'YouTube', loom: 'Loom', file: 'File video', unknown: 'Link khác (mở ở tab mới)' } as const;

export const VideoEditor = ({ milestone, onDone }: Props) => {
  const custom = useAppStore((s) => s.customVideos[milestone.id]);
  const setCustomVideo = useAppStore((s) => s.setCustomVideo);
  const removeCustomVideo = useAppStore((s) => s.removeCustomVideo);
  const [url, setUrl] = useState(custom?.url ?? '');
  const [title, setTitle] = useState(custom?.title ?? '');
  const [error, setError] = useState('');

  const preview = resolveVideo(url);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!preview) {
      setError('Link không hợp lệ. Dán link bắt đầu bằng https://');
      return;
    }
    setCustomVideo(milestone.id, url, title || `Video: ${milestone.title}`);
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl border border-slate-700 bg-navy-800/60 p-3">
      <div>
        <label className="label" htmlFor={`v-url-${milestone.id}`}>Link video (YouTube, Loom, MP4)</label>
        <input
          id={`v-url-${milestone.id}`}
          className="input"
          placeholder="https://www.loom.com/share/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
        />
        {url && preview && <p className="mt-1 text-xs text-slate-400">Nhận diện: {KIND_LABEL[preview.kind]}</p>}
        {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
      </div>
      <div>
        <label className="label" htmlFor={`v-title-${milestone.id}`}>Tiêu đề video</label>
        <input
          id={`v-title-${milestone.id}`}
          className="input"
          placeholder="Ví dụ: Loom Demo: AI Lead Inbox chạy thật"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">Lưu video</button>
        <button type="button" className="btn-ghost" onClick={onDone}>Hủy</button>
        {custom && (
          <button
            type="button"
            className="btn-ghost text-rose-300"
            onClick={() => {
              removeCustomVideo(milestone.id);
              onDone();
            }}
          >
            {milestone.hasVideo ? 'Xóa, dùng lại video mẫu' : 'Xóa video'}
          </button>
        )}
      </div>
    </form>
  );
};
