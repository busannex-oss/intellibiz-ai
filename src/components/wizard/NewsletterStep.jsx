import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Mail, Users, Share2, Trash2, Plus, CheckCircle, AlertCircle, Copy, ExternalLink, Palette } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import NewsletterThemeEditor from '../newsletter/NewsletterThemeEditor';

export default function NewsletterStep({ project, onUpdate, onPrev }) {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['subscribers', project?.id],
    queryFn: () => base44.entities.NewsletterSubscriber.filter({ project_id: project?.id }),
    enabled: !!project?.id
  });

  const addSubscriberMutation = useMutation({
    mutationFn: (data) => base44.entities.NewsletterSubscriber.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers', project?.id]);
      setNewEmail('');
      setNewName('');
      toast.success('Subscriber added!');
    }
  });

  const updateSubscriberMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NewsletterSubscriber.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers', project?.id]);
    }
  });

  const deleteSubscriberMutation = useMutation({
    mutationFn: (id) => base44.entities.NewsletterSubscriber.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers', project?.id]);
      toast.success('Subscriber removed');
    }
  });

  const handleAddSubscriber = (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    addSubscriberMutation.mutate({
      project_id: project.id,
      email: newEmail,
      name: newName,
      opted_in: true,
      source: 'manual'
    });
  };

  const handleToggleOptIn = (subscriber) => {
    updateSubscriberMutation.mutate({
      id: subscriber.id,
      data: { opted_in: !subscriber.opted_in }
    });
  };

  const embedCode = `<!-- Newsletter Signup Form -->
<form action="YOUR_ENDPOINT" method="POST">
  <input type="email" name="email" placeholder="Enter your email" required />
  <input type="text" name="name" placeholder="Your name" />
  <label>
    <input type="checkbox" name="opt_in" required />
    I agree to receive marketing emails. You can unsubscribe at any time.
  </label>
  <button type="submit">Subscribe</button>
</form>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied!');
  };

  const optedInCount = subscribers.filter(s => s.opted_in).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Newsletter & Subscribers
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Build your email list with GDPR-compliant opt-in management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/80">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-violet-600" />
            <p className="text-3xl font-bold text-slate-800">{subscribers.length}</p>
            <p className="text-sm text-slate-500">Total Subscribers</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-3xl font-bold text-slate-800">{optedInCount}</p>
            <p className="text-sm text-slate-500">Opted In</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <p className="text-3xl font-bold text-slate-800">{subscribers.length - optedInCount}</p>
            <p className="text-sm text-slate-500">Opted Out</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/80">
          <CardContent className="p-4 text-center">
            <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-3xl font-bold text-slate-800">
              {subscribers.length > 0 ? Math.round((optedInCount / subscribers.length) * 100) : 0}%
            </p>
            <p className="text-sm text-slate-500">Opt-in Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="subscribers">
            <Users className="w-4 h-4 mr-2" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="themes">
            <Palette className="w-4 h-4 mr-2" />
            Email Themes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
        {/* Add Subscriber */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Subscriber
            </CardTitle>
            <CardDescription>
              Manually add subscribers to your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="subscriber@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
                disabled={addSubscriberMutation.isPending}
              >
                Add Subscriber
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Invites */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Social Invites
            </CardTitle>
            <CardDescription>
              Invite friends from social platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full justify-start">
                <span className="text-xl mr-3">📘</span>
                Share on Facebook
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Check out ${project?.business_name}!&url=${encodeURIComponent(window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full justify-start">
                <span className="text-xl mr-3">🐦</span>
                Share on X (Twitter)
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full justify-start">
                <span className="text-xl mr-3">💼</span>
                Share on LinkedIn
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </a>
            <a
              href={`mailto:?subject=Check out ${project?.business_name}&body=I thought you might be interested in this: ${window.location.origin}`}
            >
              <Button variant="outline" className="w-full justify-start">
                <span className="text-xl mr-3">📧</span>
                Invite via Email
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Signup Form Embed</CardTitle>
            <CardDescription>
              Add this form to your website for compliant signups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 text-xs text-slate-300 font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">{embedCode}</pre>
            </div>
            <Button onClick={copyEmbedCode} variant="outline" className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Copy Embed Code
            </Button>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Compliance Note:</strong> This form includes required opt-in consent and unsubscribe notice per GDPR/CAN-SPAM regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriber List */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Subscriber List</CardTitle>
          <CardDescription>
            Manage your subscribers and their opt-in status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {subscriber.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={subscriber.opted_in}
                          onCheckedChange={() => handleToggleOptIn(subscriber)}
                        />
                        <span className={subscriber.opted_in ? 'text-emerald-600' : 'text-slate-400'}>
                          {subscriber.opted_in ? 'Opted In' : 'Opted Out'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSubscriberMutation.mutate(subscriber.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No subscribers yet. Add your first subscriber above!</p>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="themes">
          <NewsletterThemeEditor project={project} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="h-12 px-6">
          <ChevronLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <Button
          onClick={() => onUpdate({ status: 'completed', current_step: 6 })}
          className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
}