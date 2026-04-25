import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function MetricCard({ label, value, suffix = '', icon: Icon = null, color = 'slate' }) {
  const colorClasses = {
    slate: 'text-slate-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    amber: 'text-amber-500'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-8 h-8 ${colorClasses[color]}`} />}
          <div>
            <p className="text-sm text-slate-600">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}{suffix}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}