import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Download, Palette } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import BrandColorsStep from './BrandColorsStep';

export default function LogoStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('logo');

  const generateLogo = async (additionalInstructions = '') => {
    setIsGenerating(true);
    
    try {
      const brandPersonality = project?.brand_personality;
      const competitors = project?.market_research?.competitors;
      
      // Get primary brand color for the logo
      const primaryColor = Array.isArray(project?.brand_colors) 
        ? project.brand_colors.find(c => c.role === 'primary')?.hex || project.brand_colors[0]?.hex
        : null;
      
      const basePrompt = `Create a professional, modern, minimalist logo icon for "${project.business_name}" in the ${project.industry} industry.

BUSINESS CONTEXT:
${project.description}

STYLE REQUIREMENTS:
- Clean, simple geometric design
- Minimalist and memorable
- Premium, professional appearance
- Works on both light and dark backgrounds
${primaryColor ? `- Use ${primaryColor} as the primary color` : '- Use modern, professional colors'}
- Centered composition with balanced proportions
- No text, icon/symbol only
- Vector-style, flat design aesthetic

BRAND PERSONALITY: ${brandPersonality?.traits?.join(', ') || 'Professional, trustworthy, innovative'}

${additionalInstructions ? `ADDITIONAL NOTES: ${additionalInstructions}` : ''}

Create a distinctive mark that represents the brand's unique value and stands out from competitors.`;

      const response = await base44.integrations.Core.GenerateImage({
        prompt: basePrompt
      });
      
      if (response?.url) {
        await onUpdate({
          logo_url: response.url,
          logo_prompt: basePrompt
        });
      } else {
        throw new Error('No logo URL returned');
      }
      
      setCustomPrompt('');
    } catch (error) {
      console.error('Logo generation failed:', error);
      alert('Failed to generate logo. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Create Your Logo
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          AI will generate a professional logo based on your business plan
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="logo">Logo Design</TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="w-4 h-4 mr-2" />
            Brand Colors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo Preview */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
                      <p className="text-slate-500 font-medium">Creating your logo...</p>
                      <p className="text-xs text-slate-400">This may take 10-15 seconds</p>
                    </div>
                  ) : project?.logo_url ? (
                    <>
                      <img
                        src={project.logo_url}
                        alt={`${project.business_name} logo`}
                        className="max-w-[80%] max-h-[80%] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML += '<div class="text-red-500">Failed to load logo</div>';
                        }}
                      />
                      {/* Dark background preview toggle */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-white border border-slate-200 rounded cursor-pointer" title="Light" />
                          <div className="w-6 h-6 bg-slate-900 rounded cursor-pointer" title="Dark" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No logo yet</p>
                      <p className="text-xs text-slate-400 mt-1">Click "Generate Logo" to create your brand mark</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

        {/* Controls */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Business Info</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium">Name:</span> {project?.business_name}</p>
                  <p><span className="font-medium">Industry:</span> {project?.industry}</p>
                </div>
                {project?.brand_colors?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {project.brand_colors.slice(0, 6).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Custom Instructions (optional)</Label>
                <Input
                  placeholder="e.g., Make it more playful, Add a symbol..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-3">
                {!project?.logo_url ? (
                  <Button
                    onClick={() => generateLogo(customPrompt)}
                    disabled={isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Logo
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => generateLogo(customPrompt)}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full h-12 border-slate-200"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Regenerate Logo
                        </>
                      )}
                    </Button>
                    <a
                      href={project.logo_url}
                      download={`${project.business_name}-logo.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full h-12 border-slate-200">
                        <Download className="w-5 h-5 mr-2" />
                        Download Logo
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              onClick={onPrev}
              variant="outline"
              className="h-12 px-6 border-slate-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!project?.logo_url}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              Continue to Website
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="colors">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <BrandColorsStep
                colors={project?.brand_colors || []}
                project={project}
                onUpdate={(colors) => onUpdate({ brand_colors: colors })}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button
              onClick={onPrev}
              variant="outline"
              className="h-12 px-6 border-slate-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setActiveTab('logo')}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              Continue to Logo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}