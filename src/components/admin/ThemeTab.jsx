import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Palette, Save, Upload, Loader2, Check, Type, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const THEMES = [
  {
    id: 'amber',
    name: 'Forge (Default)',
    description: 'Warm amber & orange — bold and energetic',
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#fbbf24',
    bg: 'from-slate-900 to-slate-800',
    nav: 'bg-slate-900',
    font: 'Inter',
    preview: ['#f59e0b', '#f97316', '#0f172a', '#1e293b'],
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    description: 'Deep violet & indigo — premium and professional',
    primary: '#7c3aed',
    secondary: '#4f46e5',
    accent: '#a78bfa',
    bg: 'from-slate-900 to-violet-950',
    nav: 'bg-slate-900',
    font: 'Inter',
    preview: ['#7c3aed', '#4f46e5', '#0f172a', '#1e1b4b'],
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    description: 'Fresh emerald & teal — health, finance, eco',
    primary: '#059669',
    secondary: '#0d9488',
    accent: '#34d399',
    bg: 'from-slate-900 to-emerald-950',
    nav: 'bg-slate-900',
    font: 'Inter',
    preview: ['#059669', '#0d9488', '#0f172a', '#022c22'],
  },
  {
    id: 'rose',
    name: 'Rose Luxury',
    description: 'Rich rose & pink — beauty, lifestyle, fashion',
    primary: '#e11d48',
    secondary: '#db2777',
    accent: '#fb7185',
    bg: 'from-slate-900 to-rose-950',
    nav: 'bg-slate-900',
    font: 'Inter',
    preview: ['#e11d48', '#db2777', '#0f172a', '#4c0519'],
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Classic blue & cyan — trust, tech, corporate',
    primary: '#2563eb',
    secondary: '#0891b2',
    accent: '#60a5fa',
    bg: 'from-slate-900 to-blue-950',
    nav: 'bg-slate-900',
    font: 'Inter',
    preview: ['#2563eb', '#0891b2', '#0f172a', '#172554'],
  },
  {
    id: 'slate',
    name: 'Slate Minimal',
    description: 'Clean slate — minimal, editorial, neutral',
    primary: '#64748b',
    secondary: '#475569',
    accent: '#94a3b8',
    bg: 'from-slate-950 to-slate-900',
    nav: 'bg-slate-950',
    font: 'Inter',
    preview: ['#64748b', '#475569', '#0f172a', '#020617'],
  },
  {
    id: 'gold',
    name: 'Prestige Gold',
    description: 'Deep gold & charcoal — luxury and authority',
    primary: '#d97706',
    secondary: '#92400e',
    accent: '#fcd34d',
    bg: 'from-stone-950 to-stone-900',
    nav: 'bg-stone-950',
    font: 'Playfair Display',
    preview: ['#d97706', '#92400e', '#1c1917', '#0c0a09'],
  },
];

