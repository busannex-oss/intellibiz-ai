import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Zap, Check, Sparkles, Brain, Globe, Phone, Mail, BarChart, BookOpen, Shield, Star, Layers } from 'lucide-react';

const ICON_MAP = { Zap, Sparkles, Brain, Globe, Phone, Mail, BarChart, BookOpen, Shield, Star, Layers };

const getIcon = (name) => {
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className="w-6 h-6" />;
};

export default function Services() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['page-content', 'services'],
    queryFn: () => base44.entities.PageContent.filter({ page_key: 'services', is_active: true }, 'order', 50),
  });

  const hero = items.find(i => i.section_key === 'hero') || {};
  const services = items.filter(i => i.section_key === 'service_item');

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title || 'Our Services'}</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">{hero.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div key={svc.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${svc.color || 'from-amber-500 to-orange-500'}`}>
                {getIcon(svc.icon)}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{svc.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{svc.body}</p>
              {svc.items?.length > 0 && (
                <ul className="space-y-1">
                  {svc.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}