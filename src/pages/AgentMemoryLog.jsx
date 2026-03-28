import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Search, Archive, Trash2, Plus, Loader2, Bot, Tag, Calendar, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const MEMORY_TYPES = ['observation', 'decision', 'learning', 'context', 'error', 'user_preference'];

const TYPE_COLORS = {
  observation: 'bg-blue-100 text-blue-700',
  decision: 'bg-violet-100 text-violet-700',
  learning: 'bg-emerald-100 text-emerald-700',
  context: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  user_preference: 'bg-pink-100 text-pink-700',
};

const AGENTS = [
  'brand_sentinel', 'business_assistant', 'project_manager', 'graphic_artist',
  'market_intelligence', 'competitive_intelligence', 'gap_opportunity',
  'brand_strategy_architect', 'go_to_market', 'strategy_auditor',
  'performance_monitor', 'business_plan_architect', 'seo_growth_engine',
  'board_advisor', 'cms_design_guardian', 'security_sentinel',
  'infrastructure_sentinel', 'logo_standards_guardian', 'brand_consistency_guardian',
];

function MemoryCard({ memory, onArchive, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border p-4 bg-white ${memory.is_archived ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge className={`text-[10px] ${TYPE_COLORS[memory.memory_type] || 'bg-slate-100 text-slate-600'}`}>
              {memory.memory_type}
            </Badge>
            {memory.importance >= 8 && <Badge className="text-[10px] bg-orange-100 text-orange-700">High Priority</Badge>}
            {memory.session_id && <Badge className="text-[10px] bg-slate-100 text-slate-500">Session: {memory.session_id.slice(0, 8)}</Badge>}
          </div>
          <p className="text-sm font-medium text-slate-800">{memory.summary || memory.content.slice(0, 100)}</p>
          {expanded && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">{memory.content}</p>
              {memory.keywords?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {memory.keywords.map(k => (
                    <span key={k} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{k}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{moment(memory.created_date).fromNow()}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" />Importance: {memory.importance}/10</span>
            <span>Accessed: {memory.access_count || 0}x</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(v => !v)} className="text-slate-400 p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onArchive(memory.id)} className="text-slate-400 p-1 hover:text-amber-500">
            <Archive className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(memory.id)} className="text-slate-400 p-1 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AgentMemoryLogPage() {
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ content: '', memory_type: 'observation', importance: 5, tags: '' });

  const { data: agents = [] } = useQuery({
    queryKey: ['agentMemoryAgents'],
    queryFn: async () => {
      const res = await base44.functions.invoke('agentMemory', { action: 'list_agents' });
      return res.data?.agents || [];
    }
  });

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['agentMemories', selectedAgent],
    queryFn: async () => {
      if (!selectedAgent) return [];
      const res = await base44.functions.invoke('agentMemory', { action: 'list', agent_name: selectedAgent });
      return res.data?.memories || [];
    },
    enabled: !!selectedAgent,
  });

  const storeMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('agentMemory', { action: 'store', ...data }),
    onSuccess: () => {
      toast.success('Memory stored!');
      queryClient.invalidateQueries({ queryKey: ['agentMemories'] });
      queryClient.invalidateQueries({ queryKey: ['agentMemoryAgents'] });
      setShowAddForm(false);
      setNewMemory({ content: '', memory_type: 'observation', importance: 5, tags: '' });
    },
    onError: (e) => toast.error('Failed: ' + e.message),
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => base44.functions.invoke('agentMemory', { action: 'archive', memory_id: id }),
    onSuccess: () => { toast.success('Memory archived'); queryClient.invalidateQueries({ queryKey: ['agentMemories'] }); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.functions.invoke('agentMemory', { action: 'delete', memory_id: id }),
    onSuccess: () => { toast.success('Memory deleted'); queryClient.invalidateQueries({ queryKey: ['agentMemories'] }); queryClient.invalidateQueries({ queryKey: ['agentMemoryAgents'] }); }
  });

  const handleSearch = async () => {
    if (!selectedAgent || !searchQuery.trim()) return;
    setIsSearching(true);
    const res = await base44.functions.invoke('agentMemory', { action: 'retrieve', agent_name: selectedAgent, query: searchQuery });
    setSearchResults(res.data?.memories || []);
    setIsSearching(false);
  };

  const handleStore = () => {
    if (!selectedAgent || !newMemory.content) { toast.error('Select an agent and enter memory content'); return; }
    storeMutation.mutate({
      agent_name: selectedAgent,
      content: newMemory.content,
      memory_type: newMemory.memory_type,
      importance: parseInt(newMemory.importance),
      tags: newMemory.tags ? newMemory.tags.split(',').map(t => t.trim()) : [],
    });
  };

  const displayMemories = searchResults !== null ? searchResults : memories;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-white/80" />
            Team Memory Logs
          </h1>
          <p className="text-indigo-200 mt-1">Persistent memory storage with keyword-vector retrieval for all team members</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Agent Stats */}
        {agents.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents.slice(0, 4).map(a => (
              <Card key={a.agent_name} className="wizard-card border-0 cursor-pointer hover:ring-2 hover:ring-violet-400 transition-all"
                onClick={() => { setSelectedAgent(a.agent_name); setSearchResults(null); }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-semibold text-slate-700 truncate">{a.agent_name.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-2xl font-bold text-violet-600">{a.total - a.archived}</div>
                  <div className="text-xs text-slate-400">active memories</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Controls */}
        <Card className="wizard-card border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={selectedAgent} onValueChange={(v) => { setSelectedAgent(v); setSearchResults(null); }}>
                <SelectTrigger className="w-full md:w-64">
                  <Bot className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select a team member..." />
                </SelectTrigger>
                <SelectContent>
                  {AGENTS.map(a => (
                    <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Search memories by keyword..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); if (!e.target.value) setSearchResults(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching || !selectedAgent} className="bg-violet-600 hover:bg-violet-700">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>

              <Button onClick={() => setShowAddForm(v => !v)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />Add Memory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Memory Form */}
        {showAddForm && (
          <Card className="wizard-card border-0 border-l-4 border-l-violet-500">
            <CardHeader className="pb-3"><CardTitle className="text-slate-900 text-base">Store New Memory</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <Label>Type</Label>
                  <Select value={newMemory.memory_type} onValueChange={v => setNewMemory(p => ({ ...p, memory_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{MEMORY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Importance (1–10)</Label>
                  <Input type="number" min={1} max={10} value={newMemory.importance} onChange={e => setNewMemory(p => ({ ...p, importance: e.target.value }))} />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input placeholder="brand, logo, user" value={newMemory.tags} onChange={e => setNewMemory(p => ({ ...p, tags: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Memory Content</Label>
                <Textarea placeholder="Enter the memory content to store..." value={newMemory.content} onChange={e => setNewMemory(p => ({ ...p, content: e.target.value }))} className="h-24" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleStore} disabled={storeMutation.isPending} className="bg-violet-600 hover:bg-violet-700">
                  {storeMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Storing...</> : 'Store Memory'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Memory List */}
        {selectedAgent && (
          <Card className="wizard-card border-0">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-500" />
                  {selectedAgent.replace(/_/g, ' ')}
                  {searchResults !== null && <Badge className="bg-violet-100 text-violet-700 ml-2">{searchResults.length} results</Badge>}
                </CardTitle>
                {searchResults !== null && (
                  <Button variant="ghost" size="sm" onClick={() => { setSearchResults(null); setSearchQuery(''); }}>Clear Search</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
              ) : displayMemories.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">{searchResults !== null ? 'No memories matched your search' : 'No memories yet for this agent'}</p>
                </div>
              ) : (
                displayMemories.map(mem => (
                  <MemoryCard
                    key={mem.id}
                    memory={mem}
                    onArchive={(id) => archiveMutation.mutate(id)}
                    onDelete={(id) => { if (confirm('Delete this memory permanently?')) deleteMutation.mutate(id); }}
                  />
                ))
              )}
            </CardContent>
          </Card>
        )}

        {!selectedAgent && (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Select a team member to view their memory log</p>
          </div>
        )}
      </div>
    </div>
  );
}