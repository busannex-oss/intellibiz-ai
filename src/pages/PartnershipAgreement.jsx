import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Download, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import PartnerInfoForm from '@/components/PartnershipAgreement/PartnerInfoForm';
import PartnershipVariation from '@/components/PartnershipAgreement/PartnershipVariation';
import PartnershipVersionHistory from '@/components/PartnershipAgreement/PartnershipVersionHistory';

export default function PartnershipAgreement() {
  const [partnerInfo, setPartnerInfo] = useState({
    name: '',
    type: 'technology_integration',
    contact: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [agreements, setAgreements] = useState({
    technology_integration: null,
    referral: null,
    strategic_alliance: null
  });
  const [activeTab, setActiveTab] = useState('technology_integration');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [versions, setVersions] = useState([]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (Object.values(agreements).some(a => a)) {
        saveAgreements();
      }
    }, 60000);
    return () => clearInterval(autoSaveTimer);
  }, [agreements, partnerInfo]);

  const saveAgreements = async () => {
    try {
      setLastSaved(new Date());
      await base44.functions.invoke('savePartnershipAgreements', {
        partnerInfo,
        agreements,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving agreements:', error);
    }
  };

  const generateAgreements = async () => {
    if (!partnerInfo.name) {
      alert('Please enter partner name first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await base44.functions.invoke('generatePartnershipAgreements', {
        partnerInfo,
        platformName: 'Business Annex'
      });

      setAgreements(result);
      setVersions([
        ...versions,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          agreements: result,
          note: 'AI Generated'
        }
      ]);
      saveAgreements();
    } catch (error) {
      console.error('Error generating agreements:', error);
      alert('Failed to generate agreements. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVariationUpdate = (variation, updatedContent) => {
    setAgreements(prev => ({
      ...prev,
      [variation]: updatedContent
    }));
  };

  const exportPDF = async (variation) => {
    try {
      await base44.functions.invoke('exportPartnershipAgreementPDF', {
        variation,
        partnerInfo,
        content: agreements[variation],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const restoreVersion = (version) => {
    setAgreements(version.agreements);
    setVersions([
      ...versions,
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        agreements: version.agreements,
        note: `Restored from ${new Date(version.timestamp).toLocaleString()}`
      }
    ]);
  };

  const variationLabels = {
    technology_integration: 'Technology Integration Partner',
    referral: 'Referral Partner',
    strategic_alliance: 'Strategic Alliance'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Partnership Agreements</h1>
            <p className="text-slate-500 mt-1">Business Annex Platform</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Last saved: {lastSaved.toLocaleTimeString()}</p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={generateAgreements}
                disabled={isGenerating}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate All Variations
                  </>
                )}
              </Button>
              <Button
                onClick={saveAgreements}
                variant="outline"
                className="border-slate-300"
              >
                Save Now
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Legal Disclaimer:</strong> These Partnership Agreements are generated by AI and should be reviewed by a qualified legal professional before execution. Business Annex provides these templates as guidelines only and does not constitute legal advice.
          </div>
        </div>

        {/* Partner Information Form */}
        <PartnerInfoForm partnerInfo={partnerInfo} setPartnerInfo={setPartnerInfo} />

        {/* Agreements Tabs */}
        {Object.values(agreements).some(a => a) ? (
          <Card className="border-0 shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 m-4 rounded-lg">
                <TabsTrigger value="technology_integration" className="data-[state=active]:bg-white text-xs md:text-sm">
                  Technology Integration
                </TabsTrigger>
                <TabsTrigger value="referral" className="data-[state=active]:bg-white text-xs md:text-sm">
                  Referral Partner
                </TabsTrigger>
                <TabsTrigger value="strategic_alliance" className="data-[state=active]:bg-white text-xs md:text-sm">
                  Strategic Alliance
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6 space-y-6">
                <TabsContent value="technology_integration" className="space-y-4">
                  {agreements.technology_integration && (
                    <PartnershipVariation
                      variation="technology_integration"
                      title="Technology Integration Partner Agreement"
                      content={agreements.technology_integration}
                      partnerInfo={partnerInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('technology_integration')}
                      onRegenerate={generateAgreements}
                      isGenerating={isGenerating}
                    />
                  )}
                </TabsContent>

                <TabsContent value="referral" className="space-y-4">
                  {agreements.referral && (
                    <PartnershipVariation
                      variation="referral"
                      title="Referral Partner Agreement"
                      content={agreements.referral}
                      partnerInfo={partnerInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('referral')}
                      onRegenerate={generateAgreements}
                      isGenerating={isGenerating}
                    />
                  )}
                </TabsContent>

                <TabsContent value="strategic_alliance" className="space-y-4">
                  {agreements.strategic_alliance && (
                    <PartnershipVariation
                      variation="strategic_alliance"
                      title="Strategic Alliance Agreement"
                      content={agreements.strategic_alliance}
                      partnerInfo={partnerInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('strategic_alliance')}
                      onRegenerate={generateAgreements}
                      isGenerating={isGenerating}
                    />
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg p-12 text-center">
            <p className="text-slate-500 mb-4">No agreements generated yet.</p>
            <Button
              onClick={generateAgreements}
              disabled={isGenerating}
              className="bg-violet-600 hover:bg-violet-700 text-white mx-auto"
            >
              {isGenerating ? 'Generating...' : 'Generate Partnership Agreements'}
            </Button>
          </Card>
        )}

        {/* Version History */}
        {versions.length > 0 && (
          <PartnershipVersionHistory versions={versions} onRestore={restoreVersion} />
        )}
      </div>
    </motion.div>
  );
}