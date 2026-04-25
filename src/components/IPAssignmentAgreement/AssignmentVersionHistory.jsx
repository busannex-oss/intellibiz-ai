import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw } from 'lucide-react';

export default function AssignmentVersionHistory({ versions, onRestore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full hover:bg-slate-50 p-2 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-lg">Version History ({versions.length})</CardTitle>
          </div>
          <span className="text-sm text-slate-500">{expanded ? '−' : '+'}</span>
        </button>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="text-sm">
                  <p className="font-medium text-slate-800">
                    {new Date(version.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{version.note}</p>
                </div>
                <Button
                  onClick={() => onRestore(version)}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 hover:bg-slate-100"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}