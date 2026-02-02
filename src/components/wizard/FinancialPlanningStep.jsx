import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, ArrowRight, ArrowLeft, Plus, Trash2, Sparkles, Loader2, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FinancialPlanningStep({ project, onUpdate, onNext, onPrev }) {
  const [financialData, setFinancialData] = useState(project?.financial_data || {
    startup_costs: {
      initial_inventory: 0,
      equipment: 0,
      legal_fees: 0,
      marketing: 0,
      technology: 0,
      other: 0
    },
    funding_requirements: {
      total_needed: 0,
      equity_investment: 0,
      loans: 0,
      personal_funds: 0,
      grants: 0
    },
    revenue_forecast: [
      { year: 1, revenue: 0, cogs: 0, gross_profit: 0 },
      { year: 2, revenue: 0, cogs: 0, gross_profit: 0 },
      { year: 3, revenue: 0, cogs: 0, gross_profit: 0 }
    ],
    monthly_expenses: {
      rent: 0,
      salaries: 0,
      utilities: 0,
      marketing: 0,
      insurance: 0,
      software: 0,
      other: 0
    },
    cash_flow_projections: []
  });

  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateStartupCosts = (field, value) => {
    setFinancialData(prev => ({
      ...prev,
      startup_costs: {
        ...prev.startup_costs,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const updateFundingRequirements = (field, value) => {
    setFinancialData(prev => ({
      ...prev,
      funding_requirements: {
        ...prev.funding_requirements,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const updateRevenueForecast = (index, field, value) => {
    const newForecast = [...financialData.revenue_forecast];
    newForecast[index] = {
      ...newForecast[index],
      [field]: parseFloat(value) || 0
    };
    if (field === 'revenue' || field === 'cogs') {
      newForecast[index].gross_profit = newForecast[index].revenue - newForecast[index].cogs;
    }
    setFinancialData(prev => ({
      ...prev,
      revenue_forecast: newForecast
    }));
  };

  const updateMonthlyExpenses = (field, value) => {
    setFinancialData(prev => ({
      ...prev,
      monthly_expenses: {
        ...prev.monthly_expenses,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const generateCashFlowProjections = async () => {
    setIsGenerating(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate comprehensive financial projections for this business:

Business: ${project.business_name}
Industry: ${project.industry}
Target Market: ${project.target_audience}

STARTUP COSTS:
${Object.entries(financialData.startup_costs).map(([k, v]) => `${k}: $${v}`).join('\n')}

FUNDING:
Total Needed: $${financialData.funding_requirements.total_needed}
Sources: Equity ($${financialData.funding_requirements.equity_investment}), Loans ($${financialData.funding_requirements.loans}), Personal ($${financialData.funding_requirements.personal_funds})

REVENUE FORECAST:
${financialData.revenue_forecast.map(y => `Year ${y.year}: $${y.revenue} revenue, $${y.cogs} COGS, $${y.gross_profit} gross profit`).join('\n')}

MONTHLY EXPENSES:
${Object.entries(financialData.monthly_expenses).map(([k, v]) => `${k}: $${v}`).join('\n')}

Generate:
1. Detailed 12-month cash flow with realistic monthly variations
2. 3-year P&L statement with quarterly breakdown
3. Basic balance sheet projections (assets, liabilities, equity)
4. Key financial metrics (burn rate, runway, break-even point, ROI)
5. Financial risk analysis (top 3 risks)
6. Growth opportunities (top 3 opportunities)
7. Recommendations for financial optimization

Be realistic based on industry standards.`,
        response_json_schema: {
          type: "object",
          properties: {
            cash_flow_projections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: { type: "string" },
                  cash_in: { type: "number" },
                  cash_out: { type: "number" },
                  net_cash_flow: { type: "number" },
                  cumulative_cash: { type: "number" }
                }
              }
            },
            pl_statement: {
              type: "object",
              properties: {
                year_1: { type: "object" },
                year_2: { type: "object" },
                year_3: { type: "object" }
              }
            },
            balance_sheet: {
              type: "object",
              properties: {
                assets: { type: "object" },
                liabilities: { type: "object" },
                equity: { type: "object" }
              }
            },
            key_metrics: {
              type: "object",
              properties: {
                burn_rate: { type: "number" },
                runway_months: { type: "number" },
                break_even_month: { type: "number" },
                roi_3year: { type: "number" }
              }
            },
            risks: {
              type: "array",
              items: { type: "string" }
            },
            opportunities: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setFinancialData(prev => ({
        ...prev,
        ...response
      }));
      
      toast.success('AI-powered financial projections generated!');
    } catch (error) {
      toast.error('Failed to generate projections');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await onUpdate({ financial_data: financialData });
    setLoading(false);
    onNext();
  };

  const totalStartupCosts = Object.values(financialData.startup_costs).reduce((sum, val) => sum + val, 0);
  const totalFunding = Object.values(financialData.funding_requirements).reduce((sum, val) => sum + val, 0);
  const totalMonthlyExpenses = Object.values(financialData.monthly_expenses).reduce((sum, val) => sum + val, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <Card className="border-slate-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <DollarSign className="w-7 h-7" />
            Financial Planning
          </CardTitle>
          <p className="text-emerald-50 text-sm mt-2">
            Input your financial data to generate comprehensive financial statements
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="startup" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="startup">Startup Costs</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* Startup Costs */}
            <TabsContent value="startup" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Initial Inventory</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.initial_inventory}
                    onChange={(e) => updateStartupCosts('initial_inventory', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Equipment</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.equipment}
                    onChange={(e) => updateStartupCosts('equipment', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Legal Fees</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.legal_fees}
                    onChange={(e) => updateStartupCosts('legal_fees', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Marketing</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.marketing}
                    onChange={(e) => updateStartupCosts('marketing', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Technology</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.technology}
                    onChange={(e) => updateStartupCosts('technology', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Other</Label>
                  <Input
                    type="number"
                    value={financialData.startup_costs.other}
                    onChange={(e) => updateStartupCosts('other', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Startup Costs</p>
                <p className="text-3xl font-bold text-emerald-600">${totalStartupCosts.toLocaleString()}</p>
              </div>
            </TabsContent>

            {/* Funding Requirements */}
            <TabsContent value="funding" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Total Funding Needed</Label>
                  <Input
                    type="number"
                    value={financialData.funding_requirements.total_needed}
                    onChange={(e) => updateFundingRequirements('total_needed', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Equity Investment</Label>
                  <Input
                    type="number"
                    value={financialData.funding_requirements.equity_investment}
                    onChange={(e) => updateFundingRequirements('equity_investment', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Loans</Label>
                  <Input
                    type="number"
                    value={financialData.funding_requirements.loans}
                    onChange={(e) => updateFundingRequirements('loans', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Personal Funds</Label>
                  <Input
                    type="number"
                    value={financialData.funding_requirements.personal_funds}
                    onChange={(e) => updateFundingRequirements('personal_funds', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Grants</Label>
                  <Input
                    type="number"
                    value={financialData.funding_requirements.grants}
                    onChange={(e) => updateFundingRequirements('grants', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Funding Sources</p>
                <p className="text-3xl font-bold text-blue-600">${totalFunding.toLocaleString()}</p>
              </div>
            </TabsContent>

            {/* Revenue Forecast */}
            <TabsContent value="revenue" className="space-y-4">
              {financialData.revenue_forecast.map((yearData, index) => (
                <Card key={index} className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Year {yearData.year}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Revenue</Label>
                      <Input
                        type="number"
                        value={yearData.revenue}
                        onChange={(e) => updateRevenueForecast(index, 'revenue', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>COGS (Cost of Goods Sold)</Label>
                      <Input
                        type="number"
                        value={yearData.cogs}
                        onChange={(e) => updateRevenueForecast(index, 'cogs', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Gross Profit</Label>
                      <Input
                        type="number"
                        value={yearData.gross_profit}
                        readOnly
                        className="bg-slate-50"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Monthly Expenses */}
            <TabsContent value="expenses" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Rent</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.rent}
                    onChange={(e) => updateMonthlyExpenses('rent', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Salaries</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.salaries}
                    onChange={(e) => updateMonthlyExpenses('salaries', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Utilities</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.utilities}
                    onChange={(e) => updateMonthlyExpenses('utilities', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Marketing</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.marketing}
                    onChange={(e) => updateMonthlyExpenses('marketing', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Insurance</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.insurance}
                    onChange={(e) => updateMonthlyExpenses('insurance', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Software</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.software}
                    onChange={(e) => updateMonthlyExpenses('software', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Other</Label>
                  <Input
                    type="number"
                    value={financialData.monthly_expenses.other}
                    onChange={(e) => updateMonthlyExpenses('other', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Monthly Expenses</p>
                <p className="text-3xl font-bold text-purple-600">${totalMonthlyExpenses.toLocaleString()}</p>
              </div>
              <Button
                onClick={generateCashFlowProjections}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating AI Projections...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />AI Generate Projections</>
                )}
              </Button>
            </TabsContent>

            {/* AI Analysis */}
            <TabsContent value="analysis" className="space-y-6">
              {financialData.key_metrics ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Key Financial Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500 mb-1">Monthly Burn Rate</p>
                          <p className="text-2xl font-bold text-slate-800">${financialData.key_metrics.burn_rate?.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500 mb-1">Runway</p>
                          <p className="text-2xl font-bold text-slate-800">{financialData.key_metrics.runway_months} mo</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500 mb-1">Break-Even</p>
                          <p className="text-2xl font-bold text-slate-800">Month {financialData.key_metrics.break_even_month}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-500 mb-1">3-Year ROI</p>
                          <p className="text-2xl font-bold text-emerald-600">{financialData.key_metrics.roi_3year}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800">
                          <AlertTriangle className="w-5 h-5" />
                          Financial Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {financialData.risks?.map((risk, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                              <span className="text-red-500 mt-0.5">⚠</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-200 bg-emerald-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-800">
                          <Lightbulb className="w-5 h-5" />
                          Growth Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {financialData.opportunities?.map((opp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                              <span className="text-emerald-500 mt-0.5">✓</span>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {financialData.recommendations && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {financialData.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                              <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-slate-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {financialData.pl_statement && (
                    <Card>
                      <CardHeader>
                        <CardTitle>3-Year P&L Statement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">Item</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-700">Year 1</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-700">Year 2</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-700">Year 3</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(financialData.pl_statement.year_1 || {}).map(key => (
                                <tr key={key} className="border-t">
                                  <td className="px-4 py-3 text-slate-600 capitalize">{key.replace(/_/g, ' ')}</td>
                                  <td className="px-4 py-3 text-right font-medium">${financialData.pl_statement.year_1[key]?.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right font-medium">${financialData.pl_statement.year_2[key]?.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right font-medium">${financialData.pl_statement.year_3[key]?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">Generate AI-powered financial projections to see detailed analysis</p>
                    <Button onClick={generateCashFlowProjections} disabled={isGenerating}>
                      {isGenerating ? 'Generating...' : 'Generate Analysis'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button onClick={onPrev} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              {loading ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}