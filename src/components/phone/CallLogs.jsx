import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Voicemail,
  Play,
  Download,
  Search,
  Filter,
  Clock,
  MessageSquare,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock call log data
const MOCK_CALLS = [
  {
    id: 1,
    direction: 'inbound',
    from_number: '+1 (555) 123-4567',
    to_number: '+1 (800) 555-0199',
    status: 'completed',
    duration: 245,
    timestamp: new Date(Date.now() - 3600000),
    caller_info: { name: 'John Smith', company: 'Acme Corp' },
    handled_by: 'Sarah (Ext 102)',
    transcription: "Hi, I'm calling about my order #12345. I placed it last week and haven't received a shipping confirmation yet. Can you help me track it?",
    ai_summary: "Customer inquired about order #12345 shipping status. Provided tracking number and estimated delivery date of Friday.",
    sentiment: 'neutral',
    recording_url: '#'
  },
  {
    id: 2,
    direction: 'outbound',
    from_number: '+1 (800) 555-0199',
    to_number: '+1 (555) 987-6543',
    status: 'completed',
    duration: 180,
    timestamp: new Date(Date.now() - 7200000),
    caller_info: { name: 'Emily Davis' },
    handled_by: 'Mike (Ext 103)',
    transcription: "Following up on your support ticket. We've resolved the issue with your account access.",
    ai_summary: "Outbound follow-up call regarding support ticket resolution. Customer confirmed issue is resolved.",
    sentiment: 'positive',
    recording_url: '#'
  },
  {
    id: 3,
    direction: 'inbound',
    from_number: '+1 (555) 456-7890',
    to_number: '+1 (800) 555-0199',
    status: 'missed',
    duration: 0,
    timestamp: new Date(Date.now() - 10800000),
    caller_info: { name: 'Unknown' },
    handled_by: null,
    sentiment: null
  },
  {
    id: 4,
    direction: 'inbound',
    from_number: '+1 (555) 321-0987',
    to_number: '+1 (800) 555-0199',
    status: 'voicemail',
    duration: 45,
    timestamp: new Date(Date.now() - 14400000),
    caller_info: { name: 'Robert Chen', company: 'Tech Solutions' },
    handled_by: 'Voicemail',
    transcription: "Hi, this is Robert Chen. I'd like to discuss a potential partnership. Please call me back at your earliest convenience.",
    ai_summary: "Partnership inquiry voicemail. Caller requested callback.",
    sentiment: 'positive',
    recording_url: '#'
  }
];

export default function CallLogs({ phoneSystem, projectId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusIcon = (call) => {
    if (call.status === 'missed') return <PhoneMissed className="w-5 h-5 text-red-500" />;
    if (call.status === 'voicemail') return <Voicemail className="w-5 h-5 text-amber-500" />;
    if (call.direction === 'inbound') return <PhoneIncoming className="w-5 h-5 text-emerald-500" />;
    return <PhoneOutgoing className="w-5 h-5 text-blue-500" />;
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
    if (sentiment === 'negative') return <ThumbsDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredCalls = MOCK_CALLS.filter(call => {
    if (filter === 'inbound') return call.direction === 'inbound' && call.status !== 'missed';
    if (filter === 'outbound') return call.direction === 'outbound';
    if (filter === 'missed') return call.status === 'missed';
    if (filter === 'voicemail') return call.status === 'voicemail';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search calls by number, name, or transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="inbound">Inbound</TabsTrigger>
                <TabsTrigger value="outbound">Outbound</TabsTrigger>
                <TabsTrigger value="missed">Missed</TabsTrigger>
                <TabsTrigger value="voicemail">Voicemail</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Call List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {getStatusIcon(call)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">
                        {call.caller_info?.name || call.from_number}
                      </p>
                      {call.caller_info?.company && (
                        <Badge variant="secondary" className="text-xs">
                          {call.caller_info.company}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {call.direction === 'inbound' ? call.from_number : call.to_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {call.sentiment && (
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(call.sentiment)}
                    </div>
                  )}
                  {call.transcription && (
                    <FileText className="w-4 h-4 text-violet-500" title="Has transcription" />
                  )}
                  {call.recording_url && (
                    <Play className="w-4 h-4 text-blue-500" title="Has recording" />
                  )}
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      {call.duration > 0 ? formatDuration(call.duration) : '--:--'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(call.timestamp, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call Detail Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCall && getStatusIcon(selectedCall)}
              Call Details
            </DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">From</p>
                  <p className="font-medium">{selectedCall.from_number}</p>
                  {selectedCall.caller_info?.name && (
                    <p className="text-sm text-slate-600">{selectedCall.caller_info.name}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">To</p>
                  <p className="font-medium">{selectedCall.to_number}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-medium">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Handled By</p>
                  <p className="font-medium">{selectedCall.handled_by || 'N/A'}</p>
                </div>
              </div>

              {/* Recording */}
              {selectedCall.recording_url && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-700">Recording</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-1" /> Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {selectedCall.ai_summary && (
                <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-violet-600">AI Summary</Badge>
                    {selectedCall.sentiment && (
                      <div className="flex items-center gap-1 text-sm">
                        {getSentimentIcon(selectedCall.sentiment)}
                        <span className="capitalize">{selectedCall.sentiment}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-700">{selectedCall.ai_summary}</p>
                </div>
              )}

              {/* Transcription */}
              {selectedCall.transcription && (
                <div>
                  <p className="font-medium text-slate-700 mb-2">Transcription</p>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-600 italic">"{selectedCall.transcription}"</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Back
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}