import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, FileDown, FileText, SortAsc, SortDesc,
  LayoutGrid, List, Calendar, Layers, CheckSquare, Square
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const DOC_TYPE_LABELS = {
  mission_statement: 'Mission Statement',
  white_paper: 'White Paper',
  brand_style_guide: 'Brand Style Guide',
  privacy_policy: 'Privacy Policy & Terms',
  service_agreement: 'Service Agreement',
};

const DOC_TYPE_COLORS = {
  mission_statement: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  white_paper: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  brand_style_guide: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  privacy_policy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  service_agreement: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

function exportDocAsPDF(doc) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  const label = DOC_TYPE_LABELS[doc.doc_type] || doc.doc_label || doc.doc_type;

  // Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageW, 28, 'F');
  pdf.setFillColor(245, 158, 11);
  pdf.rect(0, 28, pageW, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(255, 255, 255);
  pdf.text('BrandForge', margin, 17);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text(label, pageW - margin, 17, { align: 'right' });

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(label, margin, 48);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  const dateStr = new Date(doc.updated_date || doc.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(`Last modified: ${dateStr}  |  Version: ${doc.version || 1}`, margin, 55);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.4);
  pdf.line(margin, 60, pageW - margin, 60);

  let cursorY = 68;
  const lineHeight = 5.5;

  const addFooter = () => {
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, pageH - 14, pageW, 14, 'F');
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(148, 163, 184);
    pdf.text('BrandForge Platform — Confidential', margin, pageH - 5);
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, pageW - margin, pageH - 5, { align: 'right' });
  };

  for (const rawLine of (doc.content || '').split('\n')) {
    const line = rawLine.trimEnd();
    const isH1 = /^#{1,2}\s/.test(line);
    const isH2 = /^#{3,4}\s/.test(line);
    const isBullet = /^[-•*]\s/.test(line);
    const isEmpty = line.trim() === '';

    if (cursorY > pageH - 25) {
      addFooter();
      pdf.addPage();
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageW, 10, 'F');
      pdf.setFillColor(245, 158, 11);
      pdf.rect(0, 10, pageW, 1.5, 'F');
      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      pdf.text('BrandForge — ' + label, margin, 7);
      cursorY = 20;
    }

    if (isEmpty) { cursorY += 3; continue; }

    const cleanText = line
      .replace(/^#{1,4}\s*/, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/^[-•*]\s+/, '• ');

    if (isH1) {
      cursorY += 3;
      pdf.setFontSize(13); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(15, 23, 42);
      pdf.text(cleanText, margin, cursorY);
      pdf.setDrawColor(245, 158, 11); pdf.setLineWidth(0.5);
      pdf.line(margin, cursorY + 1.5, margin + pdf.getTextWidth(cleanText), cursorY + 1.5);
      cursorY += lineHeight + 3;
    } else if (isH2) {
      cursorY += 2;
      pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 41, 59);
      pdf.text(cleanText, margin, cursorY);
      cursorY += lineHeight + 1;
    } else if (isBullet) {
      pdf.setFontSize(9.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(51, 65, 85);
      const wrapped = pdf.splitTextToSize(cleanText, contentW - 4);
      pdf.text(wrapped, margin + 2, cursorY);
      cursorY += wrapped.length * lineHeight;
    } else {
      pdf.setFontSize(9.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(51, 65, 85);
      const wrapped = pdf.splitTextToSize(cleanText, contentW);
      pdf.text(wrapped, margin, cursorY);
      cursorY += wrapped.length * lineHeight;
    }
  }

  addFooter();
  pdf.save(`${label.replace(/\s+/g, '_')}_BrandForge.pdf`);
}

