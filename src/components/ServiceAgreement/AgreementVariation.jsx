import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit2, RefreshCw, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function AgreementVariation({
  variation,
  title,
  content,
  clientInfo,
  onUpdate,
  onExport,
  onRegenerate,
  isGenerating
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSaveEdit = () => {
    onUpdate(variation, editedContent);
    setIsEditing(false);
  };

  const handleRegenerate = async () => {
    await onRegenerate();
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6 space-y-4">
        {/* Header with Actions */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setEditedContent(content);
                    setIsEditing(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-slate-300"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  Regenerate with AI
                </Button>
                <Button
                  onClick={onExport}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Agreement Content */}
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[600px] font-mono text-sm border-slate-200 focus:border-violet-400"
            placeholder="Agreement content..."
          />
        ) : (
          <div className="prose prose-sm max-w-none bg-slate-50 p-6 rounded-lg min-h-[600px] overflow-y-auto text-slate-700 whitespace-pre-wrap font-serif text-sm leading-relaxed">
            {content}
          </div>
        )}

        {/* Client Info Footer */}
        <div className="text-xs text-slate-500 pt-4 border-t">
          <p>Agreement for: <strong>{clientInfo.name || 'Client'}</strong> | Date: <strong>{clientInfo.date}</strong></p>
        </div>
      </CardContent>
    </Card>
  );
}