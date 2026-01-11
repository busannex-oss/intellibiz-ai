import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, RefreshCw, Pencil, Check, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function BusinessPlanStep({ project, onUpdate, onNext }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    business_name: project?.business_name || '',
    industry: project?.industry || '',
    description: project?.description || '',
    target_audience: project?.target_audience || ''
  });
  const [editedPlan, setEditedPlan] = useState('');

  const generateBusinessPlan = async () => {
    if (!formData.business_name || !formData.industry || !formData.description) {
      return;
    }
    
    setIsGenerating(true);
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a comprehensive business plan for the following business:
        
Business Name: ${formData.business_name}
Industry: ${formData.industry}
Description: ${formData.description}
Target Audience: ${formData.target_audience || 'General consumers'}

Generate a complete business plan with the following sections:
1. Executive Summary
2. Company Description
3. Market Analysis
4. Products/Services
5. Marketing Strategy
6. Operations Plan
7. Financial Projections (high-level)
8. Key Success Factors
9. Recommended Brand Colors (provide hex codes for primary, secondary, and accent colors that match the business personality)

Be specific, actionable, and provide real insights. Format nicely with markdown.`,
      response_json_schema: {
        type: "object",
        properties: {
          executive_summary: { type: "string" },
          company_description: { type: "string" },
          market_analysis: { type: "string" },
          products_services: { type: "string" },
          marketing_strategy: { type: "string" },
          operations_plan: { type: "string" },
          financial_projections: { type: "string" },
          key_success_factors: { type: "string" },
          brand_colors: {
            type: "object",
            properties: {
              primary: { type: "string" },
              secondary: { type: "string" },
              accent: { type: "string" }
            }
          },
          full_plan_markdown: { type: "string" }
        }
      }
    });
    
    await onUpdate({
      ...formData,
      business_plan: response,
      brand_colors: response.brand_colors,
      current_step: 1
    });
    
    setIsGenerating(false);
  };

  const handleSaveEdit = async () => {
    await onUpdate({
      business_plan: {
        ...project.business_plan,
        full_plan_markdown: editedPlan
      }
    });
    setIsEditing(false);
  };

  const businessPlan = project?.business_plan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Let's Build Your Business Plan
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Tell us about your business idea and our AI will create a comprehensive plan
        </p>
      </div>

      {!businessPlan ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Business Name *</Label>
                <Input
                  placeholder="e.g., TechFlow Solutions"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Industry *</Label>
                <Input
                  placeholder="e.g., SaaS, E-commerce, Consulting"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Business Description *</Label>
              <Textarea
                placeholder="Describe what your business does, what problem it solves, and what makes it unique..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[120px] border-slate-200 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Target Audience</Label>
              <Input
                placeholder="e.g., Small business owners, Tech startups, Working professionals"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>
            <Button
              onClick={generateBusinessPlan}
              disabled={isGenerating || !formData.business_name || !formData.industry || !formData.description}
              className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Business Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Business Plan with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800">
                  {project.business_name} - Business Plan
                </CardTitle>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditedPlan(businessPlan.full_plan_markdown || '');
                          setIsEditing(true);
                        }}
                        className="border-slate-200"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateBusinessPlan}
                        disabled={isGenerating}
                        className="border-slate-200"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                        Regenerate
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <Textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                />
              ) : (
                <Tabs defaultValue="full" className="w-full">
                  <TabsList className="mb-4 bg-slate-100">
                    <TabsTrigger value="full">Full Plan</TabsTrigger>
                    <TabsTrigger value="executive">Executive Summary</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                  </TabsList>
                  <TabsContent value="full" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.full_plan_markdown}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="executive" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.executive_summary}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="marketing" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.marketing_strategy}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="financial" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.financial_projections}</ReactMarkdown>
                  </TabsContent>
                </Tabs>
              )}
              
              {project.brand_colors && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium text-slate-600 mb-3">Recommended Brand Colors</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: project.brand_colors.primary }}
                      />
                      <span className="text-xs text-slate-500">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: project.brand_colors.secondary }}
                      />
                      <span className="text-xs text-slate-500">Secondary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: project.brand_colors.accent }}
                      />
                      <span className="text-xs text-slate-500">Accent</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={onNext}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              Continue to Logo Design
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}