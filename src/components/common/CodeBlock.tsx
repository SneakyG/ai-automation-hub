import { CopyButton } from './CopyButton';

interface Props {
  title: string;
  code: string;
  maxHeight?: string;
}

export const CodeBlock = ({ title, code, maxHeight = 'max-h-80' }: Props) => (
  <div className="overflow-hidden rounded-xl border border-slate-800 bg-navy-950">
    <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
      <span className="text-xs font-medium text-slate-400">{title}</span>
      <CopyButton text={code} />
    </div>
    <pre className={`${maxHeight} overflow-auto p-3 text-xs leading-relaxed text-slate-300`}>
      <code>{code}</code>
    </pre>
  </div>
);
