import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Code2, ExternalLink, Flag, Pencil, PlayCircle } from 'lucide-react';
import { SELF_RECORD_HINT } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { Milestone } from '../../types';
import { effectiveGuide } from '../../utils/guide';
import { effectiveVideo } from '../../utils/video';
import { CategoryBadge } from '../common/CategoryBadge';
import type { VideoModalData } from './VideoModal';

interface Props {
  milestone: Milestone;
  onPlay: (video: VideoModalData) => void;
  onEdit: (milestone: Milestone) => void;
  onOpenSpec: (milestone: Milestone) => void;
}

export const MilestoneCard = ({ milestone, onPlay, onEdit, onOpenSpec }: Props) => {
  const done = useAppStore((s) => Boolean(s.completed[milestone.id]));
  const customVideo = useAppStore((s) => s.customVideos[milestone.id]);
  const customGuide = useAppStore((s) => s.customGuides[milestone.id]);
  const toggle = useAppStore((s) => s.toggleMilestone);
  const video = effectiveVideo(milestone, customVideo);
  const guide = effectiveGuide(milestone, customGuide);
  const guideIsPrimary = Boolean(guide && !video);

  const play = () => {
    if (!video) return;
    onPlay({
      url: video.url,
      title: video.title,
      description: milestone.description,
      milestoneTitle: milestone.title,
      isCustom: video.isCustom,
    });
  };

  return (
    <motion.div layout className={`card ${milestone.isGate ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={done ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
          onClick={() => toggle(milestone.id)}
          className="mt-0.5 shrink-0 text-indigo-400 hover:text-indigo-300"
        >
          {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {milestone.isGate && <Flag size={14} className="text-indigo-300" />}
            <h3 className={`font-semibold ${done ? 'text-slate-400 line-through' : 'text-white'}`}>{milestone.title}</h3>
          </div>
          <p className={`mt-1 text-sm ${done ? 'text-slate-500' : 'text-slate-400'}`}>{milestone.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={milestone.category} />
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-amber-300">+{milestone.xp} XP</span>
            {milestone.resources
              .filter((r) => r.url !== guide?.url)
              .map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline">
                  <ExternalLink size={12} />
                  {r.label}
                </a>
              ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {video && (
              <button
                type="button"
                onClick={play}
                className={`btn text-white transition-transform hover:-translate-y-0.5 ${video.isCustom ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
              >
                <PlayCircle size={16} />
                {video.isCustom ? 'Xem video của tôi' : 'Xem Video Hướng Dẫn'}
              </button>
            )}

            {guide && (
              <motion.a
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                title={guide.title}
                className={
                  guideIsPrimary
                    ? 'btn bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400'
                    : 'btn border border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20'
                }
              >
                <BookOpen size={16} />
                {guideIsPrimary ? 'Học từ tài liệu chính' : 'Đọc tài liệu'}
                <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-semibold">{guide.sourceName}</span>
                <ExternalLink size={12} className="opacity-70" />
              </motion.a>
            )}

            {(milestone.technicalSpec || milestone.jsonSchemaSample) && (
              <button
                type="button"
                onClick={() => onOpenSpec(milestone)}
                className="btn border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 transition-transform hover:-translate-y-0.5 hover:bg-cyan-500/20"
              >
                <Code2 size={16} /> Hướng dẫn kỹ thuật & Schema
              </button>
            )}

            <button type="button" className="btn-ghost py-1.5 text-xs" onClick={() => onEdit(milestone)}>
              <Pencil size={14} /> Chỉnh sửa tài liệu & video
            </button>
          </div>

          {(video || guide) && (
            <div className="mt-2 space-y-0.5 text-xs text-slate-500">
              {video && <p className="truncate">Video: {video.title}</p>}
              {guide && (
                <p className="truncate">
                  Tài liệu: {guide.title}
                  {guide.isCustom && <span className="ml-1 text-emerald-400">(của bạn)</span>}
                </p>
              )}
            </div>
          )}
          {!video && !guide && <p className="mt-2 text-xs text-slate-500">{SELF_RECORD_HINT}</p>}
        </div>
      </div>
    </motion.div>
  );
};
