import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Zap, LayoutGrid, Sparkles, Menu, X, Crown, Settings, Search, Map } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                  <Sparkles className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </Link>
              <Link to={createPageUrl('SEOTools')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Search className="w-4 h-4 mr-2" />
                  SEO Tools
                </Button>
              </Link>
              <Link to={createPageUrl('CustomerJourney')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Map className="w-4 h-4 mr-2" />
                  Journey Map
                </Button>
              </Link>
              <Link to={createPageUrl('AccountSettings')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-2">
            <Link to={createPageUrl('Dashboard')} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to={createPageUrl('CreateBusiness')} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
            <Link to={createPageUrl('AdminDashboard')} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                <Crown className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}