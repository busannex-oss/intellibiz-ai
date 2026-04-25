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

export default function PartyInfoForm({ partyInfo, setPartyInfo }) {
  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Party Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Party Name/Organization *</Label>
            <Input
              placeholder="Enter investor, partner, or acquirer name"
              value={partyInfo.partyName}
              onChange={(e) => setPartyInfo({ ...partyInfo, partyName: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Transaction Context *</Label>
            <Select
              value={partyInfo.context}
              onValueChange={(context) => setPartyInfo({ ...partyInfo, context })}
            >
              <SelectTrigger className="h-10 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investor">Investor Discussion</SelectItem>
                <SelectItem value="whitelabel">White Label Licensing</SelectItem>
                <SelectItem value="acquisition">Acquisition/Strategic Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Investment/Deal Amount</Label>
            <Input
              placeholder="e.g., $5M investment or $10K monthly licensing fee"
              value={partyInfo.amount}
              onChange={(e) => setPartyInfo({ ...partyInfo, amount: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">LOI Date</Label>
            <Input
              type="date"
              value={partyInfo.date}
              onChange={(e) => setPartyInfo({ ...partyInfo, date: e.target.value })}
              className="h-10 border-slate-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}