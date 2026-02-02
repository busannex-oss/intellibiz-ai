import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Play, Download, Save, Edit2, ExternalLink, Video, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoCreation() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrls, setVideoUrls] = useState({});
  const [selectedVideoDuration, setSelectedVideoDuration] = useState('30sec');
  const [videoHosting, setVideoHosting] = useState('brandforge');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  useEffect(() => {
    if (project?.video_urls) {
      setVideoUrls(project.video_urls);
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessProject.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
    }
  });

  const generateCommercialVideo = async (duration) => {
    setIsGeneratingVideo(true);
    
    try {
      const durationInSeconds = parseInt(duration);
      const videoPrompt = `Create a professional, compelling ${duration} commercial video concept for "${project.business_name}". 
      
Business: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
UVP: ${project.unique_value_proposition || 'Premium service'}

The video should be engaging, highlight key benefits, and end with a strong call-to-action. Make it suitable for website, social media, and advertising platforms. Duration: ${durationInSeconds} seconds.`;

      const videoData = await base44.integrations.Core.InvokeLLM({
        prompt: videoPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timing: { type: "string" },
                  description: { type: "string" },
                  voiceover: { type: "string" }
                }
              }
            }
          }
        }
      });

      const { url: thumbnailUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `Create a professional thumbnail image for a ${duration} commercial video for "${project.business_name}". Show the key message: ${project.unique_value_proposition || project.description}. Make it modern, eye-catching, and suitable for YouTube/social media.`
      });

      const fileBlob = await fetch(thumbnailUrl).then(r => r.blob());
      const { file_url: uploadedVideoUrl } = await base44.integrations.Core.UploadFile({
        file: fileBlob
      });

      const newVideoUrls = { 
        ...videoUrls, 
        [duration]: {
          url: uploadedVideoUrl,
          concept: videoData.description,
          scenes: videoData.scenes,
          title: videoData.title
        }
      };
      
      setVideoUrls(newVideoUrls);
      await updateProjectMutation.mutateAsync({ video_urls: newVideoUrls });
      toast.success(`${duration} commercial generated and saved!`);
      
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate commercial video');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-10 h-10 text-violet-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Video Creation Studio</h1>
          </div>
          <p className="text-lg text-slate-600">{project.business_name}</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Generate Commercial Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Controls */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-6">
              <p className="text-sm text-violet-900 mb-4 font-semibold">Video Configuration & Management</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm text-slate-700 mb-2 block font-medium">Duration</label>
                  <Select value={selectedVideoDuration} onValueChange={setSelectedVideoDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30sec">30 seconds</SelectItem>
                      <SelectItem value="60sec">60 seconds</SelectItem>
                      <SelectItem value="90sec">90 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-700 mb-2 block font-medium">Hosting Platform</label>
                  <Select value={videoHosting} onValueChange={setVideoHosting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brandforge">BrandForge</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="wistia">Wistia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <Button
                    onClick={() => generateCommercialVideo(selectedVideoDuration)}
                    disabled={isGeneratingVideo}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    size="lg"
                  >
                    {isGeneratingVideo ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Video...</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" />Generate Video</>
                    )}
                  </Button>
                </div>
              </div>

              {videoUrls[selectedVideoDuration]?.url && (
                <div className="flex gap-2 border-t border-violet-200 pt-4">
                  <Button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = videoUrls[selectedVideoDuration].url;
                      a.download = `${project.business_name}-${selectedVideoDuration}.jpg`;
                      a.click();
                      toast.success('Video thumbnail downloaded!');
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={async () => {
                      await updateProjectMutation.mutateAsync({ video_urls: videoUrls });
                      toast.success('Video saved!');
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      const urls = { ...videoUrls };
                      delete urls[selectedVideoDuration];
                      setVideoUrls(urls);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              )}

              {videoHosting !== 'brandforge' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Upload final video to {videoHosting} and embed in your website
                </div>
              )}
            </div>

            {/* Video Preview */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Video Preview</h3>
              {videoUrls[selectedVideoDuration]?.url ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                  <div className="bg-slate-900 aspect-video relative overflow-hidden flex items-center justify-center group cursor-pointer">
                    <img 
                      src={videoUrls[selectedVideoDuration].url} 
                      alt="Commercial Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                        <Play className="w-10 h-10 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-bold text-slate-900">{videoUrls[selectedVideoDuration].title}</p>
                      <span className="text-sm px-3 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">{selectedVideoDuration}</span>
                    </div>
                    <p className="text-slate-600 mb-4">{videoUrls[selectedVideoDuration].concept}</p>
                    
                    {videoUrls[selectedVideoDuration].scenes && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Scene Breakdown:</p>
                        <div className="space-y-2">
                          {videoUrls[selectedVideoDuration].scenes.map((scene, i) => (
                            <div key={i} className="text-sm">
                              <span className="font-medium text-violet-600">{scene.timing}:</span>
                              <span className="text-slate-600 ml-2">{scene.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No video generated yet</p>
                    <p className="text-sm mt-1">Select duration and click Generate Video</p>
                  </div>
                </div>
              )}
            </div>

            {/* All Generated Videos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">All Generated Videos</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {['30sec', '60sec', '90sec'].map((duration) => (
                  <div key={duration} className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                    {videoUrls[duration]?.url ? (
                      <>
                        <div className="aspect-video bg-slate-900 relative overflow-hidden">
                          <img 
                            src={videoUrls[duration].url} 
                            alt={`${duration} video`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-white opacity-80" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-slate-900 text-sm">{videoUrls[duration].title}</p>
                          <p className="text-xs text-slate-500 mt-1">{duration}</p>
                        </div>
                      </>
                    ) : (
                      <div className="aspect-video bg-slate-50 flex items-center justify-center">
                        <p className="text-sm text-slate-400">{duration} - Not generated</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}