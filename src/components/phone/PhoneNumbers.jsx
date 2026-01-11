import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Plus, 
  Search,
  Settings,
  Trash2,
  Globe,
  MapPin,
  MessageSquare,
  Voicemail
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

const MOCK_NUMBERS = [
  { id: '1', number: '+1 (800) 555-0199', type: 'toll_free', label: 'Main Line', status: 'active', capabilities: ['voice', 'sms', 'mms'] },
  { id: '2', number: '+1 (555) 123-0001', type: 'local', label: 'Sales', status: 'active', capabilities: ['voice', 'sms'] },
  { id: '3', number: '+1 (555) 123-0002', type: 'local', label: 'Support', status: 'active', capabilities: ['voice', 'sms'] },
];

export default function PhoneNumbers({ phoneSystem, onUpdate }) {
  const [numbers, setNumbers] = useState(phoneSystem?.phone_numbers?.length > 0 ? phoneSystem.phone_numbers : MOCK_NUMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNumber, setNewNumber] = useState({
    type: 'local',
    areaCode: '',
    label: ''
  });

  const handleAddNumber = () => {
    // Would call API to provision number
    const fakeNumber = {
      id: Date.now().toString(),
      number: `+1 (${newNumber.areaCode || '555'}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      type: newNumber.type,
      label: newNumber.label || 'New Line',
      status: 'pending',
      capabilities: ['voice', 'sms']
    };
    setNumbers([...numbers, fakeNumber]);
    setIsAddDialogOpen(false);
    setNewNumber({ type: 'local', areaCode: '', label: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search phone numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Phone Number
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Phone Number</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Number Type</Label>
                <Select value={newNumber.type} onValueChange={(v) => setNewNumber({ ...newNumber, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Number</SelectItem>
                    <SelectItem value="toll_free">Toll-Free Number</SelectItem>
                    <SelectItem value="mobile">Mobile Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newNumber.type === 'local' && (
                <div className="space-y-2">
                  <Label>Area Code (optional)</Label>
                  <Input
                    placeholder="e.g., 415"
                    value={newNumber.areaCode}
                    onChange={(e) => setNewNumber({ ...newNumber, areaCode: e.target.value })}
                    maxLength={3}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  placeholder="e.g., Sales, Support, Main"
                  value={newNumber.label}
                  onChange={(e) => setNewNumber({ ...newNumber, label: e.target.value })}
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Estimated Cost:</strong> {newNumber.type === 'toll_free' ? '$2.00/mo + usage' : '$1.00/mo + usage'}
                </p>
              </div>
              <Button onClick={handleAddNumber} className="w-full">
                Provision Number
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Numbers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {numbers.map((num) => (
          <Card key={num.id} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    num.type === 'toll_free' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    {num.type === 'toll_free' ? (
                      <Globe className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-800">{num.number}</p>
                    <p className="text-sm text-slate-500">{num.label}</p>
                  </div>
                </div>
                <Badge className={num.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                  {num.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {num.capabilities?.includes('voice') && (
                  <Badge variant="outline" className="text-xs">
                    <Phone className="w-3 h-3 mr-1" /> Voice
                  </Badge>
                )}
                {num.capabilities?.includes('sms') && (
                  <Badge variant="outline" className="text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" /> SMS
                  </Badge>
                )}
                {num.capabilities?.includes('mms') && (
                  <Badge variant="outline" className="text-xs">
                    MMS
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}