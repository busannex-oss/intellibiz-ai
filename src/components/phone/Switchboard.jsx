import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneForwarded,
  Mic, 
  MicOff, 
  Pause, 
  Play,
  Volume2,
  VolumeX,
  Users,
  Clock,
  ArrowRight,
  MoreVertical,
  MessageSquare,
  Voicemail,
  PhoneIncoming,
  PhoneOutgoing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demo
const MOCK_ACTIVE_CALLS = [
  { id: 1, number: '+1 (555) 123-4567', name: 'John Smith', duration: '2:34', status: 'active', direction: 'inbound' },
  { id: 2, number: '+1 (555) 987-6543', name: 'Sarah Johnson', duration: '0:45', status: 'hold', direction: 'inbound' },
];

const MOCK_QUEUE = [
  { id: 3, number: '+1 (555) 456-7890', name: 'Unknown', waitTime: '1:20', position: 1 },
  { id: 4, number: '+1 (555) 321-0987', name: 'Mike Wilson', waitTime: '0:35', position: 2 },
];

const MOCK_EXTENSIONS = [
  { ext: '101', name: 'Reception', status: 'available' },
  { ext: '102', name: 'Sales', status: 'busy' },
  { ext: '103', name: 'Support', status: 'available' },
  { ext: '104', name: 'Billing', status: 'away' },
  { ext: '105', name: 'Manager', status: 'dnd' },
];

export default function Switchboard({ phoneSystem, projectId }) {
  const [activeCalls, setActiveCalls] = useState(MOCK_ACTIVE_CALLS);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [dialNumber, setDialNumber] = useState('');
  const [selectedCall, setSelectedCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-amber-500';
      case 'dnd': return 'bg-red-600';
      default: return 'bg-slate-400';
    }
  };

  const handleDial = () => {
    if (!dialNumber) return;
    // Would initiate call via API
    console.log('Dialing:', dialNumber);
    setDialNumber('');
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Main Call Panel */}
      <div className="lg:col-span-3 space-y-6">
        {/* Dialer */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter phone number to dial..."
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                className="flex-1 h-12 text-lg"
              />
              <Button 
                onClick={handleDial}
                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Calls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              Active Calls ({activeCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {activeCalls.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Phone className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No active calls</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedCall === call.id 
                          ? 'border-violet-500 bg-violet-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedCall(call.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            call.status === 'active' ? 'bg-emerald-100' : 'bg-amber-100'
                          }`}>
                            {call.direction === 'inbound' ? (
                              <PhoneIncoming className={`w-6 h-6 ${call.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`} />
                            ) : (
                              <PhoneOutgoing className={`w-6 h-6 ${call.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{call.name}</p>
                            <p className="text-sm text-slate-500">{call.number}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge className={call.status === 'hold' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
                              {call.status === 'hold' ? 'On Hold' : 'Active'}
                            </Badge>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {call.duration}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant={call.status === 'hold' ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle hold
                              }}
                            >
                              {call.status === 'hold' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                              }}
                            >
                              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <PhoneForwarded className="w-4 h-4 mr-2" />
                                  Transfer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="w-4 h-4 mr-2" />
                                  Add to Conference
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Send SMS
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Voicemail className="w-4 h-4 mr-2" />
                                  Send to Voicemail
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalls(activeCalls.filter(c => c.id !== call.id));
                              }}
                            >
                              <PhoneOff className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Call Queue */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Call Queue ({queue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No calls in queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((caller) => (
                  <div key={caller.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                        {caller.position}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{caller.name}</p>
                        <p className="text-sm text-slate-500">{caller.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">Waiting: {caller.waitTime}</span>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Phone className="w-4 h-4 mr-1" />
                        Answer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Extensions Panel */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Extensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_EXTENSIONS.map((ext) => (
              <div key={ext.ext} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{ext.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-slate-800">{ext.name}</p>
                    <p className="text-xs text-slate-500">Ext. {ext.ext}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(ext.status)}`} title={ext.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Today's Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Calls</span>
              <span className="font-bold">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Answered</span>
              <span className="font-bold text-emerald-600">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Missed</span>
              <span className="font-bold text-red-600">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Duration</span>
              <span className="font-bold">3:24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Wait Time</span>
              <span className="font-bold">0:45</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}