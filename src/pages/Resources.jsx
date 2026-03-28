import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BookOpen, Zap, Sparkles, Globe, BarChart, Shield } from 'lucide-react';

const ICON_MAP = { BookOpen, Zap, Sparkles, Globe, BarChart, Shield };

const getIcon = (name) => {
  const Icon = ICON_MAP[name] || BookOpen;
  return <Icon className="w-6 h-6" />;
};

export default function Resources() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['page-content', 'resources'],
    queryFn: () => base44.entities.PageContent.filter({ page_key: 'resources', is_active: true }, 'order', 50),
  });

  const hero = items.find(i => i.section_key === 'hero') || {};
  const resources = items.filter(i => i.section_key === 'resource_item');

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title || 'Resources'}</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">{hero.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {resources.length === 0 ? (
          <p className="text-center text-slate-500">No resources found. Add content via the Admin dashboard.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${res.color || 'from-blue-500 to-indigo-500'}`}>
                  {getIcon(res.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{res.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{res.body}</p>
                {res.cta_text && res.cta_link && (
                  <a href={res.cta_link} className="text-amber-600 font-medium text-sm hover:underline">
                    {res.cta_text} →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}