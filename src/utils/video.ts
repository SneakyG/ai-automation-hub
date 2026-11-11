import type { CustomVideo, Milestone, ResolvedVideo } from '../types';

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const FILE_EXT = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

const youtubeId = (url: URL): string | null => {
  const host = url.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (v) return v;
    const match = url.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
    if (match) return match[2];
  }
  return null;
};

/** Chuyển link người dùng dán (YouTube, Loom, MP4) thành nguồn phát được trong trang. */
export const resolveVideo = (raw: string): ResolvedVideo | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const yt = youtubeId(url);
  if (yt && YOUTUBE_ID.test(yt)) {
    const start = url.searchParams.get('t') ?? url.searchParams.get('start');
    const startParam = start ? `&start=${parseInt(start, 10) || 0}` : '';
    return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt}?rel=0${startParam}`, originalUrl: trimmed };
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'loom.com') {
    const match = url.pathname.match(/^\/(share|embed)\/([a-zA-Z0-9]+)/);
    if (match) return { kind: 'loom', src: `https://www.loom.com/embed/${match[2]}`, originalUrl: trimmed };
  }

  if (FILE_EXT.test(url.pathname)) return { kind: 'file', src: trimmed, originalUrl: trimmed };

  return { kind: 'unknown', src: trimmed, originalUrl: trimmed };
};

export interface EffectiveVideo {
  url: string;
  title: string;
  isCustom: boolean;
}

/** Video người dùng tự dán được ưu tiên hơn video mẫu trong mockData. */
export const effectiveVideo = (milestone: Milestone, custom?: CustomVideo): EffectiveVideo | null => {
  if (custom?.url) return { url: custom.url, title: custom.title || 'Video của tôi', isCustom: true };
  if (milestone.hasVideo && milestone.videoUrl) {
    return { url: milestone.videoUrl, title: milestone.videoTitle ?? milestone.title, isCustom: false };
  }
  return null;
};
