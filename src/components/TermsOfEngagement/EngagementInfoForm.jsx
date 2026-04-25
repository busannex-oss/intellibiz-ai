import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function EngagementInfoForm({ engagementInfo, setEngagementInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Engagement Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Client Name/Organization *</Label>
            <Input
              placeholder="Enter client name"
              value={engagementInfo.clientName}
              onChange={(e) => setEngagementInfo({ ...engagementInfo, clientName: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Engagement Type *</Label>
            <Select
              value={engagementInfo.engagementType}
              onValueChange={(engagementType) => setEngagementInfo({ ...engagementInfo, engagementType })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="ai_deployment">AI Deployment</SelectItem>
                <SelectItem value="brand_building">Brand Building</SelectItem>
                <SelectItem value="white_label_setup">White Label Setup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label className="text-slate-700 font-medium">Engagement Scope</Label>
            <Textarea
              placeholder="Describe the scope of work, objectives, and deliverables"
              value={engagementInfo.scope}
              onChange={(e) => setEngagementInfo({ ...engagementInfo, scope: e.target.value })}
              className="min-h-20 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Fee Structure</Label>
            <Input
              placeholder="e.g., $50,000 monthly retainer or $5,000 per day"
              value={engagementInfo.fees}
              onChange={(e) => setEngagementInfo({ ...engagementInfo, fees: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Engagement Start Date</Label>
            <Input
              type="date"
              value={engagementInfo.date}
              onChange={(e) => setEngagementInfo({ ...engagementInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}