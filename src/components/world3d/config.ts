import type { SectionId } from '../../types';

export type Vec3 = [number, number, number];

export interface ObjectInfo {
  title: string;
  description: string;
  section: SectionId;
  actionLabel: string;
}

export const OBJECT_INFO = {
  hologram: {
    title: 'Trung tâm điều hành',
    description: 'Data Orb hiển thị tổng quan tiến độ 90 ngày, giờ thực hành và thu nhập.',
    section: 'dashboard',
    actionLabel: 'Mở Dashboard',
  },
  laptop: {
    title: 'Workshop · Ngày 1–30',
    description: 'Giai đoạn 1: Claude Code, n8n Docker, 3 dự án portfolio. Cổng 1: 3 demo + 1 pilot.',
    section: 'roadmap',
    actionLabel: 'Xem lộ trình',
  },
  servers: {
    title: 'Automation Lab · Ngày 31–60',
    description: 'Giai đoạn 2: AI Agent, chatbot RAG Supabase, VPS, Fiverr. Cổng 2: dự án trả phí đầu tiên ≥ $300.',
    section: 'roadmap',
    actionLabel: 'Xem lộ trình',
  },
  vault: {
    title: 'Commercial Vault · Ngày 61–90',
    description: '3 gói dịch vụ giá cố định + retainer. Cổng 3: ≥ $300/tháng + 1 retainer.',
    section: 'pricing',
    actionLabel: 'Mở bảng tính gói dịch vụ',
  },
  telescope: {
    title: 'The Summit · Tháng 4–6',
    description: 'Tăng giá, thêm agency đối tác, đích $1.000+/tháng.',
    section: 'dashboard',
    actionLabel: 'Xem biểu đồ thu nhập',
  },
  forge: {
    title: 'Alchemist Forge',
    description: 'Sinh system prompt và prompt cho Claude Code theo ngách, vấn đề và tech stack.',
    section: 'outreach',
    actionLabel: 'Mở Prompt Studio',
  },
} satisfies Record<string, ObjectInfo>;

export const CODE_LINES = [
  '$ claude "dựng workflow AI Lead Inbox"',
  '● Plan: webhook → llm.extract → sheets',
  'const data = await llm.extract(lead, schema);',
  'if (!validate(data)) return alert(data);',
  'await sheets.append("CRM", data);',
  'await telegram.notify(owner, data.need);',
  '$ docker compose up -d n8n',
  '✓ n8n running on :5678',
  'return { ok: true, ms: Date.now() - t0 };',
  '// demo #1 shipped ✓',
];
