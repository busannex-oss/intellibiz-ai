import React from 'react';
import { format } from 'date-fns';

export default function ReportDocument({ project }) {
  const brandColor = project?.brand_colors?.primary || '#7c3aed';

  return (
    <div id="report-content" className="font-sans">
      {/* Cover Page */}
      <div 
        className="min-h-[800px] flex flex-col justify-center items-center text-center p-12"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)` }}
      >
        {project?.logo_url && (
          <img 
            src={project.logo_url} 
            alt={project.business_name} 
            className="w-32 h-32 object-contain mb-8 rounded-2xl bg-white p-4"
          />
        )}
        <h1 className="text-5xl font-bold text-white mb-4">{project?.business_name}</h1>
        <p className="text-xl text-white/90 mb-8">{project?.industry}</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4">
          <p className="text-white text-lg">Business Plan & Brand Kit</p>
        </div>
        <p className="text-white/70 mt-auto pt-12">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Table of Contents */}
      <div className="p-12 border-b">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Table of Contents</h2>
        <div className="space-y-3">
          {[
            { num: '1', title: 'Executive Summary', page: '3' },
            { num: '2', title: 'Market Research & Analysis', page: '4' },
            { num: '3', title: 'Business Strategy', page: '6' },
            { num: '4', title: 'Marketing Plan', page: '8' },
            { num: '5', title: 'Financial Projections', page: '10' },
            { num: '6', title: 'Brand Identity Kit', page: '12' },
            { num: '7', title: 'Digital Assets', page: '14' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-4">
              <span className="text-violet-600 font-bold">{item.num}</span>
              <span className="flex-1 border-b border-dotted border-slate-300">{item.title}</span>
              <span className="text-slate-500">{item.page}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-12 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>1</div>
          <h2 className="text-2xl font-bold text-slate-800">Executive Summary</h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            {project?.description || 'No description available.'}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-500 mb-1">Industry</p>
              <p className="text-lg font-semibold text-slate-800">{project?.industry}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-500 mb-1">Target Audience</p>
              <p className="text-lg font-semibold text-slate-800">{project?.target_audience || 'General Market'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-500 mb-1">Location</p>
              <p className="text-lg font-semibold text-slate-800">{project?.location || 'Global'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <p className="text-lg font-semibold text-slate-800 capitalize">{project?.status || 'In Progress'}</p>
            </div>
          </div>

          {project?.unique_value_proposition && (
            <div className="mt-8 p-6 rounded-xl border-l-4" style={{ borderColor: brandColor, backgroundColor: `${brandColor}10` }}>
              <p className="text-sm font-semibold mb-2" style={{ color: brandColor }}>Unique Value Proposition</p>
              <p className="text-slate-700">{project.unique_value_proposition}</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Research */}
      <div className="p-12 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>2</div>
          <h2 className="text-2xl font-bold text-slate-800">Market Research & Analysis</h2>
        </div>
        
        {project?.market_research ? (
          <div className="space-y-8">
            {project.market_research.industry_overview && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Industry Overview</h3>
                <p className="text-slate-600">{project.market_research.industry_overview}</p>
              </div>
            )}

            {project.market_research.market_size && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-emerald-600 mb-1">Market Size</p>
                  <p className="text-2xl font-bold text-emerald-700">{project.market_research.market_size}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-blue-600 mb-1">Growth Trends</p>
                  <p className="text-2xl font-bold text-blue-700">{project.market_research.growth_trends || 'Growing'}</p>
                </div>
              </div>
            )}

            {project.market_research.competitors?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Competitor Analysis</h3>
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

      {/* Business Plan */}
      <div className="p-12 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>3</div>
          <h2 className="text-2xl font-bold text-slate-800">Business Strategy</h2>
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
          <p className="text-slate-500 italic">Business plan not yet generated.</p>
        )}
      </div>

      {/* Brand Identity Kit */}
      <div className="p-12 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>6</div>
          <h2 className="text-2xl font-bold text-slate-800">Brand Identity Kit</h2>
        </div>
        
        <div className="space-y-8">
          {/* Logo */}
          {project?.logo_url && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Primary Logo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-8 flex items-center justify-center">
                  <img src={project.logo_url} alt="Logo" className="max-h-32 object-contain" />
                </div>
                <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center">
                  <img src={project.logo_url} alt="Logo on dark" className="max-h-32 object-contain" />
                </div>
              </div>
            </div>
          )}

          {/* Brand Colors */}
          {project?.brand_colors && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Brand Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                {project.brand_colors.primary && (
                  <div>
                    <div className="h-24 rounded-xl mb-2" style={{ backgroundColor: project.brand_colors.primary }}></div>
                    <p className="text-sm font-medium text-slate-800">Primary</p>
                    <p className="text-xs text-slate-500 uppercase">{project.brand_colors.primary}</p>
                  </div>
                )}
                {project.brand_colors.secondary && (
                  <div>
                    <div className="h-24 rounded-xl mb-2" style={{ backgroundColor: project.brand_colors.secondary }}></div>
                    <p className="text-sm font-medium text-slate-800">Secondary</p>
                    <p className="text-xs text-slate-500 uppercase">{project.brand_colors.secondary}</p>
                  </div>
                )}
                {project.brand_colors.accent && (
                  <div>
                    <div className="h-24 rounded-xl mb-2" style={{ backgroundColor: project.brand_colors.accent }}></div>
                    <p className="text-sm font-medium text-slate-800">Accent</p>
                    <p className="text-xs text-slate-500 uppercase">{project.brand_colors.accent}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Brand Personality */}
          {project?.brand_personality && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Brand Personality</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(project.brand_personality).map(([trait, value]) => (
                  <div key={trait} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 capitalize">{trait}</p>
                    <p className="font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digital Assets */}
      <div className="p-12 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandColor }}>7</div>
          <h2 className="text-2xl font-bold text-slate-800">Digital Assets</h2>
        </div>
        
        {project?.social_media_assets?.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Social Media Assets</h3>
            <div className="grid grid-cols-2 gap-4">
              {project.social_media_assets.map((asset, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4">
                  <p className="font-medium text-slate-800 mb-2 capitalize">{asset.platform}</p>
                  {asset.header_url && (
                    <img src={asset.header_url} alt={`${asset.platform} header`} className="w-full h-24 object-cover rounded-lg mb-2" />
                  )}
                  {asset.profile_url && (
                    <img src={asset.profile_url} alt={`${asset.platform} profile`} className="w-16 h-16 object-cover rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {project?.website_content && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Website Content</h3>
            <div className="bg-slate-50 rounded-xl p-6">
              {project.website_content.hero?.headline && (
                <div className="mb-4">
                  <p className="text-sm text-slate-500">Headline</p>
                  <p className="text-xl font-bold text-slate-800">{project.website_content.hero.headline}</p>
                </div>
              )}
              {project.website_content.hero?.subheadline && (
                <div>
                  <p className="text-sm text-slate-500">Subheadline</p>
                  <p className="text-slate-600">{project.website_content.hero.subheadline}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-12 text-center" style={{ backgroundColor: `${brandColor}10` }}>
        <p className="text-sm text-slate-500 mb-2">
          This report was generated by BrandForge AI
        </p>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {project?.business_name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}