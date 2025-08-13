import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ForecastChart = ({ scenarioData, selectedCompany }) => {
  const [timeRange, setTimeRange] = useState('12months');
  const [chartType, setChartType] = useState('line');
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);

  // Mock forecast data based on scenario
  const generateForecastData = useMemo(() => {
    const baseData = [];
    const currentDate = new Date();
    const multipliers = scenarioData?.multipliers || { revenue: 1.0, expenses: 1.0 };
    const assumptions = scenarioData?.assumptions || { growthRate: 5, seasonalityFactor: 10 };
    
    const periods = {
      '6months': 6,
      '12months': 12,
      '24months': 24,
      '5years': 60,
      '10years': 120
    };

    const monthsToGenerate = periods?.[timeRange] || 12;
    
    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(currentDate);
      date?.setMonth(date?.getMonth() + i);
      
      // Base values with growth
      const monthlyGrowth = Math.pow(1 + assumptions?.growthRate / 100, i / 12);
      const seasonality = 1 + (Math.sin((i % 12) * Math.PI / 6) * assumptions?.seasonalityFactor / 100);
      
      const baseRevenue = 450000 * monthlyGrowth * seasonality * multipliers?.revenue;
      const baseExpenses = 320000 * monthlyGrowth * multipliers?.expenses;
      const netCashFlow = baseRevenue - baseExpenses;
      
      // Confidence intervals
      const confidenceRange = netCashFlow * 0.15;
      
      baseData?.push({
        month: date?.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        fullDate: date?.toLocaleDateString('pt-BR'),
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow: i === 0 ? Math.round(netCashFlow) : 
          Math.round((baseData?.[i-1]?.cumulativeCashFlow || 0) + netCashFlow),
        upperBound: Math.round(netCashFlow + confidenceRange),
        lowerBound: Math.round(netCashFlow - confidenceRange),
        actualData: i < 3 // First 3 months are "actual" data
      });
    }
    
    return baseData;
  }, [scenarioData, timeRange]);

  const timeRangeOptions = [
    { value: '6months', label: '6 Meses' },
    { value: '12months', label: '12 Meses' },
    { value: '24months', label: '24 Meses' },
    { value: '5years', label: '5 Anos' },
    { value: '10years', label: '10 Anos' }
  ];

  const chartTypeOptions = [
    { value: 'line', label: 'Linha' },
    { value: 'area', label: 'Área' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-pronounced">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={generateForecastData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--color-text-secondary)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {showConfidenceInterval && (
            <>
              <Area
                type="monotone"
                dataKey="upperBound"
                stackId="confidence"
                stroke="none"
                fill="var(--color-primary)"
                fillOpacity={0.1}
                name="Limite Superior"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stackId="confidence"
                stroke="none"
                fill="var(--color-background)"
                fillOpacity={1}
                name="Limite Inferior"
              />
            </>
          )}
          
          <Area
            type="monotone"
            dataKey="netCashFlow"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.3}
            strokeWidth={2}
            name="Fluxo de Caixa Líquido"
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={generateForecastData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--color-text-secondary)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-text-secondary)"
          fontSize={12}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-success)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
          name="Receita"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="var(--color-error)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
          name="Despesas"
        />
        <Line
          type="monotone"
          dataKey="netCashFlow"
          stroke="var(--color-primary)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 5 }}
          name="Fluxo de Caixa Líquido"
        />
        
        {showConfidenceInterval && (
          <>
            <Line
              type="monotone"
              dataKey="upperBound"
              stroke="var(--color-primary)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Limite Superior"
            />
            <Line
              type="monotone"
              dataKey="lowerBound"
              stroke="var(--color-primary)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Limite Inferior"
            />
          </>
        )}
      </LineChart>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Projeção de Fluxo de Caixa</h2>
          <p className="text-sm text-muted-foreground">
            Cenário: <span className="font-medium">{scenarioData?.scenario || 'Base'}</span>
            {selectedCompany && (
              <span className="ml-2">• {selectedCompany}</span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-32"
          />
          
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="w-28"
          />
          
          <Button
            variant={showConfidenceInterval ? "default" : "outline"}
            size="sm"
            iconName="TrendingUp"
            onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
          >
            Intervalo
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
          >
            Exportar
          </Button>
        </div>
      </div>
      {/* Chart */}
      <div className="w-full h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        {generateForecastData?.length > 0 && (
          <>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {formatCurrency(generateForecastData?.[generateForecastData?.length - 1]?.revenue || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Receita Final</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-error">
                {formatCurrency(generateForecastData?.[generateForecastData?.length - 1]?.expenses || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Despesas Finais</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                (generateForecastData?.[generateForecastData?.length - 1]?.netCashFlow || 0) >= 0 
                  ? 'text-success' : 'text-error'
              }`}>
                {formatCurrency(generateForecastData?.[generateForecastData?.length - 1]?.netCashFlow || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Fluxo Líquido</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                (generateForecastData?.[generateForecastData?.length - 1]?.cumulativeCashFlow || 0) >= 0 
                  ? 'text-success' : 'text-error'
              }`}>
                {formatCurrency(generateForecastData?.[generateForecastData?.length - 1]?.cumulativeCashFlow || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Acumulado</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForecastChart;