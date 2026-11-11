import { SectionHeader } from '../common/SectionHeader';
import { KanbanBoard } from './KanbanBoard';
import { WeeklyRhythm } from './WeeklyRhythm';

export const SprintBoard = () => (
  <div>
    <SectionHeader title="Sprint & Lịch tuần" subtitle="Mỗi Chủ Nhật ship một thứ công khai: demo, bài viết hoặc template." />
    <div className="space-y-4">
      <WeeklyRhythm />
      <KanbanBoard />
    </div>
  </div>
);
