export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const uid = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Monday (yyyy-mm-dd, local time) of the week containing `date`. */
export const weekStart = (date: Date = new Date()): string => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

/** Index 0 = Monday ... 6 = Sunday. */
export const weekdayIndex = (date: Date = new Date()): number => (date.getDay() + 6) % 7;

export const daysBetween = (fromIso: string, to: Date = new Date()): number => {
  const from = new Date(`${fromIso}T00:00:00`);
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.floor((end.getTime() - from.getTime()) / 86_400_000);
};

/** 0-based month offset of `dateIso` relative to `startIso` (30-day months). */
export const monthOffset = (startIso: string, dateIso: string): number =>
  Math.floor(daysBetween(startIso, new Date(`${dateIso}T00:00:00`)) / 30);

export const formatVnd = (n: number): string => `${Math.round(n).toLocaleString('vi-VN')} đ`;

export const formatUsd = (n: number): string => `$${Math.round(n).toLocaleString('en-US')}`;
