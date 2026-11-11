import type { CustomGuide, Milestone } from '../types';

export interface EffectiveGuide {
  url: string;
  title: string;
  sourceName: string;
  isCustom: boolean;
}

const KNOWN_SOURCES: Record<string, string> = {
  'docs.n8n.io': 'n8n Docs',
  'community.n8n.io': 'n8n Community',
  'help.fiverr.com': 'Fiverr Help',
  'supabase.com': 'Supabase Docs',
  'code.claude.com': 'Claude Code Docs',
  'docs.claude.com': 'Claude Docs',
  'vercel.com': 'Vercel Docs',
  'developer.mozilla.org': 'MDN',
};

/** Tên nguồn hiển thị cho link người dùng tự thêm, suy ra từ tên miền. */
export const sourceFromUrl = (raw: string): string => {
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '');
    return KNOWN_SOURCES[host] ?? host;
  } catch {
    return 'Tài liệu';
  }
};

export const isValidHttpUrl = (raw: string): boolean => {
  try {
    const url = new URL(raw.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

/** Tài liệu người dùng tự thêm được ưu tiên hơn tài liệu mẫu trong mockData. */
export const effectiveGuide = (milestone: Milestone, custom?: CustomGuide): EffectiveGuide | null => {
  if (custom?.url) {
    return { url: custom.url, title: custom.title || 'Tài liệu của tôi', sourceName: sourceFromUrl(custom.url), isCustom: true };
  }
  if (milestone.guideUrl) {
    return {
      url: milestone.guideUrl,
      title: milestone.guideTitle ?? milestone.title,
      sourceName: milestone.sourceName ?? sourceFromUrl(milestone.guideUrl),
      isCustom: false,
    };
  }
  return null;
};
