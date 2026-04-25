import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageSquare, Mail, Users, AlertCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActiveSessions, useAgents } from '@/hooks/useEntityCache';
import MetricCard from '@/components/common/MetricCard';
import SessionList from '@/components/common/SessionList';
import PageHeader from '@/components/common/PageHeader';
import { assignSessionToAgent, markSessionResolved, sendResponse } from '@/utils/commonPatterns';
import { useQueryClient } from '@tanstack/react-query';

export default function Switchboard() {
  const { data: sessions, isLoading: sessionsLoading } = useActiveSessions();
  const { data: agents } = useAgents();
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionType, setSessionType] = useState('calls');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleReply = async () => {
    if (!replyMessage || !selectedSession) return;
    setIsSending(true);
    try {
      await sendResponse(sessionType, {
        to: sessionType === 'sms' ? selectedSession.from_number : selectedSession.from_email,
        message: replyMessage,
        session_id: selectedSession.id
      });
      setReplyMessage('');
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAssign = async (sessionId, agentId) => {
    const entityName = sessionType === 'calls' ? 'CallSession' : sessionType === 'sms' ? 'SMSSession' : 'EmailSession';
    try {
      await assignSessionToAgent(sessionId, agentId, entityName);
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
    } catch (error) {
      console.error('Error assigning session:', error);
    }
  };

  const handleMarkResolved = async (sessionId) => {
    const entityName = sessionType === 'sms' ? 'SMSSession' : 'EmailSession';
    try {
      await markSessionResolved(sessionId, entityName);
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
    } catch (error) {
      console.error('Error marking resolved:', error);
    }
  };

  const calls = sessions?.calls || [];
  const sms = sessions?.sms || [];
  const email = sessions?.email || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="AI Switchboard & Receptionist"
          subtitle="Manage calls, SMS, and emails with AI agent assistance"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Active Calls" value={calls.length} icon={Phone} color="blue" />
          <MetricCard label="Pending SMS" value={sms.length} icon={MessageSquare} color="green" />
          <MetricCard label="Pending Emails" value={email.length} icon={Mail} color="purple" />
          <MetricCard label="Active Agents" value={agents?.length || 0} icon={Users} color="amber" />
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

                  <TabsContent value="calls" className="mt-4">
                    <SessionList
                      sessions={calls}
                      selectedId={selectedSession?.id}
                      onSelect={setSelectedSession}
                      renderItem={(call) => (
                        <>
                          <p className="font-medium text-sm">{call.caller_number}</p>
                          <p className="text-xs text-slate-500">{call.assigned_agent_name}</p>
                        </>
                      )}
                      emptyMessage="No active calls"
                    />
                  </TabsContent>

                  <TabsContent value="sms" className="mt-4">
                    <SessionList
                      sessions={sms}
                      selectedId={selectedSession?.id}
                      onSelect={setSelectedSession}
                      renderItem={(msg) => (
                        <>
                          <p className="font-medium text-sm">{msg.from_number}</p>
                          <p className="text-xs text-slate-600 truncate">{msg.body}</p>
                        </>
                      )}
                      emptyMessage="No pending SMS"
                    />
                  </TabsContent>

                  <TabsContent value="email" className="mt-4">
                    <SessionList
                      sessions={email}
                      selectedId={selectedSession?.id}
                      onSelect={setSelectedSession}
                      renderItem={(msg) => (
                        <>
                          <div className="flex gap-1 items-start">
                            {msg.priority === 'urgent' && <AlertCircle className="w-3 h-3 text-red-500 mt-0.5" />}
                            <p className="font-medium text-sm flex-1 truncate">{msg.subject}</p>
                          </div>
                          <p className="text-xs text-slate-600 truncate">{msg.from_email}</p>
                        </>
                      )}
                      emptyMessage="No pending emails"
                    />
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
                        onChange={(e) => handleAssign(selectedSession.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value={selectedSession.assigned_agent_id}>
                          {selectedSession.assigned_agent_name} (Current)
                        </option>
                        {agents?.map(agent => (
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
                          onClick={handleReply}
                          disabled={!replyMessage || isSending}
                          className="flex-1 bg-violet-600 hover:bg-violet-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                        <Button
                          onClick={() => handleMarkResolved(selectedSession.id)}
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