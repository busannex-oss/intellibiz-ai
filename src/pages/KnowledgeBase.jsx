import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookText, Search, Phone, Globe, Palette, Users, Settings, BarChart } from 'lucide-react';

const ARTICLES = [
  { title: 'Getting Started with BrandForge', category: 'Getting Started', icon: BookText, content: 'Learn the basics of creating your first business project with AI-powered tools.' },
  { title: 'Creating Your First Project', category: 'Getting Started', icon: Settings, content: 'Step-by-step guide to set up and launch your first business project.' },
  { title: 'Understanding Market Research', category: 'Features', icon: BarChart, content: 'How our AI analyzes competitors and identifies market opportunities.' },
  { title: 'Phone Integration Setup', category: 'Integrations', icon: Phone, content: 'Connect RingCentral or Dialpad for advanced phone features.' },
  { title: 'Customizing Color Themes', category: 'Customization', icon: Palette, content: 'Learn how to customize your platform appearance with white label themes.' },
  { title: 'Managing Team Members', category: 'Team', icon: Users, content: 'Add users, assign roles, and manage permissions for your team.' },
  { title: 'Website Content Generation', category: 'Features', icon: Globe, content: 'Generate SEO-optimized website content with AI assistance.' },
  { title: 'White Label Options', category: 'Advanced', icon: Settings, content: 'Customize branding and unlock premium color themes for your platform.' }
];

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = ARTICLES.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(ARTICLES.map(a => a.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookText className="w-8 h-8 text-blue-500" />
            Knowledge Base
          </h1>
          <p className="text-slate-400 mt-1">Help articles and documentation</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="pl-12 h-14 bg-slate-800 border-slate-700 text-white text-lg"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Badge key={cat} className="bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-pointer hover:bg-blue-500/30">
              {cat}
            </Badge>
          ))}
        </div>

        {/* Articles */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredArticles.map((article, i) => (
            <Card key={i} className="border-0 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <article.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                    <Badge variant="outline" className="mt-2 border-slate-600 text-slate-400 text-xs">
                      {article.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">{article.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No articles found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}