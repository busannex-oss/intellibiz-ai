import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Trash2, UserPlus, Settings, Activity, AlertTriangle, Key, Mail, Globe, Save, Palette, Image, Navigation, Lock, Search, Loader2, Upload, Sparkles, Type, ShieldCheck, BookOpen, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ThemeTab from '@/components/admin/ThemeTab';
import BrandAuditTab from '@/components/admin/BrandAuditTab';
import TeamTab from '@/components/admin/TeamTab';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isGeneratingHero, setIsGeneratingHero] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroPrompt, setHeroPrompt] = useState('');

  // App Settings State
  const [siteName, setSiteName] = useState('BrandForge');
  const [siteTagline, setSiteTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [colorTheme, setColorTheme] = useState('amber');
  const [socialMedia, setSocialMedia] = useState({ facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '' });
  const [copyrightText, setCopyrightText] = useState('');
  const [footerTagline, setFooterTagline] = useState('');
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [hero, setHero] = useState({ headline: '', subheadline: '', cta_primary_text: '', cta_primary_link: '', cta_secondary_text: '', cta_secondary_link: '', image_url: '', badge_text: '' });
  const [permissions, setPermissions] = useState({ allow_user_signup: true, allow_project_creation: true, allow_white_label: true, allow_knowledge_base: true, allow_phone_system: true, allow_analytics: true, max_projects_per_user: 10 });
  const [seo, setSeo] = useState({ meta_title: '', meta_description: '', og_image_url: '' });

  // Fetch current user
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      return user;
    }
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const { data: appSettings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const settings = await base44.entities.AppSettings.list();
      if (settings && settings.length > 0) {
        const s = settings[0];
        setSiteName(s.site_name || 'BrandForge');
        setSiteTagline(s.site_tagline || '');
        setLogoUrl(s.logo_url || '');
        setColorTheme(s.color_theme || 'amber');
        setSocialMedia(s.social_media || {});
        setCopyrightText(s.footer_content?.copyright_text || '');
        setFooterTagline(s.footer_content?.footer_tagline || '');
        setShowSocialIcons(s.footer_content?.show_social_icons !== false);
        setHero(s.hero || {});
        setPermissions(s.permissions || { allow_user_signup: true, allow_project_creation: true, allow_white_label: true, allow_knowledge_base: true, allow_phone_system: true, allow_analytics: true, max_projects_per_user: 10 });
        setSeo(s.seo || {});
        return s;
      }
      return null;
    },
  });

  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.data?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.data?.role === 'admin';
  const isAdmin = isSuperAdmin;

  const inviteUserMutation = useMutation({
    mutationFn: async () => { await base44.users.inviteUser(newUserEmail, newUserRole); },
    onSuccess: () => { toast.success('User invited successfully'); setNewUserEmail(''); setNewUserRole('user'); queryClient.invalidateQueries(['allUsers']); },
    onError: (error) => { toast.error('Failed to invite user: ' + error.message); }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }) => base44.entities.User.update(userId, updates),
    onSuccess: () => { toast.success('User updated'); queryClient.invalidateQueries(['allUsers']); },
    onError: (error) => { toast.error('Failed to update user: ' + error.message); }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => base44.entities.User.delete(userId),
    onSuccess: () => { toast.success('User deleted'); queryClient.invalidateQueries(['allUsers']); },
    onError: (error) => { toast.error('Failed to delete user: ' + error.message); }
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (appSettings?.id) return await base44.entities.AppSettings.update(appSettings.id, data);
      return await base44.entities.AppSettings.create(data);
    },
    onSuccess: () => { 
      toast.success('Settings saved'); 
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['appSettings'] }), 100);
    },
    onError: (error) => { toast.error('Failed to save: ' + error.message); },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate({
      site_name: siteName,
      site_tagline: siteTagline,
      logo_url: logoUrl,
      color_theme: colorTheme,
      hero,
      social_media: socialMedia,
      footer_content: { copyright_text: copyrightText, show_social_icons: showSocialIcons, footer_tagline: footerTagline },
      permissions,
      seo,
    });
  };

  const handleGenerateHeroImage = async () => {
    const prompt = heroPrompt.trim() || 'Professional hero image for a business landing page. Modern, warm, diverse entrepreneur with laptop, confident and empowered.';
    setIsGeneratingHero(true);
    const response = await base44.integrations.Core.GenerateImage({ prompt });
    if (response?.url) { setHero(prev => ({ ...prev, image_url: response.url })); toast.success('Hero image generated!'); }
    setIsGeneratingHero(false);
  };

  const handleUploadHero = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setHero(prev => ({ ...prev, image_url: file_url }));
    toast.success('Hero image uploaded!');
    setIsUploadingHero(false);
  };

  const handleInviteUser = () => {
    if (!newUserEmail) { toast.error('Please enter an email address'); return; }
    inviteUserMutation.mutate();
  };

  const handleTogglePermission = (user, permission) => {
    if (user.role === 'super_admin') { toast.error('Cannot modify super admin permissions'); return; }
    updateUserMutation.mutate({ userId: user.id, updates: { permissions: { ...user.permissions, [permission]: !user.permissions?.[permission] } } });
  };

  const handleChangeRole = (user, newRole) => {
    if (user.role === 'super_admin') { toast.error('Cannot change super admin role'); return; }
    if (!isSuperAdmin) { toast.error('Only super admins can change user roles'); return; }
    updateUserMutation.mutate({ userId: user.id, updates: { role: newRole } });
  };

  const handleDeleteUser = (user) => {
    if (user.role === 'super_admin') { toast.error('Cannot delete super admin'); return; }
    if (!isSuperAdmin && user.role === 'admin') { toast.error('Only super admins can delete admins'); return; }
    if (confirm(`Delete ${user.full_name || user.email}?`)) deleteUserMutation.mutate(user.id);
  };

  const handleToggleActive = (user) => {
    if (user.role === 'super_admin') { toast.error('Cannot deactivate super admin'); return; }
    updateUserMutation.mutate({ userId: user.id, updates: { is_active: !user.is_active } });
  };

  const handleResetPassword = async (email) => {
    await base44.auth.resetPassword(email);
    toast.success(`Reset email sent to ${email}`);
    setShowResetDialog(false);
    setResetPasswordEmail('');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md border-red-500/20 bg-slate-800">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.is_active !== false).length;
  const superAdmins = users.filter(u => u.role === 'super_admin').length;
  const admins = users.filter(u => u.role === 'admin').length;

  const permissionLabels = {
    allow_user_signup: 'Allow User Sign-up',
    allow_project_creation: 'Allow Project Creation',
    allow_white_label: 'Allow White Label',
    allow_knowledge_base: 'Allow Knowledge Base',
    allow_phone_system: 'Allow Phone System',
    allow_analytics: 'Allow Analytics',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-white/80" />
                CMS Admin
              </h1>
              <p className="text-violet-200 mt-1">Full content management, user administration &amp; platform settings</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-violet-200">Logged in as</div>
              <div className="text-lg font-semibold text-white">{currentUser?.full_name || currentUser?.email}</div>
              <div className="inline-block mt-1 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                {currentUser?.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Docs Quick Link */}
        <div className="flex justify-end mb-2">
          <Link to={createPageUrl('AdminDocs')}>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white rounded-lg text-sm font-medium transition-all border border-white/20">
              <BookOpen className="w-4 h-4" />
              Platform Documentation
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 -mt-6">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
            { label: 'Active Users', value: activeUsers, icon: Activity, color: 'emerald' },
            { label: 'Super Admins', value: superAdmins, icon: Shield, color: 'purple' },
            { label: 'Admins', value: admins, icon: Settings, color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="wizard-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-white border border-slate-200 mb-6 shadow-sm flex-wrap h-auto gap-1 p-1">
           {[
              { value: 'users', icon: Users, label: 'Users' },
              { value: 'agents', icon: Bot, label: 'AI Agents' },
              { value: 'brand_audit', icon: ShieldCheck, label: 'Brand Audit' },
              { value: 'hero', icon: Image, label: 'Hero' },
              { value: 'theme', icon: Type, label: 'Theme & Brand', superOnly: true },
              { value: 'permissions', icon: Lock, label: 'Permissions' },
              { value: 'seo', icon: Search, label: 'SEO' },
              { value: 'social', icon: Globe, label: 'Social & Footer' },
            ].filter(t => !t.superOnly || isSuperAdmin || currentUser?.permissions?.manage_theme).map(({ value, icon: Icon, label }) => (
              <TabsTrigger key={value} value={value} className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* === USERS TAB === */}
          <TabsContent value="users">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">User Management</CardTitle>
                  {isSuperAdmin && (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Invite New User</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Email Address</Label>
                              <Input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="user@example.com" />
                            </div>
                            <div>
                              <Label>Role</Label>
                              <Select value={newUserRole} onValueChange={setNewUserRole}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleInviteUser} className="w-full" disabled={inviteUserMutation.isPending}>
                              {inviteUserMutation.isPending ? 'Inviting...' : 'Send Invitation'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline"><Key className="w-4 h-4 mr-2" />Reset Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Reset User Password</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>User Email</Label>
                              <Input type="email" value={resetPasswordEmail} onChange={(e) => setResetPasswordEmail(e.target.value)} placeholder="user@example.com" />
                            </div>
                            <Button onClick={() => handleResetPassword(resetPasswordEmail)} className="w-full" disabled={!resetPasswordEmail}>
                              <Mail className="w-4 h-4 mr-2" />Send Reset Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-4">
                  {users.map(user => (
                    <div key={user.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-slate-900 font-semibold">{user.full_name || 'No Name'}</h3>
                            <Badge className={user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}>{user.role}</Badge>
                            {user.is_active === false && <Badge className="bg-red-100 text-red-700">Inactive</Badge>}
                            {user.id === currentUser?.id && <Badge className="bg-emerald-100 text-emerald-700">You</Badge>}
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{user.email}</p>
                          {user.role !== 'super_admin' && isSuperAdmin && (
                            <div className="flex flex-wrap gap-3 mt-2">
                              {['manage_users', 'manage_projects', 'manage_settings', 'view_analytics', 'manage_billing', 'manage_theme'].map(perm => (
                                <div key={perm} className="flex items-center gap-1.5">
                                  <Switch checked={user.permissions?.[perm] || false} onCheckedChange={() => handleTogglePermission(user, perm)} />
                                  <span className="text-xs text-slate-600 capitalize">{perm.replace(/_/g, ' ')}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                          {isSuperAdmin && user.role !== 'super_admin' && (
                            <>
                              <Select value={user.role} onValueChange={(val) => handleChangeRole(user, val)}>
                                <SelectTrigger className="w-28 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="outline" onClick={() => handleToggleActive(user)}>{user.is_active === false ? 'Activate' : 'Deactivate'}</Button>
                              <Button size="sm" variant="outline" onClick={() => { setResetPasswordEmail(user.email); setShowResetDialog(true); }}><Key className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user)} className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                            </>
                          )}
                          {user.role === 'super_admin' && <Badge className="bg-purple-100 text-purple-700">Protected</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === AI AGENTS TAB === */}
          <TabsContent value="agents">
            <TeamTab />
          </TabsContent>

          {/* === HERO TAB === */}
          <TabsContent value="hero">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="wizard-card border-0">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900 flex items-center gap-2"><Image className="w-5 h-5 text-violet-500" />Hero Content</CardTitle>
                  <CardDescription>Customize the homepage hero section text and CTAs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div><Label>Headline</Label><Input placeholder="Build a Brand That Outperforms Competitors" value={hero.headline || ''} onChange={e => setHero(p => ({ ...p, headline: e.target.value }))} /></div>
                  <div><Label>Sub-headline</Label><Textarea placeholder="AI-powered market research analyzes your competition..." value={hero.subheadline || ''} onChange={e => setHero(p => ({ ...p, subheadline: e.target.value }))} className="h-20" /></div>
                  <div><Label>Badge Text</Label><Input placeholder="AI-Powered Business Builder" value={hero.badge_text || ''} onChange={e => setHero(p => ({ ...p, badge_text: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Primary CTA Text</Label><Input placeholder="Create Now" value={hero.cta_primary_text || ''} onChange={e => setHero(p => ({ ...p, cta_primary_text: e.target.value }))} /></div>
                    <div><Label>Primary CTA Link / Page</Label><Input placeholder="CreateBusiness" value={hero.cta_primary_link || ''} onChange={e => setHero(p => ({ ...p, cta_primary_link: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Secondary CTA Text</Label><Input placeholder="View My Projects" value={hero.cta_secondary_text || ''} onChange={e => setHero(p => ({ ...p, cta_secondary_text: e.target.value }))} /></div>
                    <div><Label>Secondary CTA Link / Page</Label><Input placeholder="Dashboard" value={hero.cta_secondary_link || ''} onChange={e => setHero(p => ({ ...p, cta_secondary_link: e.target.value }))} /></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="wizard-card border-0">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900 flex items-center gap-2"><Image className="w-5 h-5 text-pink-500" />Hero Image</CardTitle>
                  <CardDescription>Set or generate the main hero image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {hero.image_url && <img src={hero.image_url} alt="Hero preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />}
                  <div><Label>Image URL</Label><Input placeholder="https://..." value={hero.image_url || ''} onChange={e => setHero(p => ({ ...p, image_url: e.target.value }))} /></div>
                  <div>
                    <Label>Generate with AI</Label>
                    <Textarea placeholder="Describe the hero image you want..." value={heroPrompt} onChange={e => setHeroPrompt(e.target.value)} className="h-16 mt-1" />
                    <Button onClick={handleGenerateHeroImage} disabled={isGeneratingHero} className="w-full mt-2 bg-violet-600 hover:bg-violet-700">
                      {isGeneratingHero ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate with AI</>}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs"><div className="flex-1 h-px bg-slate-200" />or<div className="flex-1 h-px bg-slate-200" /></div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadHero} />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploadingHero} className="w-full">
                    {isUploadingHero ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4 mr-2" />Upload Image</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <Save className="w-4 h-4 mr-2" />{saveSettingsMutation.isPending ? 'Saving...' : 'Save Hero Settings'}
              </Button>
            </div>
          </TabsContent>

          {/* === BRAND AUDIT TAB === */}
          <TabsContent value="brand_audit">
            <BrandAuditTab />
          </TabsContent>

          {/* === THEME & BRAND TAB (Super Admin only) === */}
          <TabsContent value="theme">
            <ThemeTab
              appSettings={appSettings}
              onSave={(data) => saveSettingsMutation.mutate(data)}
              isSaving={saveSettingsMutation.isPending}
            />
          </TabsContent>

          {/* === PERMISSIONS TAB === */}
          <TabsContent value="permissions">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900 flex items-center gap-2"><Lock className="w-5 h-5 text-red-500" />Platform Permissions</CardTitle>
                <CardDescription>Control which features are available to users across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 max-w-xl">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">{label}</p>
                    </div>
                    <Switch checked={permissions[key] !== false} onCheckedChange={val => setPermissions(p => ({ ...p, [key]: val }))} />
                  </div>
                ))}
                <div className="pt-2">
                  <Label>Max Projects Per User</Label>
                  <Input type="number" min={1} max={100} value={permissions.max_projects_per_user || 10} onChange={e => setPermissions(p => ({ ...p, max_projects_per_user: parseInt(e.target.value) || 10 }))} className="max-w-xs" />
                </div>
                <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 mt-2">
                  <Save className="w-4 h-4 mr-2" />{saveSettingsMutation.isPending ? 'Saving...' : 'Save Permissions'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === SEO TAB === */}
          <TabsContent value="seo">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900 flex items-center gap-2"><Search className="w-5 h-5 text-blue-500" />SEO Settings</CardTitle>
                <CardDescription>Configure meta title, description, and Open Graph image for search engines and social sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 max-w-xl">
                <div><Label>Meta Title</Label><Input placeholder="BrandForge — AI Business Builder" value={seo.meta_title || ''} onChange={e => setSeo(p => ({ ...p, meta_title: e.target.value }))} /></div>
                <div><Label>Meta Description</Label><Textarea placeholder="AI-powered platform to build, launch, and grow your business..." value={seo.meta_description || ''} onChange={e => setSeo(p => ({ ...p, meta_description: e.target.value }))} className="h-24" /></div>
                <div><Label>OG Image URL</Label><Input placeholder="https://your-og-image.png" value={seo.og_image_url || ''} onChange={e => setSeo(p => ({ ...p, og_image_url: e.target.value }))} />
                  {seo.og_image_url && <img src={seo.og_image_url} alt="OG preview" className="mt-2 h-24 object-cover rounded border border-slate-200 w-full" />}
                </div>
                <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <Save className="w-4 h-4 mr-2" />{saveSettingsMutation.isPending ? 'Saving...' : 'Save SEO'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === SOCIAL & FOOTER TAB === */}
          <TabsContent value="social">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="wizard-card border-0">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" />Social Media Links</CardTitle>
                  <CardDescription>Configure social media links shown in the footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'].map(platform => (
                    <div key={platform}>
                      <Label className="capitalize">{platform === 'twitter' ? 'Twitter/X' : platform}</Label>
                      <Input placeholder={`https://${platform}.com/yourprofile`} value={socialMedia[platform] || ''} onChange={(e) => setSocialMedia({ ...socialMedia, [platform]: e.target.value })} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="wizard-card border-0">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900 flex items-center gap-2"><Settings className="w-5 h-5 text-amber-500" />Footer Settings</CardTitle>
                  <CardDescription>Customize footer text and appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  <div><Label>Copyright Text</Label><Input placeholder="© 2026 BrandForge. All rights reserved." value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} /></div>
                  <div><Label>Footer Tagline</Label><Input placeholder="AI-powered platform to build, launch, and grow your business" value={footerTagline} onChange={e => setFooterTagline(e.target.value)} /></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Social Icons</Label>
                      <p className="text-sm text-slate-500">Display social media icons in footer</p>
                    </div>
                    <Switch checked={showSocialIcons} onCheckedChange={setShowSocialIcons} />
                  </div>
                  <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isPending} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Save className="w-4 h-4 mr-2" />{saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}