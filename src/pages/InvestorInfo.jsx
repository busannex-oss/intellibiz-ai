import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function InvestorInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-500" />
          Investor Information
        </h1>
        
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">About BrandForge</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>BrandForge is an AI-powered business builder platform that helps entrepreneurs create comprehensive brands from market research to execution.</p>
            <p>For investor inquiries, please contact: investors@brandforge.ai</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}