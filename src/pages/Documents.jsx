import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileText, Scale, Search, ExternalLink,
  CheckCircle2, Clock, AlertCircle, FileCheck, ChevronRight, Globe, Sparkles, Archive
} from 'lucide-react';
import AIDocModal from '@/components/documents/AIDocModal';
import ArchivesView from '@/components/documents/ArchivesView';
import { base44 } from '@/api/base44Client';

// Doc types that support AI generation (key → modal doc_type)
const AI_ENABLED = {
  mission_statement: 'mission_statement',
  white_paper: 'white_paper',
  brand_style_guide: 'brand_style_guide',
  privacy_policy: 'privacy_policy',
  service_agreement_1: 'service_agreement',
  service_agreement_2: 'service_agreement',
  service_agreement_3: 'service_agreement',
};

const FOUNDATIONAL_DOCS = [
  { key: 'mission_statement', name: 'Mission Statement', route: null },
  { key: 'white_paper', name: 'White Paper', route: null },
  { key: 'business_plan', name: '30-Year Business Plan', route: 'BusinessReport' },
  { key: 'brand_style_guide', name: 'Brand Style Guide', route: 'BrandKit' },
  { key: 'sitemap', name: 'Sitemap', route: null },
  { key: 'kpi_framework', name: 'KPI Framework', route: 'PerformanceReports' },
  { key: 'pillar_alignment', name: 'Pillar Alignment Document', route: null },
  { key: 'master_element_registry', name: 'Master Element Registry', route: null },
  { key: 'map_legend', name: 'Map Legend', route: null },
  { key: 'system_architecture', name: 'System Architecture Mind Map', route: null },
  { key: '8_pillars_map', name: '8 Pillars Architecture Map', route: null },
  { key: 'sop_library', name: 'S.O.P. Library', route: null },
  { key: 'agent_manifest', name: 'Agent & Automation Manifest', route: 'AdminDocs' },
  { key: 'onboarding_design', name: 'Onboarding Experience Design', route: null },
  { key: 'version_roadmap', name: 'Version Roadmap', route: null },
];

const LEGAL_DOCS = [
  { key: 'privacy_policy', name: 'Privacy Policy & Terms of Service', route: 'PrivacyPolicy' },
  { key: 'licensing_terms', name: 'Licensing Terms', route: null },
  { key: 'nda_1', name: 'NDA — Variation 1', route: null },
  { key: 'nda_2', name: 'NDA — Variation 2', route: null },
  { key: 'nda_3', name: 'NDA — Variation 3', route: null },
  { key: 'service_agreement_1', name: 'Service Agreement — Variation 1', route: 'ServiceAgreement' },
  { key: 'service_agreement_2', name: 'Service Agreement — Variation 2', route: 'ServiceAgreement' },
  { key: 'service_agreement_3', name: 'Service Agreement — Variation 3', route: 'ServiceAgreement' },
  { key: 'contractor_agreement', name: 'Independent Contractor Agreement', route: 'IndependentContractorAgreement' },
  { key: 'partnership_1', name: 'Partnership Agreement — Variation 1', route: 'PartnershipAgreement' },
  { key: 'partnership_2', name: 'Partnership Agreement — Variation 2', route: 'PartnershipAgreement' },
  { key: 'partnership_3', name: 'Partnership Agreement — Variation 3', route: 'PartnershipAgreement' },
  { key: 'loi_1', name: 'Letter of Intent — Variation 1', route: 'LetterOfIntent' },
  { key: 'loi_2', name: 'Letter of Intent — Variation 2', route: 'LetterOfIntent' },
  { key: 'loi_3', name: 'Letter of Intent — Variation 3', route: 'LetterOfIntent' },
  { key: 'ip_assignment', name: 'IP Assignment Agreement', route: 'IPAssignmentAgreement' },
  { key: 'terms_of_engagement', name: 'Terms of Engagement', route: 'TermsOfEngagement' },
];

const STATUS_MAP = {
  business_plan: 'complete',
  brand_style_guide: 'complete',
  privacy_policy: 'complete',
  agent_manifest: 'complete',
  service_agreement_1: 'in_progress',
  service_agreement_2: 'in_progress',
  service_agreement_3: 'in_progress',
  contractor_agreement: 'in_progress',
  partnership_1: 'in_progress',
  partnership_2: 'in_progress',
  partnership_3: 'in_progress',
  loi_1: 'in_progress',
  loi_2: 'in_progress',
  loi_3: 'in_progress',
  ip_assignment: 'in_progress',
  terms_of_engagement: 'in_progress',
};

