import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Sparkles, Search, ChevronRight, ChevronLeft,
  FileText, Phone, MessageSquare, Globe, Palette, BarChart3,
  CreditCard, HelpCircle, Rocket, CheckCircle2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

const CATEGORIES = [
  { id: 'getting_started', label: 'Getting Started', icon: Rocket, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'dashboard', label: 'Dashboard', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { id: 'phone_system', label: 'Phone System', icon: Phone, color: 'bg-violet-100 text-violet-600' },
  { id: 'omnichannel', label: 'Omnichannel', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
  { id: 'website', label: 'Website', icon: Globe, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'social_media', label: 'Social Media', icon: Palette, color: 'bg-orange-100 text-orange-600' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'bg-amber-100 text-amber-600' },
];

export default function KnowledgeBaseStep({ project, onUpdate, onNext, onBack }) {
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledgeBase', project?.id],
    queryFn: () => base44.entities.KnowledgeBase.filter({ project_id: project.id }),
    enabled: !!project?.id
  });

  const generateKnowledgeBase = async () => {
    setGenerating(true);
    
    const knowledgePrompts = [
      {
        category: 'getting_started',
        title: 'Welcome to Your Business Dashboard',
        prompt: `Create a comprehensive getting started guide for ${project.business_name}, a ${project.industry} business. Include: initial setup steps, overview of key features, first-time setup checklist, and tips for success.`
      },
      {
        category: 'getting_started',
        title: 'Quick Start Checklist',
        prompt: `Create a quick start checklist for ${project.business_name}. Include essential tasks to complete in the first week: setting up profile, configuring communications, launching website, etc.`
      },
      {
        category: 'dashboard',
        title: 'Navigating Your Dashboard',
        prompt: `Create a guide for navigating the business dashboard for ${project.business_name}. Explain each section: projects, analytics, settings, and how to access key features.`
      },
      {
        category: 'phone_system',
        title: 'Setting Up Your AI Phone System',
        prompt: `Create a detailed guide for setting up the AI phone system for ${project.business_name}. Include: provider selection, phone number setup, IVR configuration, call routing, voicemail, and AI receptionist settings.`
      },
      {
        category: 'phone_system',
        title: 'Managing Calls and SMS',
        prompt: `Create a guide for managing calls and SMS for ${project.business_name}. Cover: viewing call logs, handling voicemails, sending/receiving SMS, call analytics, and team extensions.`
      },
      {
        category: 'omnichannel',
        title: 'Unified Inbox Setup',
        prompt: `Create a guide for setting up the unified inbox for ${project.business_name}. Include: connecting channels (WhatsApp, Facebook, Instagram, email, SMS), managing conversations, and AI auto-responses.`
      },
      {
        category: 'omnichannel',
        title: 'Chat Widget Installation',
        prompt: `Create step-by-step instructions for installing the website chat widget for ${project.business_name}. Include code snippets and customization options.`
      },
      {
        category: 'website',
        title: 'Managing Your Website Content',
        prompt: `Create a guide for managing website content for ${project.business_name}. Cover: editing pages, updating hero sections, adding services, managing testimonials, and SEO settings.`
      },
      {
        category: 'social_media',
        title: 'Social Media Asset Management',
        prompt: `Create a guide for managing social media assets for ${project.business_name}. Include: downloading assets, optimal posting sizes, brand consistency, and content calendar tips.`
      },
      {
        category: 'analytics',
        title: 'Understanding Your Analytics',
        prompt: `Create a guide for understanding business analytics for ${project.business_name}. Cover: key metrics, call analytics, message analytics, website traffic, and conversion tracking.`
      },
      {
        category: 'faq',
        title: 'Frequently Asked Questions',
        prompt: `Create a comprehensive FAQ for ${project.business_name} business owners. Include common questions about: account management, billing, technical issues, feature requests, and support.`
      }
    ];

    for (const item of knowledgePrompts) {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: item.prompt + `\n\nFormat the response in clean markdown with headers, bullet points, and numbered lists where appropriate. Make it professional and easy to follow.`,
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            keywords: { type: "array", items: { type: "string" } }
          }
        }
      });

      await base44.entities.KnowledgeBase.create({
        project_id: project.id,
        category: item.category,
        title: item.title,
        content: response.content,
        keywords: response.keywords || [],
        is_auto_generated: true,
        order: knowledgePrompts.indexOf(item)
      });
    }

    queryClient.invalidateQueries(['knowledgeBase', project.id]);
    setGenerating(false);
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedArticles = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = filteredArticles.filter(a => a.category === cat.id);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Knowledge Base</h2>
        <p className="text-slate-500">AI-generated documentation and guides for managing your business</p>
      </div>

      {articles.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Generate Your Knowledge Base</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Create comprehensive documentation and guides tailored to {project?.business_name}. 
              This will help you and your team manage all aspects of your business.
            </p>
            <Button 
              onClick={generateKnowledgeBase} 
              disabled={generating}
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Articles...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Knowledge Base
                </>
              )}
            </Button>
            {generating && (
              <p className="text-sm text-slate-400 mt-4">This may take a minute...</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardContent className="p-2">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedArticle(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-violet-100 text-violet-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">All Articles</span>
                  <Badge variant="secondary" className="ml-auto">{articles.length}</Badge>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = groupedArticles[cat.id]?.length || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedArticle(null); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id ? 'bg-violet-100 text-violet-700' : 'hover:bg-slate-50'
                      }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-sm">{cat.label}</span>
                      {count > 0 && <Badge variant="secondary" className="ml-auto">{count}</Badge>}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={generateKnowledgeBase} 
              disabled={generating}
              className="w-full"
            >
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Regenerate All
            </Button>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedArticle ? (
                <motion.div
                  key="article"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader className="border-b">
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back to articles
                      </button>
                      <CardTitle>{selectedArticle.title}</CardTitle>
                      <Badge className={CATEGORIES.find(c => c.id === selectedArticle.category)?.color}>
                        {CATEGORIES.find(c => c.id === selectedArticle.category)?.label}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="prose prose-slate max-w-none">
                          <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {(selectedCategory ? [{ id: selectedCategory, ...CATEGORIES.find(c => c.id === selectedCategory) }] : CATEGORIES).map((cat) => {
                    const catArticles = groupedArticles[cat.id] || [];
                    if (catArticles.length === 0) return null;
                    return (
                      <Card key={cat.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                              <cat.icon className="w-4 h-4" />
                            </div>
                            <CardTitle className="text-lg">{cat.label}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-1">
                            {catArticles.map((article) => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span className="text-slate-700">{article.title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="bg-gradient-to-r from-violet-600 to-indigo-600">
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}