import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import {
  MessageSquare, X, Send, Loader2, Sparkles, Bot, ChevronDown, Lightbulb
} from 'lucide-react';

const PROACTIVE_TIPS = {
  super_admin: [
    { id: 'sa1', text: 'As Super Admin, start by customizing the platform theme in Admin → Theme & Brand.' },
    { id: 'sa2', text: 'Invite your team members from Admin Dashboard → Users tab.' },
    { id: 'sa3', text: 'Run a brand audit to score your platform\'s market readiness.' },
  ],
  admin: [
    { id: 'a1', text: 'You can manage users and platform settings from the Admin Dashboard.' },
    { id: 'a2', text: 'Check the Brand Audit tab to ensure consistent branding across all projects.' },
    { id: 'a3', text: 'The Agent Docs page gives you a full reference for all AI agents.' },
  ],
  user: [
    { id: 'u1', text: 'Start by creating your first Business Project — the AI will guide you step by step.' },
    { id: 'u2', text: 'Your Business Assistant AI agent is always available to answer strategy questions.' },
    { id: 'u3', text: 'Complete the 4 steps in order: Research → Brand → Website → Growth.' },
  ],
};

const QUICK_QUESTIONS = {
  super_admin: [
    'How do I invite admins?',
    'How do I change the platform theme?',
    'What does the Security Sentinel do?',
  ],
  admin: [
    'How do I run a brand audit?',
    'What can I customize?',
    'How do agents work?',
  ],
  user: [
    'How do I get started?',
    'What is a Business Project?',
    'How long does setup take?',
  ],
};

export default function OnboardingAssistant({ userRole = 'user', userName = '', context = '' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(false);
  const messagesEndRef = useRef(null);

  const role = ['super_admin', 'admin', 'user'].includes(userRole) ? userRole : 'user';
  const tips = PROACTIVE_TIPS[role];
  const quickQs = QUICK_QUESTIONS[role];

  // Show proactive tip after 8 seconds if chat not opened
  useEffect(() => {
    if (tipDismissed || open) return;
    const timer = setTimeout(() => setShowTip(true), 8000);
    return () => clearTimeout(timer);
  }, [open, tipDismissed]);

  // Rotate tips
  useEffect(() => {
    if (!showTip || open) return;
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % tips.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [showTip, open, tips.length]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when opening
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = userName
        ? `Hi ${userName.split(' ')[0]}! 👋`
        : 'Hi there! 👋';
      const roleMsg = {
        super_admin: "I see you're a Super Admin. I can help you configure the platform, manage users, and get the most out of every AI agent.",
        admin: "I see you're an Admin. I can help you with platform management, brand audits, and team setup.",
        user: "Let's get your business set up! I'll guide you through creating your first project and using the AI tools.",
      }[role];
      setMessages([{ role: 'assistant', content: `${greeting} ${roleMsg}` }]);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const roleContext = {
        super_admin: 'Super Admin with full platform control, can manage users, themes, and all settings',
        admin: 'Admin user who can manage content, run audits, and configure platform features',
        user: 'Regular user building their first business project',
      }[role];

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the BrandForge onboarding assistant. Be concise, friendly, and action-focused.
User role: ${roleContext}
${context ? `Current context: ${context}` : ''}
${userName ? `User name: ${userName}` : ''}
Previous messages: ${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

User question: "${msg}"

Give a helpful, specific answer in 2-3 sentences max. Focus on what the user should do next.`,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble right now. Try navigating to the Dashboard to get started!" }]);
    } finally {
      setLoading(false);
    }
  };

  const roleBadgeColor = {
    super_admin: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
    user: 'bg-emerald-100 text-emerald-700',
  }[role];

  const roleLabel = { super_admin: 'Super Admin', admin: 'Admin', user: 'User' }[role];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {/* Proactive tip bubble */}
      <AnimatePresence>
        {showTip && !open && !tipDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="max-w-xs bg-white rounded-2xl shadow-xl border border-amber-200 p-4 mr-1"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 flex-1">{tips[tipIndex].text}</p>
              <button
                onClick={() => { setShowTip(false); setTipDismissed(true); }}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => { setOpen(true); setShowTip(false); }}
              className="mt-2 text-xs text-amber-600 font-medium hover:underline"
            >
              Ask me anything →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Setup Assistant</p>
                  <Badge className={`${roleBadgeColor} text-[10px] py-0`}>{roleLabel}</Badge>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 bg-white">
                {quickQs.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 rounded-full px-2.5 py-1 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                placeholder="Ask anything..."
                className="text-sm h-9"
                disabled={loading}
              />
              <Button
                size="sm"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-violet-600 hover:bg-violet-700 h-9 w-9 p-0 flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen(v => !v); setShowTip(false); }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 flex items-center justify-center text-white relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {showTip && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white" />
        )}
      </motion.button>
    </div>
  );
}