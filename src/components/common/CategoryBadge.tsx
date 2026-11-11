import { CATEGORY_META } from '../../data/mockData';
import type { Category } from '../../types';

export const CategoryBadge = ({ category }: { category: Category }) => {
  const meta = CATEGORY_META[category];
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}>{meta.label}</span>
  );
};
