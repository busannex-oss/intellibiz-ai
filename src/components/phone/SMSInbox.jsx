import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Search,
  Plus,
  Bot,
  User,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock conversations
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    contact: { name: 'John Smith', number: '+1 (555) 123-4567' },
    lastMessage: 'Thanks for the quick response!',
    timestamp: new Date(Date.now() - 300000),
    unread: 2,
    messages: [
      { id: 1, direction: 'inbound', body: 'Hi, I have a question about my order', timestamp: new Date(Date.now() - 3600000), status: 'received' },
      { id: 2, direction: 'outbound', body: 'Hello! I\'d be happy to help. What\'s your order number?', timestamp: new Date(Date.now() - 3500000), status: 'delivered', ai_generated: true },
      { id: 3, direction: 'inbound', body: 'It\'s #12345', timestamp: new Date(Date.now() - 3400000), status: 'received' },
      { id: 4, direction: 'outbound', body: 'I found your order. It shipped yesterday and should arrive by Friday. Tracking: 1Z999AA10123456784', timestamp: new Date(Date.now() - 3300000), status: 'delivered' },
      { id: 5, direction: 'inbound', body: 'Thanks for the quick response!', timestamp: new Date(Date.now() - 300000), status: 'received' },
    ]
  },
  {
    id: '2',
    contact: { name: 'Sarah Johnson', number: '+1 (555) 987-6543' },
    lastMessage: 'What are your business hours?',
    timestamp: new Date(Date.now() - 1800000),
    unread: 1,
    messages: [
      { id: 1, direction: 'inbound', body: 'What are your business hours?', timestamp: new Date(Date.now() - 1800000), status: 'received' },
    ]
  },
  {
    id: '3',
    contact: { name: 'Mike Wilson', number: '+1 (555) 456-7890' },
    lastMessage: 'Your appointment is confirmed for tomorrow at 2pm',
    timestamp: new Date(Date.now() - 7200000),
    unread: 0,
    messages: [
      { id: 1, direction: 'inbound', body: 'Can I schedule an appointment?', timestamp: new Date(Date.now() - 10800000), status: 'received' },
      { id: 2, direction: 'outbound', body: 'Of course! When would work best for you?', timestamp: new Date(Date.now() - 10700000), status: 'delivered', ai_generated: true },
      { id: 3, direction: 'inbound', body: 'Tomorrow afternoon if possible', timestamp: new Date(Date.now() - 10600000), status: 'received' },
      { id: 4, direction: 'outbound', body: 'Your appointment is confirmed for tomorrow at 2pm', timestamp: new Date(Date.now() - 7200000), status: 'delivered' },
    ]
  }
];

export default function SMSInbox({ phoneSystem, projectId }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: Date.now(),
            direction: 'outbound',
            body: newMessage,
            timestamp: new Date(),
            status: 'sent'
          }],
          lastMessage: newMessage,
          timestamp: new Date()
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
    setNewMessage('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
      {/* Conversation List */}
      <Card className="border-0 shadow-lg lg:col-span-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
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
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{conv.contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800 truncate">{conv.contact.name}</p>
                        <span className="text-xs text-slate-500">
                          {format(conv.timestamp, 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-violet-600 text-white">{conv.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card className="border-0 shadow-lg lg:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedConversation.contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedConversation.contact.name}</p>
                    <p className="text-sm text-slate-500">{selectedConversation.contact.number}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.direction === 'outbound' ? 'order-2' : ''}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.direction === 'outbound'
                              ? 'bg-violet-600 text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          <p>{msg.body}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${msg.direction === 'outbound' ? 'justify-end' : ''}`}>
                          {msg.ai_generated && (
                            <Badge variant="secondary" className="text-xs py-0">
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          <span className="text-xs text-slate-400">
                            {format(msg.timestamp, 'h:mm a')}
                          </span>
                          {msg.direction === 'outbound' && (
                            msg.status === 'delivered' ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}