import React from 'react';
import { format } from 'date-fns';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function BrandingKitDocument({ project }) {
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
    <div id="branding-kit-content" className="font-sans bg-white">
      {/* Cover Page */}
      <div 
        className="min-h-[800px] flex flex-col justify-center items-center text-center p-12 relative"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)` }}
      >
        <div className="logo absolute top-8 left-8 opacity-30 w-16 h-16">
          {project?.logo_url && (
            <img 
              src={project.logo_url} 
              alt="" 
              className="w-full h-full object-contain filter drop-shadow-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
        
        {project?.logo_url ? (
          <div className="logo w-48 h-48 mb-8 rounded-3xl p-8 shadow-2xl">
            <img 
              src={project.logo_url} 
              alt={project.business_name} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-48 h-48 mb-8 rounded-3xl bg-white/10 flex items-center justify-center">
            <div className="text-white text-4xl font-bold">{project?.business_name?.[0] || 'B'}</div>
          </div>
        )}
        <h1 className="text-5xl font-bold text-white mb-4">{project?.business_name}</h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-10 py-5 mb-8">
          <p className="text-white text-2xl font-semibold">Brand Guidelines</p>
        </div>
        <p className="text-white/80 text-lg">Official Brand Identity & Usage Manual</p>
        <p className="text-white/60 mt-auto pt-12">
          Version 1.0 • {format(new Date(), 'MMMM yyyy')}
        </p>
        
        <div className="logo absolute bottom-8 right-8 opacity-20 w-12 h-12">
          {project?.logo_url && (
            <img 
              src={project.logo_url} 
              alt="" 
              className="w-full h-full object-contain filter drop-shadow-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
      </div>

      {/* Introduction */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="logo w-14 h-14 p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Brand Guidelines</p>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Introduction</h2>
        <div className="prose max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            This brand guide serves as the official reference for maintaining consistent visual and 
            verbal identity across all {project?.business_name} communications and touchpoints. 
            Consistency in brand presentation builds recognition, trust, and professional credibility.
          </p>
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-2">Brand Promise</h3>
            <p className="text-slate-600">{project?.unique_value_proposition || 'Delivering exceptional value and quality to our customers.'}</p>
          </div>
        </div>
      </div>

      {/* Logo Usage */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="logo w-14 h-14 p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Logo Guidelines</p>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Primary Logo</h2>
        
        {project?.logo_url && (
          <div className="space-y-8">
            {/* Logo Variations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Logo Variations</h3>
              <p className="text-slate-600 text-sm mb-4">The logo should work on both light and dark backgrounds with proper spacing</p>
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
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Clear Space & Spacing Requirements</h3>
              <div className="bg-slate-50 rounded-xl p-8">
                <div className="text-center mb-4">
                  <div className="inline-block border-2 border-dashed border-slate-400 p-12 rounded-xl bg-white">
                    <img src={project.logo_url} alt="" className="w-32 h-32 object-contain mx-auto" />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>✓ Always maintain adequate clear space around the logo (minimum 20% of logo height on all sides)</p>
                  <p>✓ Never crop or crowd the logo against other elements</p>
                  <p>✓ Ensure logo has breathing room in all applications</p>
                  <p>✓ Use transparent PNG format to prevent white boxes or backgrounds</p>
                </div>
              </div>
            </div>

            {/* Minimum Size */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Minimum Size</h3>
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <img src={project.logo_url} alt="" className="w-24 h-24 object-contain mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">Digital: 80px</p>
                </div>
                <div className="text-center">
                  <img src={project.logo_url} alt="" className="w-16 h-16 object-contain mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">Print: 25mm</p>
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
            <div className="logo w-14 h-14 p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Color System</p>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Brand Color Palette</h2>
        
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

      {/* Brand Do's and Don'ts */}
      <div className="p-12 border-b">
        <div className="flex items-center justify-between mb-8">
          {project?.logo_url && (
            <div className="logo w-14 h-14 p-2">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <p className="text-xs text-slate-400 uppercase tracking-widest">Usage Rules</p>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Brand Do's & Don'ts</h2>
        
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
                  <span className="text-slate-700">{item}</span>
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
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Brand Personality */}
      {project?.brand_personality && (
        <div className="p-12 border-b">
          <div className="flex items-center justify-between mb-8">
            {project?.logo_url && (
              <div className="logo w-14 h-14 p-2">
                <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
            <p className="text-xs text-slate-400 uppercase tracking-widest">Voice & Tone</p>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Brand Personality</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {project.brand_personality.traits && (
              <div className="bg-violet-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {project.brand_personality.traits.map((trait, i) => (
                    <span key={i} className="px-4 py-2 bg-white rounded-full text-slate-700 font-medium shadow-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.brand_personality.tone_of_voice && (
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Tone of Voice</h3>
                <p className="text-slate-600">{project.brand_personality.tone_of_voice}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact / Footer */}
      <div className="p-12" style={{ backgroundColor: `${brandColor}10` }}>
        <div className="flex items-center justify-between">
          {project?.logo_url && (
            <div className="logo w-20 h-20 p-3">
              <img src={project.logo_url} alt="" className="max-w-full max-h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">
              {project?.business_name} Brand Guidelines
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