import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Download, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import ContractorInfoForm from '@/components/IndependentContractorAgreement/ContractorInfoForm';
import ContractorAgreement from '@/components/IndependentContractorAgreement/ContractorAgreement';
import ContractorVersionHistory from '@/components/IndependentContractorAgreement/ContractorVersionHistory';

export default function IndependentContractorAgreement() {
  const [contractorInfo, setContractorInfo] = useState({
    name: '',
    scope: 'AI Development',
    compensation: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [agreement, setAgreement] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [versions, setVersions] = useState([]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (agreement) {
        saveAgreement();
      }
    }, 60000);
    return () => clearInterval(autoSaveTimer);
  }, [agreement, contractorInfo]);

  const saveAgreement = async () => {
    try {
      setLastSaved(new Date());
      await base44.functions.invoke('saveIndependentContractorAgreement', {
        contractorInfo,
        agreement,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving agreement:', error);
    }
  };

  const generateAgreement = async () => {
    if (!contractorInfo.name) {
      alert('Please enter contractor name first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await base44.functions.invoke('generateIndependentContractorAgreement', {
        contractorInfo,
        platformName: 'Business Annex'
      });

      setAgreement(result);
      setVersions([
        ...versions,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          agreement: result,
          note: 'AI Generated'
        }
      ]);
      saveAgreement();
    } catch (error) {
      console.error('Error generating agreement:', error);
      alert('Failed to generate agreement. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAgreementUpdate = (updatedContent) => {
    setAgreement(updatedContent);
  };

  const exportPDF = async () => {
    try {
      await base44.functions.invoke('exportIndependentContractorAgreementPDF', {
        contractorInfo,
        content: agreement,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const restoreVersion = (version) => {
    setAgreement(version.agreement);
    setVersions([
      ...versions,
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        agreement: version.agreement,
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Independent Contractor Agreement</h1>
            <p className="text-slate-500 mt-1">Business Annex Platform</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Last saved: {lastSaved.toLocaleTimeString()}</p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={generateAgreement}
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
                    Generate Agreement
                  </>
                )}
              </Button>
              <Button
                onClick={saveAgreement}
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
            <strong>Legal Disclaimer:</strong> This Independent Contractor Agreement is generated by AI and should be reviewed by a qualified legal professional before execution. Business Annex provides this template as a guideline only and does not constitute legal advice.
          </div>
        </div>

        {/* Contractor Information Form */}
        <ContractorInfoForm contractorInfo={contractorInfo} setContractorInfo={setContractorInfo} />

        {/* Agreement */}
        {agreement ? (
          <ContractorAgreement
            content={agreement}
            contractorInfo={contractorInfo}
            onUpdate={handleAgreementUpdate}
            onExport={exportPDF}
            onRegenerate={generateAgreement}
            isGenerating={isGenerating}
          />
        ) : (
          <Card className="border-0 shadow-lg p-12 text-center">
            <p className="text-slate-500 mb-4">No agreement generated yet.</p>
            <Button
              onClick={generateAgreement}
              disabled={isGenerating}
              className="bg-violet-600 hover:bg-violet-700 text-white mx-auto"
            >
              {isGenerating ? 'Generating...' : 'Generate Agreement'}
            </Button>
          </Card>
        )}

        {/* Version History */}
        {versions.length > 0 && (
          <ContractorVersionHistory versions={versions} onRestore={restoreVersion} />
        )}
      </div>
    </motion.div>
  );
}