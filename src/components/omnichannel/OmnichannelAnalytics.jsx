import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, TrendingUp, Clock, Users, ThumbsUp, Zap,
  Phone, Mail, Instagram, Facebook, Twitter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const CHANNEL_DATA = [
  { channel: 'WhatsApp', conversations: 456, color: '#25D366' },
  { channel: 'Instagram', conversations: 312, color: '#E4405F' },
  { channel: 'Messenger', conversations: 245, color: '#0084FF' },
  { channel: 'Email', conversations: 189, color: '#F59E0B' },
  { channel: 'Website', conversations: 167, color: '#8B5CF6' },
  { channel: 'Twitter', conversations: 89, color: '#1DA1F2' },
];

const RESPONSE_TIME = [
  { hour: '8am', time: 2.5 },
  { hour: '10am', time: 1.8 },
  { hour: '12pm', time: 3.2 },
  { hour: '2pm', time: 2.1 },
  { hour: '4pm', time: 1.5 },
  { hour: '6pm', time: 2.8 },
];

const DAILY_VOLUME = [
  { day: 'Mon', conversations: 145 },
  { day: 'Tue', conversations: 178 },
  { day: 'Wed', conversations: 156 },
  { day: 'Thu', conversations: 189 },
  { day: 'Fri', conversations: 167 },
  { day: 'Sat', conversations: 98 },
  { day: 'Sun', conversations: 67 },
];

export default function OmnichannelAnalytics({ projectId }) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Conversations</p>
                <p className="text-3xl font-bold text-slate-800">1,458</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+18% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Response Time</p>
                <p className="text-3xl font-bold text-slate-800">2.3m</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">-15% improvement</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Resolution Rate</p>
                <p className="text-3xl font-bold text-slate-800">94%</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">AI Handled</p>
                <p className="text-3xl font-bold text-slate-800">67%</p>
                <div className="flex items-center gap-1 mt-1 text-violet-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">980 conversations</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Conversations by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CHANNEL_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="channel" type="category" stroke="#64748b" width={80} />
                <Tooltip />
                <Bar dataKey="conversations" radius={[0, 4, 4, 0]}>
                  {CHANNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Volume */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Conversation Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DAILY_VOLUME}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Response Time & Channel Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={RESPONSE_TIME}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value) => [`${value}m`, 'Avg Response']} />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'WhatsApp', icon: Phone, conversations: 456, responseTime: '1.8m', satisfaction: 96, color: 'text-emerald-600 bg-emerald-100' },
                { name: 'Instagram', icon: Instagram, conversations: 312, responseTime: '2.5m', satisfaction: 92, color: 'text-pink-600 bg-pink-100' },
                { name: 'Messenger', icon: Facebook, conversations: 245, responseTime: '2.1m', satisfaction: 94, color: 'text-blue-600 bg-blue-100' },
                { name: 'Email', icon: Mail, conversations: 189, responseTime: '15m', satisfaction: 88, color: 'text-amber-600 bg-amber-100' },
                { name: 'Website', icon: MessageSquare, conversations: 167, responseTime: '1.2m', satisfaction: 95, color: 'text-violet-600 bg-violet-100' },
                { name: 'Twitter', icon: Twitter, conversations: 89, responseTime: '3.5m', satisfaction: 90, color: 'text-sky-600 bg-sky-100' },
              ].map((ch) => (
                <div key={ch.name} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.color}`}>
                      <ch.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{ch.name}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Conversations</span>
                      <span className="font-medium">{ch.conversations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Response</span>
                      <span className="font-medium">{ch.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Satisfaction</span>
                      <Badge className={ch.satisfaction >= 95 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {ch.satisfaction}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}