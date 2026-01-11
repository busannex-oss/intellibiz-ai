import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, Plus, Menu, X, Crown } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">BrandForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl('CreateBusiness')}>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Business
                </Button>
              </Link>
              <Link to={createPageUrl('WhiteLabel')}>
                <Button variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                  <Crown className="w-4 h-4 mr-2" />
                  White Label
                </Button>
              </Link>
              </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2">
            <Link to={createPageUrl('Dashboard')} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to={createPageUrl('CreateBusiness')} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                New Business
              </Button>
            </Link>
            <Link to={createPageUrl('WhiteLabel')} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-amber-300 text-amber-600">
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