import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, Phone, Globe, Save, Loader2, Trash2, AlertTriangle, Bot, Lock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const AGENT_UI_CONFIG = {
  graphic_artist: { name: 'Graphic Artist', icon: Bot, color: 'from-pink-500 to-rose-500', category: 'Visual Quality' },
  brand_sentinel: { name: 'Brand Sentinel', icon: Bot, color: 'from-violet-500 to-indigo-600', category: 'Brand Integrity' },
  brand_consistency_guardian: { name: 'Reliability & Diagnostics', icon: Bot, color: 'from-amber-500 to-orange-500', category: 'Diagnostics' },
  cms_design_guardian: { name: 'Theme Coordinator', icon: Bot, color: 'from-blue-500 to-cyan-500', category: 'CMS & Design' },
  logo_standards_guardian: { name: 'Logo Standards Guardian', icon: Bot, color: 'from-yellow-400 to-amber-500', category: 'Visual Quality' },
  business_assistant: { name: 'Business Assistant', icon: Bot, color: 'from-emerald-500 to-teal-500', category: 'Business Intelligence' },
  market_intelligence: { name: 'Market Intelligence', icon: Bot, color: 'from-cyan-500 to-blue-500', category: 'Research' },
  business_plan_architect: { name: 'Business Plan Architect', icon: Bot, color: 'from-violet-500 to-purple-600', category: 'Business Intelligence' },
  commercial_video_architect: { name: 'Commercial Video Architect', icon: Bot, color: 'from-red-500 to-pink-500', category: 'Content Creation' },
  board_advisor: { name: 'Board Advisor', icon: Bot, color: 'from-slate-600 to-slate-800', category: 'Executive Strategy' },
  seo_growth_engine: { name: 'SEO Growth Engine', icon: Bot, color: 'from-green-500 to-emerald-600', category: 'Marketing' },
  advertising_manager: { name: 'Advertising Manager', icon: Bot, color: 'from-orange-500 to-amber-500', category: 'Marketing' },
  seasonal_newsletter_strategist: { name: 'Newsletter Strategist', icon: Bot, color: 'from-teal-500 to-cyan-500', category: 'Content Creation' },
  performance_monitor: { name: 'Performance Monitor', icon: Bot, color: 'from-blue-600 to-indigo-600', category: 'Analytics' },
  security_sentinel: { name: 'Security Sentinel', icon: Bot, color: 'from-red-600 to-rose-700', category: 'Security' },
  project_manager: { name: 'Project Manager', icon: Bot, color: 'from-slate-500 to-slate-700', category: 'Operations' },
};

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: () => base44.entities.AIAgent.list()
  });

  const [formData, setFormData] = useState({
    company_name: user?.company_name || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || '',
    phone: user?.phone || '',
    website: user?.website || '',
    tax_id: user?.tax_id || '',
    business_type: user?.business_type || '',
    notes: user?.notes || ''
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      return base44.auth.updateMe(data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });
      const prev = queryClient.getQueryData(['currentUser']);
      queryClient.setQueryData(['currentUser'], (old) => ({ ...old, ...data }));
      return { prev };
    },
    onSuccess: () => {
      toast.success('Account information updated successfully');
    },
    onError: (error, _vars, ctx) => {
      queryClient.setQueryData(['currentUser'], ctx?.prev);
      toast.error('Failed to update account: ' + error.message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] })
  });

  const handleSave = async () => {
    setIsSaving(true);
    await updateUserMutation.mutateAsync(formData);
    setIsSaving(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8 text-blue-500" />
            Account Settings
          </h1>
          <p className="text-slate-400 mt-1">Manage your account and business information</p>
        </div>

        {/* Personal Info */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Full Name</Label>
                <Input
                  value={user?.full_name || ''}
                  disabled
                  className="bg-slate-900 border-slate-700 text-slate-400"
                />
              </div>
              <div>
                <Label className="text-white">Email</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-slate-900 border-slate-700 text-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Company Name</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="Your Company LLC"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Business Type</Label>
                <Input
                  value={formData.business_type}
                  onChange={(e) => handleChange('business_type', e.target.value)}
                  placeholder="LLC, Corporation, etc."
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Street Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main Street"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-white">City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="San Francisco"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="CA"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">ZIP Code</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  placeholder="94102"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Tax ID / EIN</Label>
              <Input
                value={formData.tax_id}
                onChange={(e) => handleChange('tax_id', e.target.value)}
                placeholder="12-3456789"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional business information..."
                rows={4}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Section */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              Your AI Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                <p className="text-2xl font-bold text-violet-400">{agents.length}</p>
                <p className="text-xs text-slate-400 mt-1">Total AI Agents</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                <p className="text-2xl font-bold text-pink-400">{agents.filter(a => a.is_active).length}</p>
                <p className="text-xs text-slate-400 mt-1">Active</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                <p className="text-2xl font-bold text-blue-400">0</p>
                <p className="text-xs text-slate-400 mt-1">Admin Only</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                <p className="text-2xl font-bold text-emerald-400">0</p>
                <p className="text-xs text-slate-400 mt-1">User-Facing</p>
              </div>
            </div>

            {agents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                {agents.filter(a => a.is_active).map(agent => {
                  const config = AGENT_UI_CONFIG[agent.agent_key];
                  if (!config) return null;
                  return (
                    <div key={agent.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm">{config.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{config.category}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No AI agents loaded yet. Go to Admin Dashboard to seed agents.</p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
         <div className="flex justify-end">
           <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
          >
            {isSaving ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" /> Save Changes</>
            )}
          </Button>
        </div>

        {/* Delete Account */}
        <Card className="border border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400 text-sm">
              Once you delete your account, all your data will be permanently removed. This action cannot be undone.
            </p>
            {!showDeleteSection ? (
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => setShowDeleteSection(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-red-300 font-medium">
                  Type <span className="font-bold">DELETE</span> to confirm account deletion:
                </p>
                <input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3 py-2 bg-slate-900 border border-red-500/40 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="text-slate-400"
                    onClick={() => { setShowDeleteSection(false); setDeleteConfirm(''); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={deleteConfirm !== 'DELETE'}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40"
                    onClick={() => toast.error('Account deletion requires contacting support. Please email support@brandforge.ai')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Permanently Delete Account
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}