import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  ThumbsUp,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const CALL_DATA = [
  { day: 'Mon', inbound: 45, outbound: 23, missed: 5 },
  { day: 'Tue', inbound: 52, outbound: 31, missed: 3 },
  { day: 'Wed', inbound: 48, outbound: 27, missed: 4 },
  { day: 'Thu', inbound: 61, outbound: 35, missed: 2 },
  { day: 'Fri', inbound: 55, outbound: 29, missed: 6 },
  { day: 'Sat', inbound: 20, outbound: 8, missed: 2 },
  { day: 'Sun', inbound: 12, outbound: 5, missed: 1 },
];

const HOURLY_DATA = [
  { hour: '8am', calls: 12 },
  { hour: '9am', calls: 28 },
  { hour: '10am', calls: 35 },
  { hour: '11am', calls: 42 },
  { hour: '12pm', calls: 25 },
  { hour: '1pm', calls: 30 },
  { hour: '2pm', calls: 45 },
  { hour: '3pm', calls: 52 },
  { hour: '4pm', calls: 38 },
  { hour: '5pm', calls: 22 },
];

const SENTIMENT_DATA = [
  { name: 'Positive', value: 65, color: '#10b981' },
  { name: 'Neutral', value: 28, color: '#6b7280' },
  { name: 'Negative', value: 7, color: '#ef4444' },
];

const DEPARTMENT_DATA = [
  { department: 'Sales', calls: 145, avgDuration: '4:32', satisfaction: 92 },
  { department: 'Support', calls: 203, avgDuration: '6:15', satisfaction: 88 },
  { department: 'Billing', calls: 67, avgDuration: '3:48', satisfaction: 85 },
  { department: 'General', calls: 89, avgDuration: '2:15', satisfaction: 94 },
];

export default function Analytics({ phoneSystem, projectId }) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Calls</p>
                <p className="text-3xl font-bold text-slate-800">1,247</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12% vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Answer Rate</p>
                <p className="text-3xl font-bold text-slate-800">94.2%</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+2.5% improvement</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <PhoneIncoming className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Duration</p>
                <p className="text-3xl font-bold text-slate-800">4:23</p>
                <div className="flex items-center gap-1 mt-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">minutes</span>
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
                <p className="text-sm text-slate-500">SMS Sent</p>
                <p className="text-3xl font-bold text-slate-800">856</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+8% vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Call Volume by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CALL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="inbound" fill="#8b5cf6" name="Inbound" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" fill="#06b6d4" name="Outbound" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" fill="#f43f5e" name="Missed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Peak Call Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={HOURLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment & Department Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-violet-600" />
              Call Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={SENTIMENT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SENTIMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {SENTIMENT_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEPARTMENT_DATA.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-800">{dept.department}</p>
                    <p className="text-sm text-slate-500">{dept.calls} calls this week</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Avg Duration</p>
                      <p className="font-medium">{dept.avgDuration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Satisfaction</p>
                      <Badge className={dept.satisfaction >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {dept.satisfaction}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            AI Receptionist Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-violet-50 rounded-xl">
              <p className="text-3xl font-bold text-violet-700">312</p>
              <p className="text-sm text-slate-600">Calls Handled by AI</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-3xl font-bold text-emerald-700">89%</p>
              <p className="text-sm text-slate-600">Successfully Routed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-700">156</p>
              <p className="text-sm text-slate-600">Appointments Booked</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <p className="text-3xl font-bold text-amber-700">2.1s</p>
              <p className="text-sm text-slate-600">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}