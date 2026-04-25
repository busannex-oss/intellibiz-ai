import React from 'react';

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      {subtitle && <p className="text-slate-600 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}