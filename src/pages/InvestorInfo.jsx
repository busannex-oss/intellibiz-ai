import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Mail, Building2, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <p>
              BrandForge is an AI-powered business builder platform that helps entrepreneurs create 
              comprehensive brands from market research to execution.
            </p>
            <p>
              Our platform combines advanced AI technology with proven business frameworks to deliver 
              complete business solutions including market research, branding, financial planning, 
              and marketing strategies.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6 text-center">
              <Building2 className="w-12 h-12 text-violet-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Market Opportunity</h3>
              <p className="text-sm text-slate-400">Serving the $10B+ business planning and branding market</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Target Market</h3>
              <p className="text-sm text-slate-400">Entrepreneurs, startups, and small business owners</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-400">Cutting-edge AI for comprehensive business solutions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              For investor inquiries, partnership opportunities, or media requests:
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Mail className="w-4 h-4 mr-2" />
              investors@brandforge.ai
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}