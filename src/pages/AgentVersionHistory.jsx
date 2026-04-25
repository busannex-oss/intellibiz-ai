import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, GitCompare, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentVersionHistoryPage() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [versions, setVersions] = useState([]);
  const [compareVersions, setCompareVersions] = useState([null, null]);
  const [showComparison, setShowComparison] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadVersions();
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    try {
      const data = await base44.entities.AIAgent.list();
      setAgents(data);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const loadVersions = async () => {
    try {
      const data = await base44.entities.AgentVersionHistory.filter(
        { agent_id: selectedAgent.id },
        '-created_date'
      );
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const rollbackToVersion = async (version) => {
    if (!window.confirm(`Rollback to version ${version.version_number}? This will update the agent profile.`)) {
      return;
    }

    setIsRollingBack(true);
    try {
      // Update agent with snapshot data
      await base44.entities.AIAgent.update(selectedAgent.id, version.snapshot);

      // Create new version entry marking this as a rollback
      await base44.entities.AgentVersionHistory.create({
        agent_id: selectedAgent.id,
        version_number: (Math.max(...versions.map(v => v.version_number)) + 1),
        changed_by: (await base44.auth.me()).email,
        change_timestamp: new Date().toISOString(),
        change_description: `Rolled back to version ${version.version_number}`,
        change_type: 'other',
        snapshot: version.snapshot,
        is_current_version: true,
        rollback_enabled: true
      });

      // Reload
      await loadVersions();
      alert('Successfully rolled back to version ' + version.version_number);
    } catch (error) {
      console.error('Error rolling back:', error);
      alert('Failed to rollback version');
    } finally {
      setIsRollingBack(false);
    }
  };

  const deleteVersion = async (versionId) => {
    if (!window.confirm('Delete this version? This action cannot be undone.')) {
      return;
    }

    try {
      await base44.entities.AgentVersionHistory.delete(versionId);
      setVersions(versions.filter(v => v.id !== versionId));
    } catch (error) {
      console.error('Error deleting version:', error);
    }
  };

  const getFieldDifference = (field, v1, v2) => {
    const val1 = v1.snapshot?.[field];
    const val2 = v2.snapshot?.[field];
    return val1 !== val2 ? { old: val1, new: val2 } : null;
  };

  const getChangedFields = (v1, v2) => {
    if (!v1.snapshot || !v2.snapshot) return [];
    
    const fields = Object.keys({...v1.snapshot, ...v2.snapshot});
    return fields.filter(f => v1.snapshot[f] !== v2.snapshot[f]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Version History</h1>
          <p className="text-slate-600">Track, compare, and rollback changes to agent personas, instructions, and profiles</p>
        </div>

        {/* Agent Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    selectedAgent?.id === agent.id
                      ? 'bg-violet-100 border-violet-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-medium text-sm">{agent.first_name}</p>
                  <p className="text-xs text-slate-600">{agent.job_title}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Version Comparison Toggle */}
        {versions.length >= 2 && (
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
            className="w-full"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {showComparison ? 'Hide Comparison' : 'Compare Versions'}
          </Button>
        )}

        {/* Comparison View */}
        {showComparison && versions.length >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compare Versions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[0, 1].map(idx => (
                  <div key={idx}>
                    <label className="text-sm font-medium mb-2 block">Version {idx === 0 ? '1' : '2'}</label>
                    <select
                      value={compareVersions[idx]?.id || ''}
                      onChange={(e) => {
                        const v = versions.find(ver => ver.id === e.target.value);
                        const newCompare = [...compareVersions];
                        newCompare[idx] = v;
                        setCompareVersions(newCompare);
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="">Select version...</option>
                      {versions.map(v => (
                        <option key={v.id} value={v.id}>
                          v{v.version_number} - {new Date(v.change_timestamp).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {compareVersions[0] && compareVersions[1] && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm"><strong>Changed fields:</strong> {getChangedFields(compareVersions[0], compareVersions[1]).join(', ')}</p>
                  </div>

                  {getChangedFields(compareVersions[0], compareVersions[1]).map(field => {
                    const diff = getFieldDifference(field, compareVersions[0], compareVersions[1]);
                    if (!diff) return null;

                    return (
                      <div key={field} className="border rounded-lg p-3 space-y-2">
                        <p className="font-medium text-sm capitalize">{field.replace(/_/g, ' ')}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 p-2 rounded border border-red-200">
                            <p className="text-xs font-medium text-red-700 mb-1">Old Value</p>
                            <p className="text-sm text-slate-700 break-words">{String(diff.old || '(empty)')}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded border border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">New Value</p>
                            <p className="text-sm text-slate-700 break-words">{String(diff.new || '(empty)')}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Versions List */}
        {selectedAgent && (
          <div className="space-y-3">
            {versions.length > 0 ? (
              versions.map((version, idx) => (
                <Card key={version.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-lg">v{version.version_number}</span>
                          <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                            {new Date(version.change_timestamp).toLocaleString()}
                          </span>
                          {version.is_current_version && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Current</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{version.change_description}</p>
                        <p className="text-xs text-slate-600">Changed by: <strong>{version.changed_by}</strong> | Type: <strong>{version.change_type}</strong></p>
                      </div>
                      <div className="flex gap-2">
                        {version.rollback_enabled && !version.is_current_version && (
                          <Button
                            onClick={() => rollbackToVersion(version)}
                            disabled={isRollingBack}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            {isRollingBack ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteVersion(version.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No version history for this agent yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}