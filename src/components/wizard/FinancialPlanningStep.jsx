import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';

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

  const generateCashFlowProjections = () => {
    const projections = [];
    const monthlyRevenue = financialData.revenue_forecast[0]?.revenue / 12 || 0;
    const totalMonthlyExpenses = Object.values(financialData.monthly_expenses).reduce((sum, val) => sum + val, 0);
    let cumulativeCash = financialData.funding_requirements.total_needed || 0;

    for (let i = 1; i <= 12; i++) {
      const cashIn = monthlyRevenue;
      const cashOut = totalMonthlyExpenses;
      const netCashFlow = cashIn - cashOut;
      cumulativeCash += netCashFlow;

      projections.push({
        month: `Month ${i}`,
        cash_in: cashIn,
        cash_out: cashOut,
        net_cash_flow: netCashFlow,
        cumulative_cash: cumulativeCash
      });
    }

    setFinancialData(prev => ({
      ...prev,
      cash_flow_projections: projections
    }));
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
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="startup">Startup Costs</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Forecast</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Generate 12-Month Cash Flow Projection
              </Button>
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