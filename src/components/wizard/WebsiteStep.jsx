import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Pencil, Check, Eye, Code, Download, Play, Star, Zap, Shield, Globe2, Users, TrendingUp, Heart, Phone, Mail, Award, Rocket, Lightbulb, Target, BarChart3, Headphones, Palette, MessageSquare, Clock, CheckCircle2, ImageIcon, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function WebsiteStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [viewMode, setViewMode] = useState('preview');
  const [videoUrls, setVideoUrls] = useState(project?.video_urls || {});
  const [heroImage, setHeroImage] = useState(project?.website_content?.hero_image_url || '');
  const [showHeroImagePanel, setShowHeroImagePanel] = useState(false);
  const [heroAiPrompt, setHeroAiPrompt] = useState('');
  const [isGeneratingHeroImage, setIsGeneratingHeroImage] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const heroFileInputRef = useRef(null);
  const ceoPhotoInputRef = useRef(null);
  const [isUploadingCeoPhoto, setIsUploadingCeoPhoto] = useState(false);

  const generateWebsite = async () => {
    setIsGenerating(true);
    
    const marketResearch = project?.market_research;
    const uvp = project?.unique_value_proposition;
    const advantages = project?.competitive_advantages;
    const brandPersonality = project?.brand_personality;
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Create CONVERSION-OPTIMIZED website content for "${project.business_name}" designed to OUTPERFORM competitors:

=== BUSINESS INFO ===
Business: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience}

=== UNIQUE VALUE PROPOSITION ===
${uvp || 'Premium service provider'}

