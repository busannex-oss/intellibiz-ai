import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Workflow, 
  Plus, 
  Play,
  Trash2,
  Bot,
  Phone,
  MessageSquare,
  Users,
  Clock,
  ArrowRight,
  Volume2,
  Voicemail,
  ChevronDown,
  GripVertical
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DEFAULT_IVR = {
  id: '1',
  name: 'Main Menu',
  greeting_text: 'Thank you for calling. Please listen to the following options.',
  ai_enabled: true,
  nodes: [
    { key: '1', action: 'transfer', target: 'Sales', description: 'For Sales, press 1' },
    { key: '2', action: 'transfer', target: 'Support', description: 'For Support, press 2' },
    { key: '3', action: 'transfer', target: 'Billing', description: 'For Billing, press 3' },
    { key: '0', action: 'transfer', target: 'Operator', description: 'To speak with an operator, press 0' },
    { key: '*', action: 'repeat', target: null, description: 'To repeat these options, press star' },
  ]
};

export default function IVRBuilder({ phoneSystem, onUpdate }) {
  const [ivrFlows, setIvrFlows] = useState(phoneSystem?.ivr_flows?.length > 0 ? phoneSystem.ivr_flows : [DEFAULT_IVR]);
  const [selectedFlow, setSelectedFlow] = useState(ivrFlows[0]);
  const [isEditing, setIsEditing] = useState(false);

  const actionTypes = [
    { value: 'transfer', label: 'Transfer to Extension/Department', icon: Phone },
    { value: 'queue', label: 'Add to Call Queue', icon: Users },
    { value: 'voicemail', label: 'Send to Voicemail', icon: Voicemail },
    { value: 'submenu', label: 'Go to Sub-menu', icon: Workflow },
    { value: 'repeat', label: 'Repeat Menu', icon: Volume2 },
    { value: 'ai', label: 'AI Assistant', icon: Bot },
  ];

  const addNode = () => {
    const newNode = {
      key: '',
      action: 'transfer',
      target: '',
      description: ''
    };
    setSelectedFlow({
      ...selectedFlow,
      nodes: [...selectedFlow.nodes, newNode]
    });
  };

  const updateNode = (index, field, value) => {
    const updatedNodes = [...selectedFlow.nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setSelectedFlow({ ...selectedFlow, nodes: updatedNodes });
  };

  const removeNode = (index) => {
    setSelectedFlow({
      ...selectedFlow,
      nodes: selectedFlow.nodes.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Flow List */}
      <Card className="border-0 shadow-lg lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">IVR Flows</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {ivrFlows.map((flow) => (
            <div
              key={flow.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedFlow?.id === flow.id
                  ? 'bg-violet-50 border-2 border-violet-300'
                  : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
              }`}
              onClick={() => setSelectedFlow(flow)}
            >
              <div className="flex items-center gap-3">
                <Workflow className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="font-medium text-slate-800">{flow.name}</p>
                  <p className="text-xs text-slate-500">{flow.nodes.length} options</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Flow Editor */}
      <Card className="border-0 shadow-lg lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedFlow?.name || 'Select a Flow'}</CardTitle>
              <CardDescription>Configure your phone menu options</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Test
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedFlow && (
            <>
              {/* Greeting */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Greeting Message</Label>
                <Textarea
                  value={selectedFlow.greeting_text}
                  onChange={(e) => setSelectedFlow({ ...selectedFlow, greeting_text: e.target.value })}
                  placeholder="Thank you for calling..."
                  className="min-h-[80px]"
                />
                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="font-medium text-slate-800">AI-Powered Voice</p>
                      <p className="text-xs text-slate-500">Use natural AI voice for greetings</p>
                    </div>
                  </div>
                  <Switch
                    checked={selectedFlow.ai_enabled}
                    onCheckedChange={(v) => setSelectedFlow({ ...selectedFlow, ai_enabled: v })}
                  />
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Menu Options</Label>
                  <Button size="sm" variant="outline" onClick={addNode}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedFlow.nodes.map((node, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2 pt-2">
                          <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                        </div>
                        <div className="grid grid-cols-4 gap-3 flex-1">
                          <div className="space-y-1">
                            <Label className="text-xs">Key</Label>
                            <Input
                              value={node.key}
                              onChange={(e) => updateNode(index, 'key', e.target.value)}
                              placeholder="1"
                              maxLength={1}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Action</Label>
                            <Select value={node.action} onValueChange={(v) => updateNode(index, 'action', v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {actionTypes.map((action) => (
                                  <SelectItem key={action.value} value={action.value}>
                                    <div className="flex items-center gap-2">
                                      <action.icon className="w-4 h-4" />
                                      {action.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Target</Label>
                            <Input
                              value={node.target || ''}
                              onChange={(e) => updateNode(index, 'target', e.target.value)}
                              placeholder="Department/Extension"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Voice Prompt</Label>
                            <Input
                              value={node.description}
                              onChange={(e) => updateNode(index, 'description', e.target.value)}
                              placeholder="For sales, press 1"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
                          onClick={() => removeNode(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <Accordion type="single" collapsible>
                <AccordionItem value="advanced">
                  <AccordionTrigger>Advanced Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Menu Timeout (seconds)</Label>
                        <Input type="number" defaultValue={10} />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Invalid Attempts</Label>
                        <Input type="number" defaultValue={3} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Timeout Action</Label>
                      <Select defaultValue="repeat">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="repeat">Repeat Menu</SelectItem>
                          <SelectItem value="operator">Transfer to Operator</SelectItem>
                          <SelectItem value="voicemail">Send to Voicemail</SelectItem>
                          <SelectItem value="hangup">Disconnect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}