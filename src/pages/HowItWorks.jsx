import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Check, Zap, Sparkles, Brain, Globe, BarChart, BookOpen } from 'lucide-react';

const ICON_MAP = { ArrowRight, Zap, Sparkles, Brain, Globe, BarChart, BookOpen };

const getIcon = (name) => {
  const Icon = ICON_MAP[name] || ArrowRight;
  return <Icon className="w-6 h-6" />;
};

export default function HowItWorks() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['page-content', 'how_it_works'],
    queryFn: () => base44.entities.PageContent.filter({ page_key: 'how_it_works', is_active: true }, 'order', 50),
  });

  const hero = items.find(i => i.section_key === 'hero') || {};
  const steps = items.filter(i => i.section_key === 'step');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        {hero.badge_text && (
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1 rounded-full mb-4">
            {hero.badge_text}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title || 'How It Works'}</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">{hero.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex gap-6 items-start">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br ${step.color || 'from-amber-500 to-orange-500'}`}>
                {step.icon ? getIcon(step.icon) : <span className="text-xl font-bold">{idx + 1}</span>}
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.body}</p>
                {step.items?.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}