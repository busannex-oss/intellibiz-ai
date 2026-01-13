import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_THEMES = [
  { name: 'Classic Blue', colors: { primary: '#2563eb', secondary: '#1e40af', background: '#f8fafc', text: '#1e293b' } },
  { name: 'Forest Green', colors: { primary: '#059669', secondary: '#047857', background: '#f0fdf4', text: '#064e3b' } },
  { name: 'Sunset Orange', colors: { primary: '#ea580c', secondary: '#c2410c', background: '#fff7ed', text: '#7c2d12' } },
  { name: 'Royal Purple', colors: { primary: '#7c3aed', secondary: '#6d28d9', background: '#faf5ff', text: '#4c1d95' } },
  { name: 'Rose Pink', colors: { primary: '#e11d48', secondary: '#be123c', background: '#fff1f2', text: '#881337' } },
  { name: 'Tech Teal', colors: { primary: '#0891b2', secondary: '#0e7490', background: '#ecfeff', text: '#164e63' } },
  { name: 'Midnight Navy', colors: { primary: '#1e3a8a', secondary: '#1e40af', background: '#eff6ff', text: '#172554' } },
  { name: 'Emerald Dream', colors: { primary: '#10b981', secondary: '#059669', background: '#ecfdf5', text: '#065f46' } },
  { name: 'Amber Glow', colors: { primary: '#f59e0b', secondary: '#d97706', background: '#fffbeb', text: '#78350f' } },
  { name: 'Crimson Fire', colors: { primary: '#dc2626', secondary: '#b91c1c', background: '#fef2f2', text: '#7f1d1d' } },
  { name: 'Slate Modern', colors: { primary: '#475569', secondary: '#334155', background: '#f8fafc', text: '#0f172a' } },
  { name: 'Lavender Fields', colors: { primary: '#a855f7', secondary: '#9333ea', background: '#faf5ff', text: '#581c87' } }
];

export default function NewsletterThemeEditor({ project, onUpdate }) {
  const [customThemes, setCustomThemes] = useState(project?.newsletter_settings?.custom_themes || []);
  const [selectedTheme, setSelectedTheme] = useState(project?.newsletter_settings?.theme || 'Classic Blue');
  const [isCreating, setIsCreating] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: '',
    colors: { primary: '#000000', secondary: '#333333', background: '#ffffff', text: '#000000' }
  });

  const allThemes = [...DEFAULT_THEMES, ...customThemes];
  const currentTheme = allThemes.find(t => t.name === selectedTheme) || DEFAULT_THEMES[0];

  const handleSelectTheme = (themeName) => {
    setSelectedTheme(themeName);
    onUpdate({
      newsletter_settings: {
        ...project?.newsletter_settings,
        theme: themeName
      }
    });
    toast.success(`Theme "${themeName}" selected`);
  };

  const handleCreateTheme = () => {
    if (!newTheme.name) {
      toast.error('Please enter a theme name');
      return;
    }

    const updatedCustomThemes = [...customThemes, newTheme];
    setCustomThemes(updatedCustomThemes);
    
    onUpdate({
      newsletter_settings: {
        ...project?.newsletter_settings,
        custom_themes: updatedCustomThemes,
        theme: newTheme.name
      }
    });

    setSelectedTheme(newTheme.name);
    setIsCreating(false);
    setNewTheme({ name: '', colors: { primary: '#000000', secondary: '#333333', background: '#ffffff', text: '#000000' } });
    toast.success('Custom theme created!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Newsletter Themes
          </h3>
          <p className="text-sm text-slate-500">Customize your email newsletter design</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom
        </Button>
      </div>

      {isCreating && (
        <Card className="border-violet-200 bg-violet-50">
          <CardHeader>
            <CardTitle className="text-base">Create Custom Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Name</Label>
              <Input
                value={newTheme.name}
                onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                placeholder="e.g., My Brand Theme"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(newTheme.colors).map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    type="color"
                    value={newTheme.colors[key]}
                    onChange={(e) => setNewTheme({
                      ...newTheme,
                      colors: { ...newTheme.colors, [key]: e.target.value }
                    })}
                    className="h-12 cursor-pointer"
                  />
                  <Input
                    value={newTheme.colors[key]}
                    onChange={(e) => setNewTheme({
                      ...newTheme,
                      colors: { ...newTheme.colors, [key]: e.target.value }
                    })}
                    placeholder="#000000"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTheme} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Theme
              </Button>
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allThemes.map((theme) => (
          <Card
            key={theme.name}
            className={`cursor-pointer transition-all ${
              selectedTheme === theme.name
                ? 'border-violet-500 border-2 shadow-lg'
                : 'border-slate-200 hover:border-violet-300'
            }`}
            onClick={() => handleSelectTheme(theme.name)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{theme.name}</span>
                  {selectedTheme === theme.name && (
                    <div className="w-2 h-2 bg-violet-600 rounded-full" />
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div
                    className="h-12 rounded border border-slate-200"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="h-12 rounded border border-slate-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="h-12 rounded border border-slate-200"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="h-12 rounded border border-slate-200"
                    style={{ backgroundColor: theme.colors.text }}
                    title="Text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-slate-500">
                  <div>Pri: {theme.colors.primary}</div>
                  <div>Sec: {theme.colors.secondary}</div>
                  <div>Bg: {theme.colors.background}</div>
                  <div>Text: {theme.colors.text}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Email Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg border-2"
            style={{ backgroundColor: currentTheme.colors.background }}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <div
                className="text-center py-4 rounded-lg"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {project?.business_name}
                </h1>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3" style={{ color: currentTheme.colors.primary }}>
                  Welcome to Our Newsletter
                </h2>
                <p className="mb-4" style={{ color: currentTheme.colors.text }}>
                  Thank you for subscribing! Here's what's new this week.
                </p>
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}