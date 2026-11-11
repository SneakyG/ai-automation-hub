import { Check, Copy } from 'lucide-react';
import { useCopy } from '../../hooks/useCopy';

interface Props {
  text: string;
  label?: string;
}

export const CopyButton = ({ text, label = 'Copy' }: Props) => {
  const { copiedKey, copy } = useCopy();
  const copied = copiedKey === 'btn';
  return (
    <button type="button" className={copied ? 'btn bg-emerald-500 text-white' : 'btn-primary'} onClick={() => copy('btn', text)}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Đã copy' : label}
    </button>
  );
};
