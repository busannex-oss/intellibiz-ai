import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, Send, Search, Filter, Bot, User, Phone, Mail,
  MoreVertical, Star, Clock, CheckCheck, Paperclip, Smile,
  Instagram, Facebook, Twitter
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const CHANNEL_ICONS = {
  website_chat: MessageSquare,
  whatsapp: Phone,
  facebook_messenger: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  email: Mail,
  sms: Phone,
  telegram: Send,
  slack: MessageSquare,
  phone: Phone
};

const CHANNEL_COLORS = {
  website_chat: 'bg-violet-100 text-violet-600',
  whatsapp: 'bg-emerald-100 text-emerald-600',
  facebook_messenger: 'bg-blue-100 text-blue-600',
  instagram: 'bg-pink-100 text-pink-600',
  twitter: 'bg-sky-100 text-sky-600',
  email: 'bg-amber-100 text-amber-600',
  sms: 'bg-cyan-100 text-cyan-600',
  telegram: 'bg-blue-100 text-blue-600',
  slack: 'bg-purple-100 text-purple-600',
  phone: 'bg-green-100 text-green-600'
};

// Mock conversations for demo
const MOCK_CONVERSATIONS = [
  {
    id: '1', channel: 'whatsapp', status: 'open', priority: 'high', unread_count: 3,
    contact: { name: 'Sarah Johnson', phone: '+1 555-123-4567', avatar_url: null },
    last_message: "Hi, I need help with my order #12345",
    last_message_at: new Date(Date.now() - 300000),
    sentiment: 'neutral',
    messages: [
      { id: '1', sender: 'customer', content: "Hi there!", timestamp: new Date(Date.now() - 600000) },
      { id: '2', sender: 'ai', content: "Hello! Welcome to our support. How can I help you today?", timestamp: new Date(Date.now() - 550000) },
      { id: '3', sender: 'customer', content: "Hi, I need help with my order #12345", timestamp: new Date(Date.now() - 300000) },
    ]
  },
  {
    id: '2', channel: 'instagram', status: 'open', priority: 'medium', unread_count: 1,
    contact: { name: 'Mike Chen', avatar_url: null },
    last_message: "Love your products! Quick question about shipping",
    last_message_at: new Date(Date.now() - 1800000),
    sentiment: 'positive',
    messages: [
      { id: '1', sender: 'customer', content: "Love your products! Quick question about shipping", timestamp: new Date(Date.now() - 1800000) },
    ]
  },
  {
    id: '3', channel: 'email', status: 'pending', priority: 'low', unread_count: 0,
    contact: { name: 'Emily Davis', email: 'emily@example.com' },
    last_message: "Thank you for your response. I'll review and get back.",
    last_message_at: new Date(Date.now() - 7200000),
    sentiment: 'positive',
    messages: [
      { id: '1', sender: 'customer', content: "I have a question about your return policy", timestamp: new Date(Date.now() - 10800000) },
      { id: '2', sender: 'agent', content: "Our return policy allows returns within 30 days...", timestamp: new Date(Date.now() - 9000000) },
      { id: '3', sender: 'customer', content: "Thank you for your response. I'll review and get back.", timestamp: new Date(Date.now() - 7200000) },
    ]
  },
  {
    id: '4', channel: 'facebook_messenger', status: 'open', priority: 'medium', unread_count: 2,
    contact: { name: 'Alex Thompson' },
    last_message: "Do you ship internationally?",
    last_message_at: new Date(Date.now() - 900000),
    sentiment: 'neutral',
    messages: [
      { id: '1', sender: 'customer', content: "Hey! Do you ship internationally?", timestamp: new Date(Date.now() - 900000) },
    ]
  },
  {
    id: '5', channel: 'website_chat', status: 'resolved', priority: 'low', unread_count: 0,
    contact: { name: 'Guest Visitor' },
    last_message: "Thanks for your help!",
    last_message_at: new Date(Date.now() - 14400000),
    sentiment: 'positive',
    messages: []
  }
];

export default function UnifiedInbox({ projectId, config }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const updated = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: Date.now().toString(),
            sender: 'agent',
            content: newMessage,
            timestamp: new Date()
          }],
          last_message: newMessage,
          last_message_at: new Date()
        };
      }
      return conv;
    });
    setConversations(updated);
    setSelectedConversation(updated.find(c => c.id === selectedConversation.id));
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv => {
    if (filterChannel !== 'all' && conv.channel !== filterChannel) return false;
    if (searchQuery && !conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const ChannelIcon = selectedConversation ? CHANNEL_ICONS[selectedConversation.channel] : MessageSquare;

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
      {/* Conversation List */}
      <Card className="border-0 shadow-lg lg:col-span-1 flex flex-col">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-lg">All Conversations</CardTitle>
            <Badge variant="secondary">{conversations.filter(c => c.unread_count > 0).length} unread</Badge>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterChannel('all')}>All Channels</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterChannel('whatsapp')}>WhatsApp</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterChannel('instagram')}>Instagram</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterChannel('facebook_messenger')}>Messenger</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterChannel('email')}>Email</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterChannel('website_chat')}>Website</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const Icon = CHANNEL_ICONS[conv.channel];
                return (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id
                        ? 'bg-violet-50 border border-violet-200'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{conv.contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${CHANNEL_COLORS[conv.channel]}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-800 truncate">{conv.contact.name}</p>
                          <span className="text-xs text-slate-500">
                            {format(conv.last_message_at, 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{conv.last_message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {conv.priority === 'high' && <Badge className="bg-red-100 text-red-700 text-xs py-0">High</Badge>}
                          {conv.status === 'pending' && <Badge variant="outline" className="text-xs py-0">Pending</Badge>}
                        </div>
                      </div>
                      {conv.unread_count > 0 && (
                        <Badge className="bg-violet-600 text-white">{conv.unread_count}</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card className="border-0 shadow-lg lg:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{selectedConversation.contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${CHANNEL_COLORS[selectedConversation.channel]}`}>
                      <ChannelIcon className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConversation.contact.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{selectedConversation.channel.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    Tag
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-1" />
                    Assign
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      <DropdownMenuItem>View Contact</DropdownMenuItem>
                      <DropdownMenuItem>Add Note</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender !== 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%]`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.sender === 'customer'
                              ? 'bg-slate-100 text-slate-800 rounded-bl-md'
                              : msg.sender === 'ai'
                              ? 'bg-violet-100 text-violet-800 rounded-br-md'
                              : 'bg-violet-600 text-white rounded-br-md'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-slate-400 ${msg.sender !== 'customer' ? 'justify-end' : ''}`}>
                          {msg.sender === 'ai' && <Badge variant="secondary" className="text-xs py-0 mr-1"><Bot className="w-3 h-3 mr-1" />AI</Badge>}
                          {format(new Date(msg.timestamp), 'h:mm a')}
                          {msg.sender !== 'customer' && <CheckCheck className="w-3 h-3 text-blue-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Smile className="w-4 h-4" /></Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="ghost" size="sm" className="text-xs"><Bot className="w-3 h-3 mr-1" />AI Suggest</Button>
                <Button variant="ghost" size="sm" className="text-xs">📝 Canned Response</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose from your unified inbox to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}