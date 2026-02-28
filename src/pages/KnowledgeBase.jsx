import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookText, Search, Loader2 } from 'lucide-react';

const CATEGORY_ICONS = {
  'getting_started': BookText,
  'dashboard': Search,
  'phone_system': Search,
  'omnichannel': Search,
  'website': Search,
  'social_media': Search,
  'branding': Search,
  'analytics': Search,
  'billing': Search,
  'faq': Search
};

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledgebase'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        if (!user) return [];
        const data = await base44.entities.KnowledgeBase.filter({
          created_by: user.email
        });
        return data || [];
      } catch (err) {
        console.error('Failed to load knowledge base:', err);
        return [];
      }
    }
  });

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-slate-400 mt-4">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No articles yet. Create your first knowledge base article to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const Icon = CATEGORY_ICONS[article.category] || BookText;
              return (
                <Card key={article.id} className="border-0 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-400" />
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
                    <p className="text-slate-400 text-sm line-clamp-2">{article.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {articles.length > 0 && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No articles found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}