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

export default function PartnerInfoForm({ partnerInfo, setPartnerInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Partner Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Partner Name/Organization *</Label>
            <Input
              placeholder="Enter partner name"
              value={partnerInfo.name}
              onChange={(e) => setPartnerInfo({ ...partnerInfo, name: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Partnership Type *</Label>
            <Select
              value={partnerInfo.type}
              onValueChange={(type) => setPartnerInfo({ ...partnerInfo, type })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology_integration">Technology Integration Partner</SelectItem>
                <SelectItem value="referral">Referral Partner</SelectItem>
                <SelectItem value="strategic_alliance">Strategic Alliance Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Contact Person/Email</Label>
            <Input
              placeholder="Enter contact email or name"
              value={partnerInfo.contact}
              onChange={(e) => setPartnerInfo({ ...partnerInfo, contact: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Agreement Date</Label>
            <Input
              type="date"
              value={partnerInfo.date}
              onChange={(e) => setPartnerInfo({ ...partnerInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}