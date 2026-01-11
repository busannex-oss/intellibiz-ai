import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function LogoStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateLogo = async (additionalInstructions = '') => {
    setIsGenerating(true);
    
    const brandPersonality = project?.brand_personality;
    const competitors = project?.market_research?.competitors;
    
    const basePrompt = `Create a professional, modern logo for a business called "${project.business_name}" in the ${project.industry} industry. 

BUSINESS DESCRIPTION:
${project.description}

UNIQUE VALUE PROPOSITION:
${project.unique_value_proposition || 'Premium quality service'}

BRAND PERSONALITY:
${brandPersonality?.traits?.join(', ') || 'Professional, trustworthy, innovative'}
Visual Style: ${brandPersonality?.visual_style || 'Modern and clean'}

DIFFERENTIATION REQUIREMENTS:
This logo must stand out from competitors like: ${competitors?.slice(0, 3).map(c => c.name).join(', ') || 'major industry players'}
The design should communicate our competitive advantages and unique positioning.

BRAND COLORS (strategically chosen based on market research):
${project.brand_colors ? `Primary: ${project.brand_colors.primary}, Secondary: ${project.brand_colors.secondary}, Accent: ${project.brand_colors.accent}` : 'Modern, professional color palette'}
${project.brand_colors?.rationale ? `Color rationale: ${project.brand_colors.rationale}` : ''}

The logo should be clean, memorable, distinctive, and work well on both light and dark backgrounds.
Style: Minimalist, professional, scalable vector-style design that conveys trust and innovation.
${additionalInstructions}`;

    const response = await base44.integrations.Core.GenerateImage({
      prompt: basePrompt
    });
    
    await onUpdate({
      logo_url: response.url,
      logo_prompt: basePrompt
    });
    
    setIsGenerating(false);
    setCustomPrompt('');
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

      <div className="grid md:grid-cols-2 gap-8">
        {/* Logo Preview */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
                  <p className="text-slate-500">Creating your logo...</p>
                </div>
              ) : project?.logo_url ? (
                <img
                  src={project.logo_url}
                  alt={`${project.business_name} logo`}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500">Click "Generate Logo" to create your brand mark</p>
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
                {project?.brand_colors && (
                  <div className="flex gap-2 mt-3">
                    <div
                      className="w-6 h-6 rounded shadow-sm"
                      style={{ backgroundColor: project.brand_colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-6 h-6 rounded shadow-sm"
                      style={{ backgroundColor: project.brand_colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-6 h-6 rounded shadow-sm"
                      style={{ backgroundColor: project.brand_colors.accent }}
                      title="Accent"
                    />
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
    </motion.div>
  );
}