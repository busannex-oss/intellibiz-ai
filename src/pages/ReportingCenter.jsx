import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Download, Plus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportingCenter() {
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly',
    day_of_week: 5,
    send_time: '09:00',
    recipient_emails: '',
    include_transcripts: true,
    include_metrics: true,
    include_insights: true
  });

  useEffect(() => {
    loadReports();
    loadSchedules();
  }, []);

  const loadReports = async () => {
    try {
      const data = await base44.entities.WorkflowReport.list('-created_date');
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const loadSchedules = async () => {
    try {
      const data = await base44.entities.ReportSchedule.list();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const createSchedule = async () => {
    if (!newSchedule.name || !newSchedule.recipient_emails) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const schedule = await base44.entities.ReportSchedule.create({
        ...newSchedule,
        recipient_emails: newSchedule.recipient_emails.split(',').map(e => e.trim()),
        is_active: true
      });

      setSchedules([...schedules, schedule]);
      setNewSchedule({
        name: '',
        frequency: 'weekly',
        day_of_week: 5,
        send_time: '09:00',
        recipient_emails: '',
        include_transcripts: true,
        include_metrics: true,
        include_insights: true
      });
      setShowNewSchedule(false);
      alert('Schedule created successfully');
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const result = await base44.functions.invoke('generateWeeklyReport', {
        include_transcripts: true,
        include_metrics: true,
        include_insights: true
      });

      setReports([result, ...reports]);
      alert('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReport = async (reportId) => {
    setIsSending(true);
    try {
      await base44.functions.invoke('sendReportEmail', {
        report_id: reportId
      });

      const updated = reports.map(r =>
        r.id === reportId ? { ...r, status: 'sent', sent_at: new Date().toISOString() } : r
      );
      setReports(updated);
      alert('Report sent successfully');
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Failed to send report');
    } finally {
      setIsSending(false);
    }
  };

  const downloadReport = async (reportId) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (report?.pdf_url) {
        window.open(report.pdf_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!window.confirm('Delete this schedule?')) return;

    try {
      await base44.entities.ReportSchedule.delete(scheduleId);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reporting Center</h1>
          <p className="text-slate-600">Generate and manage weekly collaboration reports for stakeholders</p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="schedules">Report Schedules</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report Now
                  </>
                )}
              </Button>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map(report => (
                  <Card key={report.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              Week of {new Date(report.report_period_end).toLocaleDateString()}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              report.status === 'sent' ? 'bg-green-100 text-green-700' :
                              report.status === 'generated' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-slate-600">Collaborations</p>
                              <p className="text-lg font-semibold">{report.collaborations_count}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Successful Outcomes</p>
                              <p className="text-lg font-semibold">{report.successful_outcomes}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Avg Effectiveness</p>
                              <p className="text-lg font-semibold">{report.avg_effectiveness_score}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">Workflows Executed</p>
                              <p className="text-lg font-semibold">{report.workflows_executed}</p>
                            </div>
                          </div>

                          {report.key_insights && report.key_insights.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Key Insights</p>
                              <ul className="text-sm text-slate-600 space-y-1">
                                {report.key_insights.slice(0, 2).map((insight, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-violet-600 mt-0.5">•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {report.sent_at && (
                            <p className="text-xs text-slate-500">
                              Sent to: {report.sent_to?.join(', ')} on {new Date(report.sent_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 flex-col">
                          {report.pdf_url && (
                            <Button
                              onClick={() => downloadReport(report.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => sendReport(report.id)}
                            disabled={isSending}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No reports generated yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <Button
              onClick={() => setShowNewSchedule(!showNewSchedule)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>

            {showNewSchedule && (
              <Card>
                <CardHeader>
                  <CardTitle>New Report Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Schedule name"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Frequency</label>
                      <select
                        value={newSchedule.frequency}
                        onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Day of Week</label>
                      <select
                        value={newSchedule.day_of_week}
                        onChange={(e) => setNewSchedule({...newSchedule, day_of_week: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Send Time (HH:MM)</label>
                    <Input
                      type="time"
                      value={newSchedule.send_time}
                      onChange={(e) => setNewSchedule({...newSchedule, send_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipient Emails (comma-separated)</label>
                    <Input
                      placeholder="stakeholder@company.com, manager@company.com"
                      value={newSchedule.recipient_emails}
                      onChange={(e) => setNewSchedule({...newSchedule, recipient_emails: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.include_transcripts}
                        onChange={(e) => setNewSchedule({...newSchedule, include_transcripts: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Include collaboration transcripts</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.include_metrics}
                        onChange={(e) => setNewSchedule({...newSchedule, include_metrics: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Include performance metrics</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.include_insights}
                        onChange={(e) => setNewSchedule({...newSchedule, include_insights: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Include AI insights & recommendations</span>
                    </label>
                  </div>
                  <Button
                    onClick={createSchedule}
                    className="w-full bg-slate-800 hover:bg-slate-900"
                  >
                    Create Schedule
                  </Button>
                </CardContent>
              </Card>
            )}

            {schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map(schedule => (
                  <Card key={schedule.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{schedule.name}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-2">
                            <div>
                              <p className="text-xs font-medium">Frequency</p>
                              <p className="capitalize">{schedule.frequency}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium">Time</p>
                              <p>{schedule.send_time}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium">Recipients</p>
                              <p>{schedule.recipient_emails.length}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium">Status</p>
                              <p className={schedule.is_active ? 'text-green-600' : 'text-slate-600'}>
                                {schedule.is_active ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                          </div>
                          {schedule.last_sent && (
                            <p className="text-xs text-slate-500">
                              Last sent: {new Date(schedule.last_sent).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => deleteSchedule(schedule.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No schedules created yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}