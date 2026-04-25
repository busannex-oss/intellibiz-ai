import { useState, useEffect } from 'react';

export function useDocumentManagement(documentType) {
  const [document, setDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [versions, setVersions] = useState([]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (document) {
        saveDocument();
      }
    }, 60000);
    return () => clearInterval(autoSaveTimer);
  }, [document]);

  const saveDocument = async (infoData) => {
    try {
      setLastSaved(new Date());
      await window.base44?.functions.invoke(`save${documentType}`, {
        info: infoData,
        document,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error saving ${documentType}:`, error);
    }
  };

  const generateDocument = async (infoData, generateFunctionName) => {
    if (!infoData || Object.values(infoData).some(v => !v && typeof v === 'string')) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await window.base44?.functions.invoke(generateFunctionName, {
        info: infoData,
        platformName: 'Business Annex'
      });

      setDocument(result.document || result);
      setVersions([
        ...versions,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          document: result.document || result,
          note: 'AI Generated'
        }
      ]);
      
      if (saveDocument) {
        await saveDocument(infoData);
      }
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      alert(`Failed to generate ${documentType}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDocument = (updatedContent) => {
    setDocument(updatedContent);
  };

  const exportDocument = async (infoData, exportFunctionName) => {
    try {
      await window.base44?.functions.invoke(exportFunctionName, {
        info: infoData,
        content: document,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error exporting ${documentType}:`, error);
      alert(`Failed to export. Please try again.`);
    }
  };

  const restoreVersion = (version, infoData) => {
    setDocument(version.document);
    setVersions([
      ...versions,
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        document: version.document,
        note: `Restored from ${new Date(version.timestamp).toLocaleString()}`
      }
    ]);
  };

  return {
    document,
    setDocument,
    isGenerating,
    lastSaved,
    versions,
    saveDocument,
    generateDocument,
    updateDocument,
    exportDocument,
    restoreVersion
  };
}