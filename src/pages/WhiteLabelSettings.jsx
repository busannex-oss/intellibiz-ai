import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, Globe, Palette, Lock } from 'lucide-react';

export default function WhiteLabelSettings() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  // Check if user is super_admin
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => base44.entities.AppSettings.list().then((data) => data[0] || {}),
    enabled: !!user,
  });

  const { data: membership } = useQuery({
    queryKey: ['membership-group'],
    queryFn: () => base44.entities.MembershipGroup.list(),
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: (data) => {
      if (settings?.id) {
        return base44.entities.AppSettings.update(settings.id, data);
      }
      return base44.entities.AppSettings.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
  });

  const [formData, setFormData] = useState(settings || {});

  useEffect(() => {
    setFormData(settings || {});
  }, [settings]);

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Access Denied</h3>
              <p className="text-red-800 text-sm">
                White Label Settings are only available to super administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">White Label Settings</h1>
          <p className="text-slate-600">
            Control all aspects of your white-label CMS platform dynamically.
          </p>
        </div>

        <Tabs defaultValue="branding" className="space-y-4">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="domain" className="gap-2">
              <Globe className="w-4 h-4" />
              Domain
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Lock className="w-4 h-4" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Site Branding</CardTitle>
                <CardDescription>
                  Customize the name, tagline, and visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={formData.site_name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, site_name: e.target.value })
                    }
                    placeholder="e.g. BrandForge"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={formData.site_tagline || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, site_tagline: e.target.value })
                    }
                    placeholder="Your brand tagline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, logo_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color_theme">Primary Color Theme</Label>
                  <select
                    id="color_theme"
                    value={formData.color_theme || 'amber'}
                    onChange={(e) =>
                      setFormData({ ...formData, color_theme: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {['amber', 'blue', 'violet', 'emerald', 'rose', 'slate'].map(
                      (theme) => (
                        <option key={theme} value={theme}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <Button
                  onClick={() => updateSettings.mutate(formData)}
                  disabled={updateSettings.isPending}
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  {updateSettings.isPending ? 'Saving...' : 'Save Branding'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domain Tab */}
          <TabsContent value="domain" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>
                  Configure your white-label domain settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero_image">Hero Image URL</Label>
                  <Input
                    id="hero_image"
                    type="url"
                    value={formData.hero?.image_url || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, image_url: e.target.value },
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta_primary">Primary CTA Text</Label>
                  <Input
                    id="cta_primary"
                    value={formData.hero?.cta_primary_text || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          cta_primary_text: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Get Started"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta_link">Primary CTA Link</Label>
                  <Input
                    id="cta_link"
                    value={formData.hero?.cta_primary_link || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          cta_primary_link: e.target.value,
                        },
                      })
                    }
                    placeholder="/CreateBusiness"
                  />
                </div>

                <Button
                  onClick={() => updateSettings.mutate(formData)}
                  disabled={updateSettings.isPending}
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  {updateSettings.isPending ? 'Saving...' : 'Save Domain Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable/disable platform features for your white-label instance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'allow_user_signup', label: 'Allow User Signup' },
                    {
                      key: 'allow_project_creation',
                      label: 'Allow Project Creation',
                    },
                    {
                      key: 'allow_white_label',
                      label: 'Allow White Label Sales',
                    },
                    {
                      key: 'allow_knowledge_base',
                      label: 'Enable Knowledge Base',
                    },
                    {
                      key: 'allow_phone_system',
                      label: 'Enable Phone System',
                    },
                    { key: 'allow_analytics', label: 'Enable Analytics' },
                  ].map((feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <Label htmlFor={feature.key} className="cursor-pointer">
                        {feature.label}
                      </Label>
                      <Switch
                        id={feature.key}
                        checked={
                          formData.permissions?.[feature.key] !== false
                        }
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              [feature.key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => updateSettings.mutate(formData)}
                  disabled={updateSettings.isPending}
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  {updateSettings.isPending ? 'Saving...' : 'Save Features'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}