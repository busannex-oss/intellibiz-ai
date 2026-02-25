import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, MapPin, Phone, Mail, Globe, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
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
    onSuccess: () => {
      toast.success('Account information updated successfully');
      queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error) => {
      toast.error('Failed to update account: ' + error.message);
    }
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
      </div>
    </div>
  );
}