import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, RefreshCw, Pencil, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import RichContent from '@/components/ui/RichContent';

export default function BusinessPlanStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [planOutline, setPlanOutline] = useState(project?.business_plan_outline || null);

  // Auto-generate outline if not yet created and market research is available
  useEffect(() => {
    if (!planOutline && !isGeneratingOutline && project?.market_research && !project?.business_plan) {
      generateOutline();
    }
  }, []);

  const generateOutline = async () => {
    setIsGeneratingOutline(true);
    const marketResearch = project?.market_research;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are creating a 30-Year Strategic Business Plan OUTLINE for a client's business. This is the core product we deliver.

Business Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience || 'General consumers'}
Location: ${project.location || 'United States'}
Unique Value Proposition: ${project?.unique_value_proposition || 'Not yet defined'}
Market Size: ${marketResearch?.market_size || 'TBD'}
Key Opportunities: ${marketResearch?.opportunities?.slice(0, 3).join(', ') || 'TBD'}

Create a 30-year strategic roadmap broken into 6 phases. Each phase must be SPECIFIC to this business — its industry, audience, and goals. Do NOT use generic placeholders.

For each phase provide:
- A title that reflects THIS business's journey
- A clear objective tied to the actual business
- 3–4 specific focus areas for this business
- 2–3 deliverables unique to this industry
- A realistic revenue target based on the market
- A one-sentence tagline that captures the phase's purpose`,
      response_json_schema: {
        type: "object",
        properties: {
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase: { type: "string" },
                years: { type: "string" },
                title: { type: "string" },
                objective: { type: "string" },
                focus: { type: "array", items: { type: "string" } },
                deliverables: { type: "array", items: { type: "string" } },
                revenue: { type: "string" },
                tagline: { type: "string" }
              }
            }
          },
          financial_arc: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" }
              }
            }
          }
        }
      }
    });

    setPlanOutline(response);
    await onUpdate({ business_plan_outline: response });
    setIsGeneratingOutline(false);
  };

  const generateBusinessPlan = async () => {
    setIsGenerating(true);
    
    const marketResearch = project?.market_research;
    const uvp = project?.unique_value_proposition;
    const advantages = project?.competitive_advantages;

    // Generate comprehensive business plan with investor-ready professional structure
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are creating an INVESTOR-READY, PROFESSIONAL 30-YEAR BUSINESS PLAN that matches the quality and depth of PrometAI and top-tier business plan software.

⚠️ CRITICAL BRAND STANDARD: All business plans MUST include 30-year financial projections and strategic planning horizons as our platform standard.

=== BUSINESS INFORMATION ===
Business Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience || 'General consumers'}
Location: ${project.location || 'United States'}

=== MARKET INTELLIGENCE ===
Market Size: ${marketResearch?.market_size || 'Not available'}
Growth Trends: ${marketResearch?.growth_trends || 'Not available'}
Industry Overview: ${marketResearch?.industry_overview || 'Not available'}

Competitors Analyzed:
${marketResearch?.competitors?.map(c => `
  • ${c.name}
    - Strengths: ${c.strengths?.join(', ') || 'N/A'}
    - Weaknesses: ${c.weaknesses?.join(', ') || 'N/A'}
    - Pricing: ${c.pricing || 'N/A'}
    - Market Position: ${c.market_share || 'N/A'}
`).join('\n') || 'No competitor data'}

Market Opportunities: ${marketResearch?.opportunities?.join(', ') || 'Not available'}
Market Gaps: ${marketResearch?.market_gaps?.join(', ') || 'Not available'}
Customer Pain Points: ${marketResearch?.customer_pain_points?.join(', ') || 'Not available'}
Keywords: ${marketResearch?.keywords?.join(', ') || 'Not available'}

Value Proposition: ${uvp || 'Not defined'}
Competitive Advantages: ${advantages?.join(', ') || 'Not defined'}

Pricing Analysis:
- Low-end: ${marketResearch?.pricing_insights?.low_end || 'N/A'}
- Mid-range: ${marketResearch?.pricing_insights?.mid_range || 'N/A'}  
- Premium: ${marketResearch?.pricing_insights?.premium || 'N/A'}
- Recommendation: ${marketResearch?.pricing_insights?.recommendation || 'N/A'}

=== REQUIRED STRUCTURE (following PrometAI standard) ===

Create a comprehensive, investor-ready business plan with the following sections. Each section must be detailed, data-driven, and professionally written:

1. **EXECUTIVE SUMMARY** (2-3 pages)
   - Company overview and mission
   - Problem statement and solution
   - Target market snapshot
   - Unique value proposition
   - Competitive advantage summary
   - Financial highlights (3-5 year projections)
   - Funding requirements (if applicable)
   - Key success factors

2. **COMPANY DESCRIPTION** (2-3 pages)
   - Detailed business background
   - Legal structure and ownership
   - Location and facilities
   - Mission statement
   - Vision statement (5-10 year outlook)
   - Core values (3-5 principles)
   - Key milestones and achievements
   - Strategic partnerships

