import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Play, Save, Trash2, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkflowDesigner() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [agents, setAgents] = useState([]);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);

  useEffect(() => {
    loadWorkflows();
    loadAgents();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await base44.entities.AgentWorkflow.list('-created_date');
      setWorkflows(data);
      if (data.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(data[0]);
        setNodes(data[0].nodes || []);
        setEdges(data[0].edges || []);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const data = await base44.entities.AIAgent.list();
      setAgents(data.filter(a => a.is_active));
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const createNewWorkflow = async () => {
    if (!newWorkflowName) {
      alert('Please enter a workflow name');
      return;
    }

    try {
      const workflow = await base44.entities.AgentWorkflow.create({
        name: newWorkflowName,
        description: newWorkflowDesc,
        nodes: [],
        edges: [],
        status: 'draft'
      });

      setWorkflows([workflow, ...workflows]);
      setSelectedWorkflow(workflow);
      setNodes([]);
      setEdges([]);
      setNewWorkflowName('');
      setNewWorkflowDesc('');
      setShowNewForm(false);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const addNode = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const newNode = {
      id: `node_${Date.now()}`,
      agent_id: agentId,
      agent_name: `${agent.first_name} ${agent.last_name}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      input_mapping: {},
      output_template: '',
      retry_on_failure: false,
      max_retries: 0
    };

    setNodes([...nodes, newNode]);
  };

  const removeNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.source_node_id !== nodeId && e.target_node_id !== nodeId));
  };

  const addEdge = (sourceNodeId, targetNodeId) => {
    if (sourceNodeId === targetNodeId) {
      alert('Cannot connect a node to itself');
      return;
    }

    const edgeExists = edges.some(e => e.source_node_id === sourceNodeId && e.target_node_id === targetNodeId);
    if (edgeExists) {
      alert('Connection already exists');
      return;
    }

    const newEdge = {
      id: `edge_${Date.now()}`,
      source_node_id: sourceNodeId,
      target_node_id: targetNodeId
    };

    setEdges([...edges, newEdge]);
  };

  const removeEdge = (edgeId) => {
    setEdges(edges.filter(e => e.id !== edgeId));
  };

  const saveWorkflow = async () => {
    if (!selectedWorkflow) return;

    try {
      const updated = await base44.entities.AgentWorkflow.update(selectedWorkflow.id, {
        nodes,
        edges,
        status: 'active'
      });

      setSelectedWorkflow(updated);
      setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
      alert('Workflow saved successfully');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    }
  };

  const executeWorkflow = async () => {
    if (!selectedWorkflow || nodes.length === 0) {
      alert('Please save the workflow first');
      return;
    }

    setIsExecuting(true);
    try {
      const result = await base44.functions.invoke('executeAgentWorkflow', {
        workflow_id: selectedWorkflow.id,
        initial_input: {}
      });

      setExecutionResults(result);
    } catch (error) {
      console.error('Error executing workflow:', error);
      alert('Workflow execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (!window.confirm('Delete this workflow?')) return;

    try {
      await base44.entities.AgentWorkflow.delete(workflowId);
      setWorkflows(workflows.filter(w => w.id !== workflowId));
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(workflows[0] || null);
        setNodes([]);
        setEdges([]);
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Agent Workflow Designer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workflows List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setShowNewForm(!showNewForm)}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Workflow
                </Button>

                {showNewForm && (
                  <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                    <Input
                      placeholder="Workflow name"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newWorkflowDesc}
                      onChange={(e) => setNewWorkflowDesc(e.target.value)}
                      className="h-16"
                    />
                    <Button
                      onClick={createNewWorkflow}
                      className="w-full bg-slate-800 hover:bg-slate-900"
                    >
                      Create
                    </Button>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  {workflows.map(workflow => (
                    <div
                      key={workflow.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedWorkflow?.id === workflow.id
                          ? 'bg-violet-50 border-violet-200'
                          : 'hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setNodes(workflow.nodes || []);
                          setEdges(workflow.edges || []);
                        }}
                        className="w-full text-left"
                      >
                        <p className="font-medium text-sm">{workflow.name}</p>
                        <p className="text-xs text-slate-500 truncate">{workflow.description}</p>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                          workflow.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {workflow.status}
                        </span>
                      </button>
                      <Button
                        onClick={() => deleteWorkflow(workflow.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 mt-2 w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Canvas */}
          <div className="lg:col-span-3">
            {selectedWorkflow ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={saveWorkflow}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </Button>
                  <Button
                    onClick={executeWorkflow}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Workflow
                      </>
                    )}
                  </Button>
                </div>

                {/* Nodes Canvas */}
                <Card className="min-h-96">
                  <CardHeader>
                    <CardTitle className="text-base">Workflow Canvas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-slate-100 rounded-lg p-4 h-80 overflow-auto border-2 border-dashed border-slate-300">
                      {nodes.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          <p>Add agents to start building your workflow</p>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* SVG for edges */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {edges.map(edge => {
                              const source = nodes.find(n => n.id === edge.source_node_id);
                              const target = nodes.find(n => n.id === edge.target_node_id);
                              if (!source || !target) return null;
                              return (
                                <line
                                  key={edge.id}
                                  x1={source.position.x + 60}
                                  y1={source.position.y + 30}
                                  x2={target.position.x + 60}
                                  y2={target.position.y}
                                  stroke="#8b5cf6"
                                  strokeWidth="2"
                                  markerEnd="url(#arrowhead)"
                                />
                              );
                            })}
                            <defs>
                              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
                              </marker>
                            </defs>
                          </svg>

                          {/* Nodes */}
                          {nodes.map(node => (
                            <div
                              key={node.id}
                              className="absolute bg-white border-2 border-violet-400 rounded-lg p-3 w-32 shadow-lg"
                              style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                            >
                              <p className="text-sm font-medium text-slate-900">{node.agent_name}</p>
                              <div className="mt-2 space-y-1 text-xs">
                                <Button
                                  onClick={() => removeNode(node.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 w-full"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Add Agents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Agents to Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {agents.map(agent => (
                        <Button
                          key={agent.id}
                          onClick={() => addNode(agent.id)}
                          variant="outline"
                          className="text-left justify-start h-auto py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{agent.first_name}</p>
                            <p className="text-xs text-slate-600">{agent.job_title}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Connect Nodes */}
                {nodes.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Connect Agents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium mb-2 block">From Agent</label>
                          <select id="source" className="w-full px-2 py-1 border rounded text-sm">
                            <option value="">Select source...</option>
                            {nodes.map(n => (
                              <option key={n.id} value={n.id}>{n.agent_name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">To Agent</label>
                          <select id="target" className="w-full px-2 py-1 border rounded text-sm">
                            <option value="">Select target...</option>
                            {nodes.map(n => (
                              <option key={n.id} value={n.id}>{n.agent_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const source = document.getElementById('source').value;
                          const target = document.getElementById('target').value;
                          if (source && target) {
                            addEdge(source, target);
                            document.getElementById('source').value = '';
                            document.getElementById('target').value = '';
                          }
                        }}
                        className="w-full bg-violet-600 hover:bg-violet-700"
                      >
                        Connect Agents
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Execution Results */}
                {executionResults && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-900">Execution Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                        {JSON.stringify(executionResults, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <p className="text-slate-500">Select or create a workflow to begin</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}