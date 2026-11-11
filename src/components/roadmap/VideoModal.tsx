import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { resolveVideo } from '../../utils/video';

export interface VideoModalData {
  url: string;
  title: string;
  description: string;
  milestoneTitle: string;
  isCustom: boolean;
}

interface Props {
  video: VideoModalData | null;
  onClose: () => void;
}

export const VideoModal = ({ video, onClose }: Props) => {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose]);

  const resolved = video ? resolveVideo(video.url) : null;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <motion.div
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-navy-900 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3">
              <p className="truncate text-sm text-slate-400">{video.milestoneTitle}</p>
              <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {resolved && (resolved.kind === 'youtube' || resolved.kind === 'loom') && (
                <iframe
                  key={resolved.src}
                  src={resolved.src}
                  title={video.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}
              {resolved?.kind === 'file' && (
                <video key={resolved.src} src={resolved.src} controls className="absolute inset-0 h-full w-full" />
              )}
              {(!resolved || resolved.kind === 'unknown') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-slate-300">Link này không phát trực tiếp được trong trang (chỉ hỗ trợ YouTube, Loom, MP4/WebM).</p>
                  <a href={video.url} target="_blank" rel="noreferrer" className="btn-primary">
                    <ExternalLink size={16} /> Mở ở tab mới
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${video.isCustom ? 'bg-emerald-500/15 text-emerald-300' : 'bg-indigo-500/15 text-indigo-300'}`}>
                  {video.isCustom ? 'Video của bạn' : 'Video mẫu'}
                </span>
              </div>
              <p className="text-sm text-slate-400">{video.description}</p>
              <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline">
                <ExternalLink size={12} /> Mở video gốc
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
