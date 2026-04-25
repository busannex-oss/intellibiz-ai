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

export default function ClientInfoForm({ clientInfo, setClientInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Client/Company Name *</Label>
            <Input
              placeholder="Enter client or company name"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Service Tier *</Label>
            <Select value={clientInfo.tier} onValueChange={(tier) => setClientInfo({ ...clientInfo, tier })}>
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Client</SelectItem>
                <SelectItem value="whitelabel">White Label Licensee</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Agreement Date</Label>
            <Input
              type="date"
              value={clientInfo.date}
              onChange={(e) => setClientInfo({ ...clientInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}