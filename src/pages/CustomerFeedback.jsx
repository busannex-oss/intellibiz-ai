import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare, TrendingUp, BarChart3, Lightbulb, AlertCircle, 
  Plus, Sparkles, ThumbsUp, ThumbsDown, Minus, Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CustomerFeedback() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  const [newFeedback, setNewFeedback] = useState({
    feedback_text: '',
    source: 'survey',
    rating: 5,
    customer_name: '',
    customer_email: ''
  });
  const [analyzing, setAnalyzing] = useState(false);

  const { data: feedback = [] } = useQuery({
    queryKey: ['feedback', projectId],
    queryFn: () => base44.entities.CustomerFeedback.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const analyzeFeedback = async (feedbackText) => {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this customer feedback for ${project?.business_name}:

"${feedbackText}"

Provide:
1. Sentiment (positive/neutral/negative)
2. Key themes (2-4 themes)
3. Main points (3-5 bullet points)
4. Actionable insights (2-3 specific recommendations)
5. Urgency level (low/medium/high)`,
      response_json_schema: {
        type: "object",
        properties: {
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          themes: { type: "array", items: { type: "string" } },
          key_points: { type: "array", items: { type: "string" } },
          actionable_insights: { type: "array", items: { type: "string" } },
          urgency: { type: "string", enum: ["low", "medium", "high"] }
        }
      }
    });
    return response;
  };

  const createFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      setAnalyzing(true);
      const aiAnalysis = await analyzeFeedback(data.feedback_text);
      return base44.entities.CustomerFeedback.create({
        project_id: projectId,
        ...data,
        ai_analysis: aiAnalysis
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['feedback', projectId]);
      setNewFeedback({
        feedback_text: '',
        source: 'survey',
        rating: 5,
        customer_name: '',
        customer_email: ''
      });
      setAnalyzing(false);
      toast.success('Feedback added and analyzed!');
    },
    onError: () => {
      setAnalyzing(false);
      toast.error('Failed to add feedback');
    }
  });

  const sentimentCounts = {
    positive: feedback.filter(f => f.ai_analysis?.sentiment === 'positive').length,
    neutral: feedback.filter(f => f.ai_analysis?.sentiment === 'neutral').length,
    negative: feedback.filter(f => f.ai_analysis?.sentiment === 'negative').length
  };

  const allThemes = feedback
    .flatMap(f => f.ai_analysis?.themes || [])
    .reduce((acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {});

  const topThemes = Object.entries(allThemes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const allInsights = feedback
    .flatMap(f => f.ai_analysis?.actionable_insights || [])
    .slice(0, 20);

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-violet-600" />
              Customer Feedback Analysis
            </h1>
            <p className="text-slate-500">{project?.business_name}</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Customer Feedback</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name (optional)</Label>
                    <Input
                      value={newFeedback.customer_name}
                      onChange={(e) => setNewFeedback({ ...newFeedback, customer_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Email (optional)</Label>
                    <Input
                      type="email"
                      value={newFeedback.customer_email}
                      onChange={(e) => setNewFeedback({ ...newFeedback, customer_email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select value={newFeedback.source} onValueChange={(v) => setNewFeedback({ ...newFeedback, source: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="social_media">Social Media</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={newFeedback.rating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Feedback *</Label>
                  <Textarea
                    value={newFeedback.feedback_text}
                    onChange={(e) => setNewFeedback({ ...newFeedback, feedback_text: e.target.value })}
                    placeholder="Enter customer feedback..."
                    rows={6}
                  />
                </div>

                <Button
                  onClick={() => createFeedbackMutation.mutate(newFeedback)}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  disabled={!newFeedback.feedback_text || analyzing}
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Add & Analyze</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Total Feedback</p>
              <p className="text-3xl font-bold text-slate-800">{feedback.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Avg Rating</p>
              <p className="text-3xl font-bold text-amber-600">{avgRating} ★</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Positive</p>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
                <p className="text-3xl font-bold text-emerald-600">{sentimentCounts.positive}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Negative</p>
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-600" />
                <p className="text-3xl font-bold text-red-600">{sentimentCounts.negative}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-32">
                      <ThumbsUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium">Positive</span>
                    </div>
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full"
                        style={{ width: `${(sentimentCounts.positive / feedback.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-12 text-right">
                      {sentimentCounts.positive}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-32">
                      <Minus className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium">Neutral</span>
                    </div>
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-slate-600 h-3 rounded-full"
                        style={{ width: `${(sentimentCounts.neutral / feedback.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-12 text-right">
                      {sentimentCounts.neutral}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-32">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Negative</span>
                    </div>
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-red-600 h-3 rounded-full"
                        style={{ width: `${(sentimentCounts.negative / feedback.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-12 text-right">
                      {sentimentCounts.negative}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="themes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Feedback Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topThemes.map(([theme, count], i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-48 truncate">{theme}</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-violet-600 h-2 rounded-full"
                          style={{ width: `${(count / feedback.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-12 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI-Generated Actionable Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {allInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-emerald-600">✓</span>
                      <span className="text-slate-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.id} className="border-l-4" style={{
                borderLeftColor: item.ai_analysis?.sentiment === 'positive' ? '#10b981' :
                  item.ai_analysis?.sentiment === 'negative' ? '#ef4444' : '#64748b'
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {item.customer_name && (
                          <span className="font-medium text-slate-800">{item.customer_name}</span>
                        )}
                        <Badge variant="secondary">{item.source}</Badge>
                        <Badge className={
                          item.ai_analysis?.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                            item.ai_analysis?.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-800'
                        }>
                          {item.ai_analysis?.sentiment}
                        </Badge>
                        {item.rating && (
                          <span className="text-amber-600 text-sm">{item.rating} ★</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{item.feedback_text}</p>
                  
                  {item.ai_analysis?.themes && (
                    <div className="flex flex-wrap gap-2">
                      {item.ai_analysis.themes.map((theme, i) => (
                        <Badge key={i} variant="outline">{theme}</Badge>
                      ))}
                    </div>
                  )}

                  {item.ai_analysis?.actionable_insights && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">AI Recommendations:</p>
                      <ul className="space-y-1">
                        {item.ai_analysis.actionable_insights.map((insight, i) => (
                          <li key={i} className="text-sm text-blue-800">• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}