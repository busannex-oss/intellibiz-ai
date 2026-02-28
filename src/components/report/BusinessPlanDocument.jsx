import React from 'react';
import { format } from 'date-fns';
import { 
  MarketShareChart, CompetitorStrengthChart, BrandStrengthRadar, 
  GrowthProjectionChart, OpportunityScoreChart, RevenueProjectionChart, CashFlowChart
} from './ReportCharts';

export default function BusinessPlanDocument({ project }) {
  const customization = project?.business_plan_customization || {
    included_sections: ['executive_summary', 'market_research', 'business_strategy', 'financial_projections', 'operations', 'risk_analysis'],
    color_theme: 'brand',
    custom_header: {},
    custom_footer: { show_page_numbers: true }
  };

  const getThemeColors = () => {
    const themes = {
      brand: {
        primary: Array.isArray(project?.brand_colors) 
          ? (project.brand_colors.find(c => c.role === 'primary')?.hex || project.brand_colors[0]?.hex || '#7c3aed')
          : (project?.brand_colors?.primary || '#7c3aed'),
        secondary: Array.isArray(project?.brand_colors)
          ? (project.brand_colors.find(c => c.role === 'secondary')?.hex || project.brand_colors[1]?.hex || '#4f46e5')
          : '#4f46e5'
      },
      professional_blue: { primary: '#0ea5e9', secondary: '#06b6d4' },
      executive_navy: { primary: '#1e40af', secondary: '#1e3a8a' },
      modern_purple: { primary: '#7c3aed', secondary: '#8b5cf6' },
      growth_green: { primary: '#10b981', secondary: '#059669' },
      warm_orange: { primary: '#f97316', secondary: '#ea580c' }
    };
    return themes[customization.color_theme] || themes.brand;
  };

  const { primary: brandColor, secondary: secondaryColor } = getThemeColors();
  const shouldInclude = (section) => customization.included_sections.includes(section);

  return (
    <div id="business-plan-content" className="font-sans bg-white">
      <style>{`
        @media print, (prefers-color-scheme: light) {
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      {/* Cover Page */}
      <div 
        className="min-h-[1100px] flex flex-col justify-center items-center text-center p-16 relative page-break-after"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)` }}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>


        <div className="relative z-10">
          {project?.logo_url ? (
            <div className="logo w-56 h-56 mx-auto mb-12 rounded-3xl p-8">
              <img 
                src={project.logo_url} 
                alt={project.business_name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-56 h-56 mx-auto mb-12 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-white/60 text-center">
                <div className="text-6xl font-bold mb-2">{project?.business_name?.[0] || 'B'}</div>
              </div>
            </div>
          )}
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">{project?.business_name}</h1>
          <p className="text-2xl text-white/95 mb-12 font-semibold tracking-tight">{project?.industry}</p>
          <div className="bg-white/25 backdrop-blur-md rounded-3xl px-12 py-6 border-2 border-white/40 shadow-2xl">
            <p className="text-white text-2xl font-bold tracking-tight">Business Plan</p>
          </div>
        </div>

        <div className="mt-auto pt-16 relative z-10">
          <p className="text-white/80 text-base font-medium">
            Generated on {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>

      </div>

      {/* Table of Contents */}
      <div className="p-12 border-b page-break-after">
        {customization.custom_header?.company_name && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">{customization.custom_header.company_name}</h3>
            {customization.custom_header.tagline && (
              <p className="text-sm text-slate-500">{customization.custom_header.tagline}</p>
            )}
            {customization.custom_header.contact_info && (
              <p className="text-xs text-slate-400 mt-1">{customization.custom_header.contact_info}</p>
            )}
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-[-0.02em]">Table of Contents</h2>
        <div className="space-y-4">
          {[
            { id: 'executive_summary', num: '01', title: 'Executive Summary', page: '3' },
            { id: 'market_research', num: '02', title: 'Market Research & Analysis', page: '4' },
            { id: 'business_strategy', num: '03', title: 'Business Strategy & Objectives', page: '6' },
            { id: 'financial_projections', num: '04', title: 'Financial Projections', page: '8' },
            { id: 'operations', num: '05', title: 'Operations & Implementation', page: '10' },
            { id: 'risk_analysis', num: '06', title: 'Risk Analysis & Mitigation', page: '11' },
          ].filter(item => shouldInclude(item.id)).map((item) => (
            <div key={item.num} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-2xl font-bold tracking-[-0.02em]" style={{ color: brandColor }}>{item.num}</span>
              <span className="flex-1 font-medium text-slate-700 tracking-[-0.011em]">{item.title}</span>
              <span className="text-slate-400 font-light">{item.page}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      {shouldInclude('executive_summary') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
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
      )}

      {/* Market Research */}
      {shouldInclude('market_research') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
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
      )}

      {/* Business Strategy */}
      {shouldInclude('business_strategy') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Strategy</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>03</div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">Business Strategy & Objectives</h2>
        </div>

        <div className="space-y-8">
            {project?.business_plan?.mission && (
              <div className="p-8 rounded-2xl border-l-4 shadow-sm" style={{ borderColor: brandColor, backgroundColor: `${brandColor}08` }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: brandColor }}>Mission Statement</p>
                <p className="text-slate-800 text-xl leading-relaxed font-medium">{project.business_plan.mission}</p>
              </div>
            )}
            
            {!project?.business_plan?.mission && (
              <div className="p-8 rounded-2xl border-l-4 shadow-sm" style={{ borderColor: brandColor, backgroundColor: `${brandColor}08` }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: brandColor }}>Mission Statement</p>
                <p className="text-slate-800 text-xl leading-relaxed font-medium">
                  To deliver exceptional value to our customers through innovative solutions in the {project?.industry} industry, 
                  establishing {project?.business_name} as a trusted leader committed to quality, growth, and sustainable success.
                </p>
              </div>
            )}

            {project?.business_plan?.vision && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></span>
                  Vision
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed">{project.business_plan.vision}</p>
              </div>
            )}
            
            {!project?.business_plan?.vision && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></span>
                  Vision
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  To become the premier choice in {project?.industry}, recognized for innovation, customer excellence, 
                  and transformative impact on the market we serve.
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Core Values</h3>
              <div className="grid gap-4">
                {(project?.business_plan?.core_values?.length > 0 ? project.business_plan.core_values : [
                  'Customer Excellence - Delivering exceptional value and service',
                  'Innovation - Continuously improving and staying ahead of market trends',
                  'Integrity - Operating with transparency and ethical practices',
                  'Growth Mindset - Embracing challenges as opportunities for development'
                ]).map((value, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: brandColor }}>
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed pt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Strategic Objectives</h3>
              <div className="grid gap-4">
                {(project?.business_plan?.objectives?.length > 0 ? project.business_plan.objectives : [
                  'Achieve market leadership position within 24 months through differentiated value proposition',
                  'Build a loyal customer base of 10,000+ active users by end of Year 2',
                  'Establish strategic partnerships with key industry players to accelerate growth',
                  'Maintain profitability with 25%+ profit margins by Year 3',
                  'Develop scalable operations infrastructure to support 10x growth'
                ]).map((obj, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0" style={{ backgroundColor: brandColor }}>{i + 1}</span>
                    <span className="text-slate-800 text-base leading-relaxed pt-1.5 font-medium">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {project.business_plan.success_metrics?.length > 0 && (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-xl font-bold text-emerald-900 mb-4">Key Success Metrics</h3>
                <ul className="space-y-3">
                  {project.business_plan.success_metrics.map((metric, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 text-base">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="leading-relaxed">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Competitive Advantages</h3>
              <ul className="space-y-3">
                {(project?.business_plan?.competitive_advantages?.length > 0 
                  ? project.business_plan.competitive_advantages 
                  : project?.competitive_advantages || [
                    'First-mover advantage in emerging market segment',
                    'Superior technology platform and user experience',
                    'Strategic pricing model optimized for market penetration',
                    'Strong brand identity and customer-centric approach'
                  ]
                ).map((adv, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-base p-4 bg-white rounded-lg border border-slate-200">
                    <span style={{ color: brandColor }} className="font-bold text-lg">✓</span>
                    <span className="leading-relaxed">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>
      )}

      {/* Financial Analysis & Projections */}
      {shouldInclude('financial_projections') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Financial Analysis</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>04</div>
          <h2 className="text-3xl font-bold text-slate-800">Financial Projections & Analysis</h2>
        </div>
        
        <div className="space-y-8">
          {/* Revenue Projection Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">3-Year Revenue Projection</h3>
            <RevenueProjectionChart financialData={project?.financial_data} brandColor={brandColor} />
            <p className="text-sm text-slate-500 mt-4">
              Projected revenue growth trajectory showing sustainable scaling with controlled expense management and increasing profitability.
            </p>
          </div>

          {/* Cash Flow Projection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">12-Month Cash Flow Forecast</h3>
            <CashFlowChart cashFlowData={project?.financial_data?.cash_flow_projections} brandColor={brandColor} />
            <p className="text-sm text-slate-500 mt-4">
              Cumulative cash position demonstrating path to positive cash flow and financial sustainability.
            </p>
          </div>
          {/* Key Metrics */}
          {project?.financial_data?.key_metrics && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Burn Rate</p>
                <p className="text-2xl font-bold text-blue-900">${project.financial_data.key_metrics.burn_rate?.toLocaleString()}/mo</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Runway</p>
                <p className="text-2xl font-bold text-emerald-900">{project.financial_data.key_metrics.runway_months} months</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">Break-Even</p>
                <p className="text-2xl font-bold text-purple-900">Month {project.financial_data.key_metrics.break_even_month}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">3-Year ROI</p>
                <p className="text-2xl font-bold text-amber-900">{project.financial_data.key_metrics.roi_3year}%</p>
              </div>
            </div>
          )}

          {/* P&L Statement */}
           {project?.financial_data?.pl_statement && (
             <div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">3-Year Profit & Loss Statement</h3>
               <div className="bg-white rounded-xl border border-slate-200 p-6">
                 <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-4 mb-6">
                     <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                       <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-2">Year 1 Revenue</p>
                       <p className="text-2xl font-bold text-blue-900">${project.financial_data.pl_statement.year_1?.revenue?.toLocaleString()}</p>
                     </div>
                     <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                       <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-2">Year 2 Revenue</p>
                       <p className="text-2xl font-bold text-purple-900">${project.financial_data.pl_statement.year_2?.revenue?.toLocaleString()}</p>
                     </div>
                     <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                       <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-2">Year 3 Revenue</p>
                       <p className="text-2xl font-bold text-emerald-900">${project.financial_data.pl_statement.year_3?.revenue?.toLocaleString()}</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                     <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                       <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-2">Year 1 Net Income</p>
                       <p className="text-2xl font-bold text-emerald-900">${project.financial_data.pl_statement.year_1?.net_income?.toLocaleString()}</p>
                     </div>
                     <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                       <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-2">Year 2 Net Income</p>
                       <p className="text-2xl font-bold text-emerald-900">${project.financial_data.pl_statement.year_2?.net_income?.toLocaleString()}</p>
                     </div>
                     <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                       <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-2">Year 3 Net Income</p>
                       <p className="text-2xl font-bold text-emerald-900">${project.financial_data.pl_statement.year_3?.net_income?.toLocaleString()}</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

          {/* Balance Sheet */}
          {project?.financial_data?.balance_sheet && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Balance Sheet Overview</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {project.financial_data.balance_sheet.assets && (
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">Assets</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(project.financial_data.balance_sheet.assets).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-blue-700 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-semibold text-blue-900">${value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {project.financial_data.balance_sheet.liabilities && (
                  <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                    <h4 className="font-bold text-red-900 mb-3">Liabilities</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(project.financial_data.balance_sheet.liabilities).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-red-700 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-semibold text-red-900">${value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {project.financial_data.balance_sheet.equity && (
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                    <h4 className="font-bold text-emerald-900 mb-3">Equity</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(project.financial_data.balance_sheet.equity).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-emerald-700 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-semibold text-emerald-900">${value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Cash Flow Table */}
          {project?.financial_data?.cash_flow_projections?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">12-Month Cash Flow Projection</h3>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Month</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Cash In</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Cash Out</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Net Flow</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.financial_data.cash_flow_projections.map((month, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3 text-slate-700 font-medium">{month.month}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                          ${month.cash_in?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600 font-medium">
                          ${month.cash_out?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          ${month.net_cash_flow?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-3 text-right font-bold" style={{ 
                          color: month.cumulative_cash >= 0 ? '#10b981' : '#ef4444' 
                        }}>
                          ${month.cumulative_cash?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Risks & Opportunities */}
          <div className="grid md:grid-cols-2 gap-6">
            {project?.financial_data?.risks && (
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-4">Financial Risks</h3>
                <ul className="space-y-2">
                  {project.financial_data.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                      <span className="text-red-600 font-bold">⚠</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project?.financial_data?.opportunities && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-900 mb-4">Growth Opportunities</h3>
                <ul className="space-y-2">
                  {project.financial_data.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                      <span className="text-emerald-600 font-bold">✓</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {project?.financial_data?.recommendations && (
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Strategic Financial Recommendations</h3>
              <ul className="space-y-3">
                {project.financial_data.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" 
                      style={{ backgroundColor: brandColor }}>
                      {i + 1}
                    </span>
                    <span className="text-slate-700 pt-0.5">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Operations */}
      {shouldInclude('operations') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
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
      )}

      {/* Risk Analysis */}
      {shouldInclude('risk_analysis') && (
      <div className="p-12 border-b page-break-after">
        <div className="mb-8">
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
      )}

      {/* Footer */}
      <div className="p-12" style={{ background: `linear-gradient(135deg, ${brandColor}15 0%, ${secondaryColor}15 100%)` }}>
        <div className="flex items-center justify-between">
          {customization.custom_footer?.text && (
            <p className="text-sm text-slate-600 font-medium">{customization.custom_footer.text}</p>
          )}
          <div className={customization.custom_footer?.text ? "text-right" : "text-right ml-auto"}>
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