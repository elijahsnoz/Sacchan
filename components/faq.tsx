import { faqs } from '@/lib/content';

export function Faq() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {faqs.map((faq) => (
        <details key={faq.question} className="sac-panel group p-6">
          <summary className="cursor-pointer list-none text-lg font-semibold text-white marker:hidden">{faq.question}</summary>
          <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
