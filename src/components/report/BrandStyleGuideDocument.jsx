import React from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

export default function BrandStyleGuideDocument({ project }) {
  const getPrimaryColor = () => {
    if (Array.isArray(project?.brand_colors)) {
      const primary = project.brand_colors.find(c => c.role === 'primary');
      return primary?.hex || project.brand_colors[0]?.hex || '#7c3aed';
    }
    return '#7c3aed';
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

  const brandDos = [
    'Always use the logo in its original proportions',
    'Maintain minimum clear space around the logo equal to the height of the icon',
    'Use approved brand colors consistently across all materials',
    'Ensure adequate contrast between logo and background',
    'Use high-resolution logo files for print (300 DPI minimum)',
    'Keep typography consistent with brand guidelines',
    'Apply brand voice and tone in all communications',
    'Use approved imagery that aligns with brand personality'
  ];

  const brandDonts = [
    'Never stretch, skew, or distort the logo',
    'Never change the logo colors outside approved variations',
    'Never place the logo on busy or low-contrast backgrounds',
    'Never add effects like shadows, outlines, or gradients to the logo',
    'Never rotate or flip the logo',
    'Never use low-resolution or pixelated versions',
    'Never recreate the logo using different fonts',
    'Never alter the spacing between logo elements'
  ];

  return (
    <div id="brand-style-guide-content" className="font-sans bg-white">
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
            <div className="w-56 h-56 mx-auto mb-12 rounded-3xl bg-transparent p-8 flex items-center justify-center">
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
          <div className="bg-white/25 backdrop-blur-md rounded-3xl px-12 py-6 mb-8 border-2 border-white/40 shadow-2xl">
            <p className="text-white text-2xl font-bold tracking-tight">Brand Style Guide</p>
          </div>
          <p className="text-white/90 text-xl font-medium mb-2">Official Brand Identity & Usage Standards</p>
          <p className="text-white/70 mt-8 text-base">Version 1.0 • {format(new Date(), 'MMMM yyyy')}</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url ? (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
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
            { num: '01', title: 'Introduction & Brand Promise', page: '3' },
            { num: '02', title: 'Logo & Visual Identity', page: '4' },
            { num: '03', title: 'Color Palette & Usage', page: '6' },
            { num: '04', title: 'Typography Guidelines', page: '8' },
            { num: '05', title: 'Brand Personality & Voice', page: '9' },
            { num: '06', title: 'Do\'s & Don\'ts', page: '10' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-2xl font-bold tracking-[-0.02em]" style={{ color: brandColor }}>{item.num}</span>
              <span className="flex-1 font-medium text-slate-700 tracking-[-0.011em]">{item.title}</span>
              <span className="text-slate-400 font-light">{item.page}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Introduction */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Introduction</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>01</div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-[-0.02em]">Introduction & Brand Promise</h2>
        </div>

        <div className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed">
              This brand style guide is the official reference for maintaining consistent visual and 
              verbal identity across all {project?.business_name} communications and touchpoints. 
              Consistency in brand presentation builds recognition, trust, and professional credibility.
            </p>
          </div>

          {project?.unique_value_proposition && (
            <div className="bg-slate-50 rounded-xl p-6 border-l-4" style={{ borderColor: brandColor }}>
              <h3 className="font-semibold text-slate-800 mb-2">Brand Promise</h3>
              <p className="text-slate-600">{project.unique_value_proposition}</p>
            </div>
          )}

          {project?.brand_personality && (
            <div className="grid grid-cols-2 gap-6">
              {project.brand_personality.traits && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Brand Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.brand_personality.traits.map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.brand_personality.tone_of_voice && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Tone of Voice</h3>
                  <p className="text-slate-600 text-sm">{project.brand_personality.tone_of_voice}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logo & Visual Identity */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Logo Guidelines</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>02</div>
          <h2 className="text-3xl font-bold text-slate-800">Logo & Visual Identity</h2>
        </div>
        
        {project?.logo_url && (
          <div className="space-y-8">
            {/* Logo Variations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Primary Logo</h3>
              <p className="text-slate-600 text-sm mb-4">The logo works on both light and dark backgrounds with proper spacing.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-12 flex items-center justify-center min-h-[250px]">
                  <img src={project.logo_url} alt="Logo on light background" className="max-w-[200px] max-h-[180px] object-contain" />
                </div>
                <div className="bg-slate-900 rounded-2xl p-12 flex items-center justify-center min-h-[250px]">
                  <img src={project.logo_url} alt="Logo on dark background" className="max-w-[200px] max-h-[180px] object-contain" />
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center mt-4">Always use the logo with transparent background and maintain proper spacing</p>
            </div>

            {/* Clear Space */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Clear Space & Spacing</h3>
              <div className="bg-slate-50 rounded-xl p-8">
                <div className="text-center mb-4">
                  <div className="inline-block border-2 border-dashed border-slate-400 p-12 rounded-xl bg-white">
                    <img src={project.logo_url} alt="" className="w-32 h-32 object-contain mx-auto" />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ Maintain adequate clear space around logo (minimum 20% of logo height on all sides)</p>
                  <p>✓ Never crop or crowd the logo against other elements</p>
                  <p>✓ Ensure logo has breathing room in all applications</p>
                  <p>✓ Use transparent PNG format to prevent white boxes</p>
                </div>
              </div>
            </div>

            {/* Minimum Size */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Minimum Size Requirements</h3>
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <img src={project.logo_url} alt="" className="w-24 h-24 object-contain mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">Digital: 80px minimum</p>
                </div>
                <div className="text-center">
                  <img src={project.logo_url} alt="" className="w-16 h-16 object-contain mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">Print: 25mm minimum</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Color Palette */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Color System</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>03</div>
          <h2 className="text-3xl font-bold text-slate-800">Color Palette & Usage</h2>
        </div>
        
        {Array.isArray(project?.brand_colors) && project.brand_colors.length > 0 && (
          <div className="space-y-8">
            {/* Color Swatches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.brand_colors.map((color, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-32" style={{ backgroundColor: color.hex }} />
                  <div className="bg-white p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-800">{color.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{color.role}</p>
                      </div>
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded uppercase">{color.hex}</span>
                    </div>
                    {color.psychology && (
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Why This Color</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{color.psychology}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Color Usage */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Color Application Guidelines</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Primary</p>
                  <p className="text-slate-500">Headers, CTAs, key elements</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Secondary</p>
                  <p className="text-slate-500">Supporting elements, accents</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Neutral</p>
                  <p className="text-slate-500">Text, backgrounds, borders</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Typography</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>04</div>
          <h2 className="text-3xl font-bold text-slate-800">Typography Guidelines</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Typeface System</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Headlines</p>
                <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>Use consistent, modern typography</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Body Text</p>
                <p className="text-base text-slate-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>Body copy should be clear and readable at all sizes. Maintain proper line height and spacing for optimal readability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Personality */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Voice & Tone</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>05</div>
          <h2 className="text-3xl font-bold text-slate-800">Brand Personality & Voice</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Communication Style</h3>
            <p className="text-slate-600 mb-4">
              Our brand voice is consistent across all communications, reflecting our values and personality.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✓ Professional yet approachable</li>
              <li>✓ Clear and direct communication</li>
              <li>✓ Authentic and transparent</li>
              <li>✓ Helpful and customer-focused</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Do's & Don'ts */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="w-14 h-14 flex items-center justify-center p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Usage Rules</p>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: brandColor }}>06</div>
          <h2 className="text-3xl font-bold text-slate-800">Brand Do's & Don'ts</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Do's */}
          <div className="bg-emerald-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800">Do</h3>
            </div>
            <ul className="space-y-3">
              {brandDos.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-800">Don't</h3>
            </div>
            <ul className="space-y-3">
              {brandDonts.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-12" style={{ backgroundColor: `${brandColor}10` }}>
        <div className="flex items-center justify-between">
          {project?.logo_url && (
            <div className="w-20 h-20 flex items-center justify-center p-3">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <div className="text-right">
            <p className="text-sm text-slate-600 font-medium mb-1">
              {project?.business_name} Brand Style Guide
            </p>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}