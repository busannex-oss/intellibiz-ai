import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-3xl text-white">Terms of Service</CardTitle>
            </div>
            <p className="text-slate-400">Last updated: February 26, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
                <p>By accessing and using BrandForge, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">2. Use License</h2>
                <p>Permission is granted to temporarily use BrandForge for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">3. User Accounts</h2>
                <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of BrandForge and its licensors.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">5. Termination</h2>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
                <p>In no event shall BrandForge, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">7. Changes to Terms</h2>
                <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">8. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at support@brandforge.com</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}