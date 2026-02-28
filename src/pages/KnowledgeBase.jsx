import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookText, Search, Loader2, ChevronDown, Plus } from 'lucide-react';

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
  const [expandedId, setExpandedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'getting_started' });
  const queryClient = useQueryClient();
  
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

  const createMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      if (!user) throw new Error('Not authenticated');
      return base44.entities.KnowledgeBase.create({
        ...formData,
        project_id: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgebase'] });
      setFormData({ title: '', content: '', category: 'getting_started' });
      setIsDialogOpen(false);
    }
  });

  const handleCreate = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookText className="w-8 h-8 text-blue-500" />
              Knowledge Base
            </h1>
            <p className="text-slate-400 mt-1">Help articles and documentation</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create Knowledge Base Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Article title..."
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm">Category</label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="getting_started">Getting Started</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="phone_system">Phone System</SelectItem>
                      <SelectItem value="omnichannel">Omnichannel</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Article content..."
                    className="bg-slate-700 border-slate-600 text-white mt-1 h-40"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">Cancel</Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                    {createMutation.isPending ? 'Creating...' : 'Create Article'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
             <p className="text-slate-400">No articles found. Your Knowledge Base is empty.</p>
             <p className="text-slate-500 text-sm mt-2">Ensure you have created Knowledge Base articles.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
               const Icon = CATEGORY_ICONS[article.category] || BookText;
               const isExpanded = expandedId === article.id;
               return (
                 <Card key={article.id} className="border-0 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer overflow-hidden" onClick={() => setExpandedId(isExpanded ? null : article.id)}>
                   <CardHeader>
                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                         <Icon className="w-5 h-5 text-blue-400" />
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center justify-between">
                           <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                           <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                         </div>
                         <Badge variant="outline" className="mt-2 border-slate-600 text-slate-400 text-xs">
                           {article.category}
                         </Badge>
                       </div>
                     </div>
                   </CardHeader>
                   {isExpanded && (
                     <CardContent>
                       <div className="text-slate-300 text-sm whitespace-pre-wrap">{article.content}</div>
                     </CardContent>
                   )}
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