import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-3xl text-white">Cookie Policy</CardTitle>
            </div>
            <p className="text-slate-400">Last updated: February 26, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">What Are Cookies</h2>
                <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us provide you with a better experience and allow certain features to function properly.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">How We Use Cookies</h2>
                <p>BrandForge uses cookies for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Authentication Cookies:</strong> To keep you logged in</li>
                  <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                  <li><strong>Analytics Cookies:</strong> To understand how visitors use our site</li>
                  <li><strong>Performance Cookies:</strong> To improve site functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">Types of Cookies We Use</h2>
                
                <div className="space-y-4 mt-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Session Cookies</h3>
                    <p>Temporary cookies that expire when you close your browser.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Persistent Cookies</h3>
                    <p>Cookies that remain on your device until they expire or you delete them.</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Third-Party Cookies</h3>
                    <p>Cookies set by third-party services we use, such as analytics providers.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">Managing Cookies</h2>
                <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
                <p className="mt-2">However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">Your Consent</h2>
                <p>By using our website, you consent to our use of cookies in accordance with this Cookie Policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">Contact Us</h2>
                <p>If you have any questions about our Cookie Policy, please contact us at privacy@brandforge.com</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}