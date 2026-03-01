import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Zap, LayoutGrid, Sparkles, Crown, Facebook, Twitter, Instagram, Linkedin, Youtube, Home, FolderOpen, ListTodo, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children }) {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  // Auto dark mode: apply 'dark' class based on system preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await base44.entities.AppSettings.list();
        if (data && data.length > 0) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.log('Settings not loaded');
      }
    };
    loadSettings();
  }, []);

  const socialIcons = {
    facebook: { icon: Facebook, color: 'hover:text-blue-500' },
    twitter: { icon: Twitter, color: 'hover:text-blue-400' },
    instagram: { icon: Instagram, color: 'hover:text-pink-500' },
    linkedin: { icon: Linkedin, color: 'hover:text-blue-600' },
    youtube: { icon: Youtube, color: 'hover:text-red-500' }
  };

  const mobileNav = [
    { label: 'Home', icon: Home, page: 'Home' },
    { label: 'Projects', icon: FolderOpen, page: 'Dashboard' },
    { label: 'New', icon: Sparkles, page: 'CreateBusiness' },
    { label: 'Tasks', icon: ListTodo, page: 'Tasks' },
    { label: 'Settings', icon: Settings, page: 'AccountSettings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: -0.011em;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          letter-spacing: -0.025em;
          font-weight: 700;
        }
        
        p {
          line-height: 1.7;
          letter-spacing: -0.011em;
        }

        .logo, .logo img, [class*="logo"] img {
          background: transparent !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
      `}</style>
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight" style={{ letterSpacing: '-0.03em' }}>BrandForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
              <Link to={createPageUrl('Resources')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Resources
                </Button>
              </Link>
              <Link to={createPageUrl('WhiteLabel')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Crown className="w-4 h-4 mr-2" />
                  White Label
                </Button>
              </Link>
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Link to={createPageUrl('AdminDashboard')} className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Crown className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>


      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">BrandForge</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                AI-powered platform to build, launch, and grow your business
              </p>
              {/* Social Media Icons */}
              {settings?.footer_content?.show_social_icons !== false && settings?.social_media && (
                <div className="flex items-center gap-3">
                  {Object.entries(settings.social_media).map(([platform, url]) => {
                    if (!url) return null;
                    const IconData = socialIcons[platform];
                    if (!IconData) return null;
                    const Icon = IconData.icon;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-slate-400 ${IconData.color} transition-colors`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('HowItWorks')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
                <Link to={createPageUrl('InvestorInfo')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Investor Info
                </Link>
                <Link to={createPageUrl('WhiteLabel')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  White Label
                </Link>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Services')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  All Services
                </Link>
                <Link to={createPageUrl('KnowledgeBase')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Knowledge Base
                </Link>
                <Link to={createPageUrl('HowItWorks')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('PrivacyPolicy')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to={createPageUrl('TermsOfService')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to={createPageUrl('CookiePolicy')} className="block text-slate-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-6">
            <div className="text-center text-slate-400 text-sm">
              {settings?.footer_content?.copyright_text
  ? settings.footer_content.copyright_text.replace(/\d{4}/, new Date().getFullYear())
  : `© ${new Date().getFullYear()} BrandForge. All rights reserved.`}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}