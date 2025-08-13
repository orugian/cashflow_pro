import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';



const ProjectedBalanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [selectedScenario, setSelectedScenario] = useState('base');

  const periodOptions = [
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '12 meses' },
    { value: '24m', label: '24 meses' },
    { value: '5y', label: '5 anos' },
    { value: '10y', label: '10 anos' }
  ];

  const scenarioOptions = [
    { value: 'pessimistic', label: 'Pessimista', color: '#DC2626' },
    { value: 'base', label: 'Base', color: '#1E3A8A' },
    { value: 'optimistic', label: 'Otimista', color: '#059669' }
  ];

  // Mock data for different periods
  const generateChartData = (period, scenario) => {
    const baseData = {
      'ytd': [
        { month: 'Jan', actual: 45000, projected: null },
        { month: 'Fev', actual: 52000, projected: null },
        { month: 'Mar', actual: 48000, projected: null },
        { month: 'Abr', actual: 61000, projected: null },
        { month: 'Mai', actual: 55000, projected: null },
        { month: 'Jun', actual: 67000, projected: null },
        { month: 'Jul', actual: 72000, projected: null },
        { month: 'Ago', actual: 68000, projected: 70000 },
        { month: 'Set', actual: null, projected: 75000 },
        { month: 'Out', actual: null, projected: 78000 },
        { month: 'Nov', actual: null, projected: 82000 },
        { month: 'Dez', actual: null, projected: 85000 }
      ],
      '12m': [
        { month: 'Ago/24', actual: 45000, projected: null },
        { month: 'Set/24', actual: 52000, projected: null },
        { month: 'Out/24', actual: 48000, projected: null },
        { month: 'Nov/24', actual: 61000, projected: null },
        { month: 'Dez/24', actual: 55000, projected: null },
        { month: 'Jan/25', actual: 67000, projected: null },
        { month: 'Fev/25', actual: 72000, projected: null },
        { month: 'Mar/25', actual: 68000, projected: null },
        { month: 'Abr/25', actual: 75000, projected: null },
        { month: 'Mai/25', actual: 78000, projected: null },
        { month: 'Jun/25', actual: 82000, projected: null },
        { month: 'Jul/25', actual: 85000, projected: null },
        { month: 'Ago/25', actual: null, projected: 88000 }
      ]
    };

    const multipliers = {
      pessimistic: 0.85,
      base: 1.0,
      optimistic: 1.15
    };

    const data = baseData?.[period] || baseData?.['12m'];
    const multiplier = multipliers?.[scenario];

    return data?.map(item => ({
      ...item,
      projected: item?.projected ? Math.round(item?.projected * multiplier) : null
    }));
  };

  const chartData = generateChartData(selectedPeriod, selectedScenario);
  const currentScenario = scenarioOptions?.find(s => s?.value === selectedScenario);

  const formatCurrency = (value) => {
    if (!value) return '';
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
          <p className="font-medium text-sm text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-sm text-muted-foreground capitalize">
                {entry?.dataKey === 'actual' ? 'Real' : 'Projetado'}:
              </span>
              <span className="text-sm font-medium text-popover-foreground">
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Saldo Projetado
          </h2>
          <p className="text-sm text-muted-foreground">
            Evolução do saldo consolidado - Cenário {currentScenario?.label}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Period Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {periodOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedPeriod(option?.value)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                  ${selectedPeriod === option?.value
                    ? 'bg-primary text-primary-foreground shadow-base'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }
                `}
              >
                {option?.label}
              </button>
            ))}
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {scenarioOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setSelectedScenario(option?.value)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                  ${selectedScenario === option?.value
                    ? 'bg-card text-foreground shadow-base border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: option?.color }}
                  ></div>
                  <span>{option?.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="w-full h-80" aria-label="Gráfico de Saldo Projetado">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentScenario?.color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={currentScenario?.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Actual Balance Area */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#1E3A8A"
              strokeWidth={3}
              fill="url(#actualGradient)"
              connectNulls={false}
            />
            
            {/* Projected Balance Area */}
            <Area
              type="monotone"
              dataKey="projected"
              stroke={currentScenario?.color}
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#projectedGradient)"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-muted-foreground">Saldo Real</span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full border-2 border-dashed"
            style={{ borderColor: currentScenario?.color }}
          ></div>
          <span className="text-sm text-muted-foreground">
            Projeção {currentScenario?.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectedBalanceChart;