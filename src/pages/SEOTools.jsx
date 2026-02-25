import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, TrendingUp, Target, Globe, Download, Sparkles, 
  Loader2, CheckCircle, AlertTriangle, FileCode, Copy, Eye
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SEOTools() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [seoData, setSeoData] = useState(null);
  const [contentToAnalyze, setContentToAnalyze] = useState('');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.BusinessProject.get(projectId),
    enabled: !!projectId
  });

  // Keyword Research
  const conductKeywordResearch = async () => {
    setIsAnalyzing(true);
    setAnalysisType('keywords');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Conduct comprehensive SEO keyword research for:

Business: ${project?.business_name}
Industry: ${project?.industry}
Description: ${project?.description}
Target Audience: ${project?.target_audience}
Location: ${project?.location}

Provide:
1. 20 high-value primary keywords (high volume, medium-high difficulty)
2. 30 long-tail keywords (lower competition, specific intent)
3. 10 local SEO keywords (if location-based)
4. Search volume estimates and difficulty scores (1-100)
5. Search intent classification (informational, commercial, transactional, navigational)
6. Monthly traffic potential
7. Keyword clustering by topic
8. Question-based keywords (voice search optimization)`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          primary_keywords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                volume: { type: "number" },
                difficulty: { type: "number" },
                intent: { type: "string" },
                traffic_potential: { type: "number" }
              }
            }
          },
          long_tail_keywords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                volume: { type: "number" },
                difficulty: { type: "number" },
                intent: { type: "string" }
              }
            }
          },
          local_keywords: {
            type: "array",
            items: { type: "string" }
          },
          keyword_clusters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                topic: { type: "string" },
                keywords: { type: "array", items: { type: "string" } }
              }
            }
          },
          question_keywords: {
            type: "array",
            items: { type: "string" }
          },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    });

    setSeoData({ ...seoData, keywords: result });
    setIsAnalyzing(false);
  };

  // On-Page SEO Analysis
  const analyzeOnPageSEO = async () => {
    if (!contentToAnalyze) {
      toast.error('Please paste website content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisType('onpage');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze the following website content for SEO optimization:

${contentToAnalyze}

Business Context:
- Name: ${project?.business_name}
- Industry: ${project?.industry}
- Target Keywords: ${project?.market_research?.keywords?.join(', ') || 'N/A'}

Provide detailed analysis:
1. Title tag analysis (optimal length, keyword usage, compelling)
2. Meta description analysis (length, call-to-action, keyword inclusion)
3. Heading structure analysis (H1-H6 hierarchy, keyword distribution)
4. Content quality score (readability, keyword density, semantic relevance)
5. Image optimization (alt tags, file names)
6. Internal linking opportunities
7. Content length and depth analysis
8. Keyword optimization score (1-100)
9. Mobile-friendliness indicators
10. Page speed recommendations
11. Specific actionable improvements with before/after examples`,
      response_json_schema: {
        type: "object",
        properties: {
          overall_score: { type: "number" },
          title_analysis: {
            type: "object",
            properties: {
              current: { type: "string" },
              score: { type: "number" },
              issues: { type: "array", items: { type: "string" } },
              recommendation: { type: "string" }
            }
          },
          meta_description: {
            type: "object",
            properties: {
              current: { type: "string" },
              score: { type: "number" },
              issues: { type: "array", items: { type: "string" } },
              recommendation: { type: "string" }
            }
          },
          headings: {
            type: "object",
            properties: {
              score: { type: "number" },
              issues: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } }
            }
          },
          content_quality: {
            type: "object",
            properties: {
              score: { type: "number" },
              readability: { type: "string" },
              word_count: { type: "number" },
              keyword_density: { type: "number" },
              recommendations: { type: "array", items: { type: "string" } }
            }
          },
          improvements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                priority: { type: "string" },
                issue: { type: "string" },
                fix: { type: "string" }
              }
            }
          }
        }
      }
    });

    setSeoData({ ...seoData, onpage: result });
    setIsAnalyzing(false);
  };

  // Competitor SEO Analysis
  const analyzeCompetitorSEO = async () => {
    setIsAnalyzing(true);
    setAnalysisType('competitor');

    const competitors = project?.market_research?.competitors || [];

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze SEO strategies of these competitors:

${competitors.map(c => `- ${c.name} (${c.website})`).join('\n')}

For the business: ${project?.business_name} (${project?.industry})

Analyze and provide:
1. Top keywords each competitor ranks for
2. Content strategies and topics they cover
3. Backlink profile strength (estimated)
4. Domain authority estimates
5. Content gaps we can exploit
6. Keywords they rank for that we should target
7. Their content format preferences (blog, video, infographic, etc.)
8. Social media SEO strategies
9. Local SEO tactics (if applicable)
10. Actionable opportunities based on their weaknesses`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          competitor_analysis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                top_keywords: { type: "array", items: { type: "string" } },
                content_topics: { type: "array", items: { type: "string" } },
                estimated_domain_authority: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } }
              }
            }
          },
          keyword_opportunities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                current_leaders: { type: "array", items: { type: "string" } },
                opportunity_score: { type: "number" },
                reason: { type: "string" }
              }
            }
          },
          content_gaps: { type: "array", items: { type: "string" } },
          actionable_strategies: { type: "array", items: { type: "string" } }
        }
      }
    });

    setSeoData({ ...seoData, competitor: result });
    setIsAnalyzing(false);
  };

  // Generate Sitemap
  const generateSitemap = () => {
    const pages = [
      '/',
      '/about',
      '/services',
      '/contact',
      '/blog',
      '/products'
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://${project?.business_name?.toLowerCase().replace(/\s+/g, '')}.com${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    setSeoData({ ...seoData, sitemap });
    toast.success('Sitemap generated!');
  };

  // Generate robots.txt
  const generateRobotsTxt = () => {
    const robotsTxt = `# robots.txt for ${project?.business_name}
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

Sitemap: https://${project?.business_name?.toLowerCase().replace(/\s+/g, '')}.com/sitemap.xml`;

    setSeoData({ ...seoData, robotsTxt });
    toast.success('robots.txt generated!');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    toast.success(`${filename} downloaded!`);
  };

  if (!projectId || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">Please select a project to use SEO tools</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered SEO Suite
          </div>
          <h1 className="text-4xl font-bold text-white">
            SEO Tools for {project.business_name}
          </h1>
          <p className="text-slate-400 text-lg">Optimize your online presence and outrank competitors</p>
        </div>

        <Tabs defaultValue="keywords" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="keywords">Keyword Research</TabsTrigger>
            <TabsTrigger value="onpage">On-Page SEO</TabsTrigger>
            <TabsTrigger value="competitor">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="technical">Technical SEO</TabsTrigger>
          </TabsList>

          {/* Keyword Research */}
          <TabsContent value="keywords" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="w-5 h-5 text-emerald-500" />
                  AI Keyword Research
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Discover high-value keywords for your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={conductKeywordResearch}
                  disabled={isAnalyzing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isAnalyzing && analysisType === 'keywords' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Keywords...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Keyword Research
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {seoData?.keywords && (
              <>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Primary Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {seoData.keywords.primary_keywords?.map((kw, i) => (
                        <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-white">{kw.keyword}</p>
                            <Badge className={`${
                              kw.difficulty < 30 ? 'bg-emerald-500' :
                              kw.difficulty < 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}>
                              {kw.difficulty}/100
                            </Badge>
                          </div>
                          <div className="flex gap-3 text-sm text-slate-400">
                            <span>Vol: {kw.volume?.toLocaleString()}</span>
                            <span>Traffic: {kw.traffic_potential}</span>
                            <Badge variant="outline" className="text-xs">{kw.intent}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Long-Tail Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {seoData.keywords.long_tail_keywords?.map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-slate-300 border-slate-600">
                          {kw.keyword} ({kw.volume})
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {seoData.keywords.keyword_clusters?.length > 0 && (
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white">Keyword Clusters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {seoData.keywords.keyword_clusters.map((cluster, i) => (
                          <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                            <h4 className="font-semibold text-white mb-2">{cluster.topic}</h4>
                            <div className="flex flex-wrap gap-2">
                              {cluster.keywords.map((kw, j) => (
                                <Badge key={j} className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* On-Page SEO */}
          <TabsContent value="onpage" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  Content Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Paste your website content for SEO analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your website page content here (HTML or plain text)..."
                  value={contentToAnalyze}
                  onChange={(e) => setContentToAnalyze(e.target.value)}
                  className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white"
                />
                <Button
                  onClick={analyzeOnPageSEO}
                  disabled={isAnalyzing || !contentToAnalyze}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isAnalyzing && analysisType === 'onpage' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {seoData?.onpage && (
              <>
                <Card className="border-slate-700 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-white mb-2">
                        {seoData.onpage.overall_score}/100
                      </p>
                      <p className="text-slate-400">Overall SEO Score</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Title Tag</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Score</span>
                        <Badge className={`${
                          seoData.onpage.title_analysis.score > 80 ? 'bg-emerald-500' :
                          seoData.onpage.title_analysis.score > 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}>
                          {seoData.onpage.title_analysis.score}/100
                        </Badge>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded text-sm text-slate-300">
                        {seoData.onpage.title_analysis.current || 'No title found'}
                      </div>
                      {seoData.onpage.title_analysis.issues?.length > 0 && (
                        <div className="space-y-1">
                          {seoData.onpage.title_analysis.issues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-amber-400">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm text-emerald-300">
                        <strong>Recommended:</strong> {seoData.onpage.title_analysis.recommendation}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Meta Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Score</span>
                        <Badge className={`${
                          seoData.onpage.meta_description.score > 80 ? 'bg-emerald-500' :
                          seoData.onpage.meta_description.score > 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}>
                          {seoData.onpage.meta_description.score}/100
                        </Badge>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded text-sm text-slate-300">
                        {seoData.onpage.meta_description.current || 'No meta description found'}
                      </div>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm text-emerald-300">
                        <strong>Recommended:</strong> {seoData.onpage.meta_description.recommendation}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Priority Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {seoData.onpage.improvements?.map((imp, i) => (
                        <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge className={`${
                                imp.priority === 'high' ? 'bg-red-500' :
                                imp.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                              } mb-2`}>
                                {imp.priority} priority
                              </Badge>
                              <p className="font-medium text-white">{imp.category}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{imp.issue}</p>
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm text-emerald-300">
                            <strong>Fix:</strong> {imp.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Competitor Analysis */}
          <TabsContent value="competitor" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Competitor SEO Intelligence
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Analyze what keywords and strategies your competitors use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={analyzeCompetitorSEO}
                  disabled={isAnalyzing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isAnalyzing && analysisType === 'competitor' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Competitors...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Competitor Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {seoData?.competitor && (
              <>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Competitor Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {seoData.competitor.competitor_analysis?.map((comp, i) => (
                        <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-white">{comp.name}</h4>
                            <Badge className="bg-violet-500">DA: {comp.estimated_domain_authority}</Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-emerald-400 mb-1">TOP KEYWORDS</p>
                              <div className="flex flex-wrap gap-1">
                                {comp.top_keywords?.slice(0, 5).map((kw, j) => (
                                  <Badge key={j} variant="outline" className="text-xs text-slate-300 border-slate-600">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-amber-400 mb-1">CONTENT TOPICS</p>
                              <div className="flex flex-wrap gap-1">
                                {comp.content_topics?.slice(0, 3).map((topic, j) => (
                                  <Badge key={j} variant="outline" className="text-xs text-slate-300 border-slate-600">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-emerald-400 mb-1">STRENGTHS</p>
                              <ul className="space-y-1">
                                {comp.strengths?.map((s, j) => (
                                  <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-red-400 mb-1">WEAKNESSES</p>
                              <ul className="space-y-1">
                                {comp.weaknesses?.map((w, j) => (
                                  <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                                    <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                                    {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Keyword Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {seoData.competitor.keyword_opportunities?.map((opp, i) => (
                        <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-white">{opp.keyword}</p>
                            <Badge className="bg-emerald-500">Score: {opp.opportunity_score}/100</Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{opp.reason}</p>
                          <p className="text-xs text-slate-500">
                            Current leaders: {opp.current_leaders?.join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Actionable Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {seoData.competitor.actionable_strategies?.map((strategy, i) => (
                        <div key={i} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
                          <p className="text-sm text-emerald-300">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Technical SEO */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileCode className="w-5 h-5 text-emerald-500" />
                    XML Sitemap
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Generate SEO-optimized sitemap for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={generateSitemap}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Generate Sitemap.xml
                  </Button>
                  {seoData?.sitemap && (
                    <>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <pre className="text-xs text-slate-300 overflow-x-auto">
                          {seoData.sitemap}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(seoData.sitemap, 'Sitemap')}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(seoData.sitemap, 'sitemap.xml')}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileCode className="w-5 h-5 text-emerald-500" />
                    Robots.txt
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Control search engine crawler access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={generateRobotsTxt}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Generate robots.txt
                  </Button>
                  {seoData?.robotsTxt && (
                    <>
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                          {seoData.robotsTxt}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(seoData.robotsTxt, 'robots.txt')}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(seoData.robotsTxt, 'robots.txt')}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}