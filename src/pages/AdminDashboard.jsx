import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Trash2, UserPlus, Settings, Activity, AlertTriangle, Key, Mail, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const queryClient = useQueryClient();

  // App Settings State
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    tiktok: ''
  });
  const [copyrightText, setCopyrightText] = useState('');
  const [showSocialIcons, setShowSocialIcons] = useState(true);

  // Fetch current user
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      return user;
    }
  });

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  // Fetch App Settings
  const { data: appSettings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const settings = await base44.entities.AppSettings.list();
      if (settings && settings.length > 0) {
        const s = settings[0];
        setSocialMedia(s.social_media || {});
        setCopyrightText(s.footer_content?.copyright_text || '');
        setShowSocialIcons(s.footer_content?.show_social_icons !== false);
        return s;
      }
      return null;
    },
  });

  // Check if current user is super admin - check both top-level role and data.role
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.data?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.data?.role === 'admin' || isSuperAdmin;

  // Invite user mutation
  const inviteUserMutation = useMutation({
    mutationFn: async () => {
      await base44.users.inviteUser(newUserEmail, newUserRole);
    },
    onSuccess: () => {
      toast.success('User invited successfully');
      setNewUserEmail('');
      setNewUserRole('user');
      queryClient.invalidateQueries(['allUsers']);
    },
    onError: (error) => {
      toast.error('Failed to invite user: ' + error.message);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }) => {
      return base44.entities.User.update(userId, updates);
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries(['allUsers']);
    },
    onError: (error) => {
      toast.error('Failed to update user: ' + error.message);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      return base44.entities.User.delete(userId);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['allUsers']);
    },
    onError: (error) => {
      toast.error('Failed to delete user: ' + error.message);
    }
  });

  // Save App Settings Mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData) => {
      if (appSettings?.id) {
        return await base44.entities.AppSettings.update(appSettings.id, settingsData);
      } else {
        return await base44.entities.AppSettings.create(settingsData);
      }
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ['appSettings'] });
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate({
      social_media: socialMedia,
      footer_content: {
        copyright_text: copyrightText,
        show_social_icons: showSocialIcons
      }
    });
  };

  const handleInviteUser = () => {
    if (!newUserEmail) {
      toast.error('Please enter an email address');
      return;
    }
    inviteUserMutation.mutate();
  };

  const handleTogglePermission = (user, permission) => {
    if (user.role === 'super_admin') {
      toast.error('Cannot modify super admin permissions');
      return;
    }
    
    const updatedPermissions = {
      ...user.permissions,
      [permission]: !user.permissions?.[permission]
    };
    
    updateUserMutation.mutate({
      userId: user.id,
      updates: { permissions: updatedPermissions }
    });
  };

  const handleChangeRole = (user, newRole) => {
    if (user.role === 'super_admin') {
      toast.error('Cannot change super admin role');
      return;
    }
    
    if (!isSuperAdmin) {
      toast.error('Only super admins can change user roles');
      return;
    }
    
    updateUserMutation.mutate({
      userId: user.id,
      updates: { role: newRole }
    });
  };

  const handleDeleteUser = (user) => {
    if (user.role === 'super_admin') {
      toast.error('Cannot delete super admin');
      return;
    }
    
    if (!isSuperAdmin && user.role === 'admin') {
      toast.error('Only super admins can delete admins');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.full_name || user.email}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleToggleActive = (user) => {
    if (user.role === 'super_admin') {
      toast.error('Cannot deactivate super admin');
      return;
    }
    
    updateUserMutation.mutate({
      userId: user.id,
      updates: { is_active: !user.is_active }
    });
  };

  const handleResetPassword = async (email) => {
    try {
      await base44.auth.resetPassword(email);
      toast.success(`Password reset email sent to ${email}`);
      setShowResetDialog(false);
      setResetPasswordEmail('');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
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
              <p className="text-violet-200 mt-1">Content management system and user administration</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-violet-200">Logged in as</div>
              <div className="text-lg font-semibold text-white">{currentUser?.full_name || currentUser?.email}</div>
              <div className="inline-block mt-1 px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 -mt-6">
          <Card className="wizard-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="wizard-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Users</p>
                  <p className="text-3xl font-bold text-emerald-600">{activeUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="wizard-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Super Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{superAdmins}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="wizard-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Admins</p>
                  <p className="text-3xl font-bold text-amber-600">{admins}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-white border border-slate-200 mb-6 shadow-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              App Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
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
                          <DialogHeader>
                            <DialogTitle>Invite New User</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Email Address</Label>
                              <Input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                              />
                            </div>
                            <div>
                              <Label>Role</Label>
                              <Select value={newUserRole} onValueChange={setNewUserRole}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
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
                          <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                            <Key className="w-4 h-4 mr-2" />
                            Reset Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset User Password</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>User Email</Label>
                              <Input
                                type="email"
                                value={resetPasswordEmail}
                                onChange={(e) => setResetPasswordEmail(e.target.value)}
                                placeholder="user@example.com"
                              />
                            </div>
                            <Button 
                              onClick={() => handleResetPassword(resetPasswordEmail)} 
                              className="w-full"
                              disabled={!resetPasswordEmail}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Reset Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{user.full_name || 'No Name'}</h3>
                            <Badge className={
                              user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              user.role === 'admin' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }>
                              {user.role}
                            </Badge>
                            {user.is_active === false && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inactive</Badge>
                            )}
                            {user.id === currentUser?.id && (
                              <Badge className="bg-emerald-500/20 text-emerald-400">You</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{user.email}</p>
                          
                          {user.role !== 'super_admin' && isSuperAdmin && (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-500 font-medium">Permissions:</p>
                              <div className="flex flex-wrap gap-3">
                                {['manage_users', 'manage_projects', 'manage_settings', 'view_analytics', 'manage_billing'].map(perm => (
                                  <div key={perm} className="flex items-center gap-2">
                                    <Switch
                                      checked={user.permissions?.[perm] || false}
                                      onCheckedChange={() => handleTogglePermission(user, perm)}
                                      disabled={user.role === 'super_admin'}
                                    />
                                    <span className="text-xs text-slate-400 capitalize">{perm.replace(/_/g, ' ')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isSuperAdmin && user.role !== 'super_admin' && (
                            <>
                              <Select value={user.role} onValueChange={(val) => handleChangeRole(user, val)}>
                                <SelectTrigger className="w-32 bg-slate-900 border-slate-600 text-white text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleActive(user)}
                                className="border-slate-600 text-white"
                              >
                                {user.is_active === false ? 'Activate' : 'Deactivate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setResetPasswordEmail(user.email);
                                  setShowResetDialog(true);
                                }}
                                className="border-slate-600 text-white"
                              >
                                <Key className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {user.role === 'super_admin' && (
                            <Badge className="bg-purple-500/20 text-purple-400">Protected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Social Media Links */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Social Media Links
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure social media links for the footer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Facebook</Label>
                    <Input
                      placeholder="https://facebook.com/yourpage"
                      value={socialMedia.facebook || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Twitter/X</Label>
                    <Input
                      placeholder="https://twitter.com/yourhandle"
                      value={socialMedia.twitter || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Instagram</Label>
                    <Input
                      placeholder="https://instagram.com/yourprofile"
                      value={socialMedia.instagram || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">LinkedIn</Label>
                    <Input
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={socialMedia.linkedin || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">YouTube</Label>
                    <Input
                      placeholder="https://youtube.com/@yourchannel"
                      value={socialMedia.youtube || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">TikTok</Label>
                    <Input
                      placeholder="https://tiktok.com/@yourprofile"
                      value={socialMedia.tiktok || ''}
                      onChange={(e) => setSocialMedia({ ...socialMedia, tiktok: e.target.value })}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Footer Settings */}
              <Card className="border-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-400" />
                    Footer Settings
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Customize footer appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-slate-300">Copyright Text</Label>
                    <Input
                      placeholder="© 2026 BrandForge. All rights reserved."
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Show Social Icons</Label>
                      <p className="text-sm text-slate-500">Display social media icons in footer</p>
                    </div>
                    <Switch
                      checked={showSocialIcons}
                      onCheckedChange={setShowSocialIcons}
                    />
                  </div>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={saveSettingsMutation.isPending}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
          </div>
          </div>
          </div>
          );
          }