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
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeProvider, setActiveProvider] = useState('sora');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
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
    setIsGenerating(true);
    
    try {
      const videoPrompt = `${customPrompt || ''}
      
Business: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
UVP: ${project.unique_value_proposition}
Duration: ${selectedDuration} seconds
Style: ${selectedStyle}

Create a compelling commercial video that showcases the business value proposition, highlights key benefits, and ends with a strong call-to-action.`;

      const response = await base44.functions.invoke('generateVideoWithFallback', {
        prompt: videoPrompt,
        duration: selectedDuration,
        aspect_ratio: '16:9',
        style: selectedStyle
      });

      if (response.data.success) {
        const videoKey = `${selectedDuration}sec_${selectedStyle}`;
        const updatedVideos = {
          ...commercialVideos,
          [videoKey]: {
            url: response.data.video_url,
            thumbnail_url: response.data.thumbnail_url,
            duration: selectedDuration,
            style: selectedStyle,
            provider: response.data.provider,
            created_at: new Date().toISOString(),
            prompt: videoPrompt
          }
        };

        await updateProjectMutation.mutateAsync({
          commercial_videos: updatedVideos
        });

        toast.success(`Video generated successfully using ${response.data.provider}!`);
      } else {
        toast.error('All video providers failed. Please try again.');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Failed to generate video');
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
            <CardTitle className="text-xl">Create Commercial Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Duration (seconds)</Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="90">90 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

            <div>
              <Label>Custom Instructions (Optional)</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add specific scenes, transitions, or messaging you want..."
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              onClick={generateCommercial}
              disabled={isGenerating}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Video with AI Fallback...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Commercial Video
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