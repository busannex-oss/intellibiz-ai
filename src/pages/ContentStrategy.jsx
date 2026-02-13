import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, TrendingUp, Calendar, Search, FileText, Hash, Target, CheckCircle2, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ContentStrategy() {
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [contentStrategy, setContentStrategy] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list('-created_date')
  });

  const generateContentStrategy = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    setIsGenerating(true);

    try {
      const project = projects.find(p => p.id === selectedProjectId);
      if (!project) throw new Error('Project not found');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a content marketing strategist creating a comprehensive content strategy for this business.

BUSINESS INFORMATION:
Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience}
Location: ${project.location}
UVP: ${project.unique_value_proposition}

MARKET RESEARCH:
Market Size: ${project.market_research?.market_size}
Customer Pain Points: ${project.market_research?.customer_pain_points?.join(', ')}
Market Opportunities: ${project.market_research?.opportunities?.join(', ')}
Keywords: ${project.market_research?.keywords?.join(', ')}

BUSINESS PLAN SUMMARY:
${project.business_plan?.executive_summary?.substring(0, 500) || 'Not available'}

Create a comprehensive content marketing strategy that includes:

1. CONTENT THEMES (5-7 themes)
   - Theme name
   - Description
   - Target audience segment
   - Key messages
   - Content types suited for this theme

2. BLOG POST IDEAS (20 ideas)
   - Compelling title
   - Brief description
   - Theme category
   - Target keyword
   - Estimated word count
   - Priority (high/medium/low)
   - SEO difficulty (easy/medium/hard)

3. SOCIAL MEDIA CONTENT CALENDAR (30 days of posts)
   - Date
   - Platform (Instagram, LinkedIn, Twitter, Facebook)
   - Post type (educational, promotional, engaging, story)
   - Content idea
   - Hashtags (3-5)
   - Best posting time

4. SEO KEYWORDS STRATEGY
   - Primary keywords (5-7): high search volume, high relevance
   - Secondary keywords (10-15): medium volume, niche specific
   - Long-tail keywords (15-20): low competition, high intent
   - Each keyword with:
     * Search volume estimate
     * Competition level
     * Ranking difficulty
     * Content opportunities

5. CONTENT PILLARS
   - 4-5 main content pillars
   - Description of each
   - How it aligns with business goals
   - Content frequency recommendation

6. DISTRIBUTION STRATEGY
   - Recommended channels
   - Posting frequency per channel
   - Best practices for each
   - Cross-promotion tactics

7. ENGAGEMENT TACTICS
   - Community building strategies
   - User-generated content ideas
   - Interactive content types
   - Influencer collaboration opportunities

8. METRICS & KPIs
   - Key performance indicators to track
   - Success benchmarks
   - Tracking tools recommendations