=== COMPETITIVE ADVANTAGES TO HIGHLIGHT ===
${advantages?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Quality, service, value'}

=== COMPETITOR WEAKNESSES TO EXPLOIT IN COPY ===
${marketResearch?.competitors?.flatMap(c => c.weaknesses || []).slice(0, 5).join('\n- ') || 'Generic messaging, poor support'}

=== CUSTOMER PAIN POINTS TO ADDRESS ===
${marketResearch?.customer_pain_points?.join('\n- ') || 'Not specified'}

=== TARGET KEYWORDS FOR SEO ===
${marketResearch?.keywords?.join(', ') || 'Not specified'}

=== BRAND PERSONALITY ===
Traits: ${brandPersonality?.traits?.join(', ') || 'Professional, trustworthy'}
Tone: ${brandPersonality?.tone_of_voice || 'Confident and helpful'}

=== BUSINESS PLAN CONTEXT ===
Executive Summary: ${project.business_plan?.executive_summary?.substring(0, 500)}
Products/Services: ${project.business_plan?.products_services?.substring(0, 500)}

Generate STRATEGIC website content that:
1. Immediately addresses customer pain points in the hero
2. Emphasizes our advantages over competitors
3. Uses target keywords naturally for SEO
4. Builds trust through specific, credible claims
5. Creates urgency with compelling CTAs

Sections needed:
1. Hero Section (headline that addresses main pain point, subheadline with UVP, strong CTA)
2. About Section (trust-building, differentiation focus)
3. Services/Products Section (4 key offerings that beat competitors)
4. Features/Benefits Section (6 benefits that address competitor weaknesses)
5. Video Commercial Section (compelling video description for AI generation, 30-60 seconds concept)
6. CEO Message Section (optional inspiring message from CEO, include name and title)
7. Testimonials (3 realistic testimonials addressing common objections)
8. Newsletter Section (compelling signup headline and description)
9. Call to Action Section (urgency-focused)
10. Footer content

Make every word count. Focus on conversion and differentiation.`,
      response_json_schema: {
        type: "object",
        properties: {
          hero: {
            type: "object",
            properties: {
              headline: { type: "string" },
              subheadline: { type: "string" },
              cta_text: { type: "string" }
            }
          },
          about: { type: "string" },
          services: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                icon: { type: "string" }
              }
            }
          },
          features: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" }
              }
            }
          },
          video_commercial: {
            type: "object",
            properties: {
              concept: { type: "string" },
              script: { type: "string" },
              duration: { type: "string" }
            }
          },
          ceo_message: {
            type: "object",
            properties: {
              name: { type: "string" },
              title: { type: "string" },
              message: { type: "string" }
            }
          },
          testimonials: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                role: { type: "string" },
                quote: { type: "string" }
              }
            }
          },
          newsletter: {
            type: "object",
            properties: {
              headline: { type: "string" },
              description: { type: "string" },
              placeholder: { type: "string" },
              button_text: { type: "string" }
            }
          },
          cta: {
            type: "object",
            properties: {
              headline: { type: "string" },
              description: { type: "string" },
              button_text: { type: "string" }
            }
          },
          footer: {
            type: "object",
            properties: {
              tagline: { type: "string" },
              copyright: { type: "string" }
            }
          }
        }
      }
    });
    
    // Auto-generate hero image based on business info
    let heroImageUrl = project?.website_content?.hero_image_url;
    if (!heroImageUrl) {
      try {
        const { url } = await base44.integrations.Core.GenerateImage({
          prompt: `Professional hero image for "${project.business_name}" in the ${project.industry} industry. ${project.description}. Modern, high quality, cinematic, clean composition, suitable for a business website hero section.`
        });
        heroImageUrl = url;
        setHeroImage(url);
      } catch (e) {
        // fallback to existing
      }
    }

    await onUpdate({
      website_content: { ...response, hero_image_url: heroImageUrl },
      current_step: Math.max(project.current_step || 1, 3)
    });
    
    setIsGenerating(false);
  };

  const handleSaveSection = async (section) => {
    const updatedContent = { ...project.website_content };
    
    if (section === 'hero') {
      const parsed = JSON.parse(editContent);
      updatedContent.hero = parsed;
    } else if (section === 'about') {
      updatedContent.about = editContent;
    } else if (section === 'services') {
      updatedContent.services = JSON.parse(editContent);
    } else if (section === 'features') {
      updatedContent.features = JSON.parse(editContent);
    } else if (section === 'testimonials') {
      updatedContent.testimonials = JSON.parse(editContent);
    } else if (section === 'cta') {
      updatedContent.cta = JSON.parse(editContent);
    } else if (section === 'video_commercial') {
      updatedContent.video_commercial = JSON.parse(editContent);
    } else if (section === 'ceo_message') {
      updatedContent.ceo_message = JSON.parse(editContent);
    } else if (section === 'newsletter') {
      updatedContent.newsletter = JSON.parse(editContent);
    }
    
    await onUpdate({ website_content: updatedContent });
    setEditingSection(null);
  };

  const startEditing = (section, content) => {
    setEditingSection(section);
    setEditContent(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  };

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

      // Generate video concept first
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

      // Generate thumbnail/preview image
      const { url: thumbnailUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `Create a professional thumbnail image for a ${duration} commercial video for "${project.business_name}". Show the key message: ${project.unique_value_proposition || project.description}. Make it modern, eye-catching, and suitable for YouTube/social media.`
      });

      // Upload the thumbnail as video preview
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
      await onUpdate({ video_urls: newVideoUrls });
      toast.success(`${duration} commercial generated and saved!`);
      
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate commercial video');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateHeroImage = async () => {
    const prompt = heroAiPrompt.trim() || `Professional hero image for a business website for "${project.business_name}" in the ${project.industry} industry. Modern, high quality, clean background.`;
    setIsGeneratingHeroImage(true);
    try {
      const response = await base44.integrations.Core.GenerateImage({ prompt });
      if (response?.url) {
        setHeroImage(response.url);
        await onUpdate({ website_content: { ...(project.website_content || {}), hero_image_url: response.url } });
        toast.success('Hero image generated!');
        setShowHeroImagePanel(false);
      }
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setIsGeneratingHeroImage(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHeroImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setHeroImage(file_url);
      await onUpdate({ website_content: { ...(project.website_content || {}), hero_image_url: file_url } });
      toast.success('Image uploaded!');
      setShowHeroImagePanel(false);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingHeroImage(false);
    }
  };

  const handleCeoPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCeoPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await onUpdate({ website_content: { ...(project.website_content || {}), ceo_photo_url: file_url } });
      toast.success('CEO photo uploaded!');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploadingCeoPhoto(false);
    }
  };

  const website = project?.website_content;
  const brandColors = project?.brand_colors || [];
  const getColor = (role, fallback) => brandColors.find(c => c.role === role)?.hex || fallback;
  const colors = {
    primary: getColor('primary', '#6366f1'),
    secondary: getColor('secondary', '#8b5cf6'),
    accent: getColor('accent', '#ec4899'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Build Your Website
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          AI generates professional website content tailored to your business
        </p>
      </div>

      {!website ? (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Ready to create your website content?</h3>
              <p className="text-slate-500">Our AI will generate engaging, conversion-focused content for all your website sections.</p>
              <Button
                onClick={generateWebsite}
                disabled={isGenerating}
                className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Website Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('preview')}
                className={viewMode === 'preview' ? 'bg-violet-600' : ''}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant={viewMode === 'sections' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('sections')}
                className={viewMode === 'sections' ? 'bg-violet-600' : ''}
              >
                <Code className="w-4 h-4 mr-2" />
                Edit Sections
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateWebsite}
              disabled={isGenerating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate All
            </Button>
          </div>

          {viewMode === 'preview' ? (
            <Card className="border-0 shadow-xl overflow-hidden bg-white">
              {/* Hero Preview - split layout */}
              <div 
                className="grid md:grid-cols-2 text-white overflow-hidden min-h-[380px]"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                {/* Left: text */}
                <div className="flex flex-col justify-center p-10 md:p-14">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{website.hero?.headline}</h1>
                  <p className="text-base opacity-90 mb-6 leading-relaxed">{website.hero?.subheadline}</p>
                  <div>
                    <Button className="h-11 px-7 bg-white text-slate-800 hover:bg-slate-100">
                      {website.hero?.cta_text}
                    </Button>
                  </div>
                </div>
                {/* Right: image */}
                <div className="relative hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=700&q=80&auto=format&fit=crop"
                    alt="Hero"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${colors.primary}88, transparent)` }} />
                </div>
              </div>

              {/* About Preview */}
              <div className="p-12 md:p-16 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">About Us</h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto text-center">{website.about}</p>
              </div>

              {/* Services Preview */}
              <div className="p-12 md:p-16 bg-slate-50">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">Our Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {website.services?.map((service, i) => {
                    const serviceIcons = [
                      <Star className="w-6 h-6 text-white" />,
                      <Zap className="w-6 h-6 text-white" />,
                      <Shield className="w-6 h-6 text-white" />,
                      <Globe2 className="w-6 h-6 text-white" />,
                      <Rocket className="w-6 h-6 text-white" />,
                      <Award className="w-6 h-6 text-white" />,
                      <Lightbulb className="w-6 h-6 text-white" />,
                      <Target className="w-6 h-6 text-white" />,
                    ];
                    return (
                      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div 
                          className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                        >
                          {serviceIcons[i % serviceIcons.length]}
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">{service.title}</h3>
                        <p className="text-sm text-slate-600">{service.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Features Preview */}
              <div className="p-12 md:p-16 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">Why Choose Us</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {website.features?.map((feature, i) => {
                    const featureIcons = [CheckCircle2, Heart, TrendingUp, Users, Clock, MessageSquare, Phone, Mail, BarChart3, Headphones, Palette, Shield];
                    const FIcon = featureIcons[i % featureIcons.length];
                    return (
                      <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                        <div 
                          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})` }}
                        >
                          <FIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Commercial Preview - Only Selected Video */}
              {project?.selected_commercial_video && project?.commercial_videos?.[project.selected_commercial_video] && (
                <div className="p-12 md:p-16 bg-slate-900">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">See Us In Action</h2>
                  <div className="max-w-5xl mx-auto">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
                      <img
                        src={project.commercial_videos[project.selected_commercial_video].thumbnail_url || project.commercial_videos[project.selected_commercial_video].url}
                        alt="Commercial Video"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-10 h-10 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CEO Message Preview */}
              {website.ceo_message && (
                <div className="p-12 md:p-16 bg-slate-50">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">A Message From Our CEO</h2>
                  <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                    {/* CEO Photo */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative group">
                        {website.ceo_photo_url ? (
                          <img src={website.ceo_photo_url} alt={website.ceo_message.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-6xl text-slate-500">{website.ceo_message.name?.charAt(0)}</div>
                        )}
                      </div>
                      <input ref={ceoPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleCeoPhotoUpload} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => ceoPhotoInputRef.current?.click()}
                        disabled={isUploadingCeoPhoto}
                        className="text-xs border-slate-400 text-slate-600 hover:bg-slate-100"
                      >
                        {isUploadingCeoPhoto ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Uploading...</> : <><Upload className="w-3 h-3 mr-1" />{website.ceo_photo_url ? 'Change Photo' : 'Upload Photo'}</>}
                      </Button>
                    </div>
                    <div>
                      <p className="text-lg text-slate-700 leading-relaxed mb-4 italic">"{website.ceo_message.message}"</p>
                      <div>
                        <p className="font-semibold text-slate-900">{website.ceo_message.name}</p>
                        <p className="text-sm text-slate-600">{website.ceo_message.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Preview */}
              <div className="p-12 md:p-16 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">What Our Clients Say</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {website.testimonials?.map((testimonial, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-6 shadow-sm">
                      <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup Preview */}
              <div className="p-12 md:p-16 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{website.newsletter?.headline}</h2>
                  <p className="text-slate-600 mb-8">{website.newsletter?.description}</p>
                  <div className="flex gap-2 max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder={website.newsletter?.placeholder || "Enter your email"}
                      className="flex-1 h-12 px-4 rounded-lg border border-slate-300 focus:border-violet-500 focus:outline-none"
                    />
                    <Button 
                      className="h-12 px-6"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {website.newsletter?.button_text || "Subscribe"}
                    </Button>
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="mt-8 flex justify-center gap-4">
                    {project.selected_platforms?.map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                      >
                        <span className="text-slate-700 text-sm font-semibold">
                          {platform === 'facebook' && 'f'}
                          {platform === 'instagram' && 'ig'}
                          {platform === 'twitter' && '𝕏'}
                          {platform === 'linkedin' && 'in'}
                          {platform === 'youtube' && 'yt'}
                          {platform === 'tiktok' && 'tt'}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Preview */}
              <div 
                className="p-12 md:p-16 text-center text-white"
                style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})` }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{website.cta?.headline}</h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">{website.cta?.description}</p>
                <Button className="h-12 px-8 bg-white text-slate-800 hover:bg-slate-100">
                  {website.cta?.button_text}
                </Button>
              </div>

              {/* Footer Preview */}
              <div className="p-8 bg-slate-900 text-center">
                {project.logo_url && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={project.logo_url} 
                      alt="Logo" 
                      className="h-16 object-contain"
                      style={{ background: 'transparent' }}
                    />
                  </div>
                )}
                <p className="text-slate-400 mb-2">{website.footer?.tagline}</p>
                <p className="text-sm text-slate-500">{website.footer?.copyright}</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {['hero', 'about', 'services', 'features', 'video_commercial', 'ceo_message', 'testimonials', 'newsletter', 'cta'].map((section) => (
                <Card key={section} className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{section} Section</CardTitle>
                      {editingSection === section ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => handleSaveSection(section)} className="bg-emerald-600 hover:bg-emerald-700">
                            <Check className="w-4 h-4 mr-1" /> Save
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(section, website[section])}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingSection === section ? (
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    ) : (
                      <pre className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg overflow-x-auto">
                        {typeof website[section] === 'string' ? website[section] : JSON.stringify(website[section], null, 2)}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={onPrev} variant="outline" className="h-12 px-6">
              <ChevronLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <Button onClick={onNext} className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
              Complete Setup
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}