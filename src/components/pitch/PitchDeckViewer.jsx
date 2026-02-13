import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Target, DollarSign, Rocket, Award, Zap, BarChart3 } from 'lucide-react';

export default function PitchDeckViewer({ deck }) {
  const getThemeStyles = (theme) => {
    const themes = {
      professional: {
        gradient: 'from-blue-900 via-blue-800 to-slate-900',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-500/20'
      },
      modern: {
        gradient: 'from-slate-900 via-slate-800 to-slate-900',
        accent: 'text-emerald-400',
        accentBg: 'bg-emerald-500/20'
      },
      vibrant: {
        gradient: 'from-purple-900 via-pink-900 to-slate-900',
        accent: 'text-pink-400',
        accentBg: 'bg-pink-500/20'
      },
      minimal: {
        gradient: 'from-slate-800 via-slate-700 to-slate-800',
        accent: 'text-slate-300',
        accentBg: 'bg-slate-500/20'
      }
    };
    return themes[theme] || themes.professional;
  };

  const theme = getThemeStyles(deck.theme);

  return (
    <div className="space-y-6">
      {/* Cover Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px] flex flex-col items-center justify-center text-center`}>
        <Zap className={`w-20 h-20 ${theme.accent} mb-8`} />
        <h1 className="text-6xl font-bold text-white mb-4">{deck.cover?.title}</h1>
        <p className="text-2xl text-slate-300 mb-8">{deck.cover?.tagline}</p>
        <p className="text-slate-400">{deck.cover?.presenter}</p>
      </Card>

      {/* Problem Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <Target className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.problem?.title}</h2>
        </div>
        <p className="text-2xl text-slate-300 mb-8">{deck.problem?.headline}</p>
        <div className="space-y-4">
          {deck.problem?.pain_points?.map((point, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className={`w-8 h-8 rounded-full ${theme.accentBg} flex items-center justify-center flex-shrink-0 text-white font-bold`}>
                {i + 1}
              </div>
              <p className="text-lg text-slate-200">{point}</p>
            </div>
          ))}
        </div>
        {deck.problem?.why_now && (
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 font-semibold mb-2">Why Now?</p>
            <p className="text-slate-300">{deck.problem.why_now}</p>
          </div>
        )}
      </Card>

      {/* Solution Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <Zap className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.solution?.title}</h2>
        </div>
        <p className="text-2xl text-slate-300 mb-8">{deck.solution?.headline}</p>
        <p className="text-lg text-slate-200 mb-8">{deck.solution?.description}</p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
            <ul className="space-y-3">
              {deck.solution?.key_features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className={`${theme.accent} mt-1`}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Differentiators</h3>
            <ul className="space-y-3">
              {deck.solution?.differentiators?.map((diff, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className={`${theme.accent} mt-1`}>★</span>
                  {diff}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Market Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <TrendingUp className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.market?.title}</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-slate-800/50 rounded-lg text-center">
            <p className="text-sm text-slate-400 mb-2">TAM</p>
            <p className={`text-3xl font-bold ${theme.accent}`}>{deck.market?.tam}</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-lg text-center">
            <p className="text-sm text-slate-400 mb-2">SAM</p>
            <p className={`text-3xl font-bold ${theme.accent}`}>{deck.market?.sam}</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-lg text-center">
            <p className="text-sm text-slate-400 mb-2">SOM</p>
            <p className={`text-3xl font-bold ${theme.accent}`}>{deck.market?.som}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Market Trends</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {deck.market?.trends?.map((trend, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-slate-200">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Business Model Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <DollarSign className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.business_model?.title}</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Revenue Streams</h3>
          <div className="space-y-3">
            {deck.business_model?.revenue_streams?.map((stream, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-slate-200">{stream}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Pricing Strategy</h3>
            <p className="text-slate-300">{deck.business_model?.pricing}</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Customer Acquisition</h3>
            <p className="text-slate-300">{deck.business_model?.customer_acquisition}</p>
          </div>
        </div>
      </Card>

      {/* Competition Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <Award className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.competition?.title}</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Our Competitive Advantages</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {deck.competition?.advantages?.map((adv, i) => (
              <div key={i} className={`p-4 ${theme.accentBg} rounded-lg border border-current`}>
                <p className="text-white font-medium">{adv}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-800/50 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Market Position</h3>
          <p className="text-slate-300">{deck.competition?.positioning}</p>
        </div>
      </Card>

      {/* Financials Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <BarChart3 className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.financials?.title}</h2>
        </div>

        {deck.financials?.projections && (
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-4">
              {deck.financials.projections.map((year, i) => (
                <div key={i} className="p-6 bg-slate-800/50 rounded-lg text-center">
                  <p className="text-sm text-slate-400 mb-2">Year {i + 1}</p>
                  <p className={`text-2xl font-bold ${theme.accent}`}>${year.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {deck.financials?.key_metrics?.map((metric, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-slate-200">{metric}</p>
            </div>
          ))}
        </div>

        {deck.financials?.path_to_profit && (
          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 font-semibold mb-2">Path to Profitability</p>
            <p className="text-slate-300">{deck.financials.path_to_profit}</p>
          </div>
        )}
      </Card>

      {/* Team Slide */}
      {deck.team && (
        <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
              <Users className={`w-8 h-8 ${theme.accent}`} />
            </div>
            <h2 className="text-4xl font-bold text-white">{deck.team?.title}</h2>
          </div>

          {deck.team?.members && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {deck.team.members.map((member, i) => (
                <div key={i} className="p-6 bg-slate-800/50 rounded-lg">
                  <p className="text-xl font-bold text-white mb-2">{member.name}</p>
                  <p className={`text-sm ${theme.accent} mb-3`}>{member.role}</p>
                  <p className="text-slate-300">{member.bio}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 bg-slate-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Why We're Uniquely Qualified</h3>
            <p className="text-slate-300">{deck.team?.why_us}</p>
          </div>
        </Card>
      )}

      {/* The Ask Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px]`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${theme.accentBg} flex items-center justify-center`}>
            <Rocket className={`w-8 h-8 ${theme.accent}`} />
          </div>
          <h2 className="text-4xl font-bold text-white">{deck.ask?.title}</h2>
        </div>

        <div className="text-center mb-12">
          <p className="text-slate-400 mb-4">We are raising</p>
          <p className={`text-6xl font-bold ${theme.accent}`}>{deck.ask?.amount}</p>
        </div>

        {deck.ask?.use_of_funds && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Use of Funds</h3>
            <div className="space-y-3">
              {deck.ask.use_of_funds.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-200">{item.category}</span>
                  <span className={`font-bold ${theme.accent}`}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {deck.ask?.outcomes && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Expected Outcomes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {deck.ask.outcomes.map((outcome, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-200">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Closing Slide */}
      <Card className={`pitch-slide border-0 bg-gradient-to-br ${theme.gradient} p-16 min-h-[600px] flex flex-col items-center justify-center text-center`}>
        <h2 className="text-5xl font-bold text-white mb-8">{deck.closing?.title}</h2>
        <p className="text-2xl text-slate-300 mb-12 max-w-3xl">{deck.closing?.vision}</p>
        <div className={`text-xl ${theme.accent} font-semibold mb-8`}>{deck.closing?.cta}</div>
        <p className="text-slate-400">{deck.closing?.contact}</p>
      </Card>
    </div>
  );
}