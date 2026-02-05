import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, ArrowRight, MessageSquare, TrendingUp, 
  Palette, Globe, DollarSign, Users, Lightbulb, CheckCircle, Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    business_name: '',
    industry: '',
    description: '',
    target_audience: '',
    location: '',
    project_type: 'full_business'
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState(false);

  const projectTypes = {
    full_business: { 
      label: 'Complete Business Setup',
      desc: 'Market research, branding, website, financials',
      icon: TrendingUp,
      features: ['Market Research', 'Business Plan', 'Logo & Branding', 'Website', 'Financial Planning']
    },
    brand_identity: {
      label: 'Brand Identity Only',
      desc: 'Logo, colors, brand guidelines',
      icon: Palette,
      features: ['Logo Design', 'Brand Colors', 'Brand Kit', 'Style Guide']
    },
    website_launch: {
      label: 'Website Launch',
      desc: 'Professional website with content',
      icon: Globe,
      features: ['Website Design', 'Content Generation', 'SEO Strategy', 'Social Assets']
    },
    financial_planning: {
      label: 'Financial Analysis',
      desc: 'Projections, P&L, cash flow',
      icon: DollarSign,
      features: ['Financial Forecasts', 'P&L Statements', 'Cash Flow', 'ROI Analysis']
    }
  };

  const createProjectMutation = useMutation({
    mutationFn: async (data) => {
      const project = await base44.entities.BusinessProject.create({
        ...data,
        status: 'in_progress',
        current_step: 1
      });
      return project;
    },
    onSuccess: (project) => {
      toast.success('Project created! Redirecting...');
      setTimeout(() => {
        navigate(createPageUrl(`CreateBusiness?projectId=${project.id}`));
      }, 1000);
    }
  });

  useEffect(() => {
    if (step === 2 && userData.business_name && userData.industry) {
      generateAISuggestions();
    }
  }, [step]);

  const generateAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Given this business setup:
- Name: ${userData.business_name}
- Industry: ${userData.industry}
- Type: ${projectTypes[userData.project_type].label}

Provide 5 personalized, actionable suggestions for features or steps they should prioritize. Each suggestion should be specific to their industry and project type.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            }
          }
        }
      });
      setAiSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Failed to generate suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;
    
    const newMessage = { role: 'user', content: userQuestion };
    setChatMessages([...chatMessages, newMessage]);
    setUserQuestion('');
    setAnsweringQuestion(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an onboarding assistant for BrandForge, an AI business builder platform. 
User context: ${userData.business_name} in ${userData.industry} industry.
Project type: ${projectTypes[userData.project_type].label}

User question: "${userQuestion}"

Provide a helpful, concise answer focused on onboarding and getting started with the platform.`
      });
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try asking your question again.' 
      }]);
    } finally {
      setAnsweringQuestion(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-violet-600" />
            Welcome to BrandForge
          </h1>
          <p className="text-slate-600">Let's build your business with AI</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-slate-500">
            <span>Step {step} of 3</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Path - 4 Simple Options</CardTitle>
                  <p className="text-sm text-slate-600 mt-2">
                    Each option is a streamlined workflow designed for speed and simplicity. 
                    Select the path that fits your needs - you can always add more features later.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(projectTypes).map(([key, type], index) => {
                      const Icon = type.icon;
                      const stepNumber = index + 1;
                      return (
                        <button
                          key={key}
                          onClick={() => setUserData({ ...userData, project_type: key })}
                          className={`p-6 rounded-xl border-2 text-left transition-all ${
                            userData.project_type === key
                              ? 'border-violet-600 bg-violet-50'
                              : 'border-slate-200 hover:border-violet-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-violet-700">{stepNumber}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-violet-600" />
                                <h3 className="font-bold text-slate-900 text-base">{type.label}</h3>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{type.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {type.features.slice(0, 3).map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full" size="lg">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tell us about your business</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name *</Label>
                    <Input
                      value={userData.business_name}
                      onChange={(e) => setUserData({ ...userData, business_name: e.target.value })}
                      placeholder="e.g., TechStart Solutions"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Industry *</Label>
                    <Select value={userData.industry} onValueChange={(v) => setUserData({ ...userData, industry: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Creative Services">Creative Services</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Brief Description *</Label>
                    <Textarea
                      value={userData.description}
                      onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                      placeholder="What does your business do?"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Input
                        value={userData.target_audience}
                        onChange={(e) => setUserData({ ...userData, target_audience: e.target.value })}
                        placeholder="e.g., Small business owners"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setStep(1)} variant="outline">
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      className="flex-1"
                      disabled={!userData.business_name || !userData.industry || !userData.description}
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: AI Suggestions & Assistant */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSuggestions ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-2" />
                      <p className="text-slate-500">Analyzing your business needs...</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {aiSuggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">{suggestion.title}</p>
                            <p className="text-sm text-slate-600 mt-1">{suggestion.description}</p>
                            <Badge 
                              className="mt-2"
                              variant={suggestion.priority === 'high' ? 'default' : 'secondary'}
                            >
                              {suggestion.priority} priority
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* AI Assistant Chat */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-violet-600" />
                    Ask Our AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chatMessages.length > 0 && (
                      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-violet-100 ml-8'
                                : 'bg-slate-100 mr-8'
                            }`}
                          >
                            <p className="text-sm text-slate-700">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        placeholder="Ask anything about getting started..."
                      />
                      <Button onClick={handleAskQuestion} disabled={answeringQuestion}>
                        {answeringQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Launch Button */}
              <Button
                onClick={() => createProjectMutation.mutate(userData)}
                disabled={createProjectMutation.isPending}
                className="w-full"
                size="lg"
              >
                {createProjectMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Your Project...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Start Building</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}