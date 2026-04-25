import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageSquare, Mail, Users, Clock, AlertCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Switchboard() {
  const [activeCalls, setActiveCalls] = useState([]);
  const [smsSessions, setSMSSessions] = useState([]);
  const [emailSessions, setEmailSessions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionType, setSessionType] = useState('calls');
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [callsData, smsData, emailData, agentsData] = await Promise.all([
        base44.entities.CallSession.filter({ status: { $in: ['ringing', 'active'] } }, '-created_date'),
        base44.entities.SMSSession.filter({ requires_response: true }, '-created_date'),
        base44.entities.EmailSession.filter({ requires_response: true }, '-created_date')
      ]);

      setActiveCalls(callsData);
      setSMSSessions(smsData);
      setEmailSessions(emailData);

      const agents = await base44.entities.AIAgent.filter({ is_active: true });
      setAgents(agents);
    } catch (error) {
      console.error('Error loading switchboard data:', error);
    }
  };

  const assignToAgent = async (sessionId, agentId, type) => {
    try {
      const entityName = type === 'calls' ? 'CallSession' : type === 'sms' ? 'SMSSession' : 'EmailSession';
      const agent = agents.find(a => a.id === agentId);

      await base44.entities[entityName].update(sessionId, {
        assigned_agent_id: agentId,
        assigned_agent_name: `${agent.first_name} ${agent.last_name}`
      });

      loadData();
    } catch (error) {
      console.error('Error assigning session:', error);
    }
  };

  const sendReply = async () => {
    if (!replyMessage || !selectedSession) return;

    setIsLoading(true);
    try {
      if (sessionType === 'sms') {
        await base44.functions.invoke('sendSMSReply', {
          to: selectedSession.from_number,
          message: replyMessage,
          session_id: selectedSession.id
        });
      } else if (sessionType === 'email') {
        await base44.functions.invoke('sendEmailReply', {
          to: selectedSession.from_email,
          subject: `RE: ${selectedSession.subject}`,
          body: replyMessage,
          thread_id: selectedSession.thread_id
        });
      }

      setReplyMessage('');
      loadData();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markResolved = async (sessionId, type) => {
    try {
      const entityName = type === 'sms' ? 'SMSSession' : 'EmailSession';
      await base44.entities[entityName].update(sessionId, {
        requires_response: false,
        status: type === 'sms' ? 'delivered' : 'archived'
      });
      loadData();
    } catch (error) {
      console.error('Error marking resolved:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Switchboard & Receptionist</h1>
          <p className="text-slate-600">Manage calls, SMS, and emails with AI agent assistance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-600">Active Calls</p>
                  <p className="text-2xl font-bold">{activeCalls.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600">Pending SMS</p>
                  <p className="text-2xl font-bold">{smsSessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-slate-600">Pending Emails</p>
                  <p className="text-2xl font-bold">{emailSessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-sm text-slate-600">Active Agents</p>
                  <p className="text-2xl font-bold">{agents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={sessionType} onValueChange={setSessionType} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="calls">Calls</TabsTrigger>
                    <TabsTrigger value="sms">SMS</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                  </TabsList>

                  <TabsContent value="calls" className="space-y-2 mt-4">
                    {activeCalls.map(call => (
                      <button
                        key={call.id}
                        onClick={() => {
                          setSelectedSession(call);
                          setSessionType('calls');
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedSession?.id === call.id
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <p className="font-medium text-sm">{call.caller_number}</p>
                        <p className="text-xs text-slate-500">{call.assigned_agent_name}</p>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          call.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {call.status}
                        </span>
                      </button>
                    ))}
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-2 mt-4">
                    {smsSessions.map(sms => (
                      <button
                        key={sms.id}
                        onClick={() => {
                          setSelectedSession(sms);
                          setSessionType('sms');
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedSession?.id === sms.id
                            ? 'bg-green-50 border-green-300'
                            : 'hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <p className="font-medium text-sm">{sms.from_number}</p>
                        <p className="text-xs text-slate-600 truncate">{sms.body}</p>
                        <p className="text-xs text-slate-500 mt-1">{sms.assigned_agent_name}</p>
                      </button>
                    ))}
                  </TabsContent>

                  <TabsContent value="email" className="space-y-2 mt-4">
                    {emailSessions.map(email => (
                      <button
                        key={email.id}
                        onClick={() => {
                          setSelectedSession(email);
                          setSessionType('email');
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedSession?.id === email.id
                            ? 'bg-purple-50 border-purple-300'
                            : 'hover:bg-slate-100 border-slate-200'
                        } ${email.sentiment === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}
                      >
                        <p className="font-medium text-sm truncate">{email.subject}</p>
                        <p className="text-xs text-slate-600 truncate">{email.from_email}</p>
                        <div className="flex gap-1 mt-1">
                          {email.priority === 'urgent' && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          )}
                          <p className="text-xs text-slate-500">{email.assigned_agent_name}</p>
                        </div>
                      </button>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="space-y-4">
                {/* Session Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {sessionType === 'calls' ? '📞 Call Details' : sessionType === 'sms' ? '💬 SMS Details' : '📧 Email Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sessionType === 'calls' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Caller</p>
                          <p className="text-sm">{selectedSession.caller_number}</p>
                        </div>
                        {selectedSession.call_transcript && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">Transcript</p>
                            <div className="bg-slate-50 p-3 rounded text-sm space-y-1 max-h-40 overflow-y-auto">
                              {selectedSession.call_transcript.map((line, idx) => (
                                <p key={idx}><strong>{line.speaker}:</strong> {line.message}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {sessionType === 'sms' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-slate-700">From</p>
                          <p className="text-sm">{selectedSession.from_number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Message</p>
                          <p className="text-sm bg-slate-50 p-3 rounded">{selectedSession.body}</p>
                        </div>
                      </>
                    )}

                    {sessionType === 'email' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-slate-700">From</p>
                          <p className="text-sm">{selectedSession.from_email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Subject</p>
                          <p className="text-sm">{selectedSession.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Message</p>
                          <p className="text-sm bg-slate-50 p-3 rounded max-h-40 overflow-y-auto">{selectedSession.body}</p>
                        </div>
                        {selectedSession.ai_summary && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs font-medium text-blue-900">AI Summary</p>
                            <p className="text-sm text-blue-800">{selectedSession.ai_summary}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Agent Assignment */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Assign to Agent</p>
                      <select
                        onChange={(e) => assignToAgent(selectedSession.id, e.target.value, sessionType)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value={selectedSession.assigned_agent_id}>
                          {selectedSession.assigned_agent_name} (Current)
                        </option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name} ({agent.job_title})
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Reply Section */}
                {(sessionType === 'sms' || sessionType === 'email') && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Send Response</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <textarea
                        placeholder={sessionType === 'email' ? 'Type email response...' : 'Type SMS response...'}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm h-24 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={sendReply}
                          disabled={!replyMessage || isLoading}
                          className="flex-1 bg-violet-600 hover:bg-violet-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                        <Button
                          onClick={() => markResolved(selectedSession.id, sessionType)}
                          variant="outline"
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <p className="text-slate-500">Select a session to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}