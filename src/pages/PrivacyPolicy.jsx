import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          Privacy Policy
        </h1>
        
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h3 className="text-white font-semibold mt-6">Information We Collect</h3>
            <p>We collect information you provide when creating business projects, including business details, market research data, and generated content.</p>
            
            <h3 className="text-white font-semibold mt-6">How We Use Your Information</h3>
            <p>Your data is used to generate AI-powered business plans, branding materials, and market analysis. We do not sell your personal information to third parties.</p>
            
            <h3 className="text-white font-semibold mt-6">Data Security</h3>
            <p>We implement industry-standard security measures to protect your data, including encryption and secure storage.</p>
            
            <h3 className="text-white font-semibold mt-6">Contact</h3>
            <p>For privacy concerns, contact: privacy@brandforge.ai</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}