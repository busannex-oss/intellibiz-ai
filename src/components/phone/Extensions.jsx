import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Search,
  Settings,
  Trash2,
  Phone,
  Voicemail,
  PhoneForwarded
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_EXTENSIONS = [
  { extension: '100', name: 'Reception', email: 'reception@company.com', department: 'General', voicemail_enabled: true, forward_to: '', status: 'available' },
  { extension: '101', name: 'John Smith', email: 'john@company.com', department: 'Sales', voicemail_enabled: true, forward_to: '+1 (555) 123-4567', status: 'busy' },
  { extension: '102', name: 'Sarah Johnson', email: 'sarah@company.com', department: 'Sales', voicemail_enabled: true, forward_to: '', status: 'available' },
  { extension: '103', name: 'Mike Wilson', email: 'mike@company.com', department: 'Support', voicemail_enabled: true, forward_to: '', status: 'away' },
  { extension: '104', name: 'Emily Davis', email: 'emily@company.com', department: 'Support', voicemail_enabled: false, forward_to: '', status: 'offline' },
  { extension: '105', name: 'Robert Chen', email: 'robert@company.com', department: 'Management', voicemail_enabled: true, forward_to: '', status: 'dnd' },
];

export default function Extensions({ phoneSystem, onUpdate }) {
  const [extensions, setExtensions] = useState(phoneSystem?.extensions?.length > 0 ? phoneSystem.extensions : MOCK_EXTENSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExtension, setNewExtension] = useState({
    extension: '',
    name: '',
    email: '',
    department: '',
    voicemail_enabled: true
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-amber-500';
      case 'dnd': return 'bg-red-600';
      default: return 'bg-slate-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'On Call';
      case 'away': return 'Away';
      case 'dnd': return 'Do Not Disturb';
      default: return 'Offline';
    }
  };

  const handleAddExtension = () => {
    setExtensions([...extensions, { ...newExtension, status: 'offline' }]);
    setIsAddDialogOpen(false);
    setNewExtension({ extension: '', name: '', email: '', department: '', voicemail_enabled: true });
  };

  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.extension.includes(searchQuery) ||
    ext.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, extension, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Extension</Label>
                  <Input
                    placeholder="e.g., 106"
                    value={newExtension.extension}
                    onChange={(e) => setNewExtension({ ...newExtension, extension: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={newExtension.department} onValueChange={(v) => setNewExtension({ ...newExtension, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={newExtension.name}
                  onChange={(e) => setNewExtension({ ...newExtension, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={newExtension.email}
                  onChange={(e) => setNewExtension({ ...newExtension, email: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Voicemail className="w-4 h-4 text-slate-500" />
                  <span>Enable Voicemail</span>
                </div>
                <Switch
                  checked={newExtension.voicemail_enabled}
                  onCheckedChange={(v) => setNewExtension({ ...newExtension, voicemail_enabled: v })}
                />
              </div>
              <Button onClick={handleAddExtension} className="w-full" disabled={!newExtension.extension || !newExtension.name}>
                Add Team Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Extensions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExtensions.map((ext) => (
          <Card key={ext.extension} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-violet-100 text-violet-700">
                        {ext.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(ext.status)}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{ext.name}</p>
                    <p className="text-sm text-slate-500">Ext. {ext.extension}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <Badge variant="secondary" className="capitalize">
                    {getStatusLabel(ext.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium">{ext.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Voicemail</span>
                  <span className={ext.voicemail_enabled ? 'text-emerald-600' : 'text-slate-400'}>
                    {ext.voicemail_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {ext.forward_to && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <PhoneForwarded className="w-3 h-3" />
                    Forwarding to {ext.forward_to}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}