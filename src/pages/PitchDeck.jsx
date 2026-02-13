import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Download, Eye, Presentation, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PitchDeckViewer from '@/components/pitch/PitchDeckViewer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PitchDeck() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.BusinessProject.list(`id="${projectId}"`).then(res => res[0]),
    enabled: !!projectId
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list('-created_date')
  });

  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [pitchDeck, setPitchDeck] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customization, setCustomization] = useState({
    theme: 'professional',
    includeTeam: true,
    fundingAsk: '',
    useOfFunds: '',
    keyMetrics: ''
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const generatePitchDeck = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    setIsGenerating(true);

    try {
      const selectedProject = allProjects.find(p => p.id === selectedProjectId);
      if (!selectedProject) throw new Error('Project not found');

      const marketResearch = selectedProject.market_research || {};
      const businessPlan = selectedProject.business_plan || {};
      const financialData = selectedProject.financial_data || {};

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional, investor-ready pitch deck for this business. Make it compelling, data-driven, and visually descriptive.

BUSINESS INFORMATION:
Name: ${selectedProject.business_name}
Industry: ${selectedProject.industry}
Description: ${selectedProject.description}
Target Audience: ${selectedProject.target_audience}
Location: ${selectedProject.location}
UVP: ${selectedProject.unique_value_proposition}

MARKET RESEARCH:
Market Size: ${marketResearch.market_size}
Growth Rate: ${marketResearch.growth_rate}
Industry Overview: ${marketResearch.industry_overview}
Competitors: ${marketResearch.competitors?.map(c => c.name).join(', ')}
Market Opportunities: ${marketResearch.opportunities?.join(', ')}
Customer Pain Points: ${marketResearch.customer_pain_points?.join(', ')}

BUSINESS PLAN HIGHLIGHTS:
${businessPlan.executive_summary?.substring(0, 500) || 'Executive summary not available'}

FINANCIAL DATA:
Year 1 Revenue: $${financialData.revenue_streams?.reduce((sum, s) => sum + (s.year1_revenue || 0), 0) || 0}
Total Startup Costs: $${Object.values(financialData.startup_costs || {}).reduce((sum, v) => sum + v, 0)}
Break-even: Month ${financialData.projections?.break_even_analysis?.month_achieved || 'TBD'}

CUSTOM REQUIREMENTS:
Funding Ask: ${customization.fundingAsk || 'Not specified'}
Use of Funds: ${customization.useOfFunds || 'Not specified'}
Key Metrics: ${customization.keyMetrics || 'Standard metrics'}

Generate a complete pitch deck with these slides. Each slide should have:
1. A compelling title
2. Detailed bullet points or content
3. Visual descriptions (for charts/images to be added)
4. Speaker notes for presenting

SLIDE STRUCTURE:

1. COVER SLIDE
   - Company name and tagline
   - Key visual description
   - Presenter information

2. PROBLEM
   - What problem are we solving?
   - Market pain points
   - Current inadequate solutions
   - Why now?

3. SOLUTION
   - Our product/service
   - How it solves the problem
   - Unique approach
   - Key differentiators

4. MARKET OPPORTUNITY
   - Total Addressable Market (TAM)
   - Serviceable Addressable Market (SAM)
   - Serviceable Obtainable Market (SOM)
   - Market trends and growth
   - Target customer segments

5. BUSINESS MODEL
   - Revenue streams
   - Pricing strategy
   - Unit economics
   - Customer acquisition strategy

6. COMPETITIVE LANDSCAPE
   - Key competitors
   - Competitive advantages
   - Market positioning
   - Barriers to entry

7. GO-TO-MARKET STRATEGY
   - Marketing channels
   - Sales strategy
   - Partnerships
   - Growth roadmap

8. TRACTION & MILESTONES
   - Key achievements to date
   - Current metrics
   - Upcoming milestones
   - Timeline

9. FINANCIALS
   - 5-year revenue projections
   - Key financial metrics
   - Unit economics
   - Path to profitability

10. TEAM (if requested)
    - Founders and key team members
    - Relevant experience
    - Advisors
    - Why we're uniquely qualified

11. THE ASK
    - Funding amount needed
    - Use of funds breakdown
    - Expected outcomes
    - Timeline and milestones

12. CLOSING
    - Vision for the future
    - Call to action
    - Contact information

Make each slide investor-focused, concise, and impactful. Use numbers and data wherever possible.`,
        response_json_schema: {
          type: "object",
          properties: {
            cover: {
              type: "object",
              properties: {
                title: { type: "string" },
                tagline: { type: "string" },
                visual_description: { type: "string" },
                presenter: { type: "string" }
              }
            },
            problem: {
              type: "object",
              properties: {
                title: { type: "string" },
                headline: { type: "string" },
                pain_points: { type: "array", items: { type: "string" } },
                current_solutions: { type: "string" },
                why_now: { type: "string" },
                speaker_notes: { type: "string" }
              }
            },
            solution: {
              type: "object",
              properties: {
                title: { type: "string" },
                headline: { type: "string" },
                description: { type: "string" },
                key_features: { type: "array", items: { type: "string" } },
                differentiators: { type: "array", items: { type: "string" } },
                speaker_notes: { type: "string" }
              }
            },
            market: {
              type: "object",
              properties: {
                title: { type: "string" },
                tam: { type: "string" },
                sam: { type: "string" },
                som: { type: "string" },
                growth_rate: { type: "string" },
                trends: { type: "array", items: { type: "string" } },
                target_segments: { type: "array", items: { type: "string" } },
                speaker_notes: { type: "string" }
              }
            },
            business_model: {
              type: "object",
              properties: {
                title: { type: "string" },
                revenue_streams: { type: "array", items: { type: "string" } },
                pricing: { type: "string" },
                unit_economics: { type: "object" },
                customer_acquisition: { type: "string" },
                speaker_notes: { type: "string" }
              }
            },
            competition: {
              type: "object",
              properties: {
                title: { type: "string" },
                competitors: { type: "array", items: { type: "string" } },
                advantages: { type: "array", items: { type: "string" } },
                positioning: { type: "string" },
                barriers: { type: "array", items: { type: "string" } },
                speaker_notes: { type: "string" }
              }
            },
            go_to_market: {
              type: "object",
              properties: {
                title: { type: "string" },
                channels: { type: "array", items: { type: "string" } },
                sales_strategy: { type: "string" },
                partnerships: { type: "array", items: { type: "string" } },
                roadmap: { type: "array", items: { type: "string" } },
                speaker_notes: { type: "string" }
              }
            },
            traction: {
              type: "object",
              properties: {
                title: { type: "string" },
                achievements: { type: "array", items: { type: "string" } },
                metrics: { type: "array", items: { type: "string" } },
                milestones: { type: "array", items: { type: "string" } },
                speaker_notes: { type: "string" }
              }
            },
            financials: {
              type: "object",
              properties: {
                title: { type: "string" },
                projections: { type: "array", items: { type: "object" } },
                key_metrics: { type: "array", items: { type: "string" } },
                path_to_profit: { type: "string" },
                speaker_notes: { type: "string" }
              }
            },
            team: {
              type: "object",
              properties: {
                title: { type: "string" },
                members: { type: "array", items: { type: "object" } },
                advisors: { type: "array", items: { type: "string" } },
                why_us: { type: "string" },
                speaker_notes: { type: "string" }
              }
            },
            ask: {
              type: "object",
              properties: {
                title: { type: "string" },
                amount: { type: "string" },
                use_of_funds: { type: "array", items: { type: "object" } },
                outcomes: { type: "array", items: { type: "string" } },
                timeline: { type: "string" },
                speaker_notes: { type: "string" }
              }
            },
            closing: {
              type: "object",
              properties: {
                title: { type: "string" },
                vision: { type: "string" },
                cta: { type: "string" },
                contact: { type: "string" }
              }
            }
          }
        }
      });

      setPitchDeck({
        ...response,
        projectName: selectedProject.business_name,
        theme: customization.theme
      });
      toast.success('Pitch deck generated successfully!');
    } catch (error) {
      toast.error('Failed to generate pitch deck: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPitchDeck = async () => {
    if (!pitchDeck) return;
    
    setIsDownloading(true);
    toast.info('Preparing pitch deck for download...');

    try {
      const slides = document.querySelectorAll('.pitch-slide');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: slide.offsetWidth,
          height: slide.offsetHeight
        });

        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${pitchDeck.projectName}_Investor_Pitch_Deck.pdf`);
      toast.success('Pitch deck downloaded!');
    } catch (error) {
      toast.error('Failed to download pitch deck');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Presentation className="w-8 h-8 text-amber-500" />
              Investor Pitch Deck
            </h1>
            <p className="text-slate-400 mt-1">Generate a professional pitch deck for investors</p>
          </div>
        </div>

        {!pitchDeck ? (
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configure Your Pitch Deck</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Selection */}
              <div>
                <Label className="text-slate-300">Select Project</Label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Choose a business project" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {allProjects.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-white">
                        {p.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div>
                <Label className="text-slate-300">Visual Theme</Label>
                <Select value={customization.theme} onValueChange={(v) => setCustomization({ ...customization, theme: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="professional" className="text-white">Professional Blue</SelectItem>
                    <SelectItem value="modern" className="text-white">Modern Dark</SelectItem>
                    <SelectItem value="vibrant" className="text-white">Vibrant Gradient</SelectItem>
                    <SelectItem value="minimal" className="text-white">Minimal Clean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Funding Ask */}
              <div>
                <Label className="text-slate-300">Funding Ask ($)</Label>
                <Input
                  type="text"
                  placeholder="e.g., $2,000,000"
                  value={customization.fundingAsk}
                  onChange={(e) => setCustomization({ ...customization, fundingAsk: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              {/* Use of Funds */}
              <div>
                <Label className="text-slate-300">Use of Funds (optional)</Label>
                <Input
                  type="text"
                  placeholder="e.g., Product development, Marketing, Team"
                  value={customization.useOfFunds}
                  onChange={(e) => setCustomization({ ...customization, useOfFunds: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <Button
                onClick={generatePitchDeck}
                disabled={isGenerating || !selectedProjectId}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 h-12"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Pitch Deck...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Investor Pitch Deck
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={downloadPitchDeck}
                disabled={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                onClick={() => setPitchDeck(null)}
                variant="outline"
                className="border-slate-700 text-slate-300"
              >
                Generate New Deck
              </Button>
            </div>

            {/* Pitch Deck Viewer */}
            <PitchDeckViewer deck={pitchDeck} />
          </div>
        )}
      </div>
    </div>
  );
}