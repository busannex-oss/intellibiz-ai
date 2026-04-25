import React from 'react';

export default function SessionList({ sessions, selectedId, onSelect, renderItem, emptyMessage = 'No sessions' }) {
  if (!sessions || sessions.length === 0) {
    return <div className="p-4 text-center text-slate-500 text-sm">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-2">
      {sessions.map(session => (
        <button
          key={session.id}
          onClick={() => onSelect(session)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedId === session.id
              ? 'bg-violet-50 border-violet-200'
              : 'hover:bg-slate-100 border-slate-200'
          }`}
        >
          {renderItem(session)}
        </button>
      ))}
    </div>
  );
}