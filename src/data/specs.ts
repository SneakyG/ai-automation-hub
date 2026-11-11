import type { TechnicalSpec } from '../types';

const pretty = (value: unknown): string => JSON.stringify(value, null, 2);

/* ------------------------------------------------------------------ */
/* Dự án 2 — Tài liệu → Dữ liệu                                         */
/* ------------------------------------------------------------------ */

const invoiceSchema = {
  type: 'object',
  properties: {
    invoice_number: { type: 'string', description: 'Số hóa đơn, giữ nguyên ký hiệu' },
    invoice_date: { type: 'string', description: 'Ngày xuất hóa đơn, định dạng YYYY-MM-DD' },
    supplier_name: { type: 'string', description: 'Tên đơn vị bán hàng' },
    tax_id: { type: ['string', 'null'], description: 'Mã số thuế người bán, null nếu không có' },
    currency: { type: 'string', enum: ['VND', 'USD'], description: 'Đơn vị tiền tệ' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          quantity: { type: 'number' },
          unit_price: { type: 'number' },
          total_amount: { type: 'number' },
        },
        required: ['description', 'quantity', 'unit_price', 'total_amount'],
        additionalProperties: false,
      },
    },
    subtotal: { type: 'number', description: 'Tiền trước thuế' },
    vat_amount: { type: 'number', description: 'Tiền thuế GTGT' },
    grand_total: { type: 'number', description: 'Tổng tiền thanh toán' },
  },
  required: ['invoice_number', 'invoice_date', 'supplier_name', 'tax_id', 'currency', 'items', 'subtotal', 'vat_amount', 'grand_total'],
  additionalProperties: false,
};

const invoiceInput = `CÔNG TY TNHH THIẾT BỊ VĂN PHÒNG ABC (dữ liệu mẫu)
Mã số thuế: 0312345678
Địa chỉ: 12 Nguyễn Huệ, Quận 1, TP.HCM

HÓA ĐƠN GIÁ TRỊ GIA TĂNG
Ký hiệu: 1C26TAB     Số: 0000123
Ngày 05 tháng 11 năm 2026

STT | Tên hàng hóa, dịch vụ        | ĐVT  | SL | Đơn giá     | Thành tiền
1   | Laptop văn phòng 14 inch     | Cái  | 1  | 15.000.000  | 15.000.000
2   | Chuột không dây              | Cái  | 2  | 250.000     | 500.000

Cộng tiền hàng:                              15.500.000
Thuế suất GTGT: 10%   Tiền thuế GTGT:         1.550.000
Tổng cộng tiền thanh toán:                   17.050.000
Số tiền viết bằng chữ: Mười bảy triệu không trăm năm mươi nghìn đồng.`;

const invoiceOutput = {
  invoice_number: '0000123',
  invoice_date: '2026-11-05',
  supplier_name: 'CÔNG TY TNHH THIẾT BỊ VĂN PHÒNG ABC',
  tax_id: '0312345678',
  currency: 'VND',
  items: [
    { description: 'Laptop văn phòng 14 inch', quantity: 1, unit_price: 15000000, total_amount: 15000000 },
    { description: 'Chuột không dây', quantity: 2, unit_price: 250000, total_amount: 500000 },
  ],
  subtotal: 15500000,
  vat_amount: 1550000,
  grand_total: 17050000,
};

const cvSchema = {
  type: 'object',
  properties: {
    full_name: { type: 'string' },
    email: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'], description: 'Chuẩn hóa dạng +84xxxxxxxxx' },
    location: { type: ['string', 'null'] },
    years_experience: { type: 'number', description: 'Tổng số năm kinh nghiệm, ước tính từ lịch sử làm việc' },
    skills: { type: 'array', items: { type: 'string' } },
    languages: { type: 'array', items: { type: 'string' } },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          school: { type: 'string' },
          degree: { type: ['string', 'null'] },
          graduation_year: { type: ['integer', 'null'] },
        },
        required: ['school', 'degree', 'graduation_year'],
        additionalProperties: false,
      },
    },
    work_history: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          role: { type: 'string' },
          start_date: { type: 'string', description: 'YYYY-MM' },
          end_date: { type: ['string', 'null'], description: 'YYYY-MM, null nếu đang làm' },
        },
        required: ['company', 'role', 'start_date', 'end_date'],
        additionalProperties: false,
      },
    },
  },
  required: ['full_name', 'email', 'phone', 'location', 'years_experience', 'skills', 'languages', 'education', 'work_history'],
  additionalProperties: false,
};

