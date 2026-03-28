import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Zap, Globe, BarChart, Shield, Star, DollarSign, Users } from 'lucide-react';

const ICON_MAP = { TrendingUp, Zap, Globe, BarChart, Shield, Star, DollarSign, Users };

const getIcon = (name) => {
  const Icon = ICON_MAP[name] || TrendingUp;
  return <Icon className="w-6 h-6" />;
};

export default function InvestorInfo() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['page-content', 'investor'],
    queryFn: () => base44.entities.PageContent.filter({ page_key: 'investor', is_active: true }, 'order', 50),
  });

  const hero = items.find(i => i.section_key === 'hero') || {};
  const stats = items.filter(i => i.section_key === 'stat');
  const features = items.filter(i => i.section_key === 'feature');
  const partnerships = items.filter(i => i.section_key === 'partnership');

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title || 'Investor Information'}</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">{hero.subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center p-6 bg-slate-50 rounded-2xl">
                <div className="text-3xl font-bold text-amber-600 mb-1">{stat.title}</div>
                <div className="text-slate-600 text-sm">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div key={feat.id} className="border border-slate-200 rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${feat.color || 'from-amber-500 to-orange-500'}`}>
                  {getIcon(feat.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-slate-600 text-sm">{feat.body}</p>
              </div>
            ))}
          </div>
        )}

        {partnerships.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Strategic Partnerships</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {partnerships.map((p) => (
                <div key={p.id} className="border border-slate-200 rounded-2xl p-6 flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br ${p.color || 'from-blue-500 to-indigo-500'}`}>
                    {getIcon(p.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                    <p className="text-slate-600 text-sm">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}