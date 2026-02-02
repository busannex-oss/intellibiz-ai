import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Image, Type, FileImage, Film, FileText, Palette, Share2,
  Copy, Check, Download, Trash2, ExternalLink, ArrowLeft, Sparkles, MessageSquare
} from 'lucide-react';
import { toast } from "sonner";
import { createPageUrl } from '@/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BrandKit() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();
  const [uploadingAsset, setUploadingAsset] = useState(null);
  const [copied, setCopied] = useState(false);
  const [newAsset, setNewAsset] = useState({
    asset_type: 'image',
    name: '',
    description: '',
    usage_guidelines: '',
    tags: []
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.BusinessProject.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['brand-assets', projectId],
    queryFn: () => base44.entities.BrandAsset.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      return file_url;
    }
  });

  const createAssetMutation = useMutation({
    mutationFn: (data) => base44.entities.BrandAsset.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['brand-assets', projectId]);
      setNewAsset({
        asset_type: 'image',
        name: '',
        description: '',
        usage_guidelines: '',
        tags: []
      });
      toast.success('Asset added to Brand Kit!');
    }
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id) => base44.entities.BrandAsset.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['brand-assets', projectId]);
      toast.success('Asset removed');
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data) => base44.entities.BusinessProject.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      toast.success('Brand guidelines updated!');
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAsset(file.name);
    try {
      const fileUrl = await uploadMutation.mutateAsync(file);
      setNewAsset({
        ...newAsset,
        file_url: fileUrl,
        file_format: file.name.split('.').pop(),
        file_size: file.size
      });
      toast.success('File uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingAsset(null);
    }
  };

  const handleSaveAsset = () => {
    if (!newAsset.file_url || !newAsset.name) {
      toast.error('Please upload a file and enter a name');
      return;
    }

    createAssetMutation.mutate({
      project_id: projectId,
      ...newAsset
    });
  };

  const handleSaveGuidelines = () => {
    updateProjectMutation.mutate({
      brand_personality: {
        traits: project.brand_personality?.traits || [],
        tone_of_voice: project.brand_personality?.tone_of_voice || '',
        messaging_pillars: project.brand_personality?.messaging_pillars || [],
        brand_story: project.brand_personality?.brand_story || ''
      }
    });
  };

  const shareUrl = `${window.location.origin}${createPageUrl(`BrandKit?projectId=${projectId}`)}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Brand Kit link copied!');
  };

  const groupedAssets = {
    logo: assets.filter(a => a.asset_type === 'logo'),
    image: assets.filter(a => a.asset_type === 'image'),
    font: assets.filter(a => a.asset_type === 'font'),
    template: assets.filter(a => a.asset_type === 'template'),
    video: assets.filter(a => a.asset_type === 'video'),
    document: assets.filter(a => a.asset_type === 'document')
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl(`CreateBusiness?projectId=${projectId}`)}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-8 h-8 text-violet-600" />
                Brand Kit
              </h1>
              <p className="text-slate-500">{project?.business_name}</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share Brand Kit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Brand Kit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Brand Kit Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={shareUrl} readOnly />
                    <Button onClick={copyShareLink} variant="outline">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Share this link with team members, designers, or partners to give them access to all your brand assets and guidelines.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <FileImage className="w-8 h-8 mx-auto mb-2 text-violet-600" />
              <p className="text-2xl font-bold text-slate-800">{assets.length}</p>
              <p className="text-sm text-slate-500">Total Assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Image className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-slate-800">{groupedAssets.logo.length + groupedAssets.image.length}</p>
              <p className="text-sm text-slate-500">Visual Assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Palette className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold text-slate-800">{project?.brand_colors?.length || 0}</p>
              <p className="text-sm text-slate-500">Brand Colors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-slate-800">{project?.brand_personality ? '✓' : '—'}</p>
              <p className="text-sm text-slate-500">Voice Defined</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="assets">
              <FileImage className="w-4 h-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="guidelines">
              <Sparkles className="w-4 h-4 mr-2" />
              Guidelines
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6">
            {['logo', 'image', 'font', 'video', 'template', 'document'].map(type => (
              groupedAssets[type].length > 0 && (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      {type === 'logo' && <FileImage className="w-5 h-5" />}
                      {type === 'image' && <Image className="w-5 h-5" />}
                      {type === 'font' && <Type className="w-5 h-5" />}
                      {type === 'video' && <Film className="w-5 h-5" />}
                      {type === 'template' && <FileText className="w-5 h-5" />}
                      {type === 'document' && <FileText className="w-5 h-5" />}
                      {type}s ({groupedAssets[type].length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {groupedAssets[type].map(asset => (
                        <div key={asset.id} className="group relative bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-violet-300 transition-colors">
                          {(asset.asset_type === 'logo' || asset.asset_type === 'image') && (
                            <div className="aspect-square logo rounded-lg mb-3 p-2">
                              <img src={asset.file_url} alt={asset.name} className="max-w-full max-h-full object-contain" />
                            </div>
                          )}
                          <p className="font-medium text-sm text-slate-800 truncate">{asset.name}</p>
                          {asset.file_format && (
                            <Badge variant="secondary" className="mt-1 text-xs">{asset.file_format.toUpperCase()}</Badge>
                          )}
                          {asset.description && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{asset.description}</p>
                          )}
                          <div className="flex gap-1 mt-3">
                            <a href={asset.file_url} download target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => deleteAssetMutation.mutate(asset.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            ))}

            {assets.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileImage className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No brand assets yet</p>
                  <p className="text-sm text-slate-400 mb-6">Upload your logos, images, fonts, and other brand materials</p>
                  <Button onClick={() => document.getElementById('asset-tabs').click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Asset
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Personality & Voice</CardTitle>
                <CardDescription>Define how your brand communicates and presents itself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Textarea
                    placeholder="e.g., Professional yet approachable, friendly and conversational, bold and confident..."
                    value={project?.brand_personality?.tone_of_voice || ''}
                    onChange={(e) => updateProjectMutation.mutate({
                      brand_personality: {
                        ...project?.brand_personality,
                        tone_of_voice: e.target.value
                      }
                    })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Story</Label>
                  <Textarea
                    placeholder="Tell the story of your brand, its origins, mission, and purpose..."
                    value={project?.brand_personality?.brand_story || ''}
                    onChange={(e) => updateProjectMutation.mutate({
                      brand_personality: {
                        ...project?.brand_personality,
                        brand_story: e.target.value
                      }
                    })}
                    rows={5}
                  />
                </div>

                {project?.brand_personality?.traits && (
                  <div>
                    <Label className="mb-3 block">Brand Traits</Label>
                    <div className="flex flex-wrap gap-2">
                      {project.brand_personality.traits.map((trait, i) => (
                        <Badge key={i} className="bg-violet-100 text-violet-800 text-sm">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {project?.brand_colors && (
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.brand_colors.map((color, i) => (
                      <div key={i} className="text-center">
                        <div className="w-full h-24 rounded-lg mb-2" style={{ backgroundColor: color.hex }} />
                        <p className="font-medium text-sm">{color.name}</p>
                        <p className="text-xs text-slate-500">{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upload" id="asset-tabs">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Asset</CardTitle>
                <CardDescription>Add logos, images, fonts, or other brand materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <Select value={newAsset.asset_type} onValueChange={(v) => setNewAsset({ ...newAsset, asset_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="font">Font</SelectItem>
                      <SelectItem value="icon">Icon</SelectItem>
                      <SelectItem value="pattern">Pattern</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="asset-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="asset-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">
                        {uploadingAsset ? `Uploading ${uploadingAsset}...` : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-slate-400">PNG, JPG, SVG, PDF, TTF, OTF up to 10MB</p>
                    </label>
                  </div>
                  {newAsset.file_url && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Check className="w-4 h-4" />
                      File uploaded successfully
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Asset Name *</Label>
                  <Input
                    placeholder="e.g., Primary Logo - Full Color"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe this asset..."
                    value={newAsset.description}
                    onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Usage Guidelines</Label>
                  <Textarea
                    placeholder="When and how to use this asset..."
                    value={newAsset.usage_guidelines}
                    onChange={(e) => setNewAsset({ ...newAsset, usage_guidelines: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSaveAsset}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                  disabled={!newAsset.file_url || !newAsset.name || createAssetMutation.isPending}
                >
                  {createAssetMutation.isPending ? 'Saving...' : 'Add to Brand Kit'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}