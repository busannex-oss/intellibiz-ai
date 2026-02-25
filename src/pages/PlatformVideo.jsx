import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Play, Download, Sparkles, Loader2, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PlatformVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoProvider, setVideoProvider] = useState(null);

  const generatePlatformVideo = async () => {
    setIsGenerating(true);
    
    try {
      const videoPrompt = `Create a compelling 60-second commercial video for BrandForge - an AI-powered business platform:

Business Platform: BrandForge
Industry: B2B SaaS / Business Automation
Value Proposition: Complete AI-powered platform that helps entrepreneurs build and scale businesses from idea to launch

Key Features:
- AI Market Research & Competitive Analysis
- Automated Business Plan Generation (30-year projections)
- Brand Identity Creation (Logo, Colors, Visual Assets)
- Professional Website Generation
- Commercial Video Production
- Social Media Asset Creation
- Omnichannel Communication (WhatsApp, SMS, Email, Chat)
- AI Phone System & Receptionist
- Customer Journey Mapping
- SEO Tools & Optimization
- Performance Analytics & Reporting

Target Audience: Entrepreneurs, Small Business Owners, Startups, Solopreneurs

Call to Action: Start Building Your Business Today - Free Trial Available

Create a dynamic, professional video that:
1. Opens with an entrepreneur's pain point (overwhelming business setup)
2. Introduces BrandForge as the all-in-one solution
3. Showcases key features with smooth transitions
4. Highlights AI-powered automation benefits
5. Shows successful business outcomes
6. Ends with strong call-to-action

Style: Modern, professional, energetic - with sleek visuals, smooth animations, and premium aesthetic.
Duration: 60 seconds
Format: 16:9 landscape for website hero section`;

      const response = await base44.functions.invoke('generateVideoWithFallback', {
        prompt: videoPrompt,
        duration: '60',
        aspect_ratio: '16:9',
        style: 'professional'
      });

      if (response.data.success) {
        setVideoUrl(response.data.video_url);
        setThumbnailUrl(response.data.thumbnail_url);
        setVideoProvider(response.data.provider);
        toast.success(`Platform video generated successfully using ${response.data.provider}!`);
      } else {
        toast.error('Video generation failed. Please try again.');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error('Failed to generate platform video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-purple-500" />
            Platform Commercial Video
          </h1>
          <p className="text-slate-400 mt-1">
            AI-generated promotional video for the BrandForge platform
          </p>
        </div>

        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Generate Platform Video</span>
              <Badge className="bg-purple-500/20 text-purple-400">AI-Powered</Badge>
            </CardTitle>
            <p className="text-sm text-slate-400 mt-2">
              Create a professional 60-second commercial showcasing BrandForge features and benefits
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!videoUrl ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Create Platform Video</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Generate a professional commercial video highlighting BrandForge's AI capabilities and features
                </p>
                <Button
                  onClick={generatePlatformVideo}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12 px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Platform Video
                    </>
                  )}
                </Button>
                {isGenerating && (
                  <p className="text-sm text-slate-400 mt-4">This may take a few minutes...</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                  <img
                    src={thumbnailUrl || videoUrl}
                    alt="Platform video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-purple-600">
                    Generated with {videoProvider}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Video
                    </Button>
                  </a>
                  <a href={videoUrl} download>
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>

                <Button
                  onClick={generatePlatformVideo}
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Regenerate Video
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Video Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Duration</p>
                <p className="text-white font-medium">60 seconds</p>
              </div>
              <div>
                <p className="text-slate-500">Format</p>
                <p className="text-white font-medium">16:9 Landscape</p>
              </div>
              <div>
                <p className="text-slate-500">Style</p>
                <p className="text-white font-medium">Professional</p>
              </div>
              <div>
                <p className="text-slate-500">Use Case</p>
                <p className="text-white font-medium">Website Hero</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}