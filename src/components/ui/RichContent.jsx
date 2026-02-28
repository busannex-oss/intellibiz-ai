/**
 * RichContent — Shared styled markdown renderer for BrandForge.
 * Use this everywhere you render AI-generated text content.
 * 
 * Usage:
 *   import RichContent from '@/components/ui/RichContent';
 *   <RichContent content={someMarkdownString} />
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';

const components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b-2 border-violet-200">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-violet-700 mt-6 mb-3 flex items-center gap-2">
      <span className="w-1 h-5 bg-violet-500 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-700 mt-5 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-1">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-slate-600 leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 mb-4 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 mb-4 ml-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-slate-600 flex gap-2 items-start leading-relaxed">
      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        ›
      </span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-800">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-500">{children}</em>
  ),
  table: ({ children }) => (
    <table className="w-full text-sm border-collapse my-4 rounded-lg border border-slate-200">
      {children}
    </table>
  ),
  thead: ({ children }) => <thead className="bg-violet-50">{children}</thead>,
  th: ({ children }) => (
    <th className="text-violet-800 font-semibold text-left p-3 border-b border-slate-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="p-3 border-b border-slate-100 text-slate-600">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-violet-400 pl-4 my-4 bg-violet-50 py-2 rounded-r-lg text-slate-600 italic text-sm">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-violet-700 text-xs font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono">
        <code>{children}</code>
      </pre>
    ),
  hr: () => <hr className="border-slate-200 my-6" />,
};

export default function RichContent({ content, className = '' }) {
  if (!content) return null;
  return (
    <div className={`bg-slate-50 rounded-xl p-6 border border-slate-100 ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}