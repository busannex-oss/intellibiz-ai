import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Send, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SharedWorkspace() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadAgents();
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const loadAgents = async () => {
    try {
      const data = await base44.entities.AIAgent.list();
      setAgents(data.filter(a => a.is_active));
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await base44.entities.AgentConversation.list('-created_date');
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const createNewConversation = async () => {
    if (!problemTitle || selectedAgents.length < 2 || !problemDescription) {
      alert('Please fill all fields and select at least 2 agents');
      return;
    }

    setIsLoading(true);
    try {
      const newConversation = await base44.entities.AgentConversation.create({
        workspace_id: `workspace_${Date.now()}`,
        title: problemTitle,
        business_problem: problemDescription,
        participating_agents: selectedAgents,
        status: 'active',
        messages: []
      });

      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
      setProblemTitle('');
      setProblemDescription('');
      setSelectedAgents([]);
      setShowNewForm(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to create conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const runAgentCollaboration = async () => {
    if (!activeConversation) return;

    setIsRunning(true);
    try {
      await base44.functions.invoke('collaborateAgents', {
        conversation_id: activeConversation.id,
        problem: activeConversation.business_problem,
        agents: selectedAgents
      });

      // Reload conversation to get updated messages
      const updated = await base44.entities.AgentConversation.get(activeConversation.id);
      setActiveConversation(updated);

      // Update in list
      setConversations(conversations.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Error running collaboration:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const updateConversationStatus = async (status) => {
    if (!activeConversation) return;

    try {
      const updated = await base44.entities.AgentConversation.update(activeConversation.id, {
        status
      });

      setActiveConversation(updated);
      setConversations(conversations.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Agent Collaboration Workspace</h1>
          <p className="text-slate-600">Watch multiple humanized agents solve complex business problems together</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setShowNewForm(!showNewForm)}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  New Collaboration
                </Button>

                {showNewForm && (
                  <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                    <Input
                      placeholder="Problem title"
                      value={problemTitle}
                      onChange={(e) => setProblemTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Describe the business problem..."
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      className="h-20"
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Agents</label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {agents.map(agent => (
                          <label key={agent.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedAgents.includes(agent.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAgents([...selectedAgents, agent.id]);
                                } else {
                                  setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{agent.first_name} {agent.last_name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={createNewConversation}
                      disabled={isLoading}
                      className="w-full bg-slate-800 hover:bg-slate-900"
                    >
                      {isLoading ? 'Creating...' : 'Start Collaboration'}
                    </Button>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        activeConversation?.id === conv.id
                          ? 'bg-violet-50 border-violet-200'
                          : 'hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{conv.title}</p>
                      <p className="text-xs text-slate-500">{conv.participating_agents.length} agents</p>
                      <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                        conv.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        conv.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {conv.status}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Conversation */}
          <div className="lg:col-span-2">
            {activeConversation ? (
              <div className="space-y-4">
                {/* Conversation Header */}
                <Card>
                  <CardHeader>
                    <CardTitle>{activeConversation.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-2"><strong>Problem:</strong> {activeConversation.business_problem}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {agents
                        .filter(a => activeConversation.participating_agents.includes(a.id))
                        .map(a => (
                          <span key={a.id} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                            {a.first_name} {a.last_name}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={runAgentCollaboration}
                        disabled={isRunning}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        {isRunning ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Collaborating...
                          </>
                        ) : (
                          'Run Collaboration'
                        )}
                      </Button>
                      <Button
                        onClick={() => updateConversationStatus(activeConversation.status === 'active' ? 'resolved' : 'active')}
                        variant="outline"
                      >
                        Mark as {activeConversation.status === 'active' ? 'Resolved' : 'Active'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages / Collaboration Thread */}
                <Card className="h-96 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">Collaboration Thread</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-3 pb-4">
                    {activeConversation.messages && activeConversation.messages.length > 0 ? (
                      <>
                        {activeConversation.messages.map((msg, idx) => {
                          const agent = agents.find(a => a.id === msg.agent_id);
                          return (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border-l-4 border-violet-500">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{msg.agent_name}</span>
                                <span className="text-xs text-slate-500">{agent?.job_title}</span>
                              </div>
                              <p className="text-sm text-slate-700 mb-2">{msg.content}</p>
                              {msg.thinking_process && (
                                <details className="cursor-pointer">
                                  <summary className="text-xs text-slate-500 hover:text-slate-600">View thinking process</summary>
                                  <p className="text-xs text-slate-600 mt-1 italic">{msg.thinking_process}</p>
                                </details>
                              )}
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        <p>No messages yet. Run collaboration to start.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Consensus / Outcome */}
                {(activeConversation.consensus || activeConversation.outcome) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Collaboration Outcome</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {activeConversation.consensus && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Consensus</p>
                          <p className="text-sm text-slate-600">{activeConversation.consensus}</p>
                        </div>
                      )}
                      {activeConversation.outcome && (
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Final Outcome</p>
                          <p className="text-sm text-slate-600">{activeConversation.outcome}</p>
                        </div>
                      )}
                      {activeConversation.effectiveness_score && (
                        <div className="flex items-center gap-2 pt-3 border-t">
                          <span className="text-sm font-medium">Effectiveness Score:</span>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${activeConversation.effectiveness_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{activeConversation.effectiveness_score}%</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <p className="text-slate-500">Select or create a conversation to begin</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}