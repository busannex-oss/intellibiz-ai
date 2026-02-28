import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Play, Loader2, Sparkles, Download, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoCreation() {
  const [searchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [activeProvider, setActiveProvider] = useState('sora');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || null);

  const { data: allProjects = [] } = useQuery({
    queryKey: ['userProjects'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user) return [];
      return base44.entities.BusinessProject.filter({ created_by: user.email });
    }
  });

  const { data: project } = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return null;
      const projects = await base44.entities.BusinessProject.filter({ id: selectedProjectId });
      return projects[0];
    },
    enabled: !!selectedProjectId
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessProject.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
    }
  });

  const commercialVideos = project?.commercial_videos || {};
  const selectedCommercial = project?.selected_commercial_video;

  const generateCommercial = async () => {
    if (!project) {
      toast.error('Project data not loaded. Please try again.');
      return;
    }

    setIsGenerating(true);

    try {
      const marketData = project.market_research || {};
      const websiteContent = project.website_content || {};

      const videoPrompt = `Create a compelling ${selectedDuration}-second commercial video in ${selectedStyle} style for:

  Business: ${project.business_name}
  Industry: ${project.industry}
  Description: ${project.description}

  Value Proposition: ${project.unique_value_proposition || 'Exceptional business solution'}

  Target Audience: ${project.target_audience || 'General consumers'}

  Key Benefits:
  ${project.competitive_advantages?.slice(0, 3).map(adv => `- ${adv}`).join('\n') || '- Premium quality\n- Expert service\n- Customer satisfaction'}

  Brand Personality: ${project.brand_personality?.traits?.join(', ') || 'Professional, trustworthy, innovative'}

  Call to Action: ${websiteContent.hero?.cta_text || 'Get Started Today'}

  Create a dynamic, engaging ${selectedDuration}-second video that:
  1. Opens with a compelling hook related to the target audience's pain points
  2. Showcases the unique value proposition visually
  3. Highlights 2-3 key benefits with dynamic visuals
  4. Ends with a strong call-to-action

  Style: ${selectedStyle} - ensure smooth transitions, professional quality, and brand-appropriate aesthetics.
  Make sure the video is exactly ${selectedDuration} seconds.`;

      const response = await base44.functions.invoke('generateVideoWithFallback', {
        prompt: videoPrompt,
        duration: selectedDuration,
        aspect_ratio: '16:9',
        style: selectedStyle,
        provider: activeProvider
      });

      if (response?.data?.success) {
        const videoKey = `${selectedDuration}sec_${selectedStyle}`;
        const updatedVideos = {
          ...commercialVideos,
          [videoKey]: {
            url: response.data.video_url || response.data.url,
            thumbnail_url: response.data.thumbnail_url,
            duration: selectedDuration,
            style: selectedStyle,
            provider: response.data.provider || activeProvider,
            created_at: new Date().toISOString(),
            prompt: videoPrompt
          }
        };

        await updateProjectMutation.mutateAsync({
          commercial_videos: updatedVideos
        });

        toast.success(`Video generated successfully using ${response.data.provider || activeProvider}!`);
      } else {
        toast.error(response?.data?.error || 'All video providers failed. Please try again.');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error(error?.message || 'Failed to generate video. Please ensure you have API credentials configured.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectCommercialForWebsite = async (videoKey) => {
    await updateProjectMutation.mutateAsync({
      selected_commercial_video: videoKey
    });
    toast.success('Commercial selected for website display!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-purple-600" />
            Business Video Production
          </h1>
          <p className="text-slate-600 mt-1">
            AI-powered video generation with multi-provider fallback: Sora → Veo → Runway → PIKA
          </p>
        </div>

        {/* Video Generator */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Create Commercial Video</span>
              <Badge className="bg-purple-500/20 text-purple-700">AI-Powered</Badge>
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Video will be automatically generated using your business information, branding, and target audience insights.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Info Preview */}
            {project && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <p className="text-sm font-medium text-slate-700">Using business data:</p>
                <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>✓ {project.business_name}</div>
                  <div>✓ {project.industry}</div>
                  <div>✓ Target audience: {project.target_audience || 'General'}</div>
                  <div>✓ {project.competitive_advantages?.length || 0} competitive advantages</div>
                </div>
              </div>
            )}

            {/* Primary Control - Duration */}
            <div>
              <Label className="text-base font-semibold">Video Duration</Label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds - Quick teaser</SelectItem>
                  <SelectItem value="30">30 seconds - Standard commercial</SelectItem>
                  <SelectItem value="60">60 seconds - Detailed showcase</SelectItem>
                  <SelectItem value="90">90 seconds - Full presentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Settings Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <Label>Video Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="modern">Modern & Dynamic</SelectItem>
                      <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                      <SelectItem value="energetic">Energetic & Bold</SelectItem>
                      <SelectItem value="minimal">Minimal & Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preferred Provider</Label>
                  <Select value={activeProvider} onValueChange={setActiveProvider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sora">Sora (OpenAI)</SelectItem>
                      <SelectItem value="veo">Veo (Google)</SelectItem>
                      <SelectItem value="runway">Runway ML</SelectItem>
                      <SelectItem value="pika">PIKA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button
              onClick={generateCommercial}
              disabled={isGenerating || !project}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating {selectedDuration}s Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate {selectedDuration}-Second Commercial
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Videos */}
        {Object.keys(commercialVideos).length > 0 && (
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-xl">Your Commercial Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(commercialVideos).map(([key, video]) => (
                  <Card key={key} className={`border-2 ${selectedCommercial === key ? 'border-purple-500 shadow-lg' : 'border-slate-200'}`}>
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                        <img
                          src={video.thumbnail_url || video.url}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                        {selectedCommercial === key && (
                          <Badge className="absolute top-3 right-3 bg-purple-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Website Display
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{video.duration}s • {video.style}</Badge>
                          <Badge className="bg-blue-500/20 text-blue-700">{video.provider}</Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => selectCommercialForWebsite(key)}
                            className={selectedCommercial === key ? 'bg-purple-600' : 'bg-slate-600'}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {selectedCommercial === key ? 'Selected' : 'Use on Website'}
                          </Button>
                          <a href={video.url} download target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}