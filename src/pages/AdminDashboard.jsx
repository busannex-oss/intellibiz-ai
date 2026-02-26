import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Shield, Users, Trash2, UserPlus, Settings, Activity, AlertTriangle, Key, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const queryClient = useQueryClient();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">User management and permissions</p>
          </div>
          {isSuperAdmin && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Invite New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Email Address</Label>
                    <Input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
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
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Reset User Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">User Email</Label>
                    <Input
                      type="email"
                      value={resetPasswordEmail}
                      onChange={(e) => setResetPasswordEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-slate-900 border-slate-700 text-white"
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

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Users</p>
                  <p className="text-3xl font-bold text-emerald-500">{activeUsers}</p>
                </div>
                <Activity className="w-10 h-10 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Super Admins</p>
                  <p className="text-3xl font-bold text-purple-500">{superAdmins}</p>
                </div>
                <Shield className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-slate-800/50 border border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Admins</p>
                  <p className="text-3xl font-bold text-amber-500">{admins}</p>
                </div>
                <Settings className="w-10 h-10 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-0 bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
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
      </div>
    </div>
  );
}