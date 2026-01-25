import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Zap, LayoutGrid, Sparkles, Menu, X, Crown } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">BrandForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Business
                </Button>
              </Link>
              <Link to={createPageUrl('WhiteLabel')}>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  White Label
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
                New Business
              </Button>
            </Link>
            <Link to={createPageUrl('WhiteLabel')} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                <Crown className="w-4 h-4 mr-2" />
                White Label
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