import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Lock, Crown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const COLOR_THEMES = [
  { name: 'Default Dark', colors: ['#0f172a', '#1e293b', '#334155', '#475569'], free: true },
  { name: 'Ocean Blue', colors: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9'], free: true },
  { name: 'Forest Green', colors: ['#14532d', '#166534', '#15803d', '#16a34a'], free: false },
  { name: 'Royal Purple', colors: ['#581c87', '#7e22ce', '#9333ea', '#a855f7'], free: false },
  { name: 'Sunset Orange', colors: ['#7c2d12', '#c2410c', '#ea580c', '#f97316'], free: false },
  { name: 'Crimson Red', colors: ['#7f1d1d', '#991b1b', '#dc2626', '#ef4444'], free: false },
  { name: 'Midnight Blue', colors: ['#1e1b4b', '#312e81', '#3730a3', '#4f46e5'], free: false },
  { name: 'Emerald Mint', colors: ['#064e3b', '#047857', '#059669', '#10b981'], free: false }
];

export default function ColorThemes() {
  const { data: subscription } = useQuery({
    queryKey: ['whiteLabelSubscription'],
    queryFn: async () => {
      const subs = await base44.entities.WhiteLabelSubscription.list();
      return subs[0];
    }
  });

  const hasWhiteLabel = subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Palette className="w-8 h-8 text-purple-500" />
              Color Themes
            </h1>
            <p className="text-slate-400 mt-1">Customize your platform appearance</p>
          </div>
          {!hasWhiteLabel && (
            <Link to={createPageUrl('WhiteLabel')}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Unlock
              </Button>
            </Link>
          )}
        </div>

        {!hasWhiteLabel && (
          <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="text-white font-semibold">Unlock Premium Themes</h3>
                  <p className="text-slate-300 text-sm">Upgrade to White Label to access all color themes and customization options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLOR_THEMES.map((theme, i) => {
            const isLocked = !theme.free && !hasWhiteLabel;
            
            return (
              <Card key={i} className={`border-0 bg-slate-800/50 border ${isLocked ? 'border-slate-700 opacity-60' : 'border-slate-700 hover:border-purple-500/50 cursor-pointer'} transition-all`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{theme.name}</CardTitle>
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      theme.free ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Free</Badge>
                      ) : (
                        <Badge className="bg-purple-500/20 text-purple-400">Premium</Badge>
                      )
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    {theme.colors.map((color, j) => (
                      <div
                        key={j}
                        className="flex-1 h-16 rounded-lg shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {!isLocked && (
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Check className="w-4 h-4 mr-2" />
                      Apply Theme
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}