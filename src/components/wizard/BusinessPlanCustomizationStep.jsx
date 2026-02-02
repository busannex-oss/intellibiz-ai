import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BusinessPlanCustomizationStep({ project, onUpdate, onNext, onPrev }) {
  const [customization, setCustomization] = useState(project?.business_plan_customization || {
    included_sections: [
      'executive_summary',
      'market_research',
      'business_strategy',
      'financial_projections',
      'operations',
      'risk_analysis'
    ],
    color_theme: 'brand',
    custom_header: {
      company_name: project?.business_name || '',
      tagline: '',
      contact_info: ''
    },
    custom_footer: {
      text: '',
      show_page_numbers: true
    }
  });

  const [loading, setLoading] = useState(false);

  const sections = [
    { id: 'executive_summary', label: 'Executive Summary' },
    { id: 'market_research', label: 'Market Research' },
    { id: 'business_strategy', label: 'Business Strategy' },
    { id: 'financial_projections', label: 'Financial Projections' },
    { id: 'operations', label: 'Operations Plan' },
    { id: 'risk_analysis', label: 'Risk Analysis' }
  ];

  const colorThemes = [
    { id: 'brand', label: 'Brand Colors', colors: ['#6366f1', '#8b5cf6'] },
    { id: 'professional_blue', label: 'Professional Blue', colors: ['#0ea5e9', '#06b6d4'] },
    { id: 'executive_navy', label: 'Executive Navy', colors: ['#1e40af', '#1e3a8a'] },
    { id: 'modern_purple', label: 'Modern Purple', colors: ['#7c3aed', '#8b5cf6'] },
    { id: 'growth_green', label: 'Growth Green', colors: ['#10b981', '#059669'] },
    { id: 'warm_orange', label: 'Warm Orange', colors: ['#f97316', '#ea580c'] }
  ];

  const toggleSection = (sectionId) => {
    setCustomization(prev => ({
      ...prev,
      included_sections: prev.included_sections.includes(sectionId)
        ? prev.included_sections.filter(id => id !== sectionId)
        : [...prev.included_sections, sectionId]
    }));
  };

  const updateHeader = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      custom_header: {
        ...prev.custom_header,
        [field]: value
      }
    }));
  };

  const updateFooter = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      custom_footer: {
        ...prev.custom_footer,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    await onUpdate({ business_plan_customization: customization });
    setLoading(false);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      <Card className="border-slate-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <FileText className="w-7 h-7" />
            Customize Business Plan Report
          </CardTitle>
          <p className="text-violet-50 text-sm mt-2">
            Choose sections, colors, and customize header/footer for your business plan
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Included Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Include Sections
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    id={section.id}
                    checked={customization.included_sections.includes(section.id)}
                    onCheckedChange={() => toggleSection(section.id)}
                  />
                  <label htmlFor={section.id} className="text-sm font-medium cursor-pointer flex-1">
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Theme
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCustomization(prev => ({ ...prev, color_theme: theme.id }))}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    customization.color_theme === theme.id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    {theme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{theme.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Header */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Header</h3>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={customization.custom_header.company_name}
                  onChange={(e) => updateHeader('company_name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label>Tagline (Optional)</Label>
                <Input
                  value={customization.custom_header.tagline}
                  onChange={(e) => updateHeader('tagline', e.target.value)}
                  placeholder="Your company tagline"
                />
              </div>
              <div>
                <Label>Contact Information (Optional)</Label>
                <Input
                  value={customization.custom_header.contact_info}
                  onChange={(e) => updateHeader('contact_info', e.target.value)}
                  placeholder="Email, Phone, or Website"
                />
              </div>
            </div>
          </div>

          {/* Custom Footer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Footer</h3>
            <div className="space-y-4">
              <div>
                <Label>Footer Text (Optional)</Label>
                <Input
                  value={customization.custom_footer.text}
                  onChange={(e) => updateFooter('text', e.target.value)}
                  placeholder="e.g., Confidential and Proprietary"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="show_page_numbers"
                  checked={customization.custom_footer.show_page_numbers}
                  onCheckedChange={(checked) => updateFooter('show_page_numbers', checked)}
                />
                <label htmlFor="show_page_numbers" className="text-sm font-medium cursor-pointer">
                  Show page numbers
                </label>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button onClick={onPrev} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-violet-500 to-purple-500"
            >
              {loading ? 'Saving...' : 'Save Customization'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}