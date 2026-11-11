import { useMemo, useState, type ChangeEvent } from 'react';
import { CopyButton } from '../common/CopyButton';

type PromptKind = 'system' | 'claudeCode' | 'n8nNode';

interface Inputs {
  niche: string;
  painPoint: string;
  techStack: string;
  businessName: string;
}

const KIND_LABEL: Record<PromptKind, string> = {
  system: 'System prompt cho chatbot (OpenAI/Claude API)',
  claudeCode: 'Prompt cho Claude Code dựng workflow/app',
  n8nNode: 'Prompt cho Claude Code viết n8n custom node',
};

const buildPrompt = (kind: PromptKind, i: Inputs): string => {
  const name = i.businessName || '[Tên doanh nghiệp]';
  if (kind === 'system') {
    return `Bạn là trợ lý chăm sóc khách hàng của ${name}, một doanh nghiệp trong ngành ${i.niche}.

Nhiệm vụ: trả lời câu hỏi của khách về ${i.painPoint}, chỉ dựa trên tài liệu trong <knowledge>.

Quy tắc:
1. Trả lời bằng tiếng Việt, thân thiện, tối đa 4 câu.
2. Nếu tài liệu không có câu trả lời, nói rõ là chưa chắc và đề nghị chuyển cho tư vấn viên. Không bịa giá, lịch hay chính sách.
3. Khi khách để lại tên hoặc số điện thoại, xác nhận lại và ghi nhận nhu cầu.
4. Cuối mỗi lượt, trả về JSON trong thẻ <meta> theo schema:
{"intent": "hoi_gia | dat_lich | khieu_nai | khac", "confidence": 0-1, "handoff": true/false, "lead": {"name": "", "phone": "", "need": ""}}

<knowledge>
{{TÀI_LIỆU_RAG_CHÈN_VÀO_ĐÂY}}
</knowledge>`;
  }
  if (kind === 'claudeCode') {
    return `Mục tiêu: xây dựng giải pháp tự động hóa cho ${name} (ngành ${i.niche}) để giải quyết: ${i.painPoint}.

Tech stack: ${i.techStack}.

Yêu cầu:
- Lập kế hoạch trước (plan mode), liệt kê các bước và file sẽ tạo, chờ tôi duyệt rồi mới code.
- Tách cấu hình (API key, URL webhook) vào file .env, có .env.example.
- Viết README tiếng Việt: kiến trúc, cách cài, cách chạy thử với 10 dữ liệu mẫu.
- Có xử lý lỗi và log rõ ràng; không hard-code dữ liệu khách.
- Sau mỗi bước, tóm tắt thay đổi và cách tôi kiểm tra.

Tiêu chí hoàn thành: chạy end-to-end với dữ liệu mẫu dưới 1 phút, lỗi được ghi lại.`;
  }
  return `Viết một n8n community node bằng TypeScript cho ${name} (ngành ${i.niche}).

Chức năng: ${i.painPoint}.
Hệ thống cần tích hợp: ${i.techStack}.

Yêu cầu:
- Theo cấu trúc n8n-nodes-starter: credentials riêng, file node, icon, package.json có khóa "n8n".
- Node có các operation rõ ràng, field có displayName và description tiếng Việt.
- Xử lý lỗi bằng NodeOperationError, hỗ trợ "Continue On Fail".
- Viết hướng dẫn build, link vào n8n local qua npm link, và một workflow JSON mẫu để test.
- Lập kế hoạch trước, chờ tôi duyệt rồi mới tạo file.`;
};

export const PromptStudio = () => {
  const [kind, setKind] = useState<PromptKind>('system');
  const [inputs, setInputs] = useState<Inputs>({
    niche: 'trung tâm tiếng Anh',
    painPoint: 'lịch học, học phí và đăng ký học thử',
    techStack: 'n8n, Supabase pgvector, Telegram, Google Sheets',
    businessName: '',
  });
  const prompt = useMemo(() => buildPrompt(kind, inputs), [kind, inputs]);
  const update = (key: keyof Inputs) => (e: ChangeEvent<HTMLInputElement>) => setInputs((v) => ({ ...v, [key]: e.target.value }));

  return (
    <div className="card">
      <h2 className="font-semibold text-white">AI Prompt Studio</h2>
      <p className="mb-4 text-xs text-slate-400">Điền ngách, vấn đề và công nghệ để sinh prompt dùng ngay.</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(KIND_LABEL) as PromptKind[]).map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} className={kind === k ? 'btn-primary' : 'btn-ghost'}>
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Tên doanh nghiệp</label>
          <input className="input" value={inputs.businessName} onChange={update('businessName')} placeholder="Ví dụ: Trung tâm ABC" />
        </div>
        <div>
          <label className="label">Ngách (Niche)</label>
          <input className="input" value={inputs.niche} onChange={update('niche')} />
        </div>
        <div>
          <label className="label">Vấn đề (Pain point)</label>
          <input className="input" value={inputs.painPoint} onChange={update('painPoint')} />
        </div>
        <div>
          <label className="label">Tech stack</label>
          <input className="input" value={inputs.techStack} onChange={update('techStack')} />
        </div>
      </div>
      <div className="relative">
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-navy-950 p-4 text-xs leading-relaxed text-slate-300">
          {prompt}
        </pre>
        <div className="mt-3 flex justify-end">
          <CopyButton text={prompt} label="Copy prompt" />
        </div>
      </div>
    </div>
  );
};