export default function ArchivesView({ docs, loading }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState('updated_date');
  const [sortDir, setSortDir] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState(new Set());
  const [bulkExporting, setBulkExporting] = useState(false);

  const allTypes = useMemo(() => {
    const types = new Set((docs || []).map(d => d.doc_type));
    return Array.from(types);
  }, [docs]);

  const filtered = useMemo(() => {
    let list = docs || [];
    if (search) list = list.filter(d =>
      (DOC_TYPE_LABELS[d.doc_type] || d.doc_label || d.doc_type).toLowerCase().includes(search.toLowerCase()) ||
      (d.content || '').toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'all') list = list.filter(d => d.doc_type === typeFilter);
    list = [...list].sort((a, b) => {
      let av = a[sortField]; let bv = b[sortField];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [docs, search, typeFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(d => d.id)));
  };

  const handleBulkExport = async () => {
    setBulkExporting(true);
    const selectedDocs = filtered.filter(d => selected.has(d.id));
    for (const doc of selectedDocs) {
      exportDocAsPDF(doc);
      await new Promise(r => setTimeout(r, 400));
    }
    setBulkExporting(false);
  };

  const SortIcon = sortDir === 'asc' ? SortAsc : SortDesc;

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-slate-500">
      <div className="w-6 h-6 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin mr-3" />
      Loading archived documents...
    </div>
  );

  if (!docs || docs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
        <FileText className="w-7 h-7 text-slate-600" />
      </div>
      <p className="text-slate-400 font-medium">No saved documents yet</p>
      <p className="text-slate-600 text-sm">Use AI Generate on any document card to create and save documents here.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search archives..."
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-52 bg-slate-800 border-slate-700 text-white">
            <Layers className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            {allTypes.map(t => (
              <SelectItem key={t} value={t} className="text-white">
                {DOC_TYPE_LABELS[t] || t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortField} onValueChange={v => { setSortField(v); setSortDir('desc'); }}>
          <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white">
            <SortAsc className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="updated_date" className="text-white">Last Modified</SelectItem>
            <SelectItem value="created_date" className="text-white">Date Created</SelectItem>
            <SelectItem value="doc_type" className="text-white">Type</SelectItem>
            <SelectItem value="version" className="text-white">Version</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
          className="text-slate-400 hover:text-white border border-slate-700"
          title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
        >
          <SortIcon className="w-4 h-4" />
        </Button>

        <div className="flex border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
          <span className="text-sm text-amber-300 font-medium">{selected.size} selected</span>
          <Button
            size="sm"
            onClick={handleBulkExport}
            disabled={bulkExporting}
            className="bg-amber-500 hover:bg-amber-600 text-white h-7 px-3"
          >
            <FileDown className="w-3.5 h-3.5 mr-1.5" />
            {bulkExporting ? 'Exporting...' : `Export ${selected.size} PDF${selected.size > 1 ? 's' : ''}`}
          </Button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-slate-400 hover:text-white ml-auto"
          >
            Clear
          </button>
        </div>
      )}

      {/* Select all / count row */}
      <div className="flex items-center justify-between">
        <button
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {selected.size === filtered.length && filtered.length > 0
            ? <CheckSquare className="w-4 h-4 text-amber-400" />
            : <Square className="w-4 h-4" />
          }
          {selected.size === filtered.length && filtered.length > 0 ? 'Deselect all' : 'Select all'}
        </button>
        <span className="text-xs text-slate-500">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const label = DOC_TYPE_LABELS[doc.doc_type] || doc.doc_label || doc.doc_type;
            const colorClass = DOC_TYPE_COLORS[doc.doc_type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            const isSelected = selected.has(doc.id);
            const preview = (doc.content || '').replace(/^#+ /gm, '').replace(/\*\*/g, '').slice(0, 160);
            const lastMod = doc.updated_date ? format(new Date(doc.updated_date), 'MMM d, yyyy') : '—';

            return (
              <div
                key={doc.id}
                onClick={() => toggleSelect(doc.id)}
                className={`group relative bg-slate-800/50 border rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200
                  ${isSelected ? 'border-amber-500/60 bg-slate-800' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}
              >
                {/* Selection indicator */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600 group-hover:border-slate-400'}`}>
                  {isSelected && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
                </div>

                <div className="pr-6">
                  <Badge className={`text-xs border mb-2 ${colorClass}`}>{label}</Badge>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{preview}...</p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {lastMod}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">v{doc.version || 1}</span>
                    <button
                      onClick={e => { e.stopPropagation(); exportDocAsPDF(doc); }}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-md transition-colors"
                    >
                      <FileDown className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} className="text-slate-400 hover:text-white">
                    {selected.size === filtered.length && filtered.length > 0
                      ? <CheckSquare className="w-4 h-4 text-amber-400" />
                      : <Square className="w-4 h-4" />
                    }
                  </button>
                </th>
                <th
                  onClick={() => toggleSort('doc_type')}
                  className="text-left px-4 py-3 text-xs font-medium text-slate-400 cursor-pointer hover:text-white select-none"
                >
                  <span className="flex items-center gap-1">
                    Type {sortField === 'doc_type' && <SortIcon className="w-3 h-3" />}
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400">Preview</th>
                <th
                  onClick={() => toggleSort('updated_date')}
                  className="text-left px-4 py-3 text-xs font-medium text-slate-400 cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">
                    Last Modified {sortField === 'updated_date' && <SortIcon className="w-3 h-3" />}
                  </span>
                </th>
                <th
                  onClick={() => toggleSort('version')}
                  className="text-left px-4 py-3 text-xs font-medium text-slate-400 cursor-pointer hover:text-white select-none"
                >
                  <span className="flex items-center gap-1">
                    Ver {sortField === 'version' && <SortIcon className="w-3 h-3" />}
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(doc => {
                const label = DOC_TYPE_LABELS[doc.doc_type] || doc.doc_label || doc.doc_type;
                const colorClass = DOC_TYPE_COLORS[doc.doc_type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                const isSelected = selected.has(doc.id);
                const preview = (doc.content || '').replace(/^#+ /gm, '').replace(/\*\*/g, '').slice(0, 80);
                const lastMod = doc.updated_date ? format(new Date(doc.updated_date), 'MMM d, yyyy') : '—';

                return (
                  <tr
                    key={doc.id}
                    onClick={() => toggleSelect(doc.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-500/5' : 'hover:bg-slate-800/50'}`}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleSelect(doc.id)} className="text-slate-400 hover:text-white">
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 text-amber-400" />
                          : <Square className="w-4 h-4" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs border whitespace-nowrap ${colorClass}`}>{label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{preview}…</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {lastMod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">v{doc.version || 1}</td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => exportDocAsPDF(doc)}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-md transition-colors ml-auto"
                      >
                        <FileDown className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (docs || []).length > 0 && (
        <div className="text-center py-12 text-slate-500">
          No documents match your filters.
        </div>
      )}
    </div>
  );
}