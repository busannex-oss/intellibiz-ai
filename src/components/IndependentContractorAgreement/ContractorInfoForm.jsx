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

export default function ContractorInfoForm({ contractorInfo, setContractorInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Contractor Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Contractor Name *</Label>
            <Input
              placeholder="Enter contractor name"
              value={contractorInfo.name}
              onChange={(e) => setContractorInfo({ ...contractorInfo, name: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Scope of Work *</Label>
            <Select
              value={contractorInfo.scope}
              onValueChange={(scope) => setContractorInfo({ ...contractorInfo, scope })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI Development">AI Development</SelectItem>
                <SelectItem value="Platform Building">Platform Building</SelectItem>
                <SelectItem value="Content Creation">Content Creation</SelectItem>
                <SelectItem value="Brand Strategy">Brand Strategy</SelectItem>
                <SelectItem value="Integration Development">Integration Development</SelectItem>
                <SelectItem value="Multiple">Multiple Scopes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Compensation/Rate *</Label>
            <Input
              placeholder="e.g., $50,000 or $100/hour"
              value={contractorInfo.compensation}
              onChange={(e) => setContractorInfo({ ...contractorInfo, compensation: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Agreement Date</Label>
            <Input
              type="date"
              value={contractorInfo.date}
              onChange={(e) => setContractorInfo({ ...contractorInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}