import { SectionHeader } from '../common/SectionHeader';
import { MessageTemplates } from './MessageTemplates';
import { PromptStudio } from './PromptStudio';

export const OutreachHub = () => (
  <div>
    <SectionHeader
      title="Tin nhắn & Prompt Studio"
      subtitle="Kênh ưu tiên: agency white-label → cộng đồng online → demo trước, chào sau → Fiverr → Upwork."
    />
    <div className="grid gap-4 xl:grid-cols-2">
      <MessageTemplates />
      <PromptStudio />
    </div>
  </div>
);
