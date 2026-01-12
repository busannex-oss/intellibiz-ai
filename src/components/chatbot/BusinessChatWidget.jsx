import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function BusinessChatWidget({ project, position = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const brandColor = project?.brand_colors?.primary || '#7c3aed';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! 👋 Welcome to ${project?.business_name || 'our business'}. I'm your AI assistant. How can I help you today?`
      }]);
    }
  }, [isOpen, project?.business_name]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    const context = `
Business Name: ${project?.business_name}
Industry: ${project?.industry}
Description: ${project?.description}
Target Audience: ${project?.target_audience}
Location: ${project?.location}
Unique Value Proposition: ${project?.unique_value_proposition || 'Not specified'}
`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful AI assistant for ${project?.business_name}, a ${project?.industry} business.

Business Context:
${context}

User Question: ${userMessage}

Provide a helpful, friendly, and professional response. Keep it concise but informative. If you don't know something specific about the business, provide general helpful information or suggest they contact the business directly.`,
      add_context_from_internet: false
    });

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className={`w-80 md:w-96 shadow-2xl overflow-hidden ${isMinimized ? 'h-14' : 'h-[500px]'} transition-all duration-300`}>
              {/* Header */}
              <div 
                className="flex items-center justify-between px-4 py-3 text-white cursor-pointer"
                style={{ backgroundColor: brandColor }}
                onClick={() => isMinimized && setIsMinimized(false)}
              >
                <div className="flex items-center gap-3">
                  {project?.logo_url ? (
                    <img src={project.logo_url} alt="" className="w-8 h-8 rounded-full bg-white p-0.5" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{project?.business_name || 'AI Assistant'}</p>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 h-[380px] p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                msg.role === 'user'
                                  ? 'text-white rounded-br-md'
                                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
                              }`}
                              style={msg.role === 'user' ? { backgroundColor: brandColor } : {}}
                            >
                              {msg.role === 'user' ? (
                                <p className="text-sm">{msg.content}</p>
                              ) : (
                                <div className="text-sm prose prose-sm max-w-none">
                                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-3 border-t bg-white">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!input.trim() || isTyping}
                        style={{ backgroundColor: brandColor }}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ backgroundColor: brandColor }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}