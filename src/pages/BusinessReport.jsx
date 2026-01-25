import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Download, Printer, Mail, Share2, ArrowLeft, FileText, 
  Eye, MessageSquare, Users, Copy, Check, Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import ReportDocument from '@/components/report/ReportDocument';
import BusinessPlanDocument from '@/components/report/BusinessPlanDocument';
import BrandStyleGuideDocument from '@/components/report/BrandStyleGuideDocument';

export default function BusinessReport() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const reportRef = useRef(null);
  const businessPlanRef = useRef(null);
  const brandStyleGuideRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('No project ID provided');
      try {
        const projects = await base44.entities.BusinessProject.filter({ id: projectId });
        if (!projects || projects.length === 0) throw new Error('Project not found');
        return projects[0];
      } catch (err) {
        console.error('Failed to fetch project:', err);
        toast.error('Failed to load project. Please check your connection.');
        throw err;
      }
    },
    enabled: !!projectId,
    retry: 2,
    retryDelay: 1000
  });

  const generatePDF = async (ref, fileName) => {
    if (!ref.current) return;
    setIsGenerating(true);

    try {
      const element = ref.current;
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        windowWidth: 800,
        allowTaint: true,
        backgroundColor: '#ffffff',
        foreignObjectRendering: true
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas failed to render properly');
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF download failed. Please try again or use the print option.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailShare = async () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    try {
      await base44.integrations.Core.SendEmail({
        to: shareEmail,
        subject: `${project?.business_name} - Business Report`,
        body: `
${shareMessage || `Please review the business report for ${project?.business_name}`}

View the full report here: ${window.location.href}

Best regards,
${project?.business_name} Team
        `
      });
      
      toast.success('Report shared via email!');
      setShareEmail('');
      setShareMessage('');
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">Project not found</p>
          <p className="text-sm text-slate-500 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to={createPageUrl('Dashboard')}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header Actions - Hidden in print */}
      <div className="print:hidden bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl(`CreateBusiness?projectId=${projectId}`)}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-[-0.02em]">
                  <FileText className="w-5 h-5 text-violet-600" />
                  Business Report
                </h1>
                <p className="text-sm text-slate-500 tracking-[-0.011em]">{project.business_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>

              <Button 
                onClick={() => generatePDF(reportRef, `${project?.business_name || 'Business'}_Report.pdf`)}
                disabled={isGenerating}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Report
              </Button>

              <Button 
                onClick={() => generatePDF(businessPlanRef, `${project?.business_name || 'Business'}_Business_Plan.pdf`)}
                disabled={isGenerating}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Business Plan
              </Button>

              <Button 
                onClick={() => generatePDF(brandStyleGuideRef, `${project?.business_name || 'Business'}_Brand_Style_Guide.pdf`)}
                disabled={isGenerating}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Brand Guide
              </Button>

              {/* Email Share Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Report via Email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Recipient Email</Label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message (optional)</Label>
                      <Textarea
                        placeholder="Add a personal message..."
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleEmailShare} className="w-full" disabled={!shareEmail}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Share Link Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Report Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Report Link</Label>
                      <div className="flex gap-2">
                        <Input value={window.location.href} readOnly />
                        <Button onClick={copyShareLink} variant="outline">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium">Team Access</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Share this link with team members to allow them to view and comment on the report.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content - Hidden References for PDF Generation */}
      <div className="hidden">
        <div ref={businessPlanRef}>
          <BusinessPlanDocument project={project} />
        </div>
        <div ref={brandStyleGuideRef}>
          <BrandStyleGuideDocument project={project} />
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div ref={reportRef} className="bg-white shadow-xl rounded-lg overflow-hidden">
          <ReportDocument project={project} />
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}