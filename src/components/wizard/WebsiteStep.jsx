import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, RefreshCw, ChevronRight, ChevronLeft, Pencil, Check, Eye, Code } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function WebsiteStep({ project, onUpdate, onNext, onPrev }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [viewMode, setViewMode] = useState('preview');

  const generateWebsite = async () => {
    setIsGenerating(true);
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Create website content for "${project.business_name}" based on this business plan:

Business: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Target Audience: ${project.target_audience}

Executive Summary: ${project.business_plan?.executive_summary}
Products/Services: ${project.business_plan?.products_services}
Marketing Strategy: ${project.business_plan?.marketing_strategy}

Generate engaging, conversion-focused website content for these sections:
1. Hero Section (headline, subheadline, CTA button text)
2. About Section
3. Services/Products Section (list 3-4 key offerings with descriptions)
4. Features/Benefits Section (list 4-6 key benefits)
5. Testimonials (generate 3 realistic testimonials)
6. Call to Action Section
7. Footer content

Make it professional, persuasive, and aligned with the business's value proposition.`,
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
    
    await onUpdate({
      website_content: response,
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
    }
    
    await onUpdate({ website_content: updatedContent });
    setEditingSection(null);
  };

  const startEditing = (section, content) => {
    setEditingSection(section);
    setEditContent(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  };

  const website = project?.website_content;
  const colors = project?.brand_colors || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' };

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
            <Card className="border-0 shadow-xl overflow-hidden">
              {/* Hero Preview */}
              <div 
                className="p-12 md:p-20 text-center text-white"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                {project.logo_url && (
                  <img src={project.logo_url} alt="Logo" className="h-16 mx-auto mb-6 object-contain" />
                )}
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{website.hero?.headline}</h1>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">{website.hero?.subheadline}</p>
                <Button className="h-12 px-8 bg-white text-slate-800 hover:bg-slate-100">
                  {website.hero?.cta_text}
                </Button>
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
                  {website.services?.map((service, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <div 
                        className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {service.icon || '✨'}
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2">{service.title}</h3>
                      <p className="text-sm text-slate-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Preview */}
              <div className="p-12 md:p-16 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">Why Choose Us</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {website.features?.map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div 
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: colors.accent }}
                      >
                        ✓
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials Preview */}
              <div className="p-12 md:p-16 bg-slate-50">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">What Our Clients Say</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {website.testimonials?.map((testimonial, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
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
                <p className="text-slate-400 mb-2">{website.footer?.tagline}</p>
                <p className="text-sm text-slate-500">{website.footer?.copyright}</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {['hero', 'about', 'services', 'features', 'testimonials', 'cta'].map((section) => (
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
            <Button onClick={onNext} className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg">
              Continue to Social Media
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}