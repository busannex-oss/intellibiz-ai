import React from 'react';
import { format } from 'date-fns';
import { 
  MarketShareChart, CompetitorStrengthChart, BrandStrengthRadar, 
  GrowthProjectionChart, OpportunityScoreChart 
} from './ReportCharts';

export default function BusinessPlanDocument({ project }) {
  const getPrimaryColor = () => {
    if (Array.isArray(project?.brand_colors)) {
      const primary = project.brand_colors.find(c => c.role === 'primary');
      return primary?.hex || project.brand_colors[0]?.hex || '#7c3aed';
    }
    return project?.brand_colors?.primary || '#7c3aed';
  };
  
  const getSecondaryColor = () => {
    if (Array.isArray(project?.brand_colors)) {
      const secondary = project.brand_colors.find(c => c.role === 'secondary');
      return secondary?.hex || project.brand_colors[1]?.hex || '#4f46e5';
    }
    return '#4f46e5';
  };
  
  const brandColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();

  return (
    <div id="business-plan-content" className="font-sans">
      {/* Cover Page */}
      <div 
        className="min-h-[800px] flex flex-col justify-center items-center text-center p-12 relative"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)` }}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        

        <div className="relative z-10">
          {project?.logo_url ? (
            <div className="w-48 h-48 mx-auto mb-8 rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl flex items-center justify-center">
              <img 
                src={project.logo_url} 
                alt={project.business_name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-white/10');
                }}
              />
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-white/50 text-center">
                <div className="text-4xl mb-2">{project?.business_name?.[0] || 'B'}</div>
              </div>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-[-0.03em]">{project?.business_name}</h1>
          <p className="text-xl text-white/90 mb-8 font-medium tracking-[-0.011em]">{project?.industry}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-10 py-5 border border-white/30">
            <p className="text-white text-xl font-semibold">Business Plan</p>
          </div>
        </div>
        
        <div className="mt-auto pt-12 relative z-10">
          <p className="text-white/70 text-sm">
            Generated on {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
        
      </div>

      {/* Table of Contents */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url ? (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img 
                src={project.logo_url} 
                alt="" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold text-sm">
              {project?.business_name?.[0] || 'B'}
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">{project?.business_name}</p>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-[-0.02em]">Table of Contents</h2>
        <div className="space-y-4">
          {[
            { num: '01', title: 'Executive Summary', page: '3' },
            { num: '02', title: 'Market Research & Analysis', page: '4' },
            { num: '03', title: 'Business Strategy & Objectives', page: '6' },
            { num: '04', title: 'Financial Projections', page: '8' },
            { num: '05', title: 'Operations & Implementation', page: '10' },
            { num: '06', title: 'Risk Analysis & Mitigation', page: '11' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-2xl font-bold tracking-[-0.02em]" style={{ color: brandColor }}>{item.num}</span>
              <span className="flex-1 font-medium text-slate-700 tracking-[-0.011em]">{item.title}</span>
              <span className="text-slate-400 font-light">{item.page}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Executive Summary</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>01</div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-[-0.02em]">Executive Summary</h2>
        </div>
        
        <div className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-lg text-slate-600 leading-[1.7] tracking-[-0.011em]">
              {project?.description || 'No description available.'}
            </p>
          </div>

          {project?.unique_value_proposition && (
            <div className="p-8 rounded-2xl border-l-4 shadow-sm" style={{ borderColor: brandColor, backgroundColor: `${brandColor}08` }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: brandColor }}>Unique Value Proposition</p>
              <p className="text-lg text-slate-700 font-medium">{project.unique_value_proposition}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Industry</p>
              <p className="text-xl font-bold text-slate-800">{project?.industry}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Target Audience</p>
              <p className="text-xl font-bold text-slate-800">{project?.target_audience || 'General Market'}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Location</p>
              <p className="text-xl font-bold text-slate-800">{project?.location || 'Global'}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Status</p>
              <p className="text-xl font-bold text-slate-800 capitalize">{project?.status || 'In Progress'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Business Readiness</h3>
            <BrandStrengthRadar project={project} brandColor={brandColor} />
          </div>
        </div>
      </div>

      {/* Market Research */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Market Analysis</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>02</div>
          <h2 className="text-3xl font-bold text-slate-800">Market Research & Analysis</h2>
        </div>
        
        {project?.market_research ? (
          <div className="space-y-8">
            {project.market_research.industry_overview && (
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Industry Overview</h3>
                <p className="text-slate-600 leading-relaxed">{project.market_research.industry_overview}</p>
              </div>
            )}

            {project.market_research.market_size && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 text-center border border-emerald-200">
                  <p className="text-sm text-emerald-600 uppercase tracking-wide mb-2">Market Size</p>
                  <p className="text-3xl font-bold text-emerald-700">{project.market_research.market_size}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
                  <p className="text-sm text-blue-600 uppercase tracking-wide mb-2">Growth Trends</p>
                  <p className="text-3xl font-bold text-blue-700">{project.market_research.growth_trends || 'Growing'}</p>
                </div>
              </div>
            )}
            
            {project.market_research.competitors?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Competitive Landscape</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Market Share Distribution</p>
                    <MarketShareChart competitors={project.market_research.competitors} brandColor={brandColor} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Competitor Analysis</p>
                    <CompetitorStrengthChart competitors={project.market_research.competitors} brandColor={brandColor} />
                  </div>
                </div>
              </div>
            )}

            {project.market_research.competitors?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Competitors</h3>
                <div className="space-y-4">
                  {project.market_research.competitors.slice(0, 3).map((comp, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-slate-800">{comp.name}</p>
                        {comp.market_share && <span className="text-sm text-slate-500">{comp.market_share} market share</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-emerald-600 font-medium mb-1">Strengths</p>
                          <ul className="text-slate-600 list-disc list-inside">
                            {comp.strengths?.slice(0, 2).map((s, j) => <li key={j}>{s}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-red-600 font-medium mb-1">Weaknesses</p>
                          <ul className="text-slate-600 list-disc list-inside">
                            {comp.weaknesses?.slice(0, 2).map((w, j) => <li key={j}>{w}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.market_research.opportunities?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Market Opportunities</h3>
                <ul className="space-y-2">
                  {project.market_research.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                      <span className="text-slate-600">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic">Market research data not yet generated.</p>
        )}
      </div>

      {/* Business Strategy */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Strategy</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>03</div>
          <h2 className="text-3xl font-bold text-slate-800">Business Strategy & Objectives</h2>
        </div>
        
        {project?.business_plan ? (
          <div className="space-y-8">
            {project.business_plan.mission && (
              <div className="p-6 rounded-xl" style={{ backgroundColor: `${brandColor}10` }}>
                <p className="text-sm font-semibold mb-2" style={{ color: brandColor }}>Mission Statement</p>
                <p className="text-slate-700 text-lg">{project.business_plan.mission}</p>
              </div>
            )}

            {project.business_plan.vision && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Vision</h3>
                <p className="text-slate-600">{project.business_plan.vision}</p>
              </div>
            )}

            {project.business_plan.objectives?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Key Objectives</h3>
                <div className="grid gap-3">
                  {project.business_plan.objectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brandColor }}>{i + 1}</span>
                      <span className="text-slate-700">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.business_plan.competitive_advantages?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Competitive Advantages</h3>
                <ul className="space-y-2">
                  {project.business_plan.competitive_advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <span style={{ color: brandColor }}>✓</span>
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 italic">Business strategy not yet generated.</p>
        )}
      </div>

      {/* Financial Projections */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Projections</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>04</div>
          <h2 className="text-3xl font-bold text-slate-800">Financial Projections</h2>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Growth Projections</h3>
            <GrowthProjectionChart project={project} brandColor={brandColor} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <p className="text-sm text-blue-600 uppercase tracking-wide mb-2">Year 1 Target</p>
              <p className="text-2xl font-bold text-blue-700">Achieve Market Entry</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
              <p className="text-sm text-emerald-600 uppercase tracking-wide mb-2">Year 2 Target</p>
              <p className="text-2xl font-bold text-emerald-700">Scale Operations</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <p className="text-sm text-purple-600 uppercase tracking-wide mb-2">Year 3 Target</p>
              <p className="text-2xl font-bold text-purple-700">Market Leadership</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Operations</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>05</div>
          <h2 className="text-3xl font-bold text-slate-800">Operations & Implementation</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 mb-3">Implementation Timeline</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: brandColor }}>1</span>
                <div>
                  <p className="font-medium text-slate-800">Phase 1: Foundation</p>
                  <p className="text-sm text-slate-600">Establish core operations, team, and infrastructure</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: brandColor }}>2</span>
                <div>
                  <p className="font-medium text-slate-800">Phase 2: Launch</p>
                  <p className="text-sm text-slate-600">Market entry and customer acquisition</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: brandColor }}>3</span>
                <div>
                  <p className="font-medium text-slate-800">Phase 3: Growth</p>
                  <p className="text-sm text-slate-600">Scale operations and expand market reach</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Risk Management</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>06</div>
          <h2 className="text-3xl font-bold text-slate-800">Risk Analysis & Mitigation</h2>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Opportunity Score</h3>
          <OpportunityScoreChart project={project} brandColor={brandColor} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-12" style={{ background: `linear-gradient(135deg, ${brandColor}15 0%, ${secondaryColor}15 100%)` }}>
        <div className="flex items-center justify-between">
          {project?.logo_url && (
            <div className="w-20 h-20 flex items-center justify-center p-3">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <div className="text-right">
            <p className="text-sm text-slate-600 font-medium mb-1">
              {project?.business_name} Business Plan
            </p>
            <p className="text-xs text-slate-400">
              Generated by BrandForge AI • © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}