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

  const businessSteps = [
    {
      step: 1,
      label: 'Research & Business Plan',
      desc: 'Research your industry and create your business plan — the foundation of everything.',
      icon: TrendingUp,
      features: ['Market Research', 'Competitor Analysis', 'Business Plan', 'Financial Projections'],
      color: 'text-violet-600',
      bg: 'bg-violet-100'
    },
    {
      step: 2,
      label: 'Brand Identity',
      desc: 'Establish your brand — create your logo and style guide to stand out.',
      icon: Palette,
      features: ['Logo Design', 'Brand Colors', 'Style Guide', 'Brand Kit'],
      color: 'text-pink-600',
      bg: 'bg-pink-100'
    },
    {
      step: 3,
      label: 'Online Presence',
      desc: 'Build your website, social media assets, and omnichannel communication.',
      icon: Globe,
      features: ['Website Design', 'Social Media Assets', 'Omnichannel Setup', 'SEO Strategy'],
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      step: 4,
      label: 'Growth & Marketing',
      desc: 'Launch newsletters, ads, and track performance to grow your business.',
      icon: DollarSign,
      features: ['Newsletter Campaigns', 'Advertising', 'Analytics', 'Performance Reports'],
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    }
  ];

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

  const cardClass = "border border-slate-700 bg-slate-800/60 backdrop-blur-sm";
  const labelClass = "text-slate-300";
  const inputClass = "bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 tracking-[-0.02em]">
            <Sparkles className="w-8 h-8 text-amber-400" />
            Welcome to BrandForge
          </h1>
          <p className="text-slate-400">Let's build your business with AI</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
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
             <Card className={cardClass}>
               <CardHeader>
                 <CardTitle className="text-2xl text-white">Your 4-Step Path to Business Success</CardTitle>
                 <p className="text-sm text-slate-400 mt-2">
                   These are the exact steps every successful business follows — in this order.
                   The sequence matters: each step builds on the last for the best results.
                 </p>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                   {businessSteps.map((item) => {
                     const Icon = item.icon;
                     return (
                       <div
                         key={item.step}
                         className="p-6 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition-colors"
                       >
                         <div className="flex items-center gap-3 mb-3">
                           <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                             <span className="text-sm font-bold text-amber-400">{item.step}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Icon className="w-5 h-5 text-amber-400" />
                             <h3 className="font-bold text-white text-base">{item.label}</h3>
                           </div>
                         </div>
                         <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                         <div className="flex flex-wrap gap-2">
                           {item.features.map((feature, i) => (
                             <Badge key={i} className="text-xs bg-slate-700/60 text-slate-300 border border-slate-600">
                               {feature}
                             </Badge>
                           ))}
                         </div>
                       </div>
                     );
                   })}
                 </div>

                 <p className="text-center text-sm text-slate-400 font-medium pt-1">
                   ✅ Follow these steps in order for best results
                 </p>

                 <Button
                   onClick={() => setStep(2)}
                   className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20"
                   size="lg"
                 >
                   Get Started <ArrowRight className="w-4 h-4 ml-2" />
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
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="text-white">Tell us about your business</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className={labelClass}>Business Name *</Label>
                    <Input
                      className={inputClass}
                      value={userData.business_name}
                      onChange={(e) => setUserData({ ...userData, business_name: e.target.value })}
                      placeholder="e.g., TechStart Solutions"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass}>Industry *</Label>
                    <Select value={userData.industry} onValueChange={(v) => setUserData({ ...userData, industry: v })}>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {['Technology','E-commerce','Food & Beverage','Healthcare','Education','Real Estate','Consulting','Creative Services','Other'].map(v => (
                          <SelectItem key={v} value={v} className="text-slate-200 focus:bg-slate-700">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass}>Brief Description *</Label>
                    <Textarea
                      className={inputClass}
                      value={userData.description}
                      onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                      placeholder="What does your business do?"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelClass}>Target Audience</Label>
                      <Input
                        className={inputClass}
                        value={userData.target_audience}
                        onChange={(e) => setUserData({ ...userData, target_audience: e.target.value })}
                        placeholder="e.g., Small business owners"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelClass}>Location</Label>
                      <Input
                        className={inputClass}
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setStep(1)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent">
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
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
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSuggestions ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-2" />
                      <p className="text-slate-400">Analyzing your business needs...</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {aiSuggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-white">{suggestion.title}</p>
                            <p className="text-sm text-slate-400 mt-1">{suggestion.description}</p>
                            <Badge 
                              className={`mt-2 text-xs border ${suggestion.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
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
              <Card className={cardClass}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
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
                                ? 'bg-amber-500/10 border border-amber-500/20 ml-8'
                                : 'bg-slate-900/50 border border-slate-700 mr-8'
                            }`}
                          >
                            <p className="text-sm text-slate-300">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        className={inputClass}
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        placeholder="Ask anything about getting started..."
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={answeringQuestion}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
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
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20"
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