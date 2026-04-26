import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Loader2, Copy, Download, CheckCheck } from 'lucide-react';

const DOC_CONFIG = {
  mission_statement: {
    label: 'Mission Statement',
    description: 'AI will craft a compelling mission statement for BrandForge based on your inputs.',
    fields: [
      { key: 'tagline', label: 'Core Tagline', placeholder: 'e.g. Build. Launch. Grow.', type: 'input' },
      { key: 'values', label: 'Core Values', placeholder: 'e.g. Innovation, Accessibility, Empowerment', type: 'input' },
      { key: 'audience', label: 'Primary Audience', placeholder: 'e.g. Entrepreneurs, startups, small business owners', type: 'input' },
    ]
  },
  white_paper: {
    label: 'White Paper',
    description: 'AI will generate a comprehensive white paper covering the platform\'s value proposition, technology, and market opportunity.',
    fields: [
      { key: 'focus', label: 'Focus / Angle', placeholder: 'e.g. The Future of AI-Powered Business Building', type: 'input' },
    ]
  },
  brand_style_guide: {
    label: 'Brand Style Guide',
    description: 'AI will produce a complete brand style guide covering colors, typography, voice, imagery, and UI standards.',
    fields: [
      { key: 'colors', label: 'Primary Brand Colors', placeholder: 'e.g. Amber #F59E0B, Orange #F97316, Slate #0F172A', type: 'input' },
      { key: 'fonts', label: 'Typography', placeholder: 'e.g. Inter, weights 300–900', type: 'input' },
      { key: 'personality', label: 'Brand Personality', placeholder: 'e.g. Bold, Modern, Trustworthy, Innovative', type: 'input' },
    ]
  },
  privacy_policy: {
    label: 'Privacy Policy & Terms of Service',
    description: 'AI will generate a thorough Privacy Policy and Terms of Service tailored to BrandForge\'s AI SaaS platform.',
    fields: [
      { key: 'company', label: 'Legal Company Name', placeholder: 'e.g. Business Annex LLC', type: 'input' },
      { key: 'contact_email', label: 'Legal Contact Email', placeholder: 'e.g. legal@brandforge.ai', type: 'input' },
      { key: 'effective_date', label: 'Effective Date', placeholder: 'e.g. May 1, 2026', type: 'input' },
    ]
  },
  service_agreement: {
    label: 'Service Agreement',
    description: 'AI will draft a professional service agreement for the selected client tier.',
    fields: [
      { key: 'client_name', label: 'Client Name', placeholder: 'e.g. Acme Corp', type: 'input' },
      {
        key: 'tier', label: 'Agreement Tier', type: 'select',
        options: [
          { value: 'standard', label: 'Standard — Direct Platform Access' },
          { value: 'whitelabel', label: 'White Label — License to Resell' },
          { value: 'enterprise', label: 'Enterprise — Custom Deployment' },
        ]
      },
      { key: 'date', label: 'Agreement Date', placeholder: 'e.g. May 1, 2026', type: 'input' },
    ]
  },
};

export default function AIDocModal({ docType, open, onClose }) {
  const config = DOC_CONFIG[docType];
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  if (!config) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setContent('');
    try {
      const res = await base44.functions.invoke('generatePlatformDocs', { doc_type: docType, inputs });
      setContent(res.data?.content || '');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.label.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setInputs({});
    setContent('');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Generate: {config.label}
          </DialogTitle>
          <p className="text-sm text-slate-400">{config.description}</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Input Fields */}
          {!content && (
            <div className="space-y-4">
              {config.fields.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-slate-300 text-sm">{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select
                      value={inputs[field.key] || ''}
                      onValueChange={val => setInputs(p => ({ ...p, [field.key]: val }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {field.options.map(o => (
                          <SelectItem key={o.value} value={o.value} className="text-white hover:bg-slate-700">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={inputs[field.key] || ''}
                      onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  )}
                </div>
              ))}

              <p className="text-xs text-slate-500">
                All fields are optional — AI will use smart defaults for BrandForge if left blank.
              </p>
            </div>
          )}

          {/* Generated Content */}
          {content && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-400">Document generated successfully</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopy} className="text-slate-400 hover:text-white h-7 px-2">
                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1 text-xs">{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDownload} className="text-slate-400 hover:text-white h-7 px-2">
                    <Download className="w-4 h-4" />
                    <span className="ml-1 text-xs">Download</span>
                  </Button>
                </div>
              </div>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 text-sm font-mono min-h-[400px] resize-y leading-relaxed"
              />
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-slate-400 text-sm">Generating your document with AI...</p>
              <p className="text-slate-600 text-xs">This may take 15–30 seconds</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2 shrink-0">
          <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white">
            Close
          </Button>
          <div className="flex gap-2">
            {content && (
              <Button
                variant="outline"
                onClick={() => setContent('')}
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Edit Inputs & Regenerate
              </Button>
            )}
            {!content && (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}