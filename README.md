# AI Automation Builder — Roadmap & Execution Hub

Web SPA theo dõi lộ trình 30–60–90 ngày trở thành AI Automation Builder: dashboard KPI, roadmap tick được có XP, Kanban + lịch tuần, mẫu tin nhắn tìm khách, Prompt Studio, bảng tính doanh thu gói dịch vụ, xuất/nhập dữ liệu JSON.

## Chạy dự án

Yêu cầu: Node.js 18+.

```bash
npm install
npm run dev        # mở http://localhost:5173
npm run build      # kiểm tra kiểu + build bản production vào dist/
npm run preview    # xem thử bản build
```

Deploy nhanh: đẩy lên GitHub rồi import vào Vercel (framework: Vite, output: `dist`).

## Cấu trúc

```
src/
  App.tsx                    # khung SPA, điều hướng bằng #hash
  data/mockData.ts           # TOÀN BỘ nội dung lộ trình: giai đoạn, milestone, giá, mẫu tin nhắn, công cụ
  store/useAppStore.ts       # Zustand + persist localStorage
  hooks/useProgress.ts       # tính % tiến độ, XP, giờ/tuần, thu nhập theo tháng
  hooks/useCopy.ts           # copy 1 chạm
  types/index.ts
  utils/date.ts
  components/
    layout/Sidebar.tsx
    dashboard/               # StatCard, IncomeChart, SkillRadar, QuickLog
    roadmap/                 # Roadmap (4 tab), MilestoneCard (checkbox, XP, link, Loom)
    board/                   # KanbanBoard, WeeklyRhythm
    outreach/                # MessageTemplates, PromptStudio
    pricing/                 # PricingCalculator, công cụ, tài nguyên
    common/                  # DataManager (export/import), CopyButton, ...
```

## Tùy chỉnh

- Sửa nội dung lộ trình, giá, mẫu tin nhắn: chỉ cần sửa `src/data/mockData.ts`.
- Dữ liệu lưu trong localStorage với khóa `ai-automation-hub-v1`. Vào mục **Dữ liệu** để xuất JSON sao lưu hoặc chuyển sang máy khác.
