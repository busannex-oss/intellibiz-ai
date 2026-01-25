import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Download, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', headerSize: '820x312', profileSize: '170x170', icon: '📘', recommended: true },
  { id: 'instagram', name: 'Instagram', headerSize: '1080x1080', profileSize: '320x320', icon: '📸', recommended: true },
  { id: 'twitter', name: 'X (Twitter)', headerSize: '1500x500', profileSize: '400x400', icon: '🐦', recommended: true },
  { id: 'linkedin', name: 'LinkedIn', headerSize: '1584x396', profileSize: '400x400', icon: '💼', recommended: true },
  { id: 'youtube', name: 'YouTube', headerSize: '2560x1440', profileSize: '800x800', icon: '▶️', recommended: false },
  { id: 'tiktok', name: 'TikTok', headerSize: '1920x1080', profileSize: '200x200', icon: '🎵', recommended: false },
  { id: 'pinterest', name: 'Pinterest', headerSize: '800x450', profileSize: '165x165', icon: '📌', recommended: false },
  { id: 'threads', name: 'Threads', headerSize: 'N/A', profileSize: '320x320', icon: '🧵', recommended: false },
];

export default function SocialMediaStep({ project, onUpdate, onNext, onPrev }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    project?.selected_platforms || ['facebook', 'instagram', 'twitter', 'linkedin']
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingPlatform, setGeneratingPlatform] = useState(null);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateAssets = async (platformId) => {
    setGeneratingPlatform(platformId);
    
    const platform = PLATFORMS.find(p => p.id === platformId);
    const brandPersonality = project?.brand_personality;
    const uvp = project?.unique_value_proposition;
    
    // Get brand colors
    const brandColors = Array.isArray(project?.brand_colors) 
      ? project.brand_colors.map(c => c.hex).join(', ')
      : '#6366f1, #8b5cf6';
    
    const primaryColor = Array.isArray(project?.brand_colors)
      ? project.brand_colors.find(c => c.role === 'primary')?.hex || project.brand_colors[0]?.hex
      : '#6366f1';
    
    // Generate header with brand consistency
    const headerPrompt = `Create a professional ${platform.name} header/banner image for "${project.business_name}" - a ${project.industry} business.

⚠️ CRITICAL - BRAND CONSISTENCY REQUIREMENTS:
- MUST incorporate the brand logo prominently (but not dominate the design)
- MUST use ONLY the brand colors: ${brandColors}
- The design must establish brand identity and be instantly recognizable
- Maintain professional spacing and composition

BRAND ASSETS:
Logo URL: ${project?.logo_url || 'Use abstract brand symbol'}
Primary Color: ${primaryColor}
Brand Colors Palette: ${brandColors}

BUSINESS CONTEXT:
${uvp || 'Premium service and innovation'}

BRAND PERSONALITY:
${brandPersonality?.traits?.join(', ') || 'Professional, innovative'}
Visual Style: ${brandPersonality?.visual_style || 'Modern and clean'}

DESIGN REQUIREMENTS:
- Size: ${platform.headerSize}
- Modern, professional, clean design
- Logo should be integrated tastefully (not too large, not too small)
- Use brand colors as the primary color scheme
- NO text or typography on the image
- Design should work well with the platform's UI overlay

OUTPUT: A cohesive brand header that maintains consistency across all platforms.`;

    const headerResponse = await base44.integrations.Core.GenerateImage({
      prompt: headerPrompt,
      existing_image_urls: project?.logo_url ? [project.logo_url] : undefined
    });

    // Generate profile image with brand consistency
    const profilePrompt = `Create a professional ${platform.name} profile picture for "${project.business_name}".

⚠️ CRITICAL - BRAND CONSISTENCY REQUIREMENTS:
- MUST feature the brand logo as the central element
- MUST use ONLY the brand colors: ${brandColors}
- Must be instantly recognizable as part of the same brand across all platforms
- Maintain consistent visual language with the header image

BRAND ASSETS:
Logo URL: ${project?.logo_url || 'Create branded symbol'}
Primary Color: ${primaryColor}
Brand Colors: ${brandColors}

DESIGN REQUIREMENTS:
- Industry: ${project.industry}
- Size: Square, ${platform.profileSize}
- Logo should be the focal point (60-70% of the space)
- Background using brand colors in a simple, clean way
- Modern, minimal, professional aesthetic
- Should look cohesive with the header image
- Must stand out in social media feeds

BRAND PERSONALITY:
${brandPersonality?.traits?.join(', ') || 'Professional, innovative'}

OUTPUT: A profile image that clearly represents the brand with logo and brand colors.`;

    const profileResponse = await base44.integrations.Core.GenerateImage({
      prompt: profilePrompt,
      existing_image_urls: project?.logo_url ? [project.logo_url] : undefined
    });

    const existingAssets = project?.social_media_assets || [];
    const updatedAssets = existingAssets.filter(a => a.platform !== platformId);
    updatedAssets.push({
      platform: platformId,
      header_url: headerResponse.url,
      profile_url: profileResponse.url
    });

    await onUpdate({
      social_media_assets: updatedAssets,
      selected_platforms: selectedPlatforms
    });

    setGeneratingPlatform(null);
  };

  const generateAllAssets = async () => {
    setIsGenerating(true);
    for (const platformId of selectedPlatforms) {
      await generateAssets(platformId);
    }
    setIsGenerating(false);
  };

  const getAssetForPlatform = (platformId) => {
    return project?.social_media_assets?.find(a => a.platform === platformId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent tracking-[-0.02em]">
          Social Media Assets
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
          Generate professional headers and profile images for your social media presence
        </p>
      </div>

      {/* Platform Selection */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Your Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Checkbox
                  checked={selectedPlatforms.includes(platform.id)}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <Label className="cursor-pointer font-medium">{platform.name}</Label>
                  {platform.recommended && (
                    <p className="text-xs text-violet-600">Recommended</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={generateAllAssets}
              disabled={isGenerating || selectedPlatforms.length === 0}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating All Assets...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Assets for Selected Platforms
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Assets */}
      <div className="grid md:grid-cols-2 gap-6">
        {selectedPlatforms.map((platformId) => {
          const platform = PLATFORMS.find(p => p.id === platformId);
          const asset = getAssetForPlatform(platformId);
          
          return (
            <Card key={platformId} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{platform.icon}</span>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                  {asset && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateAssets(platformId)}
                      disabled={generatingPlatform === platformId}
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${generatingPlatform === platformId ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatingPlatform === platformId ? (
                  <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Generating assets...</p>
                    </div>
                  </div>
                ) : asset ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-600">Header ({platform.headerSize})</p>
                        <a href={asset.header_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        </a>
                      </div>
                      <div className="aspect-[3/1] bg-slate-100 rounded-lg overflow-hidden">
                        <img src={asset.header_url} alt="Header" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-600">Profile ({platform.profileSize})</p>
                        <a href={asset.profile_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        </a>
                      </div>
                      <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden mx-auto">
                        <img src={asset.profile_url} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Click "Generate" to create assets</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="h-12 px-6">
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
        >
          Continue to Resources
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}