const cvInput = `NGUYỄN VĂN AN (dữ liệu mẫu)
Backend Developer · Đà Nẵng
an.nguyen.dev@example.com · 0905 123 456

KỸ NĂNG: Java, Spring Boot, PostgreSQL, Docker, REST API
NGOẠI NGỮ: Tiếng Anh (đọc hiểu tài liệu)

KINH NGHIỆM
- Công ty Phần mềm XYZ — Backend Developer — 03/2022 đến nay
- Công ty Giải pháp Số DEF — Junior Developer — 07/2020 đến 02/2022

HỌC VẤN
- Đại học Bách khoa Đà Nẵng — Kỹ sư Công nghệ Thông tin — 2020`;

const cvOutput = {
  full_name: 'Nguyễn Văn An',
  email: 'an.nguyen.dev@example.com',
  phone: '+84905123456',
  location: 'Đà Nẵng',
  years_experience: 6.3,
  skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST API'],
  languages: ['Tiếng Anh (đọc hiểu)'],
  education: [{ school: 'Đại học Bách khoa Đà Nẵng', degree: 'Kỹ sư Công nghệ Thông tin', graduation_year: 2020 }],
  work_history: [
    { company: 'Công ty Phần mềm XYZ', role: 'Backend Developer', start_date: '2022-03', end_date: null },
    { company: 'Công ty Giải pháp Số DEF', role: 'Junior Developer', start_date: '2020-07', end_date: '2022-02' },
  ],
};

const validatorCode = `// n8n Code node (Run Once for All Items) — kiểm tra hóa đơn sau bước AI
const results = [];
for (const item of $input.all()) {
  const inv = item.json.output ?? item.json; // tùy node AI trả về
  const errors = [];

  const required = ['invoice_number', 'invoice_date', 'supplier_name', 'items', 'grand_total'];
  for (const key of required) {
    if (inv[key] === undefined || inv[key] === null || inv[key] === '') errors.push(\`Thiếu \${key}\`);
  }
  if (inv.invoice_date && !/^\\d{4}-\\d{2}-\\d{2}$/.test(inv.invoice_date)) errors.push('invoice_date sai định dạng YYYY-MM-DD');

  const items = Array.isArray(inv.items) ? inv.items : [];
  items.forEach((it, i) => {
    if (Math.abs(it.quantity * it.unit_price - it.total_amount) > 1) errors.push(\`Dòng \${i + 1}: SL × đơn giá ≠ thành tiền\`);
  });
  const sumItems = items.reduce((s, it) => s + (it.total_amount || 0), 0);
  if (Math.abs(sumItems - inv.subtotal) > 1) errors.push('Tổng các dòng ≠ subtotal');
  if (Math.abs(inv.subtotal + inv.vat_amount - inv.grand_total) > 1) errors.push('subtotal + VAT ≠ grand_total');

  results.push({ json: { ...inv, is_valid: errors.length === 0, errors: errors.join('; ') } });
}
return results;`;

