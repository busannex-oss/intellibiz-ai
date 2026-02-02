import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, RefreshCw, Pencil, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function BusinessPlanStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');

  const generateBusinessPlan = async () => {
    setIsGenerating(true);
    
    const marketResearch = project?.market_research;
    const uvp = project?.unique_value_proposition;
    const advantages = project?.competitive_advantages;
    
    // Generate Business Strategy & Objectives
    const strategyResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on the following business information, generate a comprehensive Business Strategy & Objectives section:

Business Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience || 'General consumers'}
Unique Value Proposition: ${uvp || 'Not defined'}
Competitive Advantages: ${advantages?.join(', ') || 'Not defined'}

Market Opportunities: ${marketResearch?.opportunities?.join(', ') || 'Not available'}
Market Gaps: ${marketResearch?.market_gaps?.join(', ') || 'Not available'}

Generate:
1. Mission Statement - A clear, inspiring statement of the company's purpose
2. Vision Statement - Where the company aims to be in 5-10 years
3. Core Values - 3-5 fundamental principles that guide the business
4. Strategic Objectives - 5-7 specific, measurable objectives for the next 1-3 years
5. Key Success Metrics - How success will be measured

Make it compelling, specific, and aligned with the market opportunities.`,
      response_json_schema: {
        type: "object",
        properties: {
          mission: { type: "string" },
          vision: { type: "string" },
          core_values: { type: "array", items: { type: "string" } },
          objectives: { type: "array", items: { type: "string" } },
          success_metrics: { type: "array", items: { type: "string" } },
          competitive_advantages: { type: "array", items: { type: "string" } }
        }
      }
    });

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a comprehensive, competition-beating business plan based on market research:
        
Business Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience || 'General consumers'}
Location: ${project.location || 'United States'}

=== MARKET RESEARCH INSIGHTS ===
Market Size: ${marketResearch?.market_size || 'Not available'}
Growth Trends: ${marketResearch?.growth_trends || 'Not available'}
Industry Overview: ${marketResearch?.industry_overview || 'Not available'}

=== COMPETITOR ANALYSIS ===
${marketResearch?.competitors?.map(c => `
Competitor: ${c.name}
- Weaknesses to exploit: ${c.weaknesses?.join(', ')}
- Their pricing: ${c.pricing}
`).join('\n') || 'No competitor data'}

=== MARKET OPPORTUNITIES ===
${marketResearch?.opportunities?.join('\n- ') || 'Not available'}

=== MARKET GAPS TO FILL ===
${marketResearch?.market_gaps?.join('\n- ') || 'Not available'}

=== CUSTOMER PAIN POINTS ===
${marketResearch?.customer_pain_points?.join('\n- ') || 'Not available'}

=== YOUR UNIQUE VALUE PROPOSITION ===
${uvp || 'Not defined'}

=== YOUR COMPETITIVE ADVANTAGES ===
${advantages?.join('\n- ') || 'Not defined'}

=== PRICING INSIGHTS ===
Low-end: ${marketResearch?.pricing_insights?.low_end || 'N/A'}
Mid-range: ${marketResearch?.pricing_insights?.mid_range || 'N/A'}
Premium: ${marketResearch?.pricing_insights?.premium || 'N/A'}
Recommendation: ${marketResearch?.pricing_insights?.recommendation || 'N/A'}

=== TARGET KEYWORDS ===
${marketResearch?.keywords?.join(', ') || 'Not available'}

Generate a STRATEGIC business plan that:
1. Directly addresses competitor weaknesses
2. Fills identified market gaps
3. Solves customer pain points
4. Leverages your unique advantages
5. Includes specific strategies to outperform each competitor

Sections needed:
1. Executive Summary (emphasize competitive differentiation)
2. Company Description (highlight unique positioning)
3. Market Analysis (reference the research data)
4. Products/Services (designed to beat competitors)
5. Marketing Strategy (target competitor weaknesses, use keywords)
6. Operations Plan (optimized for efficiency)
7. Financial Projections (realistic based on market data)
8. Competitive Battle Plan (specific tactics vs each competitor)
9. Key Success Factors

Be specific, actionable, and show exactly how this business will OUTPERFORM competitors. Format nicely with markdown.`,
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
          competitive_battle_plan: { type: "string" },
          key_success_factors: { type: "string" },
          full_plan_markdown: { type: "string" }
        }
      }
    });
    
    await onUpdate({
      business_plan: {
        ...response,
        ...strategyResponse
      },
      current_step: Math.max(project.current_step || 1, 2)
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
          Strategic Business Plan
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          AI creates a competition-beating plan based on your market research
        </p>
      </div>

      {/* Research Summary */}
      {project?.market_research && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Competitors analyzed:</span>
                <span className="font-semibold text-violet-700">{project.market_research.competitors?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Opportunities found:</span>
                <span className="font-semibold text-emerald-700">{project.market_research.opportunities?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Market gaps:</span>
                <span className="font-semibold text-amber-700">{project.market_research.market_gaps?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!businessPlan ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Create Your Strategic Plan</h3>
              <p className="text-slate-500 max-w-lg mx-auto">
                Our AI will use your market research data to create a business plan specifically designed to outperform your competitors.
              </p>
            </div>
            <Button
              onClick={generateBusinessPlan}
              disabled={isGenerating}
              className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Strategic Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Competition-Beating Plan
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
                    <TabsTrigger value="battle">Battle Plan</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                  </TabsList>
                  <TabsContent value="full" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.full_plan_markdown}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="executive" className="prose prose-slate max-w-none">
                    <ReactMarkdown>{businessPlan.executive_summary}</ReactMarkdown>
                  </TabsContent>
                  <TabsContent value="battle" className="prose prose-slate max-w-none">
                    <div className="not-prose mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800 font-medium">🎯 Competitive Battle Plan - Strategies to outperform each competitor</p>
                    </div>
                    <ReactMarkdown>{businessPlan.competitive_battle_plan}</ReactMarkdown>
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

          <div className="flex justify-between">
            <Button
              onClick={onPrev}
              variant="outline"
              className="h-12 px-6 border-slate-200"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Research
            </Button>
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