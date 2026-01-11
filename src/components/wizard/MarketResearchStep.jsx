import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Search, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Globe,
  DollarSign,
  Zap,
  Shield,
  Eye
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketResearchStep({ project, onUpdate, onNext }) {
  const [isResearching, setIsResearching] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [researchPhase, setResearchPhase] = useState('');
  const [formData, setFormData] = useState({
    business_name: project?.business_name || '',
    industry: project?.industry || '',
    description: project?.description || '',
    target_audience: project?.target_audience || '',
    location: project?.location || ''
  });

  const conductMarketResearch = async () => {
    if (!formData.business_name || !formData.industry || !formData.description) return;
    
    setIsResearching(true);
    setResearchProgress(0);

    // Phase 1: Industry Analysis
    setResearchPhase('Analyzing industry trends and market size...');
    setResearchProgress(15);

    const industryAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Conduct comprehensive market research for a new business:

Business Idea: ${formData.business_name}
Industry: ${formData.industry}
Description: ${formData.description}
Target Audience: ${formData.target_audience || 'General consumers'}
Location/Market: ${formData.location || 'United States'}

Provide detailed market intelligence including:
1. Industry overview and current state
2. Market size estimation (TAM, SAM, SOM)
3. Growth trends and projections
4. Key market drivers and challenges
5. Regulatory considerations if any`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          industry_overview: { type: "string" },
          market_size: { type: "string" },
          growth_trends: { type: "string" },
          market_drivers: { type: "array", items: { type: "string" } },
          challenges: { type: "array", items: { type: "string" } },
          regulatory_notes: { type: "string" }
        }
      }
    });

    setResearchProgress(35);
    setResearchPhase('Identifying and analyzing competitors...');

    // Phase 2: Competitor Analysis
    const competitorAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Identify and analyze the top competitors for this business:

Business: ${formData.business_name}
Industry: ${formData.industry}
Description: ${formData.description}
Location: ${formData.location || 'United States'}

Find 5-7 real competitors (existing businesses) and analyze:
1. Company name and website
2. Their strengths (what they do well)
3. Their weaknesses (where they fall short)
4. Pricing strategy
5. Market positioning
6. Estimated market share or size

Be specific and use real company data from the internet.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          competitors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                website: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                pricing: { type: "string" },
                positioning: { type: "string" },
                market_share: { type: "string" }
              }
            }
          }
        }
      }
    });

    setResearchProgress(55);
    setResearchPhase('Analyzing customer pain points and opportunities...');

    // Phase 3: Customer & Opportunity Analysis
    const opportunityAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on competitor analysis, identify opportunities for this business:

Business: ${formData.business_name}
Industry: ${formData.industry}
Description: ${formData.description}
Target Audience: ${formData.target_audience}

Competitors analyzed: ${competitorAnalysis.competitors?.map(c => c.name).join(', ')}

Identify:
1. Customer pain points not being addressed by competitors
2. Market gaps and unmet needs
3. Opportunities for differentiation
4. Potential threats to be aware of
5. Keywords customers search for
6. Pricing insights and recommendations
7. Target demographic details (age, income, behavior, preferences)`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          customer_pain_points: { type: "array", items: { type: "string" } },
          market_gaps: { type: "array", items: { type: "string" } },
          opportunities: { type: "array", items: { type: "string" } },
          threats: { type: "array", items: { type: "string" } },
          keywords: { type: "array", items: { type: "string" } },
          pricing_insights: {
            type: "object",
            properties: {
              low_end: { type: "string" },
              mid_range: { type: "string" },
              premium: { type: "string" },
              recommendation: { type: "string" }
            }
          },
          target_demographics: {
            type: "object",
            properties: {
              age_range: { type: "string" },
              income_level: { type: "string" },
              behaviors: { type: "array", items: { type: "string" } },
              preferences: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    });

    setResearchProgress(75);
    setResearchPhase('Developing competitive strategies...');

    // Phase 4: Strategy Development
    const strategyDevelopment = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on the market research, develop winning strategies for this business:

Business: ${formData.business_name}
Industry: ${formData.industry}
Description: ${formData.description}

Competitor Weaknesses Found:
${competitorAnalysis.competitors?.map(c => `- ${c.name}: ${c.weaknesses?.join(', ')}`).join('\n')}

Market Gaps: ${opportunityAnalysis.market_gaps?.join(', ')}
Customer Pain Points: ${opportunityAnalysis.customer_pain_points?.join(', ')}

Create:
1. Unique Value Proposition that addresses competitor weaknesses
2. 5 key competitive advantages to emphasize
3. Differentiation strategies
4. Brand personality traits that will resonate with the target audience
5. Recommended brand colors (with hex codes) that differentiate from competitors and appeal to the target demographic
6. Positioning statement`,
      response_json_schema: {
        type: "object",
        properties: {
          unique_value_proposition: { type: "string" },
          competitive_advantages: { type: "array", items: { type: "string" } },
          differentiation_strategies: { type: "array", items: { type: "string" } },
          brand_personality: {
            type: "object",
            properties: {
              traits: { type: "array", items: { type: "string" } },
              tone_of_voice: { type: "string" },
              visual_style: { type: "string" }
            }
          },
          brand_colors: {
            type: "object",
            properties: {
              primary: { type: "string" },
              secondary: { type: "string" },
              accent: { type: "string" },
              rationale: { type: "string" }
            }
          },
          positioning_statement: { type: "string" }
        }
      }
    });

    setResearchProgress(100);
    setResearchPhase('Research complete!');

    // Combine all research
    const marketResearch = {
      industry_overview: industryAnalysis.industry_overview,
      market_size: industryAnalysis.market_size,
      growth_trends: industryAnalysis.growth_trends,
      market_drivers: industryAnalysis.market_drivers,
      challenges: industryAnalysis.challenges,
      competitors: competitorAnalysis.competitors,
      customer_pain_points: opportunityAnalysis.customer_pain_points,
      market_gaps: opportunityAnalysis.market_gaps,
      opportunities: opportunityAnalysis.opportunities,
      threats: opportunityAnalysis.threats,
      keywords: opportunityAnalysis.keywords,
      pricing_insights: opportunityAnalysis.pricing_insights,
      target_demographics: opportunityAnalysis.target_demographics,
      differentiation_strategies: strategyDevelopment.differentiation_strategies
    };

    await onUpdate({
      ...formData,
      market_research: marketResearch,
      unique_value_proposition: strategyDevelopment.unique_value_proposition,
      competitive_advantages: strategyDevelopment.competitive_advantages,
      brand_personality: strategyDevelopment.brand_personality,
      brand_colors: strategyDevelopment.brand_colors,
      current_step: 1,
      status: 'in_progress'
    });

    setIsResearching(false);
  };

  const research = project?.market_research;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
          <Search className="w-4 h-4" />
          AI-Powered Market Intelligence
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Competitive Market Research
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Our AI analyzes your industry, competitors, and market opportunities to build a brand that outperforms
        </p>
      </div>

      {!research ? (
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Target Audience</Label>
                <Input
                  placeholder="e.g., Small business owners, Tech startups"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Location / Market</Label>
                <Input
                  placeholder="e.g., United States, New York, Global"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12 border-slate-200 focus:border-violet-400 focus:ring-violet-400"
                />
              </div>
            </div>

            {isResearching ? (
              <div className="space-y-4 py-6">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                  <span className="text-lg font-medium text-slate-700">{researchPhase}</span>
                </div>
                <Progress value={researchProgress} className="h-2" />
                <p className="text-center text-sm text-slate-500">
                  Gathering real-time market intelligence...
                </p>
              </div>
            ) : (
              <Button
                onClick={conductMarketResearch}
                disabled={!formData.business_name || !formData.industry || !formData.description}
                className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                Conduct AI Market Research
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{research.competitors?.length || 0}</p>
                <p className="text-sm opacity-80">Competitors Analyzed</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-4">
                <Lightbulb className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{research.opportunities?.length || 0}</p>
                <p className="text-sm opacity-80">Opportunities Found</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <Target className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{research.market_gaps?.length || 0}</p>
                <p className="text-sm opacity-80">Market Gaps</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{project.competitive_advantages?.length || 0}</p>
                <p className="text-sm opacity-80">Advantages</p>
              </CardContent>
            </Card>
          </div>

          {/* UVP Card */}
          {project.unique_value_proposition && (
            <Card className="border-0 shadow-xl bg-gradient-to-r from-violet-50 to-indigo-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Your Unique Value Proposition</h3>
                    <p className="text-lg text-slate-700">{project.unique_value_proposition}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Research Tabs */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Market Intelligence Report</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={conductMarketResearch}
                  disabled={isResearching}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isResearching ? 'animate-spin' : ''}`} />
                  Refresh Research
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="competitors" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6 bg-slate-100">
                  <TabsTrigger value="competitors">Competitors</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="strategy">Strategy</TabsTrigger>
                </TabsList>

                <TabsContent value="competitors" className="space-y-4">
                  <div className="grid gap-4">
                    {research.competitors?.map((competitor, i) => (
                      <Card key={i} className="border shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-800">{competitor.name}</h4>
                              {competitor.website && (
                                <a href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 hover:underline flex items-center gap-1">
                                  <Globe className="w-3 h-3" /> {competitor.website}
                                </a>
                              )}
                            </div>
                            <Badge variant="secondary">{competitor.market_share || 'N/A'}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-emerald-600 mb-2">STRENGTHS</p>
                              <ul className="space-y-1">
                                {competitor.strengths?.map((s, j) => (
                                  <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="text-emerald-500">+</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-red-600 mb-2">WEAKNESSES (Your Opportunities)</p>
                              <ul className="space-y-1">
                                {competitor.weaknesses?.map((w, j) => (
                                  <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="text-red-500">−</span> {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t flex gap-4 text-sm">
                            <span><strong>Pricing:</strong> {competitor.pricing}</span>
                            <span><strong>Position:</strong> {competitor.positioning}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="opportunities" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        Market Opportunities
                      </h4>
                      <div className="space-y-2">
                        {research.opportunities?.map((opp, i) => (
                          <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm text-slate-700">{opp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-violet-500" />
                        Market Gaps to Fill
                      </h4>
                      <div className="space-y-2">
                        {research.market_gaps?.map((gap, i) => (
                          <div key={i} className="p-3 bg-violet-50 rounded-lg border border-violet-200">
                            <p className="text-sm text-slate-700">{gap}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Customer Pain Points to Address
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {research.customer_pain_points?.map((pain, i) => (
                        <Badge key={i} variant="outline" className="bg-amber-50 border-amber-200 text-amber-800">
                          {pain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="audience" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Target Demographics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Age Range</span>
                          <span className="font-medium">{research.target_demographics?.age_range}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Income Level</span>
                          <span className="font-medium">{research.target_demographics?.income_level}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Behaviors & Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {research.target_demographics?.behaviors?.map((b, i) => (
                            <Badge key={i} variant="secondary">{b}</Badge>
                          ))}
                          {research.target_demographics?.preferences?.map((p, i) => (
                            <Badge key={i} variant="outline">{p}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Search Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {research.keywords?.map((kw, i) => (
                        <Badge key={i} className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-slate-500 mb-1">Budget Tier</p>
                        <p className="text-xl font-bold text-slate-800">{research.pricing_insights?.low_end}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-violet-300 shadow-lg">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-violet-600 mb-1">Mid-Range</p>
                        <p className="text-xl font-bold text-slate-800">{research.pricing_insights?.mid_range}</p>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-slate-500 mb-1">Premium Tier</p>
                        <p className="text-xl font-bold text-slate-800">{research.pricing_insights?.premium}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="border-0 bg-gradient-to-r from-violet-50 to-indigo-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-violet-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-800">AI Recommendation</p>
                          <p className="text-slate-600">{research.pricing_insights?.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="strategy" className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Your Competitive Advantages
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {project.competitive_advantages?.map((adv, i) => (
                        <div key={i} className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                          <p className="text-slate-700 flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">{i + 1}.</span> {adv}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Differentiation Strategies</h4>
                    <div className="space-y-2">
                      {research.differentiation_strategies?.map((strat, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-700">{strat}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {project.brand_personality && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Recommended Brand Personality</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.brand_personality.traits?.map((trait, i) => (
                          <Badge key={i} className="bg-violet-100 text-violet-800">{trait}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600"><strong>Tone:</strong> {project.brand_personality.tone_of_voice}</p>
                      <p className="text-sm text-slate-600"><strong>Visual Style:</strong> {project.brand_personality.visual_style}</p>
                    </div>
                  )}
                  {project.brand_colors && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Strategic Brand Colors</h4>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: project.brand_colors.primary }} />
                          <span className="text-sm text-slate-600">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: project.brand_colors.secondary }} />
                          <span className="text-sm text-slate-600">Secondary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: project.brand_colors.accent }} />
                          <span className="text-sm text-slate-600">Accent</span>
                        </div>
                      </div>
                      {project.brand_colors.rationale && (
                        <p className="text-sm text-slate-500 italic">{project.brand_colors.rationale}</p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={onNext}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              Continue to Business Plan
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}