import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { History, RotateCcw, Eye, Loader2, Clock, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';

const DOC_TYPE_LABELS = {
  mission_statement: 'Mission Statement',
  white_paper: 'White Paper',
  brand_style_guide: 'Brand Style Guide',
  privacy_policy: 'Privacy Policy & Terms',
  service_agreement: 'Service Agreement',
};

export default function DocVersionDrawer({ doc, open, onClose, onReverted }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [reverting, setReverting] = useState(null);

  useEffect(() => {
    if (!open || !doc) return;
    setPreviewVersion(null);
    setLoading(true);
    base44.entities.DocumentVersion
      .filter({ platform_document_id: doc.id })
      .then(data => {
        const sorted = (data || []).sort((a, b) => (b.version || 0) - (a.version || 0));
        setVersions(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, doc]);

  const handleRevert = async (v) => {
    setReverting(v.version);
    try {
      // Save current state as a new version snapshot before reverting
      const currentVersion = doc.version || 1;
      await base44.entities.DocumentVersion.create({
        platform_document_id: doc.id,
        doc_type: doc.doc_type,
        doc_label: doc.doc_label,
        version: currentVersion,
        content: doc.content,
        inputs: doc.inputs || {},
        saved_at: new Date().toISOString(),
      });

      // Revert the live document to the selected version's content
      await base44.entities.PlatformDocument.update(doc.id, {
        content: v.content,
        inputs: v.inputs || {},
        version: v.version,
      });

      if (onReverted) onReverted();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setReverting(null);
    }
  };

  const label = doc ? (DOC_TYPE_LABELS[doc.doc_type] || doc.doc_label || doc.doc_type) : '';
  const currentPreview = previewVersion
    ? (previewVersion.content || '').replace(/^#+ /gm, '').replace(/\*\*/g, '').slice(0, 600)
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl w-full max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <History className="w-5 h-5 text-violet-400" />
            Version History — {label}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Current: <span className="text-slate-300 font-medium">v{doc?.version || 1}</span>
            &nbsp;·&nbsp;{versions.length} saved snapshot{versions.length !== 1 ? 's' : ''}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-1">
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading history...
            </div>
          )}

          {!loading && versions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm">No version history yet</p>
              <p className="text-slate-600 text-xs">History is recorded each time you regenerate and save a document.</p>
            </div>
          )}

          {!loading && versions.map(v => {
            const isPreviewing = previewVersion?.id === v.id;
            const snippet = (v.content || '').replace(/^#+ /gm, '').replace(/\*\*/g, '').slice(0, 120);
            const savedAt = v.saved_at ? format(new Date(v.saved_at), 'MMM d, yyyy · h:mm a') : '—';

            return (
              <div key={v.id} className={`rounded-xl border transition-all duration-150
                ${isPreviewing ? 'border-violet-500/60 bg-slate-800' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/70'}`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-violet-400">v{v.version}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">Version {v.version}</span>
                      {v.version === (doc?.version || 1) && (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <Clock className="w-3 h-3" /> {savedAt}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{snippet}…</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setPreviewVersion(isPreviewing ? null : v)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors
                        ${isPreviewing
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                      {isPreviewing ? <X className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {isPreviewing ? 'Close' : 'Preview'}
                    </button>
                    {v.version !== (doc?.version || 1) && (
                      <button
                        onClick={() => handleRevert(v)}
                        disabled={!!reverting}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                      >
                        {reverting === v.version
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <RotateCcw className="w-3 h-3" />}
                        Revert
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline preview */}
                {isPreviewing && (
                  <div className="border-t border-slate-700 px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" /> Preview — Version {v.version}
                    </p>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto bg-slate-900/50 rounded-lg p-3">
                      {currentPreview}…
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800 shrink-0">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}