Make everything specific, actionable, and tailored to this business and industry.`,
        response_json_schema: {
          type: "object",
          properties: {
            content_themes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  target_segment: { type: "string" },
                  key_messages: { type: "array", items: { type: "string" } },
                  content_types: { type: "array", items: { type: "string" } }
                }
              }
            },
            blog_posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  theme: { type: "string" },
                  keyword: { type: "string" },
                  word_count: { type: "number" },
                  priority: { type: "string" },
                  seo_difficulty: { type: "string" }
                }
              }
            },
            social_calendar: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  platform: { type: "string" },
                  post_type: { type: "string" },
                  content: { type: "string" },
                  hashtags: { type: "array", items: { type: "string" } },
                  best_time: { type: "string" }
                }
              }
            },
            seo_keywords: {
              type: "object",
              properties: {
                primary: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      volume: { type: "string" },
                      competition: { type: "string" },
                      difficulty: { type: "string" },
                      opportunity: { type: "string" }
                    }
                  }
                },
                secondary: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      volume: { type: "string" },
                      competition: { type: "string" },
                      difficulty: { type: "string" }
                    }
                  }
                },
                long_tail: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      keyword: { type: "string" },
                      volume: { type: "string" },
                      competition: { type: "string" },
                      intent: { type: "string" }
                    }
                  }
                }
              }
            },
            content_pillars: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  alignment: { type: "string" },
                  frequency: { type: "string" }
                }
              }
            },
            distribution_strategy: {
              type: "object",
              properties: {
                channels: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      frequency: { type: "string" },
                      best_practices: { type: "array", items: { type: "string" } }
                    }
                  }
                },
                cross_promotion: { type: "array", items: { type: "string" } }
              }
            },
            engagement_tactics: {
              type: "object",
              properties: {
                community_building: { type: "array", items: { type: "string" } },
                ugc_ideas: { type: "array", items: { type: "string" } },
                interactive_content: { type: "array", items: { type: "string" } },
                influencer_opportunities: { type: "array", items: { type: "string" } }
              }
            },
            kpis: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  metric: { type: "string" },
                  target: { type: "string" },
                  tracking_method: { type: "string" }
                }
              }
            }
          }
        }
      });

      setContentStrategy({ ...response, projectName: project.business_name });
      toast.success('Content strategy generated!');
    } catch (error) {
      toast.error('Failed to generate strategy: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-500" />
            Content Strategy
          </h1>
          <p className="text-slate-400 mt-2">AI-powered content marketing plans and SEO strategies</p>
        </div>

        {!contentStrategy ? (
          <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Content Strategy</CardTitle>
              <CardDescription className="text-slate-400">
                Select a project to create a comprehensive content marketing plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Choose a business project" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-white">
                        {p.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateContentStrategy}
                disabled={isGenerating || !selectedProjectId}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing & Creating Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Content Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex gap-4">
              <Button onClick={() => setContentStrategy(null)} variant="outline" className="border-slate-700 text-slate-300">
                Generate New Strategy
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="themes" className="w-full">
              <TabsList className="bg-slate-800 border-slate-700 mb-6">
                <TabsTrigger value="themes">Content Themes</TabsTrigger>
                <TabsTrigger value="blogs">Blog Ideas</TabsTrigger>
                <TabsTrigger value="social">Social Calendar</TabsTrigger>
                <TabsTrigger value="seo">SEO Keywords</TabsTrigger>
                <TabsTrigger value="pillars">Content Pillars</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
              </TabsList>

              {/* Content Themes */}
              <TabsContent value="themes">
                <div className="grid md:grid-cols-2 gap-6">
                  {contentStrategy.content_themes?.map((theme, i) => (
                    <Card key={i} className="border-0 bg-slate-800/50 border border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                            {i + 1}
                          </div>
                          {theme.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Target Segment</p>
                          <p className="text-slate-200">{theme.target_segment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Key Messages</p>
                          <ul className="space-y-1">
                            {theme.key_messages?.map((msg, j) => (
                              <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                {msg}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Content Types</p>
                          <div className="flex flex-wrap gap-2">
                            {theme.content_types?.map((type, j) => (
                              <Badge key={j} variant="outline" className="border-slate-600 text-slate-300">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Blog Posts */}
              <TabsContent value="blogs">
                <div className="space-y-4">
                  {contentStrategy.blog_posts?.map((post, i) => (
                    <Card key={i} className="border-0 bg-slate-800/50 border border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-blue-400" />
                              <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                            </div>
                            <p className="text-slate-400 mb-3">{post.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className={getPriorityColor(post.priority)}>{post.priority}</Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                <Hash className="w-3 h-3 mr-1" />
                                {post.keyword}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {post.word_count} words
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                SEO: {post.seo_difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">Theme: {post.theme}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(`${post.title}\n\n${post.description}\n\nKeyword: ${post.keyword}`)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Social Calendar */}
              <TabsContent value="social">
                <div className="space-y-4">
                  {contentStrategy.social_calendar?.map((post, i) => (
                    <Card key={i} className="border-0 bg-slate-800/50 border border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 text-center">
                            <Calendar className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                            <p className="text-sm font-semibold text-white">Day {post.day}</p>
                            <p className="text-xs text-slate-400">{post.best_time}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {post.platform}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {post.post_type}
                              </Badge>
                            </div>
                            <p className="text-slate-200 mb-3">{post.content}</p>
                            <div className="flex flex-wrap gap-2">
                              {post.hashtags?.map((tag, j) => (
                                <span key={j} className="text-sm text-purple-400">#{tag}</span>
                              ))}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(`${post.content}\n\n${post.hashtags?.map(t => '#' + t).join(' ')}`)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* SEO Keywords */}
              <TabsContent value="seo" className="space-y-6">
                {/* Primary Keywords */}
                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-emerald-400" />
                      Primary Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contentStrategy.seo_keywords?.primary?.map((kw, i) => (
                        <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-white">{kw.keyword}</h4>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(kw.keyword)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Volume</p>
                              <p className="text-slate-200">{kw.volume}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Competition</p>
                              <p className="text-slate-200">{kw.competition}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Difficulty</p>
                              <p className="text-slate-200">{kw.difficulty}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Opportunity</p>
                              <p className="text-emerald-400">{kw.opportunity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Keywords */}
                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Secondary Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {contentStrategy.seo_keywords?.secondary?.map((kw, i) => (
                        <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                          <p className="text-white font-medium mb-1">{kw.keyword}</p>
                          <p className="text-sm text-slate-400">{kw.volume} • {kw.competition}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Long-tail Keywords */}
                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Long-tail Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-2">
                      {contentStrategy.seo_keywords?.long_tail?.map((kw, i) => (
                        <div key={i} className="p-2 bg-slate-700/30 rounded text-sm">
                          <p className="text-slate-200">{kw.keyword}</p>
                          <p className="text-xs text-slate-500">{kw.intent}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Pillars */}
              <TabsContent value="pillars">
                <div className="grid md:grid-cols-2 gap-6">
                  {contentStrategy.content_pillars?.map((pillar, i) => (
                    <Card key={i} className="border-0 bg-slate-800/50 border border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">{pillar.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300">{pillar.description}</p>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Business Alignment</p>
                          <p className="text-slate-200">{pillar.alignment}</p>
                        </div>
                        <div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {pillar.frequency}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Distribution Strategy */}
              <TabsContent value="distribution" className="space-y-6">
                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Distribution Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contentStrategy.distribution_strategy?.channels?.map((channel, i) => (
                      <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-2">{channel.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">Posting Frequency: {channel.frequency}</p>
                        <ul className="space-y-2">
                          {channel.best_practices?.map((practice, j) => (
                            <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Engagement Tactics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Community Building</h4>
                      <ul className="space-y-2">
                        {contentStrategy.engagement_tactics?.community_building?.map((tactic, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            {tactic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3">User-Generated Content</h4>
                      <ul className="space-y-2">
                        {contentStrategy.engagement_tactics?.ugc_ideas?.map((idea, i) => (
                          <li key={i} className="text-slate-300 flex items-start gap-2">
                            <span className="text-pink-400">•</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-slate-800/50 border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">KPIs & Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contentStrategy.kpis?.map((kpi, i) => (
                        <div key={i} className="p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{kpi.metric}</h4>
                            <Badge className="bg-emerald-500/20 text-emerald-400">{kpi.target}</Badge>
                          </div>
                          <p className="text-sm text-slate-400">{kpi.tracking_method}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}