export const DOC_DATA_SPEC: TechnicalSpec = {
  overview:
    'Workflow nhận file PDF thả vào một thư mục Google Drive, trích xuất văn bản, dùng AI điền dữ liệu theo JSON Schema cố định, kiểm tra hợp lệ bằng code rồi ghi vào Google Sheets. File nào không qua kiểm tra được đẩy sang sheet "Cần kiểm tra" và báo Telegram.',
  stack: ['n8n', 'Google Drive', 'Google Sheets', 'OpenAI hoặc Claude API', 'Telegram'],
  steps: [
    'Google Drive Trigger: theo dõi thư mục "Inbox-HoaDon", sự kiện File Created.',
    'Google Drive → Download File: tải file vừa tạo về dạng binary.',
    'Extract from File (PDF): lấy văn bản. Nếu kết quả rỗng là PDF scan, chuyển sang mô hình có khả năng đọc ảnh (vision) thay vì text.',
    'Node AI: Basic LLM Chain + Structured Output Parser (chế độ JSON Schema), dán schema bên dưới. Hoặc gọi thẳng API với structured output / tool schema.',
    'Code node: chạy đoạn kiểm tra hợp lệ (mẫu bên dưới) — thêm trường is_valid và errors.',
    'IF is_valid = true → Google Sheets "HoaDon" (1 dòng/hóa đơn) + Split Out items → sheet "ChiTiet" (1 dòng/mặt hàng, kèm invoice_number).',
    'Nhánh false → sheet "CanKiemTra" (kèm link file Drive, lỗi) + gửi Telegram cho chủ.',
    'Error Trigger workflow riêng: bắt mọi lỗi node và báo Telegram.',
  ],
  systemPrompt: `Bạn là hệ thống trích xuất dữ liệu từ chứng từ. Chỉ dùng thông tin có trong văn bản được cung cấp.
- Không suy đoán. Trường nào không có thì trả null (với trường cho phép null).
- Số tiền: bỏ dấu chấm/phẩy ngăn cách hàng nghìn, trả về số nguyên (15.500.000 → 15500000).
- Ngày: đổi về YYYY-MM-DD.
- Giữ nguyên tên công ty, tên mặt hàng như trong chứng từ.
Trả về đúng JSON theo schema, không thêm chữ nào khác.`,
  validationRules: [
    'Các trường bắt buộc không được rỗng.',
    'Ngày đúng định dạng YYYY-MM-DD (hóa đơn) hoặc YYYY-MM (CV).',
    'Hóa đơn: số lượng × đơn giá = thành tiền từng dòng (sai số ≤ 1).',
    'Hóa đơn: tổng các dòng = subtotal; subtotal + vat_amount = grand_total.',
    'CV: email đúng dạng, số điện thoại chuẩn hóa +84.',
  ],
  codeSnippet: { title: 'Code node kiểm tra hóa đơn', language: 'javascript', code: validatorCode },
  acceptanceCriteria: [
    'Đúng ≥ 90% trường dữ liệu trên 20 file mẫu (tự chấm bằng bảng so sánh).',
    'File sai được đẩy sang "CanKiemTra" thay vì ghi nhầm vào sheet chính.',
    'Mỗi file xử lý dưới 30 giây.',
  ],
  useCases: [
    {
      id: 'invoice',
      name: 'A · Hóa đơn GTGT',
      summary: 'Trích xuất thông tin hóa đơn và danh sách mặt hàng để nhập sổ chi phí.',
      fields: [
        { name: 'invoice_number', type: 'string', required: true, description: 'Số hóa đơn' },
        { name: 'invoice_date', type: 'string', required: true, format: 'YYYY-MM-DD', description: 'Ngày xuất hóa đơn' },
        { name: 'supplier_name', type: 'string', required: true, description: 'Tên đơn vị bán hàng / nhà cung cấp' },
        { name: 'tax_id', type: 'string', required: false, description: 'Mã số thuế người bán (null nếu không có)' },
        { name: 'currency', type: 'enum', required: true, description: 'VND hoặc USD' },
        { name: 'items', type: 'array', required: true, description: 'Mặt hàng: description, quantity, unit_price, total_amount' },
        { name: 'subtotal', type: 'number', required: true, description: 'Tiền trước thuế' },
        { name: 'vat_amount', type: 'number', required: true, description: 'Tiền thuế GTGT' },
        { name: 'grand_total', type: 'number', required: true, description: 'Tổng tiền thanh toán' },
      ],
      jsonSchemaSample: pretty(invoiceSchema),
      inputSample: invoiceInput,
      outputSample: pretty(invoiceOutput),
      arithmeticCheck: 'invoice',
    },
    {
      id: 'cv',
      name: 'B · CV ứng viên',
      summary: 'Chuẩn hóa CV về một cấu trúc để lọc ứng viên trong Google Sheets.',
      fields: [
        { name: 'full_name', type: 'string', required: true, description: 'Họ tên' },
        { name: 'email', type: 'string', required: false, description: 'Email (null nếu không có)' },
        { name: 'phone', type: 'string', required: false, description: 'Số điện thoại, chuẩn hóa +84' },
        { name: 'location', type: 'string', required: false, description: 'Tỉnh/thành' },
        { name: 'years_experience', type: 'number', required: true, description: 'Tổng năm kinh nghiệm (tính đến hiện tại)' },
        { name: 'skills', type: 'array', required: true, description: 'Danh sách kỹ năng' },
        { name: 'languages', type: 'array', required: true, description: 'Ngoại ngữ' },
        { name: 'education', type: 'array', required: true, description: 'school, degree, graduation_year' },
        { name: 'work_history', type: 'array', required: true, description: 'company, role, start_date, end_date (YYYY-MM)' },
      ],
      jsonSchemaSample: pretty(cvSchema),
      inputSample: cvInput,
      outputSample: pretty(cvOutput),
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Dự án 1 — AI Lead Inbox                                              */
/* ------------------------------------------------------------------ */

const leadSchema = {
  type: 'object',
  properties: {
    name: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'], description: 'Chuẩn hóa +84' },
    email: { type: ['string', 'null'] },
    need: { type: 'string', description: 'Nhu cầu chính, 1 câu' },
    budget_vnd: { type: ['number', 'null'] },
    urgency: { type: 'string', enum: ['thap', 'trung_binh', 'cao'] },
    category: { type: 'string', enum: ['hoi_gia', 'dat_lich', 'tu_van', 'khieu_nai', 'khac'] },
    reply_draft: { type: 'string', description: 'Email trả lời cá nhân hóa, tối đa 80 từ' },
  },
  required: ['name', 'phone', 'email', 'need', 'budget_vnd', 'urgency', 'category', 'reply_draft'],
  additionalProperties: false,
};

export const LEAD_INBOX_SPEC: TechnicalSpec = {
  overview:
    'Form gửi dữ liệu vào Webhook n8n. AI phân loại và trích xuất thông tin lead theo schema, ghi vào Google Sheets làm CRM, báo Telegram cho chủ và gửi email trả lời cá nhân hóa cho khách.',
  stack: ['n8n Webhook', 'OpenAI hoặc Claude API', 'Google Sheets', 'Telegram', 'Gmail'],
  steps: [
    'Webhook node (POST /lead): nhận name, contact, message từ form.',
    'Node AI + Structured Output Parser: dán schema bên dưới.',
    'Google Sheets → Append: ghi lead + thời gian nhận + trạng thái "Mới".',
    'IF urgency = cao → Telegram báo ngay; còn lại gom báo cáo cuối ngày.',
    'Gmail: gửi reply_draft cho khách (hoặc tạo bản nháp để duyệt tay ở giai đoạn đầu).',
    'Respond to Webhook: trả { "ok": true } cho form.',
  ],
  systemPrompt: `Bạn là trợ lý tiếp nhận khách hàng tiềm năng của một doanh nghiệp nhỏ tại Việt Nam.
Đọc tin nhắn của khách, trích xuất thông tin theo schema. Không bịa thông tin không có trong tin nhắn.
urgency = "cao" nếu khách cần trong 48 giờ hoặc nói rõ là gấp.
reply_draft: lịch sự, xưng "em", nhắc lại đúng nhu cầu của khách, hẹn phản hồi trong 24 giờ.`,
  validationRules: ['Có ít nhất một trong phone hoặc email.', 'urgency và category nằm trong danh sách enum.', 'reply_draft không quá 80 từ.'],
  acceptanceCriteria: ['10 lead thử chạy trọn vẹn dưới 1 phút.', 'Lead lỗi được ghi lại, không mất dữ liệu.'],
  useCases: [
    {
      id: 'lead',
      name: 'Lead từ form website',
      summary: 'Phân loại và trích xuất lead từ nội dung form tự do.',
      fields: [
        { name: 'name', type: 'string', required: false, description: 'Tên khách' },
        { name: 'phone', type: 'string', required: false, description: 'Số điện thoại, chuẩn hóa +84' },
        { name: 'email', type: 'string', required: false, description: 'Email' },
        { name: 'need', type: 'string', required: true, description: 'Nhu cầu chính' },
        { name: 'budget_vnd', type: 'number', required: false, description: 'Ngân sách nếu khách nêu' },
        { name: 'urgency', type: 'enum', required: true, description: 'thap · trung_binh · cao' },
        { name: 'category', type: 'enum', required: true, description: 'hoi_gia · dat_lich · tu_van · khieu_nai · khac' },
        { name: 'reply_draft', type: 'string', required: true, description: 'Email trả lời cá nhân hóa' },
      ],
      jsonSchemaSample: pretty(leadSchema),
      inputSample: `{
  "name": "Chị Hoa",
  "contact": "0912 345 678",
  "message": "Chào em, chị muốn đăng ký cho con học thử lớp tiếng Anh thiếu nhi tuần này, học phí khoảng 2 triệu/tháng được không em?"
}`,
      outputSample: pretty({
        name: 'Chị Hoa',
        phone: '+84912345678',
        email: null,
        need: 'Đăng ký học thử lớp tiếng Anh thiếu nhi trong tuần này',
        budget_vnd: 2000000,
        urgency: 'cao',
        category: 'dat_lich',
        reply_draft:
          'Dạ em chào chị Hoa, em đã nhận yêu cầu đăng ký học thử lớp tiếng Anh thiếu nhi trong tuần này cho bé. Bên em sẽ gọi lại trong 24 giờ để xếp lịch phù hợp và báo học phí chi tiết ạ.',
      }),
    },
  ],
};
