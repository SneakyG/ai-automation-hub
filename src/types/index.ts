export type Category = 'build' | 'learn' | 'outreach' | 'content';

export type PhaseId = 'p1' | 'p2' | 'p3' | 'p4';

export type SectionId = 'dashboard' | 'world' | 'roadmap' | 'board' | 'outreach' | 'pricing' | 'data';

export interface Resource {
  label: string;
  url: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: Category;
  xp: number;
  isGate?: boolean;
  resources: Resource[];
  /** Link video hướng dẫn: YouTube, Loom hoặc file MP4/WebM trực tiếp. */
  videoUrl?: string;
  /** Tiêu đề ngắn của video. */
  videoTitle?: string;
  /** Cờ đánh dấu nhanh milestone có video đính kèm. */
  hasVideo: boolean;
  /** Link tài liệu hướng dẫn / docs chính thức. */
  guideUrl?: string;
  /** Tiêu đề ngắn của tài liệu. */
  guideTitle?: string;
  /** Tên nguồn hiển thị dạng badge, ví dụ "n8n Docs". */
  sourceName?: string;
  /** Hướng dẫn kỹ thuật chi tiết: các trường dữ liệu, bước dựng, quy tắc kiểm tra. */
  technicalSpec?: TechnicalSpec;
  /** JSON Schema mẫu khi milestone chỉ có một use-case (dùng khi technicalSpec không có useCases). */
  jsonSchemaSample?: string;
  /** Dữ liệu đầu vào mẫu. */
  inputSample?: string;
  /** Kết quả JSON mong muốn sau khi AI xử lý. */
  outputSample?: string;
}

export type SchemaFieldType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'enum';

export interface SchemaField {
  name: string;
  type: SchemaFieldType;
  required: boolean;
  description: string;
  format?: string;
}

export interface SpecUseCase {
  id: string;
  name: string;
  summary: string;
  fields: SchemaField[];
  jsonSchemaSample: string;
  inputSample: string;
  outputSample: string;
  /** Kiểm tra số học tùy chọn chạy cùng trình kiểm tra schema. */
  arithmeticCheck?: 'invoice';
}

export interface TechnicalSpec {
  overview: string;
  stack: string[];
  steps: string[];
  systemPrompt?: string;
  validationRules: string[];
  codeSnippet?: { title: string; language: string; code: string };
  acceptanceCriteria: string[];
  useCases: SpecUseCase[];
}

export interface CustomGuide {
  url: string;
  title: string;
  updatedAt: string;
}

export interface CustomVideo {
  url: string;
  title: string;
  updatedAt: string;
}

export type VideoKind = 'youtube' | 'loom' | 'file' | 'unknown';

export interface ResolvedVideo {
  kind: VideoKind;
  /** URL dùng cho iframe (YouTube/Loom) hoặc thẻ <video> (file). */
  src: string;
  /** URL gốc để mở ở tab mới. */
  originalUrl: string;
}

export interface Phase {
  id: PhaseId;
  name: string;
  days: string;
  goal: string;
  gate: string;
  timeSplit: string;
  milestones: Milestone[];
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  tag: Category;
  status: TaskStatus;
  createdAt: string;
}

export interface HourLog {
  id: string;
  date: string;
  hours: number;
  note: string;
}

export interface IncomeEntry {
  id: string;
  date: string;
  amountUsd: number;
  source: string;
}

export type ShipType = 'post' | 'demo' | 'template';

export interface ShipEntry {
  id: string;
  date: string;
  type: ShipType;
  title: string;
}

export type SkillKey = 'claudeCode' | 'n8nCore' | 'agentRag' | 'promptApi' | 'selling' | 'async';

export interface Skill {
  key: SkillKey;
  label: string;
}

export interface RhythmDay {
  dayIndex: number;
  label: string;
  hours: string;
  focus: string;
  isRest?: boolean;
}

export interface MessageTemplate {
  id: string;
  title: string;
  channel: string;
  body: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  delivery: string;
  vnd: [number, number];
  usd: [number, number];
  recurring: boolean;
  monthlyAddOnVnd?: [number, number];
  monthlyAddOnUsd?: [number, number];
}

export interface IncomeTarget {
  month: string;
  lo: number;
  hi: number;
}

export interface Tool {
  name: string;
  purpose: string;
  cost: string;
  start: string;
  url: string;
}

export interface AppData {
  startDate: string;
  completed: Record<string, boolean>;
  customVideos: Record<string, CustomVideo>;
  customGuides: Record<string, CustomGuide>;
  tasks: Task[];
  hourLogs: HourLog[];
  incomes: IncomeEntry[];
  ships: ShipEntry[];
  skills: Record<SkillKey, number>;
  rhythmChecks: Record<string, boolean>;
}