function StatusBadge({ docKey, isSaved }) {
  if (isSaved) return (
    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
      <CheckCircle2 className="w-3.5 h-3.5" /> Saved
    </span>
  );
  const status = STATUS_MAP[docKey] || 'not_started';
  if (status === 'complete') return (
    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
    </span>
  );
  if (status === 'in_progress') return (
    <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
      <Clock className="w-3.5 h-3.5" /> In Progress
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
      <AlertCircle className="w-3.5 h-3.5" /> Not Started
    </span>
  );
}

function DocCard({ doc, onAIGenerate, isSaved }) {
  const isLinked = !!doc.route;
  const isAIEnabled = !!AI_ENABLED[doc.key];

  const inner = (
    <div className={`group bg-slate-800/50 border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 h-full
      ${(isLinked || isAIEnabled) ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-700/40 opacity-60'}
      ${isSaved ? 'border-emerald-700/40' : ''}
      ${isLinked ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white leading-snug">{doc.name}</p>
        {isLinked && <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 mt-0.5 transition-colors" />}
      </div>
      <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
        <StatusBadge docKey={doc.key} isSaved={isSaved} />
        <div className="flex items-center gap-1.5">
          {isAIEnabled && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onAIGenerate(AI_ENABLED[doc.key]); }}
              className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2 py-1 rounded-md transition-colors"
            >
              <Sparkles className="w-3 h-3" /> AI Generate
            </button>
          )}
          {isLinked && (
            <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
              Open <ExternalLink className="w-3 h-3" />
            </span>
          )}
          {!isLinked && !isAIEnabled && (
            <span className="text-xs text-slate-600">Coming soon</span>
          )}
        </div>
      </div>
    </div>
  );

  if (isLinked) {
    return <Link to={createPageUrl(doc.route)} className="block h-full">{inner}</Link>;
  }
  return inner;
}

export default function Documents() {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState('library');
  const [savedDocs, setSavedDocs] = useState({});
  const [archivedDocs, setArchivedDocs] = useState([]);
  const [archivesLoading, setArchivesLoading] = useState(false);

  const loadDocs = () => {
    base44.entities.PlatformDocument.list().then(docs => {
      const map = {};
      (docs || []).forEach(d => { map[d.doc_type] = true; });
      setSavedDocs(map);
      setArchivedDocs(docs || []);
    }).catch(() => {});
  };

  useEffect(() => {
    setArchivesLoading(true);
    base44.entities.PlatformDocument.list().then(docs => {
      const map = {};
      (docs || []).forEach(d => { map[d.doc_type] = true; });
      setSavedDocs(map);
      setArchivedDocs(docs || []);
    }).catch(() => {}).finally(() => setArchivesLoading(false));
  }, []);

  const handleSaved = (docType) => {
    setSavedDocs(prev => ({ ...prev, [docType]: true }));
    loadDocs();
  };

  const filter = (docs) => docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-violet-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">Documents & Legal Suite</h1>
            </div>
            <p className="text-slate-400 mt-1 text-sm ml-13">All BrandForge platform documents — foundational strategy and legal agreements</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-powered generation available
            </div>
            {activeTab === 'library' && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-700 mb-8">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${activeTab === 'library'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" />
            Document Library
          </button>
          <button
            onClick={() => setActiveTab('archives')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${activeTab === 'archives'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Archive className="w-4 h-4" />
            Archives
            {archivedDocs.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-1.5 py-0.5 rounded-full">
                {archivedDocs.length}
              </span>
            )}
          </button>
        </div>

        {/* Archives View */}
        {activeTab === 'archives' && (
          <ArchivesView docs={archivedDocs} loading={archivesLoading} />
        )}

        {/* Foundational Documents */}
        {activeTab === 'library' && <div>
        <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Foundational Documents</h2>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 border ml-1">{FOUNDATIONAL_DOCS.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filter(FOUNDATIONAL_DOCS).map(doc => (
              <DocCard key={doc.key} doc={doc} onAIGenerate={setActiveModal} isSaved={!!savedDocs[AI_ENABLED[doc.key]]} />
            ))}
          </div>
        </div>

          {/* Legal Suite */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Legal Suite</h2>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border ml-1">{LEGAL_DOCS.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filter(LEGAL_DOCS).map(doc => (
                <DocCard key={doc.key} doc={doc} onAIGenerate={setActiveModal} isSaved={!!savedDocs[AI_ENABLED[doc.key]]} />
              ))}
            </div>
          </div>
          </div>}

      </div>

      {/* AI Generation Modal */}
      <AIDocModal
        docType={activeModal}
        open={!!activeModal}
        onClose={() => setActiveModal(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}