const FONT_PAIRS = {
  Inter: { heading: 'Inter', body: 'Inter', import: null },
  'Playfair Display': { heading: 'Playfair Display', body: 'Lato', import: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;500;700&display=swap' },
  'Poppins': { heading: 'Poppins', body: 'Poppins', import: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap' },
  'Montserrat': { heading: 'Montserrat', body: 'Open Sans', import: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500&display=swap' },
  'Raleway': { heading: 'Raleway', body: 'Nunito', import: 'https://fonts.googleapis.com/css2?family=Raleway:wght@600;700;800&family=Nunito:wght@400;500;600&display=swap' },
};

export default function ThemeTab({ appSettings, onSave, isSaving }) {
  const [selectedTheme, setSelectedTheme] = useState(appSettings?.color_theme || 'amber');
  const [siteName, setSiteName] = useState(appSettings?.site_name || 'BrandForge');
  const [siteTagline, setSiteTagline] = useState(appSettings?.site_tagline || '');
  const [logoUrl, setLogoUrl] = useState(appSettings?.logo_url || '');
  const [faviconUrl, setFaviconUrl] = useState(appSettings?.favicon_url || '');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const logoRef = useRef(null);
  const faviconRef = useRef(null);

  const handleUpload = async (file, type) => {
    if (type === 'logo') setIsUploadingLogo(true);
    else setIsUploadingFavicon(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (type === 'logo') { setLogoUrl(file_url); setIsUploadingLogo(false); }
    else { setFaviconUrl(file_url); setIsUploadingFavicon(false); }
    toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded!`);
  };

  const handleSave = () => {
    onSave({
      site_name: siteName,
      site_tagline: siteTagline,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      color_theme: selectedTheme,
    });
  };

  const activeTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  return (
    <div className="space-y-6">
      {/* Super Admin Notice */}
      <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700">
        <Shield className="w-4 h-4 flex-shrink-0" />
        <span>This section is restricted to <strong>Super Admins</strong> and admins granted Theme Coordinator access. Changes apply platform-wide instantly.</span>
      </div>

      {/* Theme Selector */}
      <Card className="wizard-card border-0">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center gap-2"><Palette className="w-5 h-5 text-violet-500" />Color &amp; Typography Theme</CardTitle>
          <CardDescription>Select one of 7 themes. The active theme controls all colors and fonts across the entire platform.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative rounded-xl border-2 p-4 text-left transition-all group ${
                  selectedTheme === theme.id
                    ? 'border-violet-500 shadow-lg shadow-violet-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {/* Color swatches */}
                <div className="flex gap-1.5 mb-3">
                  {theme.preview.map((color, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="font-semibold text-slate-800 text-sm">{theme.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{theme.description}</p>
                {theme.id === 'amber' && (
                  <Badge className="mt-2 bg-amber-100 text-amber-700 text-[10px]">Default</Badge>
                )}
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Type className="w-3 h-3" />
                  {theme.font}
                </div>
              </button>
            ))}
          </div>

          {/* Live Preview Bar */}
          <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2 text-xs text-slate-400 bg-slate-50 border-b border-slate-200 font-medium">Preview — {activeTheme.name}</div>
            <div className={`bg-gradient-to-r ${activeTheme.bg} p-6 flex items-center gap-4`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}>
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-white font-bold text-base" style={{ color: '#fff' }}>{siteName || 'Your Site'}</p>
                <p className="text-sm" style={{ color: activeTheme.accent }}>{siteTagline || 'Your tagline here'}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}>
                  Primary CTA
                </div>
                <div className="px-4 py-1.5 rounded-lg text-sm font-semibold border" style={{ color: activeTheme.accent, borderColor: activeTheme.accent + '50' }}>
                  Secondary
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding Replacement */}
      <Card className="wizard-card border-0">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center gap-2"><Type className="w-5 h-5 text-pink-500" />Brand Identity — Replace All Instances</CardTitle>
          <CardDescription>Changes here replace the platform name, tagline, logo, and favicon everywhere on the site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Platform Name</Label>
              <Input placeholder="BrandForge" value={siteName} onChange={e => setSiteName(e.target.value)} />
              <p className="text-xs text-slate-400 mt-1">Replaces "BrandForge" everywhere — nav, footer, emails, meta tags</p>
            </div>
            <div>
              <Label>Tagline</Label>
              <Input placeholder="AI-powered platform to build, launch, and grow your business" value={siteTagline} onChange={e => setSiteTagline(e.target.value)} />
              <p className="text-xs text-slate-400 mt-1">Used in nav, hero, and footer descriptions</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Logo */}
            <div>
              <Label>Logo</Label>
              <div className="mt-1 space-y-2">
                {logoUrl && (
                  <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-center h-16">
                    <img src={logoUrl} alt="Logo" className="max-h-12 max-w-full object-contain" />
                  </div>
                )}
                <Input placeholder="https://your-logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files[0], 'logo')} />
                <Button size="sm" variant="outline" onClick={() => logoRef.current?.click()} disabled={isUploadingLogo} className="w-full">
                  {isUploadingLogo ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Uploading...</> : <><Upload className="w-3 h-3 mr-1" />Upload Logo</>}
                </Button>
                <p className="text-xs text-slate-400">Replaces the default icon in nav, footer, emails, and all pages</p>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <Label>Favicon</Label>
              <div className="mt-1 space-y-2">
                {faviconUrl && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 h-16">
                    <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                    <span className="text-xs text-slate-500">Browser tab icon</span>
                  </div>
                )}
                <Input placeholder="https://your-favicon.ico" value={faviconUrl} onChange={e => setFaviconUrl(e.target.value)} />
                <input ref={faviconRef} type="file" accept="image/*,.ico" className="hidden" onChange={e => handleUpload(e.target.files[0], 'favicon')} />
                <Button size="sm" variant="outline" onClick={() => faviconRef.current?.click()} disabled={isUploadingFavicon} className="w-full">
                  {isUploadingFavicon ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Uploading...</> : <><Upload className="w-3 h-3 mr-1" />Upload Favicon</>}
                </Button>
                <p className="text-xs text-slate-400">16×16 or 32×32 .ico or .png file</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />{isSaving ? 'Saving...' : 'Save Theme & Brand'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}