import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  FileText, Scale, Search, ExternalLink,
  CheckCircle2, Clock, AlertCircle, FileCheck, ChevronRight,
  ChevronDown, Briefcase
} from 'lucide-react';

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

function getDocStatus(doc, project) {
  if (!project) return 'not_started';
  if (doc.key === 'business_plan' && project.business_plan) return 'complete';
  if (doc.key === 'brand_style_guide' && project.logo_url) return 'complete';
  if (doc.key === 'privacy_policy') return 'complete';
  if (doc.key === 'agent_manifest') return 'complete';
  if (['service_agreement_1','service_agreement_2','service_agreement_3',
       'contractor_agreement','partnership_1','partnership_2','partnership_3',
       'loi_1','loi_2','loi_3','ip_assignment','terms_of_engagement'].includes(doc.key)) return 'in_progress';
  return 'not_started';
}

function StatusBadge({ status }) {
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

function DocCard({ doc, project }) {
  const isLinked = !!doc.route;
  const status = getDocStatus(doc, project);

  const cardContent = (
    <div className={`group bg-slate-800/50 border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 h-full
      ${isLinked ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800 cursor-pointer' : 'border-slate-700/40 opacity-70'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white leading-snug">{doc.name}</p>
        {isLinked && <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 mt-0.5 transition-colors" />}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <StatusBadge status={status} />
        {isLinked ? (
          <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
            Open <ExternalLink className="w-3 h-3" />
          </span>
        ) : (
          <span className="text-xs text-slate-600">Coming soon</span>
        )}
      </div>
    </div>
  );

  if (isLinked && project) {
    const url = createPageUrl(`${doc.route}?projectId=${project.id}`);
    return <Link to={url} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
}

export default function Documents() {
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.BusinessProject.list('-created_date'),
  });

  const project = projects.find(p => p.id === projectId) || null;

  const filter = (docs) => docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">Documents & Legal Suite</h1>
            <p className="text-slate-400 mt-1 text-sm">All foundational and legal documents, scoped to your selected project</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Project Selector */}
        <div className="mb-8">
          <div className="relative inline-block">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-3 bg-slate-800 border border-slate-600 hover:border-amber-500/50 rounded-xl px-4 py-3 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400">Selected Project</p>
                <p className="text-sm font-semibold text-white">
                  {project ? project.business_name : 'Select a project…'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
            </button>

            {showPicker && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl min-w-[240px] overflow-hidden">
                {projects.length === 0 ? (
                  <p className="text-sm text-slate-400 p-4">No projects found.</p>
                ) : projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigate(`/Documents?projectId=${p.id}`);
                      setShowPicker(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 transition-colors flex items-center gap-2
                      ${p.id === projectId ? 'text-amber-400 font-medium' : 'text-white'}`}
                  >
                    <Briefcase className="w-4 h-4 shrink-0 text-slate-400" />
                    {p.business_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!project ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Select a project to view its documents</h2>
            <p className="text-slate-400 text-sm max-w-sm">Each project has its own set of documents. Choose a project above to get started.</p>
          </div>
        ) : (
          <>
            {/* Foundational Documents */}
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
                  <DocCard key={doc.key} doc={doc} project={project} />
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
                  <DocCard key={doc.key} doc={doc} project={project} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}