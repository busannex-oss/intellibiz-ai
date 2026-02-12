import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Filter, Search, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function ErrorLogs() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState(null);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: errors, isLoading } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: () => base44.entities.ErrorLog.list('-created_date', 100)
  });

  const updateErrorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ErrorLog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['errorLogs']);
      toast.success('Error log updated');
    }
  });

  const deleteErrorMutation = useMutation({
    mutationFn: (id) => base44.entities.ErrorLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['errorLogs']);
      toast.success('Error log deleted');
    }
  });

  const toggleResolved = async (error) => {
    await updateErrorMutation.mutateAsync({
      id: error.id,
      data: { resolved: !error.resolved }
    });
  };

  const saveNotes = async () => {
    if (!selectedError) return;
    await updateErrorMutation.mutateAsync({
      id: selectedError.id,
      data: { notes }
    });
    setSelectedError(null);
    setNotes('');
  };

  const filteredErrors = errors?.filter(error => {
    const matchesType = filterType === 'all' || error.error_type === filterType;
    const matchesSearch = !searchQuery || 
      error.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.error_message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  const errorTypeCounts = errors?.reduce((acc, error) => {
    acc[error.error_type] = (acc[error.error_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const getErrorBadgeColor = (type) => {
    const colors = {
      '404': 'bg-yellow-100 text-yellow-800',
      '403': 'bg-red-100 text-red-800',
      '500': 'bg-red-100 text-red-800',
      'network': 'bg-orange-100 text-orange-800',
      'broken_link': 'bg-purple-100 text-purple-800',
      'other': 'bg-slate-100 text-slate-800'
    };
    return colors[type] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Error Logs</h1>
          <p className="text-slate-500 mt-1">Monitor and manage application errors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Errors</p>
                  <p className="text-2xl font-bold text-slate-900">{errors?.length || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">404 Errors</p>
                  <p className="text-2xl font-bold text-yellow-600">{errorTypeCounts['404'] || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {errors?.filter(e => e.resolved).length || 0}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Broken Links</p>
                  <p className="text-2xl font-bold text-purple-600">{errorTypeCounts['broken_link'] || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search errors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterType === '404' ? 'default' : 'outline'}
                  onClick={() => setFilterType('404')}
                  size="sm"
                >
                  404
                </Button>
                <Button
                  variant={filterType === '403' ? 'default' : 'outline'}
                  onClick={() => setFilterType('403')}
                  size="sm"
                >
                  403
                </Button>
                <Button
                  variant={filterType === 'broken_link' ? 'default' : 'outline'}
                  onClick={() => setFilterType('broken_link')}
                  size="sm"
                >
                  Broken Links
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Table */}
        <Card>
          <CardHeader>
            <CardTitle>Error Details ({filteredErrors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>
                        <Badge className={getErrorBadgeColor(error.error_type)}>
                          {error.error_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={error.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:underline flex items-center gap-1"
                        >
                          {error.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm text-slate-600">
                        {error.error_message}
                      </TableCell>
                      <TableCell className="text-sm">{error.user_email || 'Anonymous'}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {moment(error.created_date).fromNow()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={error.resolved ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}
                        >
                          {error.resolved ? 'Resolved' : 'Open'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleResolved(error)}
                          >
                            {error.resolved ? 'Reopen' : 'Resolve'}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedError(error);
                                  setNotes(error.notes || '');
                                }}
                              >
                                Notes
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Error Notes</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-slate-500 mb-2">Error Details:</p>
                                  <p className="text-sm font-medium">{error.error_message}</p>
                                  <p className="text-xs text-slate-400 mt-1">{error.url}</p>
                                </div>
                                <Textarea
                                  placeholder="Add notes about this error..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={4}
                                />
                                <Button onClick={saveNotes} className="w-full">
                                  Save Notes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteErrorMutation.mutate(error.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredErrors.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No errors found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}