import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Sparkles, Loader2, AlertTriangle, Lightbulb, Target, BarChart3, PieChart, LineChart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FinancialPlanningStep({ project, onUpdate, onNext, onPrev }) {
  const [financialData, setFinancialData] = useState(project?.financial_data || {
    revenue_streams: [
      { name: '', type: 'product', year1_revenue: 0, growth_rate: 20, unit_price: 0, units_year1: 0 }
    ],
    cogs: {
      percentage_of_revenue: 30,
      fixed_costs: 0,
      variable_costs: 0
    },
    operating_expenses: {
      salaries: 0,
      rent: 0,
      utilities: 0,
      insurance: 0,
      software: 0,
      professional_services: 0,
      other: 0
    },
    marketing_budget: {
      year1: 0,
      percentage_of_revenue: 10,
      channels: []
    },
    funding_rounds: [],
    startup_costs: {
      initial_inventory: 0,
      equipment: 0,
      legal_fees: 0,
      marketing: 0,
      technology: 0,
      other: 0
    },
    key_assumptions: {
      customer_acquisition_cost: 0,
      customer_lifetime_value: 0,
      churn_rate: 5,
      average_sale_value: 0,
      sales_cycle_days: 30
    }
  });

  const [scenarioType, setScenarioType] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Revenue Streams Management
  const addRevenueStream = () => {
    setFinancialData(prev => ({
      ...prev,
      revenue_streams: [...prev.revenue_streams, {
        name: '',
        type: 'product',
        year1_revenue: 0,
        growth_rate: 20,
        unit_price: 0,
        units_year1: 0
      }]
    }));
  };

  const removeRevenueStream = (index) => {
    setFinancialData(prev => ({
      ...prev,
      revenue_streams: prev.revenue_streams.filter((_, i) => i !== index)
    }));
  };

  const updateRevenueStream = (index, field, value) => {
    const newStreams = [...financialData.revenue_streams];
    newStreams[index] = { ...newStreams[index], [field]: value };
    
    // Auto-calculate year1_revenue if unit_price and units_year1 are set
    if (field === 'unit_price' || field === 'units_year1') {
      const price = field === 'unit_price' ? parseFloat(value) || 0 : newStreams[index].unit_price;
      const units = field === 'units_year1' ? parseFloat(value) || 0 : newStreams[index].units_year1;
      newStreams[index].year1_revenue = price * units;
    }
    
    setFinancialData(prev => ({ ...prev, revenue_streams: newStreams }));
  };

  // Funding Rounds Management
  const addFundingRound = () => {
    setFinancialData(prev => ({
      ...prev,
      funding_rounds: [...(prev.funding_rounds || []), {
        round_name: '',
        amount: 0,
        date: '',
        valuation: 0,
        equity_given: 0
      }]
    }));
  };

  const removeFundingRound = (index) => {
    setFinancialData(prev => ({
      ...prev,
      funding_rounds: prev.funding_rounds.filter((_, i) => i !== index)
    }));
  };

  const updateFundingRound = (index, field, value) => {
    const newRounds = [...(financialData.funding_rounds || [])];
    newRounds[index] = { ...newRounds[index], [field]: value };
    setFinancialData(prev => ({ ...prev, funding_rounds: newRounds }));
  };

  // Generate AI Financial Projections
  const generateFinancialProjections = async () => {
    setIsGenerating(true);
    
    try {
      const totalRevenue = financialData.revenue_streams.reduce((sum, stream) => sum + (stream.year1_revenue || 0), 0);
      const totalOpex = Object.values(financialData.operating_expenses).reduce((sum, val) => sum + (val || 0), 0);
      const totalStartupCosts = Object.values(financialData.startup_costs).reduce((sum, val) => sum + (val || 0), 0);
      const totalFunding = financialData.funding_rounds?.reduce((sum, round) => sum + (round.amount || 0), 0) || 0;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a senior financial analyst creating comprehensive 5-year financial projections for an investor presentation.

BUSINESS CONTEXT:
Name: ${project.business_name}
Industry: ${project.industry}
Description: ${project.description}
Market: ${project.target_audience}

USER INPUT DATA:
Revenue Streams:
${financialData.revenue_streams.map(s => `  - ${s.name || 'Unnamed'} (${s.type}): Year 1 $${s.year1_revenue}, Growth ${s.growth_rate}%`).join('\n')}

Total Year 1 Revenue Target: $${totalRevenue}
COGS: ${financialData.cogs.percentage_of_revenue}% of revenue
Monthly Operating Expenses: $${totalOpex}
Marketing Budget: $${financialData.marketing_budget.year1} (${financialData.marketing_budget.percentage_of_revenue}% of revenue)
Total Startup Costs: $${totalStartupCosts}
Total Funding: $${totalFunding}

Key Assumptions:
- Customer Acquisition Cost: $${financialData.key_assumptions.customer_acquisition_cost}
- Customer Lifetime Value: $${financialData.key_assumptions.customer_lifetime_value}
- Churn Rate: ${financialData.key_assumptions.churn_rate}%
- Average Sale Value: $${financialData.key_assumptions.average_sale_value}
- Sales Cycle: ${financialData.key_assumptions.sales_cycle_days} days

SCENARIO TYPE: ${scenarioType.toUpperCase()}

Generate THREE complete scenario projections (Best-Case, Realistic, Worst-Case) with the following detail:

1. 5-YEAR INCOME STATEMENTS (for each scenario):
   Year 1-5 with line items:
   - Revenue (by stream if multiple)
   - Cost of Goods Sold
   - Gross Profit & Margin %
   - Operating Expenses (detailed breakdown)
   - EBITDA & Margin %
   - Depreciation & Amortization
   - Interest Expense
   - Pre-Tax Income
   - Taxes (estimate based on industry)
   - Net Income & Margin %

2. 5-YEAR CASH FLOW STATEMENTS (for each scenario):
   - Operating Cash Flow
   - Investing Cash Flow
   - Financing Cash Flow
   - Net Change in Cash
   - Beginning Cash Balance
   - Ending Cash Balance

3. YEAR 1 & 5 BALANCE SHEETS (for each scenario):
   Assets:
   - Current Assets (Cash, AR, Inventory)
   - Fixed Assets (PP&E)
   - Total Assets
   
   Liabilities:
   - Current Liabilities (AP, Short-term debt)
   - Long-term Debt
   - Total Liabilities
   
   Equity:
   - Paid-in Capital
   - Retained Earnings
   - Total Equity

4. BREAK-EVEN ANALYSIS:
   - Break-even revenue (monthly & annual)
   - Break-even units
   - Month when break-even is achieved
   - Safety margin %

5. KEY FINANCIAL RATIOS (5-year trend):
   - Gross Margin %
   - Operating Margin %
   - Net Margin %
   - Current Ratio
   - Quick Ratio
   - Debt-to-Equity Ratio
   - Return on Assets %
   - Return on Equity %
   - Burn Rate (monthly, first 24 months)
   - Runway (months)

6. MONTH-BY-MONTH CASH FLOW (First 24 months, realistic scenario):
   For each month include:
   - Cash Inflows (revenue + funding)
   - Cash Outflows (COGS + Opex + Capex)
   - Net Cash Flow
   - Cumulative Cash Balance
   - Burn Rate

7. UNIT ECONOMICS:
   - Cost per unit/customer
   - Gross profit per unit/customer
   - Payback period
   - LTV/CAC ratio

8. SCENARIO ASSUMPTIONS:
   Best Case: Higher growth rates, lower costs
   Realistic: Moderate growth, expected costs
   Worst Case: Lower growth, higher costs

Use industry-standard assumptions for ${project.industry}. Make projections detailed, realistic, and investor-ready.`,
        response_json_schema: {
          type: "object",
          properties: {
            scenarios: {
              type: "object",
              properties: {
                best_case: {
                  type: "object",
                  properties: {
                    income_statements: { type: "array" },
                    cash_flow_statements: { type: "array" },
                    balance_sheets: { type: "object" },
                    assumptions: { type: "string" }
                  }
                },
                realistic: {
                  type: "object",
                  properties: {
                    income_statements: { type: "array" },
                    cash_flow_statements: { type: "array" },
                    balance_sheets: { type: "object" },
                    assumptions: { type: "string" }
                  }
                },
                worst_case: {
                  type: "object",
                  properties: {
                    income_statements: { type: "array" },
                    cash_flow_statements: { type: "array" },
                    balance_sheets: { type: "object" },
                    assumptions: { type: "string" }
                  }
                }
              }
            },
            break_even_analysis: {
              type: "object",
              properties: {
                monthly_revenue: { type: "number" },
                annual_revenue: { type: "number" },
                units: { type: "number" },
                month_achieved: { type: "number" },
                safety_margin: { type: "number" }
              }
            },
            key_ratios: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  year: { type: "number" },
                  gross_margin: { type: "number" },
                  operating_margin: { type: "number" },
                  net_margin: { type: "number" },
                  current_ratio: { type: "number" },
                  quick_ratio: { type: "number" },
                  debt_to_equity: { type: "number" },
                  roa: { type: "number" },
                  roe: { type: "number" }
                }
              }
            },
            monthly_cash_flow: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: { type: "number" },
                  cash_in: { type: "number" },
                  cash_out: { type: "number" },
                  net_flow: { type: "number" },
                  balance: { type: "number" },
                  burn_rate: { type: "number" }
                }
              }
            },
            unit_economics: {
              type: "object",
              properties: {
                cost_per_unit: { type: "number" },
                gross_profit_per_unit: { type: "number" },
                payback_period_months: { type: "number" },
                ltv_cac_ratio: { type: "number" }
              }
            },
            summary: {
              type: "object",
              properties: {
                total_revenue_5y: { type: "number" },
                total_profit_5y: { type: "number" },
                peak_funding_need: { type: "number" },
                roi_5y: { type: "number" }
              }
            }
          }
        }
      });

      setFinancialData(prev => ({
        ...prev,
        projections: response
      }));

      toast.success('Comprehensive financial projections generated!');
    } catch (error) {
      toast.error('Failed to generate projections: ' + error.message);
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

  const totalRevenue = financialData.revenue_streams.reduce((sum, s) => sum + (s.year1_revenue || 0), 0);
  const totalOpex = Object.values(financialData.operating_expenses).reduce((sum, v) => sum + (v || 0), 0);
  const totalStartupCosts = Object.values(financialData.startup_costs).reduce((sum, v) => sum + (v || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto"
    >
      <Card className="border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <DollarSign className="w-7 h-7" />
            Advanced Financial Planning
          </CardTitle>
          <CardDescription className="text-emerald-50 mt-2">
            Input your financial data for AI-generated 5-year projections with scenario planning
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
              <TabsTrigger value="opex">Operating</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
            </TabsList>

            {/* Revenue Streams */}
            <TabsContent value="revenue" className="space-y-4">
              {financialData.revenue_streams.map((stream, index) => (
                <Card key={index} className="border-emerald-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Revenue Stream {index + 1}</CardTitle>
                      {financialData.revenue_streams.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeRevenueStream(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Stream Name</Label>
                      <Input
                        placeholder="e.g., Product Sales"
                        value={stream.name}
                        onChange={(e) => updateRevenueStream(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={stream.type}
                        onValueChange={(v) => updateRevenueStream(index, 'type', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="licensing">Licensing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Unit Price ($)</Label>
                      <Input
                        type="number"
                        value={stream.unit_price}
                        onChange={(e) => updateRevenueStream(index, 'unit_price', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Units Year 1</Label>
                      <Input
                        type="number"
                        value={stream.units_year1}
                        onChange={(e) => updateRevenueStream(index, 'units_year1', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Year 1 Revenue ($)</Label>
                      <Input
                        type="number"
                        value={stream.year1_revenue}
                        onChange={(e) => updateRevenueStream(index, 'year1_revenue', e.target.value)}
                        className="font-bold"
                      />
                    </div>
                    <div>
                      <Label>Annual Growth Rate (%)</Label>
                      <Input
                        type="number"
                        value={stream.growth_rate}
                        onChange={(e) => updateRevenueStream(index, 'growth_rate', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addRevenueStream} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Revenue Stream
              </Button>
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Year 1 Revenue Target</p>
                <p className="text-3xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
              </div>
            </TabsContent>

            {/* Costs & COGS */}
            <TabsContent value="costs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cost of Goods Sold (COGS)</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>COGS as % of Revenue</Label>
                    <Input
                      type="number"
                      value={financialData.cogs.percentage_of_revenue}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        cogs: { ...prev.cogs, percentage_of_revenue: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Fixed Costs ($/month)</Label>
                    <Input
                      type="number"
                      value={financialData.cogs.fixed_costs}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        cogs: { ...prev.cogs, fixed_costs: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Variable Costs ($/unit)</Label>
                    <Input
                      type="number"
                      value={financialData.cogs.variable_costs}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        cogs: { ...prev.cogs, variable_costs: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Startup Costs</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  {Object.keys(financialData.startup_costs).map(key => (
                    <div key={key}>
                      <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                      <Input
                        type="number"
                        value={financialData.startup_costs[key]}
                        onChange={(e) => setFinancialData(prev => ({
                          ...prev,
                          startup_costs: {
                            ...prev.startup_costs,
                            [key]: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Startup Investment Needed</p>
                <p className="text-3xl font-bold text-blue-600">${totalStartupCosts.toLocaleString()}</p>
              </div>
            </TabsContent>

            {/* Operating Expenses */}
            <TabsContent value="opex" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Operating Expenses</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  {Object.keys(financialData.operating_expenses).map(key => (
                    <div key={key}>
                      <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                      <Input
                        type="number"
                        value={financialData.operating_expenses[key]}
                        onChange={(e) => setFinancialData(prev => ({
                          ...prev,
                          operating_expenses: {
                            ...prev.operating_expenses,
                            [key]: parseFloat(e.target.value) || 0
                          }
                        }))}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">Total Monthly Operating Expenses</p>
                <p className="text-3xl font-bold text-purple-600">${totalOpex.toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">Annual: ${(totalOpex * 12).toLocaleString()}</p>
              </div>
            </TabsContent>

            {/* Marketing Budget */}
            <TabsContent value="marketing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Budget</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Year 1 Marketing Budget ($)</Label>
                    <Input
                      type="number"
                      value={financialData.marketing_budget.year1}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        marketing_budget: { ...prev.marketing_budget, year1: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>As % of Revenue (Years 2-5)</Label>
                    <Input
                      type="number"
                      value={financialData.marketing_budget.percentage_of_revenue}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        marketing_budget: { ...prev.marketing_budget, percentage_of_revenue: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Funding Rounds */}
            <TabsContent value="funding" className="space-y-4">
              {(financialData.funding_rounds || []).map((round, index) => (
                <Card key={index} className="border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Funding Round {index + 1}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFundingRound(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Round Name</Label>
                      <Input
                        placeholder="e.g., Seed, Series A"
                        value={round.round_name}
                        onChange={(e) => updateFundingRound(index, 'round_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Amount ($)</Label>
                      <Input
                        type="number"
                        value={round.amount}
                        onChange={(e) => updateFundingRound(index, 'amount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={round.date}
                        onChange={(e) => updateFundingRound(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Valuation ($)</Label>
                      <Input
                        type="number"
                        value={round.valuation}
                        onChange={(e) => updateFundingRound(index, 'valuation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Equity Given (%)</Label>
                      <Input
                        type="number"
                        value={round.equity_given}
                        onChange={(e) => updateFundingRound(index, 'equity_given', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addFundingRound} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Funding Round
              </Button>
            </TabsContent>

            {/* Key Assumptions */}
            <TabsContent value="assumptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Economics & Key Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Acquisition Cost (CAC) ($)</Label>
                    <Input
                      type="number"
                      value={financialData.key_assumptions.customer_acquisition_cost}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        key_assumptions: { ...prev.key_assumptions, customer_acquisition_cost: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Customer Lifetime Value (LTV) ($)</Label>
                    <Input
                      type="number"
                      value={financialData.key_assumptions.customer_lifetime_value}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        key_assumptions: { ...prev.key_assumptions, customer_lifetime_value: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Churn Rate (%)</Label>
                    <Input
                      type="number"
                      value={financialData.key_assumptions.churn_rate}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        key_assumptions: { ...prev.key_assumptions, churn_rate: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Average Sale Value ($)</Label>
                    <Input
                      type="number"
                      value={financialData.key_assumptions.average_sale_value}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        key_assumptions: { ...prev.key_assumptions, average_sale_value: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Sales Cycle (days)</Label>
                    <Input
                      type="number"
                      value={financialData.key_assumptions.sales_cycle_days}
                      onChange={(e) => setFinancialData(prev => ({
                        ...prev,
                        key_assumptions: { ...prev.key_assumptions, sales_cycle_days: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Projections */}
            <TabsContent value="projections" className="space-y-6">
              {!financialData.projections ? (
                <Card>
                  <CardContent className="p-12 text-center space-y-6">
                    <div className="flex justify-center gap-4 mb-6">
                      <BarChart3 className="w-16 h-16 text-emerald-400" />
                      <LineChart className="w-16 h-16 text-blue-400" />
                      <PieChart className="w-16 h-16 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Generate Projections</h3>
                      <p className="text-slate-500 mb-4">AI will create comprehensive 5-year financial statements with scenario planning</p>
                    </div>
                    <div className="space-y-3">
                      <Label>Scenario Type</Label>
                      <Select value={scenarioType} onValueChange={setScenarioType}>
                        <SelectTrigger className="w-64 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="best_case">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              Best Case
                            </div>
                          </SelectItem>
                          <SelectItem value="realistic">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-600" />
                              Realistic
                            </div>
                          </SelectItem>
                          <SelectItem value="worst_case">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              Worst Case
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={generateFinancialProjections}
                      disabled={isGenerating || totalRevenue === 0}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" />Generate 5-Year Projections</>
                      )}
                    </Button>
                    {totalRevenue === 0 && (
                      <p className="text-sm text-amber-600">Please add revenue streams first</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">5-Year Revenue</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          ${financialData.projections.summary?.total_revenue_5y?.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">5-Year Profit</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${financialData.projections.summary?.total_profit_5y?.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">Break-Even Month</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {financialData.projections.break_even_analysis?.month_achieved}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-slate-500 mb-1">5-Year ROI</p>
                        <p className="text-2xl font-bold text-teal-600">
                          {financialData.projections.summary?.roi_5y}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Financial Statements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>5-Year Income Statements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['realistic', 'best_case', 'worst_case'].map(scenario => (
                          <div key={scenario}>
                            <h4 className="font-semibold mb-2 capitalize">{scenario.replace('_', ' ')}</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left">Year</th>
                                    <th className="px-4 py-2 text-right">Revenue</th>
                                    <th className="px-4 py-2 text-right">COGS</th>
                                    <th className="px-4 py-2 text-right">Gross Profit</th>
                                    <th className="px-4 py-2 text-right">Net Income</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {financialData.projections.scenarios?.[scenario]?.income_statements?.map((year, i) => (
                                    <tr key={i} className="border-t">
                                      <td className="px-4 py-2">{year.year || i + 1}</td>
                                      <td className="px-4 py-2 text-right">${year.revenue?.toLocaleString()}</td>
                                      <td className="px-4 py-2 text-right">${year.cogs?.toLocaleString()}</td>
                                      <td className="px-4 py-2 text-right">${year.gross_profit?.toLocaleString()}</td>
                                      <td className="px-4 py-2 text-right font-bold">${year.net_income?.toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Ratios */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Financial Ratios (5-Year Trend)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Year</th>
                              <th className="px-4 py-2 text-right">Gross Margin</th>
                              <th className="px-4 py-2 text-right">Operating Margin</th>
                              <th className="px-4 py-2 text-right">Net Margin</th>
                              <th className="px-4 py-2 text-right">ROA</th>
                              <th className="px-4 py-2 text-right">ROE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialData.projections.key_ratios?.map((ratio, i) => (
                              <tr key={i} className="border-t">
                                <td className="px-4 py-2">{ratio.year}</td>
                                <td className="px-4 py-2 text-right">{ratio.gross_margin}%</td>
                                <td className="px-4 py-2 text-right">{ratio.operating_margin}%</td>
                                <td className="px-4 py-2 text-right">{ratio.net_margin}%</td>
                                <td className="px-4 py-2 text-right">{ratio.roa}%</td>
                                <td className="px-4 py-2 text-right">{ratio.roe}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={generateFinancialProjections} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate Projections
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button onClick={onPrev} variant="outline">
              Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}