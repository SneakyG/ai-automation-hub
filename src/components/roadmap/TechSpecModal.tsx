import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, FlaskConical, ListChecks, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Milestone, SpecUseCase } from '../../types';
import { validateAgainstSchema, type ValidationResult } from '../../utils/schemaValidator';
import { CodeBlock } from '../common/CodeBlock';

interface Props {
  milestone: Milestone | null;
  onClose: () => void;
}

/** Gom use-case: ưu tiên technicalSpec.useCases, nếu không có thì dùng các trường mẫu cấp milestone. */
const useCasesOf = (m: Milestone): SpecUseCase[] => {
  if (m.technicalSpec?.useCases.length) return m.technicalSpec.useCases;
  if (m.jsonSchemaSample) {
    return [
      {
        id: 'default',
        name: 'Mẫu',
        summary: '',
        fields: [],
        jsonSchemaSample: m.jsonSchemaSample,
        inputSample: m.inputSample ?? '',
        outputSample: m.outputSample ?? '',
      },
    ];
  }
  return [];
};

const Validator = ({ useCase }: { useCase: SpecUseCase }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  return (
    <div className="rounded-xl border border-slate-800 bg-navy-800/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <FlaskConical size={16} className="text-cyan-300" />
        <h4 className="text-sm font-semibold text-white">Kiểm tra đầu ra của AI</h4>
      </div>
      <p className="mb-2 text-xs text-slate-400">Dán JSON mà node AI trả về để kiểm tra với schema{useCase.arithmeticCheck ? ' và đối chiếu số tiền' : ''}.</p>
      <textarea
        className="input h-32 font-mono text-xs"
        placeholder='{ "invoice_number": "..." }'
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setResult(null);
        }}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" disabled={!text.trim()} onClick={() => setResult(validateAgainstSchema(text, useCase.jsonSchemaSample, useCase.arithmeticCheck))}>
          Kiểm tra
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setText(useCase.outputSample);
            setResult(null);
          }}
        >
          Dùng output mẫu
        </button>
      </div>
      {result && (
        <div className={`mt-3 rounded-lg p-3 text-sm ${result.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-200'}`}>
          <p className="flex items-center gap-2 font-medium">
            {result.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {result.ok ? 'Hợp lệ: đúng schema và khớp số liệu.' : `Chưa đạt: ${result.errors.length} lỗi schema, ${result.warnings.length} lỗi số liệu`}
          </p>
          {[...result.errors, ...result.warnings].length > 0 && (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs">
              {[...result.errors, ...result.warnings].map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export const TechSpecModal = ({ milestone, onClose }: Props) => {
  const [caseId, setCaseId] = useState('');

  useEffect(() => {
    if (!milestone) return;
    setCaseId(useCasesOf(milestone)[0]?.id ?? '');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [milestone, onClose]);

  const spec = milestone?.technicalSpec;
  const cases = milestone ? useCasesOf(milestone) : [];
  const current = cases.find((c) => c.id === caseId) ?? cases[0];

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Hướng dẫn kỹ thuật: ${milestone.title}`}
        >
          <motion.aside
            className="h-full w-full max-w-3xl overflow-y-auto border-l border-slate-700 bg-navy-900 p-5 shadow-2xl sm:p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-cyan-300">Hướng dẫn kỹ thuật</p>
                <h2 className="text-xl font-bold text-white">{milestone.title}</h2>
              </div>
              <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X size={22} />
              </button>
            </div>

            {spec && (
              <section className="mb-6 space-y-3">
                <p className="text-sm leading-relaxed text-slate-300">{spec.overview}</p>
                <div className="flex flex-wrap gap-2">
                  {spec.stack.map((s) => (
                    <span key={s} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-white">Các bước dựng workflow</h3>
                  <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-300">
                    {spec.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {cases.length > 0 && current && (
              <section className="mb-6 space-y-4">
                {cases.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {cases.map((c) => (
                      <button key={c.id} type="button" className={c.id === current.id ? 'btn-primary' : 'btn-ghost'} onClick={() => setCaseId(c.id)}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
                {current.summary && <p className="text-sm text-slate-400">{current.summary}</p>}

                {current.fields.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-800 text-left text-xs uppercase text-slate-400">
                        <tr>
                          <th className="px-3 py-2">Trường</th>
                          <th className="px-3 py-2">Kiểu</th>
                          <th className="px-3 py-2">Bắt buộc</th>
                          <th className="px-3 py-2">Mô tả</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {current.fields.map((f) => (
                          <tr key={f.name}>
                            <td className="px-3 py-2 font-mono text-xs text-cyan-300">{f.name}</td>
                            <td className="px-3 py-2 text-xs text-slate-300">
                              {f.type}
                              {f.format && <span className="text-slate-500"> ({f.format})</span>}
                            </td>
                            <td className="px-3 py-2 text-xs">{f.required ? <span className="text-emerald-300">Có</span> : <span className="text-slate-500">Có thể null</span>}</td>
                            <td className="px-3 py-2 text-xs text-slate-400">{f.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <CodeBlock title="JSON Schema (dán vào Structured Output Parser / structured output)" code={current.jsonSchemaSample} />
                <div className="grid gap-4 lg:grid-cols-2">
                  {current.inputSample && <CodeBlock title="Đầu vào mẫu" code={current.inputSample} />}
                  {current.outputSample && <CodeBlock title="Kết quả mong muốn" code={current.outputSample} />}
                </div>
                <Validator key={current.id} useCase={current} />
              </section>
            )}

            {spec?.systemPrompt && (
              <section className="mb-6">
                <CodeBlock title="System prompt" code={spec.systemPrompt} maxHeight="max-h-60" />
              </section>
            )}

            {spec?.codeSnippet && (
              <section className="mb-6">
                <CodeBlock title={`${spec.codeSnippet.title} (${spec.codeSnippet.language})`} code={spec.codeSnippet.code} />
              </section>
            )}

            {spec && (
              <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <ListChecks size={16} className="text-amber-300" /> Quy tắc kiểm tra
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
                    {spec.validationRules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-800 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <CheckCircle2 size={16} className="text-emerald-300" /> Tiêu chí hoàn thành
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
                    {spec.acceptanceCriteria.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <p className="mt-6 text-xs text-slate-500">
              Schema mẫu khai báo additionalProperties: false và liệt kê mọi trường trong required (trường có thể vắng dùng kiểu null) để tương thích chế độ strict của structured output.
            </p>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