3. **MARKET ANALYSIS** (4-5 pages)
   - Industry overview and trends
   - Market size and growth projections
   - Target market segmentation
   - Customer demographics and psychographics
   - Customer needs and pain points
   - Buying behavior patterns
   - Market positioning map
   - Regulatory environment

4. **COMPETITIVE ANALYSIS** (3-4 pages)
   - Detailed competitor profiles (top 5-7)
   - Competitive comparison matrix
   - Market share analysis
   - Competitive advantages and disadvantages
   - Barriers to entry
   - Strategic positioning
   - Differentiation strategy

5. **ORGANIZATION & MANAGEMENT** (2-3 pages)
   - Organizational structure chart
   - Management team profiles
   - Key personnel and roles
   - Board of directors/advisors
   - Staffing plan
   - Human resources strategy
   - Company culture and values
   - Compensation structure

6. **PRODUCTS & SERVICES** (3-4 pages)
   - Detailed product/service descriptions
   - Features and benefits analysis
   - Product lifecycle
   - Intellectual property and proprietary technology
   - Research & development plans
   - Future product roadmap
   - Pricing strategy
   - Supplier and vendor relationships

7. **MARKETING & SALES STRATEGY** (4-5 pages)
   - Marketing strategy overview
   - Brand positioning
   - Customer acquisition strategy
   - Marketing channels and tactics
   - Sales process and methodology
   - Sales team structure
   - Pricing and promotion strategies
   - Customer retention and loyalty programs
   - Marketing budget and ROI projections

8. **OPERATIONS PLAN** (3-4 pages)
   - Production/delivery process
   - Facilities and equipment
   - Technology and systems
   - Supply chain management
   - Quality control procedures
   - Inventory management
   - Key operational milestones
   - Scalability plans

9. **FINANCIAL PROJECTIONS - 30 YEAR HORIZON** (6-8 pages)
   - Revenue model and scalability
   - 30-YEAR financial forecasts (detailed Years 1-5, then 10, 15, 20, 25, 30):
     * Income statements
     * Cash flow projections
     * Balance sheets
     * Break-even analysis
   - Long-term growth trajectories
   - Market expansion phases (Years 1-5, 6-15, 16-30)
   - Key financial ratios and benchmarks
   - Assumptions and justifications for 30-year outlook
   - Funding requirements across growth stages
   - Use of funds by phase
   - Exit strategy and succession planning (Year 20-30)

10. **RISK ANALYSIS** (2-3 pages)
    - Market risks
    - Competitive risks
    - Financial risks
    - Operational risks
    - Regulatory and legal risks
    - Mitigation strategies
    - Contingency plans

11. **IMPLEMENTATION TIMELINE** (1-2 pages)
    - 12-18 month detailed roadmap
    - Key milestones and deliverables
    - Resource allocation
    - Success metrics and KPIs

12. **APPENDIX**
    - Supporting documents
    - Market research data
    - Product specifications
    - Legal documents
    - Financial calculations

=== QUALITY REQUIREMENTS ===
- Write at a professional MBA-level
- Use specific data and numbers (not vague statements)
- Include industry benchmarks and comparisons
- Provide actionable strategies and tactics
- Make it investor-ready with clear ROI
- Use professional business language
- Include specific timeframes and milestones
- Back all claims with market research data
- Format beautifully with markdown headers, lists, tables

