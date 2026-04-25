import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function AssignmentInfoForm({ assignmentInfo, setAssignmentInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Assignment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Assignor Name/Entity *</Label>
            <Input
              placeholder="Enter contractor, co-developer, or seller name"
              value={assignmentInfo.assignor}
              onChange={(e) => setAssignmentInfo({ ...assignmentInfo, assignor: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Assignee</Label>
            <Input
              placeholder="Business Annex"
              value={assignmentInfo.assignee}
              disabled
              className="h-10 border-slate-200 bg-slate-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">IP Types *</Label>
            <Select
              value={assignmentInfo.ipTypes}
              onValueChange={(ipTypes) => setAssignmentInfo({ ...assignmentInfo, ipTypes })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform_code">Platform Code & Software</SelectItem>
                <SelectItem value="ai_systems">AI Systems & Models</SelectItem>
                <SelectItem value="brand_assets">Brand Assets</SelectItem>
                <SelectItem value="workflows">Proprietary Workflows</SelectItem>
                <SelectItem value="agent_architecture">Agent Architectures</SelectItem>
                <SelectItem value="training_data">Training Data & Datasets</SelectItem>
                <SelectItem value="system_prompts">System Prompts & Instructions</SelectItem>
                <SelectItem value="methodologies">Business Methodologies</SelectItem>
                <SelectItem value="multiple">Multiple IP Types</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Assignment Context *</Label>
            <Select
              value={assignmentInfo.context}
              onValueChange={(context) => setAssignmentInfo({ ...assignmentInfo, context })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contractor_work">Contractor Work</SelectItem>
                <SelectItem value="co_development">Co-Development</SelectItem>
                <SelectItem value="acquisition">Acquisition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label className="text-slate-700 font-medium">Agreement Date</Label>
            <Input
              type="date"
              value={assignmentInfo.date}
              onChange={(e) => setAssignmentInfo({ ...assignmentInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}