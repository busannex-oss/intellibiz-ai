import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Download, Palette, Save, Eye, EyeOff, Trash2, Upload, Edit2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import BrandColorsStep from './BrandColorsStep';
import { toast } from 'sonner';

export default function LogoStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('logo');
  const [currentLogoUrl, setCurrentLogoUrl] = useState(project?.logo_url || null);
  const [editingLogoId, setEditingLogoId] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');
  
  const savedLogos = project?.saved_logos || [];

  const generateLogo = async (additionalInstructions = '') => {
    setIsGenerating(true);
    
    try {
      const brandPersonality = project?.brand_personality;
      const competitors = project?.market_research?.competitors;
      
      // Get primary brand color for the logo
      const primaryColor = Array.isArray(project?.brand_colors) 
        ? project.brand_colors.find(c => c.role === 'primary')?.hex || project.brand_colors[0]?.hex
        : null;
      
      const basePrompt = `MANDATORY: Create ONE professional logo icon with TRANSPARENT BACKGROUND (PNG with alpha channel) for "${project.business_name}".

⚠️ CRITICAL - TRANSPARENT BACKGROUND REQUIREMENTS:
- MUST BE TRANSPARENT BACKGROUND - NO EXCEPTIONS
- NO white background, NO black background, NO solid color backgrounds
- PNG format with alpha channel transparency
- All pixels outside the logo MUST BE 100% transparent
- Logo should be clearly visible when placed on ANY background color
- Include appropriate whitespace/padding around the logo (20% of canvas)

📐 COMPOSITION & SPACING:
- Logo should occupy 60-70% of canvas (leaving 15-20% breathing room on all sides)
- Centered positioning
- Zoom in to show design details clearly
- Professional spacing that follows logo design standards

🎨 DESIGN STYLE:
Industry: ${project.industry}
Description: ${project.description}
- Clean, modern, minimalist design
- Premium and memorable
${primaryColor ? `- Primary color: ${primaryColor}` : '- Professional color palette'}
- Icon/symbol only - NO TEXT
- Vector-style, flat design aesthetic
- Sharp edges with smooth anti-aliasing

PERSONALITY: ${brandPersonality?.traits?.join(', ') || 'Professional, trustworthy, innovative'}

${additionalInstructions ? `CUSTOM INSTRUCTIONS: ${additionalInstructions}` : ''}

✅ FINAL OUTPUT: Single logo icon on TRANSPARENT background, properly spaced, zoomed to show details, ready for use on any surface.`;

      const response = await base44.integrations.Core.GenerateImage({
        prompt: basePrompt
      });
      
      if (response?.url) {
        setCurrentLogoUrl(response.url);
        toast.success('Logo generated! Click "Save Logo" to add it to your collection.');
      } else {
        throw new Error('No logo URL returned');
      }
      
      setCustomPrompt('');
    } catch (error) {
      console.error('Logo generation failed:', error);
      toast.error('Failed to generate logo. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLogo = async () => {
    if (!currentLogoUrl) return;
    
    const newLogo = {
      id: Date.now().toString(),
      url: currentLogoUrl,
      prompt: project?.logo_prompt || '',
      published: false,
      created_at: new Date().toISOString()
    };
    
    const updatedLogos = [...savedLogos, newLogo];
    await onUpdate({ saved_logos: updatedLogos });
    toast.success('Logo saved to your collection!');
  };

  const togglePublished = async (logoId) => {
    const updatedLogos = savedLogos.map(logo => ({
      ...logo,
      published: logo.id === logoId ? !logo.published : false
    }));
    
    const publishedLogo = updatedLogos.find(l => l.published);
    await onUpdate({
      saved_logos: updatedLogos,
      logo_url: publishedLogo?.url || savedLogos.find(l => l.id === logoId)?.url,
      logo_prompt: publishedLogo?.prompt || savedLogos.find(l => l.id === logoId)?.prompt
    });
    
    toast.success(publishedLogo ? 'Logo published!' : 'Logo unpublished');
  };

  const uploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsGenerating(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const newLogo = {
        id: Date.now().toString(),
        url: file_url,
        prompt: 'Uploaded by user',
        published: false,
        created_at: new Date().toISOString()
      };
      
      const updatedLogos = [...savedLogos, newLogo];
      await onUpdate({ saved_logos: updatedLogos });
      setCurrentLogoUrl(file_url);
      toast.success('Logo uploaded and saved!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsGenerating(false);
    }
  };

  const editLogoPrompt = async (logoId, newPrompt) => {
    const updatedLogos = savedLogos.map(logo => 
      logo.id === logoId ? { ...logo, prompt: newPrompt } : logo
    );
    await onUpdate({ saved_logos: updatedLogos });
    toast.success('Logo notes updated');
  };

  const deleteLogo = async (logoId) => {
    const logoToDelete = savedLogos.find(l => l.id === logoId);
    const updatedLogos = savedLogos.filter(logo => logo.id !== logoId);
    
    const updates = { saved_logos: updatedLogos };
    if (logoToDelete?.published) {
      updates.logo_url = null;
      updates.logo_prompt = null;
    }
    
    await onUpdate(updates);
    toast.success('Logo deleted');
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
                  ) : currentLogoUrl ? (
                   <>
                     <img
                       src={currentLogoUrl}
                       alt={`${project.business_name} logo`}
                       className="max-w-[80%] max-h-[80%] object-contain"
                       onError={(e) => {
                         e.target.style.display = 'none';
                         e.target.parentElement.innerHTML += '<div class="text-red-500">Failed to load logo</div>';
                       }}
                     />
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
                <p className="text-xs text-slate-500">
                  ✓ All logos generated with transparent background by default
                </p>
              </div>

              <div className="space-y-3">
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
                      {currentLogoUrl ? 'Generate New' : 'Generate Logo'}
                    </>
                  )}
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadLogo}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isGenerating}
                  />
                  <Button
                    variant="outline"
                    className="w-full h-12 border-slate-200"
                    disabled={isGenerating}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your Own Logo
                  </Button>
                </div>
                
                {currentLogoUrl && !savedLogos.find(l => l.url === currentLogoUrl) && (
                  <Button
                    onClick={saveLogo}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Logo
                  </Button>
                )}
                
                {currentLogoUrl && (
                  <a
                    href={currentLogoUrl}
                    download={`${project.business_name}-logo.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full h-12 border-slate-200">
                      <Download className="w-5 h-5 mr-2" />
                      Download Logo
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Logos */}
          {savedLogos.length > 0 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Saved Logos ({savedLogos.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedLogos.map((logo) => (
                  <div 
                    key={logo.id} 
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 hover:border-violet-200 transition-colors"
                    style={{ borderColor: logo.published ? '#7c3aed' : 'transparent' }}
                  >
                    <div 
                      className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm cursor-pointer hover:ring-2 hover:ring-violet-300"
                      onClick={() => setCurrentLogoUrl(logo.url)}
                    >
                      <img src={logo.url} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {logo.prompt === 'Uploaded by user' ? 'Uploaded Logo' : `Logo ${savedLogos.indexOf(logo) + 1}`}
                        </span>
                        {logo.published && (
                          <Badge className="bg-violet-600">Published</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {new Date(logo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingLogoId(logo.id);
                              setEditPrompt(logo.prompt || '');
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Logo Notes</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              value={editPrompt}
                              onChange={(e) => setEditPrompt(e.target.value)}
                              placeholder="Add notes about this logo..."
                              rows={4}
                            />
                            <Button
                              onClick={() => {
                                editLogoPrompt(logo.id, editPrompt);
                                setEditingLogoId(null);
                              }}
                              className="w-full"
                            >
                              Save Notes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant={logo.published ? "default" : "outline"}
                        onClick={() => togglePublished(logo.id)}
                        className={logo.published ? "bg-violet-600" : ""}
                      >
                        {logo.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteLogo(logo.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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