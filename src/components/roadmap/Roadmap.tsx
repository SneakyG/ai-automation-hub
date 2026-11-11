import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, PlayCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PHASES } from '../../data/mockData';
import { useProgress } from '../../hooks/useProgress';
import { useAppStore } from '../../store/useAppStore';
import type { Milestone, PhaseId } from '../../types';
import { effectiveGuide } from '../../utils/guide';
import { effectiveVideo } from '../../utils/video';
import { SectionHeader } from '../common/SectionHeader';
import { EditMilestoneModal } from './EditMilestoneModal';
import { MilestoneCard } from './MilestoneCard';
import { TechSpecModal } from './TechSpecModal';
import { VideoModal, type VideoModalData } from './VideoModal';

export const Roadmap = () => {
  const [active, setActive] = useState<PhaseId>('p1');
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [playing, setPlaying] = useState<VideoModalData | null>(null);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [specOf, setSpecOf] = useState<Milestone | null>(null);
  const { phaseProgress } = useProgress();
  const completed = useAppStore((s) => s.completed);
  const customVideos = useAppStore((s) => s.customVideos);
  const customGuides = useAppStore((s) => s.customGuides);
  const closeModal = useCallback(() => setPlaying(null), []);
  const closeEdit = useCallback(() => setEditing(null), []);
  const closeSpec = useCallback(() => setSpecOf(null), []);

  const phase = PHASES.find((p) => p.id === active) ?? PHASES[0];
  const phaseXp = phase.milestones.filter((m) => completed[m.id]).reduce((s, m) => s + m.xp, 0);
  const phaseXpTotal = phase.milestones.reduce((s, m) => s + m.xp, 0);
  const withVideo = phase.milestones.filter((m) => effectiveVideo(m, customVideos[m.id]));
  const visible = onlyVideo ? withVideo : phase.milestones;

  return (
    <div>
      <SectionHeader title="Lộ trình 30-60-90 ngày" subtitle="Chỉ sang giai đoạn sau khi đã qua cổng KPI của giai đoạn trước." />

      <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        {PHASES.map((p) => {
          const pp = phaseProgress.find((x) => x.id === p.id);
          const videoCount = p.milestones.filter((m) => effectiveVideo(m, customVideos[m.id])).length;
          const guideCount = p.milestones.filter((m) => effectiveGuide(m, customGuides[m.id])).length;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                active === p.id ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-800 bg-navy-900 hover:border-slate-600'
              }`}
            >
              <p className="text-xs text-slate-400">{p.days}</p>
              <p className="text-sm font-semibold text-white">{p.name.split('·')[1]?.trim() ?? p.name}</p>
              <p className="mt-1 flex items-center gap-2 text-xs">
                <span className="text-cyan-300">
                  {pp?.done ?? 0}/{pp?.total ?? 0} xong
                </span>
                <span className="inline-flex items-center gap-0.5 text-rose-300">
                  <PlayCircle size={12} /> {videoCount}
                </span>
                <span className="inline-flex items-center gap-0.5 text-indigo-300">
                  <BookOpen size={12} /> {guideCount}
                </span>
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={phase.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          <div className="card mb-4">
            <h2 className="text-lg font-semibold text-white">{phase.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{phase.goal}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-indigo-300">{phase.gate}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{phase.timeSplit}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-amber-300">
                {phaseXp}/{phaseXpTotal} XP
              </span>
              <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-slate-300">
                <input type="checkbox" className="accent-rose-500" checked={onlyVideo} onChange={(e) => setOnlyVideo(e.target.checked)} />
                Chỉ mốc có video ({withVideo.length})
              </label>
            </div>
          </div>
          <div className="grid gap-3">
            {visible.map((m) => (
              <MilestoneCard key={m.id} milestone={m} onPlay={setPlaying} onEdit={setEditing} onOpenSpec={setSpecOf} />
            ))}
            {visible.length === 0 && <p className="card text-center text-sm text-slate-500">Giai đoạn này chưa có mốc nào có video.</p>}
          </div>
        </motion.div>
      </AnimatePresence>

      <VideoModal video={playing} onClose={closeModal} />
      <EditMilestoneModal milestone={editing} onClose={closeEdit} />
      <TechSpecModal milestone={specOf} onClose={closeSpec} />
      <p className="mt-6 text-xs text-slate-500">Video mẫu là video tiếng Anh công khai trên YouTube của các tác giả bên thứ ba, chỉ để tham khảo. Tài liệu mẫu dẫn tới trang docs/help chính thức của từng công cụ.</p>
    </div>
  );
};
