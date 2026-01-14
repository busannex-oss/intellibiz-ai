import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Plus, Trash2, Info, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const COLOR_PSYCHOLOGY = {
  red: { emotion: 'Energy, Passion, Urgency', usage: 'Great for bold brands, food, sales' },
  blue: { emotion: 'Trust, Calm, Professional', usage: 'Corporate, healthcare, tech' },
  green: { emotion: 'Growth, Health, Wealth', usage: 'Eco-friendly, finance, wellness' },
  yellow: { emotion: 'Optimism, Clarity, Warmth', usage: 'Youth brands, creativity' },
  orange: { emotion: 'Confidence, Friendly, Playful', usage: 'Entertainment, food, kids' },
  purple: { emotion: 'Luxury, Creative, Spiritual', usage: 'Premium brands, beauty' },
  pink: { emotion: 'Compassion, Playful, Youthful', usage: 'Beauty, fashion, romance' },
  black: { emotion: 'Sophistication, Power, Modern', usage: 'Luxury, tech, fashion' },
  white: { emotion: 'Purity, Simplicity, Clean', usage: 'Minimal, healthcare, luxury' },
  gray: { emotion: 'Balance, Neutral, Professional', usage: 'Corporate, tech, modern' },
  brown: { emotion: 'Earthy, Reliable, Warm', usage: 'Organic, rustic, traditional' },
  teal: { emotion: 'Balanced, Unique, Calming', usage: 'Modern brands, wellness' }
};

const getColorName = (hex) => {
  const colors = {
    '#FF': 'red', '#00': 'blue', '#0F': 'green', '#FF0': 'yellow',
    '#FFA': 'orange', '#80': 'purple', '#FF69': 'pink', '#00': 'black',
    '#FFF': 'white', '#808': 'gray', '#8B4': 'brown', '#008': 'teal'
  };
  const match = Object.keys(colors).find(key => hex.toUpperCase().startsWith(key));
  return match ? colors[match] : 'custom';
};

export default function BrandColorsStep({ colors = [], onUpdate, project }) {
  const [localColors, setLocalColors] = useState(colors.length > 0 ? colors : [
    { hex: '#7c3aed', name: 'Primary', role: 'primary', psychology: '' }
  ]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const addColor = () => {
    const newColors = [...localColors, { hex: '#000000', name: 'New Color', role: 'custom', psychology: '' }];
    setLocalColors(newColors);
    onUpdate(newColors);
  };

  const removeColor = (index) => {
    const newColors = localColors.filter((_, i) => i !== index);
    setLocalColors(newColors);
    onUpdate(newColors);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...localColors];
    newColors[index][field] = value;
    
    if (field === 'hex') {
      const colorName = getColorName(value);
      const psychology = COLOR_PSYCHOLOGY[colorName];
      if (psychology) {
        newColors[index].psychology = `${psychology.emotion}. ${psychology.usage}`;
      }
    }
    
    setLocalColors(newColors);
    onUpdate(newColors);
  };

  const generateAIPsychology = async (color, index) => {
    const businessContext = project ? `for ${project.business_name}, a ${project.industry} business targeting ${project.target_audience || 'general consumers'}` : '';
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze why the color ${color.hex} (${color.name}) works ${businessContext}. 

Explain in 2-3 sentences:
1. What emotions/associations this specific color evokes
2. Why it's strategically right for this brand and audience
3. How it will help the business stand out

Be specific to this brand, not generic color theory.`,
      response_json_schema: {
        type: "object",
        properties: {
          psychology: { type: "string" }
        }
      }
    });
    updateColor(index, 'psychology', response.psychology);
  };

  const regenerateColorScheme = async () => {
    setIsRegenerating(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a strategic color palette for "${project?.business_name}", a ${project?.industry} business.

Business Context:
- Description: ${project?.description}
- Target Audience: ${project?.target_audience}
- Brand Personality: ${project?.brand_personality?.traits?.join(', ') || 'Professional, trustworthy'}
- Competitive Positioning: ${project?.unique_value_proposition || 'Premium quality'}

Create a cohesive 5-color palette that:
1. Aligns with the brand personality
2. Appeals to the target audience
3. Stands out from competitors
4. Follows color psychology principles

For each color, provide:
- A descriptive name (e.g., "Ocean Blue", "Sunset Orange")
- Hex code
- Role (primary, secondary, accent, neutral, or custom)
- Brief psychology explanation (2 sentences max)`,
        response_json_schema: {
          type: "object",
          properties: {
            colors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  role: { type: "string" },
                  psychology: { type: "string" }
                }
              }
            }
          }
        }
      });

      setLocalColors(response.colors);
      onUpdate(response.colors);
      toast.success('Color scheme regenerated!');
    } catch (error) {
      toast.error('Failed to regenerate colors');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Brand Colors
          </h3>
          <p className="text-sm text-slate-500">Define your brand color palette</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={regenerateColorScheme} 
            variant="outline" 
            size="sm"
            disabled={isRegenerating || !project}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
          <Button onClick={addColor} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Color
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {localColors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-[80px_1fr_140px_40px] gap-4 items-start">
                    <div className="space-y-2">
                      <Label className="text-xs">Preview</Label>
                      <div
                        className="w-full h-16 rounded-lg border-2 border-slate-200 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <Input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="w-full h-8 p-1 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Color Name</Label>
                        <Input
                          value={color.name}
                          onChange={(e) => updateColor(index, 'name', e.target.value)}
                          placeholder="e.g., Primary Blue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Hex Code</Label>
                        <Input
                          value={color.hex}
                          onChange={(e) => updateColor(index, 'hex', e.target.value)}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Role</Label>
                      <Select
                        value={color.role}
                        onValueChange={(value) => updateColor(index, 'role', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={localColors.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {color.psychology && (
                    <div className="mt-3 p-3 bg-violet-50 rounded-lg border border-violet-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-violet-900">{color.psychology}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show Your Brand Colors Summary */}
      {localColors.some(c => c.psychology) && (
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Why These Colors Work for {project?.business_name || 'Your Brand'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {localColors.filter(c => c.psychology).map((color, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-12 h-12 rounded-lg shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="font-semibold text-slate-800">{color.name} <span className="text-xs text-slate-400 uppercase">{color.hex}</span></p>
                  <p className="text-sm text-slate-600 mt-1">{color.psychology}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}