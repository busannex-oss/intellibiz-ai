import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Download, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import ClientInfoForm from '@/components/ServiceAgreement/ClientInfoForm';
import AgreementVariation from '@/components/ServiceAgreement/AgreementVariation';
import VersionHistory from '@/components/ServiceAgreement/VersionHistory';

export default function ServiceAgreement() {
  const queryClient = useQueryClient();
  const [clientInfo, setClientInfo] = useState({ name: '', tier: 'standard', date: new Date().toISOString().split('T')[0] });
  const [agreements, setAgreements] = useState({ standard: null, whitelabel: null, enterprise: null });
  const [activeTab, setActiveTab] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [versions, setVersions] = useState([]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (agreements.standard || agreements.whitelabel || agreements.enterprise) {
        saveAgreements();
      }
    }, 60000);
    return () => clearInterval(autoSaveTimer);
  }, [agreements, clientInfo]);

  const saveAgreements = async () => {
    try {
      setLastSaved(new Date());
      // Save to database via backend function
      await base44.functions.invoke('saveServiceAgreements', {
        clientInfo,
        agreements,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving agreements:', error);
    }
  };

  const generateAgreements = async () => {
    if (!clientInfo.name) {
      alert('Please enter client name first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await base44.functions.invoke('generateServiceAgreements', {
        clientInfo,
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
      await base44.functions.invoke('exportServiceAgreementPDF', {
        variation,
        clientInfo,
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
            <h1 className="text-3xl font-bold text-slate-900">Service Agreements</h1>
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
            <strong>Legal Disclaimer:</strong> These Service Agreements are generated by AI and should be reviewed by a qualified legal professional before execution. Business Annex provides these templates as guidelines only and does not constitute legal advice.
          </div>
        </div>

        {/* Client Information Form */}
        <ClientInfoForm clientInfo={clientInfo} setClientInfo={setClientInfo} />

        {/* Agreements Tabs */}
        {agreements.standard || agreements.whitelabel || agreements.enterprise ? (
          <Card className="border-0 shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 m-4 rounded-lg">
                <TabsTrigger value="standard" className="data-[state=active]:bg-white">
                  Standard Client
                </TabsTrigger>
                <TabsTrigger value="whitelabel" className="data-[state=active]:bg-white">
                  White Label Licensee
                </TabsTrigger>
                <TabsTrigger value="enterprise" className="data-[state=active]:bg-white">
                  Enterprise
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6 space-y-6">
                <TabsContent value="standard" className="space-y-4">
                  {agreements.standard && (
                    <AgreementVariation
                      variation="standard"
                      title="Standard Client Service Agreement"
                      content={agreements.standard}
                      clientInfo={clientInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('standard')}
                      onRegenerate={generateAgreements}
                      isGenerating={isGenerating}
                    />
                  )}
                </TabsContent>

                <TabsContent value="whitelabel" className="space-y-4">
                  {agreements.whitelabel && (
                    <AgreementVariation
                      variation="whitelabel"
                      title="White Label Licensee Service Agreement"
                      content={agreements.whitelabel}
                      clientInfo={clientInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('whitelabel')}
                      onRegenerate={generateAgreements}
                      isGenerating={isGenerating}
                    />
                  )}
                </TabsContent>

                <TabsContent value="enterprise" className="space-y-4">
                  {agreements.enterprise && (
                    <AgreementVariation
                      variation="enterprise"
                      title="Enterprise Service Agreement"
                      content={agreements.enterprise}
                      clientInfo={clientInfo}
                      onUpdate={handleVariationUpdate}
                      onExport={() => exportPDF('enterprise')}
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
              {isGenerating ? 'Generating...' : 'Generate Service Agreements'}
            </Button>
          </Card>
        )}

        {/* Version History */}
        {versions.length > 0 && (
          <VersionHistory versions={versions} onRestore={restoreVersion} />
        )}
      </div>
    </motion.div>
  );
}