import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, PlayCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Milestone } from '../../types';
import { GuideEditor } from './GuideEditor';
import { VideoEditor } from './VideoEditor';

type Tab = 'guide' | 'video';

interface Props {
  milestone: Milestone | null;
  onClose: () => void;
}

export const EditMilestoneModal = ({ milestone, onClose }: Props) => {
  const [tab, setTab] = useState<Tab>('guide');

  useEffect(() => {
    if (!milestone) return;
    setTab('guide');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [milestone, onClose]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Chỉnh sửa tài liệu và video"
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-navy-900 p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Chỉnh sửa milestone</p>
                <h3 className="font-semibold text-white">{milestone.title}</h3>
              </div>
              <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4 flex gap-2">
              <button type="button" className={tab === 'guide' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('guide')}>
                <BookOpen size={16} /> Tài liệu
              </button>
              <button type="button" className={tab === 'video' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('video')}>
                <PlayCircle size={16} /> Video
              </button>
            </div>
            {tab === 'guide' ? (
              <GuideEditor key={`g-${milestone.id}`} milestone={milestone} onDone={onClose} />
            ) : (
              <VideoEditor key={`v-${milestone.id}`} milestone={milestone} onDone={onClose} />
            )}
            <p className="mt-3 text-xs text-slate-500">Link bạn thêm được lưu tự động trong trình duyệt này và ưu tiên hiển thị thay cho link mẫu.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
