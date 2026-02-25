import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, Bot, User, Sparkles, 
  ArrowUp, X, Minimize2, Maximize2, Settings
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AIChatbot({ 
  project, 
  position = 'bottom-right',
  personality = 'friendly and professional',
  onEscalate 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        role: 'assistant',
        content: `Hi! 👋 I'm the AI assistant for ${project?.business_name}. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Build context from conversation history
    const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    try {
      // Get knowledge base articles
      const knowledgeBase = await base44.entities.KnowledgeBase.filter({
        project_id: project?.id
      });

      // Prepare knowledge context
      const kbContext = knowledgeBase.map(kb => 
        `[${kb.category}] ${kb.title}: ${kb.content.substring(0, 500)}`
      ).join('\n\n');

      // Get product/service info from business plan
      const productsInfo = project?.business_plan?.products_services || '';
      const businessInfo = project?.business_plan?.executive_summary || '';

      // Determine if escalation is needed
      const escalationCheck = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this customer message and determine if it requires human escalation:

Message: "${input}"

Previous conversation:
${conversationHistory}

Escalate if:
- Customer is frustrated or angry
- Issue is complex or technical
- Customer specifically requests human agent
- Involves billing, refunds, or legal matters
- Repeated failed attempts to resolve

Respond with JSON indicating if escalation is needed and why.`,
        response_json_schema: {
          type: "object",
          properties: {
            needs_escalation: { type: "boolean" },
            reason: { type: "string" },
            urgency: { type: "string" }
          }
        }
      });

      if (escalationCheck.needs_escalation && onEscalate) {
        const escalationMsg = {
          role: 'assistant',
          content: `I understand this requires special attention. Let me connect you with one of our team members who can better assist you. ${escalationCheck.reason}`,
          timestamp: new Date(),
          isEscalation: true
        };
        setMessages(prev => [...prev, escalationMsg]);
        setIsTyping(false);
        onEscalate({
          customer_message: input,
          conversation_history: messages,
          reason: escalationCheck.reason,
          urgency: escalationCheck.urgency
        });
        return;
      }

      // Generate AI response with knowledge base and personalization
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI customer support agent for ${project?.business_name}.

BUSINESS CONTEXT:
${businessInfo}

PRODUCTS/SERVICES:
${productsInfo}

KNOWLEDGE BASE:
${kbContext}

PERSONALITY: ${personality}
Be ${personality}, helpful, and empathetic.

CONVERSATION HISTORY:
${conversationHistory}

CURRENT CUSTOMER MESSAGE:
"${input}"

INSTRUCTIONS:
1. Answer based on knowledge base if available
2. Provide personalized recommendations based on their inquiry
3. Be conversational and match the personality trait
4. If you don't know something, be honest and offer to connect them with a human
5. Suggest relevant products/services when appropriate
6. Keep responses concise but helpful (max 150 words)
7. Use emojis sparingly but naturally

Provide a helpful, accurate response:`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            suggested_actions: {
              type: "array",
              items: { type: "string" }
            },
            recommended_products: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        suggestions: response.suggested_actions,
        recommendations: response.recommended_products,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationContext(prev => [...prev, { user: input, assistant: response.response }]);
      
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let me get you in touch with our support team.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
      
      if (onEscalate) {
        onEscalate({
          customer_message: input,
          error: error.message,
          urgency: 'high'
        });
      }
    }

    setIsTyping(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed ${positionClasses[position]} z-50`}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <MessageSquare className="w-7 h-7" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`fixed ${positionClasses[position]} z-50`}
    >
      <Card className={`shadow-2xl border-slate-700 bg-slate-800 ${isMinimized ? 'w-80' : 'w-96 h-[600px]'} flex flex-col`}>
        <CardHeader className="border-b border-slate-700 bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                        <div className={`rounded-2xl p-3 ${
                          msg.role === 'user' 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-slate-700 text-slate-100'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.suggestions?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.suggestions.map((suggestion, j) => (
                              <button
                                key={j}
                                onClick={() => setInput(suggestion)}
                                className="block w-full text-left px-3 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        {msg.recommendations?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-slate-400 mb-1">Recommended for you:</p>
                            {msg.recommendations.map((rec, j) => (
                              <Badge key={j} variant="outline" className="mr-1 text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                                {rec}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-700 rounded-2xl p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <CardContent className="p-4 border-t border-slate-700 flex-shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Powered by AI • May escalate to human agent
              </p>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  );
}