Generate a COMPLETE, DETAILED business plan that would impress any investor or bank. Make it comprehensive and professional.`,
      response_json_schema: {
        type: "object",
        properties: {
          executive_summary: { type: "string", description: "Comprehensive executive summary with 30-year vision (2-3 pages worth)" },
          company_description: { type: "string", description: "Detailed company overview with mission, vision, values, and long-term aspirations" },
          market_analysis: { type: "string", description: "In-depth market analysis with data, trends, and 30-year market evolution" },
          competitive_analysis: { type: "string", description: "Detailed competitor analysis with comparison matrix" },
          organization_management: { type: "string", description: "Org structure, management team, staffing plan with growth phases" },
          products_services: { type: "string", description: "Detailed product/service descriptions with 30-year innovation roadmap" },
          marketing_sales_strategy: { type: "string", description: "Comprehensive marketing and sales plan with multi-decade strategy" },
          operations_plan: { type: "string", description: "Detailed operations and logistics plan with scaling roadmap" },
          financial_projections_30yr: { type: "string", description: "30-YEAR financial forecasts: detailed Years 1-5, then 10, 15, 20, 25, 30 with growth assumptions" },
          risk_analysis: { type: "string", description: "Risk assessment and mitigation strategies for all business phases" },
          implementation_timeline: { type: "string", description: "Multi-year roadmap: Year 1-2 detailed, then 5yr, 10yr, 20yr, 30yr milestones" },
          appendix_notes: { type: "string", description: "Supporting documentation notes" },
          full_plan_markdown: { type: "string", description: "Complete formatted 30-year business plan" }
        }
      }
    });
    
    await onUpdate({
      business_plan: response,
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
          AI-Powered 30-Year Business Plan
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Advanced AI creates investor-ready 30-year strategic plan based on market research
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
        <div className="space-y-6">
          {/* Business Plan Outline based on entered info */}
          <Card className="wizard-card border-0">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Business Plan Outline — {project?.business_name || 'Your Business'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Business Info Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                {project?.industry && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Industry</p>
                    <p className="text-slate-800 font-medium">{project.industry}</p>
                  </div>
                )}
                {project?.target_audience && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Audience</p>
                    <p className="text-slate-800 font-medium">{project.target_audience}</p>
                  </div>
                )}
                {project?.location && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Market / Location</p>
                    <p className="text-slate-800 font-medium">{project.location}</p>
                  </div>
                )}
                {project?.unique_value_proposition && (
                  <div className="bg-violet-50 rounded-xl p-4 md:col-span-2">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Unique Value Proposition</p>
                    <p className="text-slate-800">{project.unique_value_proposition}</p>
                  </div>
                )}
              </div>

              {project?.description && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Business Description</p>
                  <p className="text-slate-700">{project.description}</p>
                </div>
              )}

              {/* 30-Year Strategic Roadmap — AI Generated */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">30-Year Strategic Growth Roadmap</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateOutline}
                    disabled={isGeneratingOutline}
                    className="border-slate-200 text-xs"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${isGeneratingOutline ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>

                {isGeneratingOutline ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    <p className="text-sm font-medium text-slate-600">AI is building your 30-year roadmap...</p>
                    <p className="text-xs text-slate-400">Personalizing based on your business and market research</p>
                  </div>
                ) : planOutline?.phases ? (
                  <>
                    <div className="space-y-3">
                      {planOutline.phases.map((phase, i) => {
                        const colors = [
                          { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-600', text: 'text-violet-700', dot: 'bg-violet-400' },
                          { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-600', text: 'text-indigo-700', dot: 'bg-indigo-400' },
                          { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-600', text: 'text-blue-700', dot: 'bg-blue-400' },
                          { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-600', text: 'text-emerald-700', dot: 'bg-emerald-400' },
                          { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', text: 'text-amber-700', dot: 'bg-amber-400' },
                          { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-600', text: 'text-rose-700', dot: 'bg-rose-400' },
                        ];
                        const c = colors[i % colors.length];
                        return (
                          <div key={i} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                            <div className="flex items-start gap-3">
                              <div className={`${c.badge} text-white text-xs font-bold rounded-lg px-2.5 py-1.5 flex-shrink-0`}>
                                Phase {phase.phase || (i + 1)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className={`font-bold text-sm ${c.text}`}>{phase.title}</span>
                                  <span className="text-xs text-slate-400 font-medium">{phase.years}</span>
                                </div>
                                <p className="text-xs text-slate-600 mb-2">{phase.objective}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                                  {phase.focus?.map((f, j) => (
                                    <span key={j} className="text-xs text-slate-500 flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />{f}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <span className={`text-xs font-semibold ${c.text}`}>🎯 {phase.revenue}</span>
                                  <span className="text-xs text-slate-400 italic">{phase.tagline}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Financial Arc */}
                    {planOutline.financial_arc?.length > 0 && (
                      <div className="mt-4 bg-slate-900 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Financial Arc (Conservative Model)</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {planOutline.financial_arc.map(({ label, value }) => (
                            <div key={label} className="text-center bg-slate-800 rounded-lg p-2">
                              <p className="text-xs text-slate-400 mb-1">{label}</p>
                              <p className="text-sm font-bold text-emerald-400">{value}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center italic">Based on disciplined scaling — not hype.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Complete market research first to generate your personalized roadmap.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={generateBusinessPlan}
              disabled={isGenerating}
              className="h-14 px-10 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating Your Business Plan...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" />Generate Full Business Plan</>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="wizard-card border-0 overflow-hidden">
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
                  <TabsList className="mb-4 bg-slate-100 flex-wrap">
                    <TabsTrigger value="full">Full Plan</TabsTrigger>
                    <TabsTrigger value="executive">Executive</TabsTrigger>
                    <TabsTrigger value="market">Market Analysis</TabsTrigger>
                    <TabsTrigger value="competitive">Competition</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="operations">Operations</TabsTrigger>
                    <TabsTrigger value="financial">Financials</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                  </TabsList>
                  {[
                    { value: 'full', content: businessPlan.full_plan_markdown || '' },
                    { value: 'executive', content: businessPlan.executive_summary },
                    { value: 'market', content: businessPlan.market_analysis },
                    { value: 'competitive', content: businessPlan.competitive_analysis },
                    { value: 'products', content: businessPlan.products_services },
                    { value: 'marketing', content: businessPlan.marketing_sales_strategy },
                    { value: 'operations', content: businessPlan.operations_plan },
                    { value: 'financial', content: businessPlan.financial_projections_30yr || businessPlan.financial_projections },
                    { value: 'risks', content: businessPlan.risk_analysis },
                  ].map(({ value, content }) => (
                    <TabsContent key={value} value={value}>
                      <RichContent content={content} />
                    </TabsContent>
                  ))}
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