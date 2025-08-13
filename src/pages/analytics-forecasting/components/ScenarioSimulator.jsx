import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ScenarioSimulator = ({ onScenarioChange }) => {
  const [activeScenario, setActiveScenario] = useState('base');
  const [customMultipliers, setCustomMultipliers] = useState({
    optimistic: { revenue: 1.2, expenses: 0.9 },
    base: { revenue: 1.0, expenses: 1.0 },
    pessimistic: { revenue: 0.8, expenses: 1.1 }
  });
  const [assumptions, setAssumptions] = useState({
    growthRate: 5,
    seasonalityFactor: 10,
    inflationRate: 4.5,
    marketExpansion: 15
  });

  const scenarios = [
    {
      id: 'optimistic',
      name: 'Otimista',
      description: 'Crescimento acelerado com expansão de mercado',
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'TrendingUp'
    },
    {
      id: 'base',
      name: 'Base',
      description: 'Cenário conservador baseado em dados históricos',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: 'Target'
    },
    {
      id: 'pessimistic',
      name: 'Pessimista',
      description: 'Cenário de crise com redução de demanda',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'TrendingDown'
    }
  ];

  const assumptionFields = [
    {
      key: 'growthRate',
      label: 'Taxa de Crescimento Anual (%)',
      description: 'Crescimento esperado da receita por ano',
      min: -50,
      max: 100,
      step: 0.5
    },
    {
      key: 'seasonalityFactor',
      label: 'Fator de Sazonalidade (%)',
      description: 'Variação sazonal nas vendas',
      min: 0,
      max: 50,
      step: 1
    },
    {
      key: 'inflationRate',
      label: 'Taxa de Inflação (%)',
      description: 'Impacto da inflação nos custos',
      min: 0,
      max: 20,
      step: 0.1
    },
    {
      key: 'marketExpansion',
      label: 'Expansão de Mercado (%)',
      description: 'Crescimento do mercado total',
      min: -20,
      max: 50,
      step: 1
    }
  ];

  const handleScenarioSelect = (scenarioId) => {
    setActiveScenario(scenarioId);
    onScenarioChange({
      scenario: scenarioId,
      multipliers: customMultipliers?.[scenarioId],
      assumptions
    });
  };

  const handleMultiplierChange = (scenario, type, value) => {
    const newMultipliers = {
      ...customMultipliers,
      [scenario]: {
        ...customMultipliers?.[scenario],
        [type]: parseFloat(value) || 1.0
      }
    };
    setCustomMultipliers(newMultipliers);
    
    if (scenario === activeScenario) {
      onScenarioChange({
        scenario: activeScenario,
        multipliers: newMultipliers?.[scenario],
        assumptions
      });
    }
  };

  const handleAssumptionChange = (key, value) => {
    const newAssumptions = {
      ...assumptions,
      [key]: parseFloat(value) || 0
    };
    setAssumptions(newAssumptions);
    
    onScenarioChange({
      scenario: activeScenario,
      multipliers: customMultipliers?.[activeScenario],
      assumptions: newAssumptions
    });
  };

  const resetToDefaults = () => {
    const defaultMultipliers = {
      optimistic: { revenue: 1.2, expenses: 0.9 },
      base: { revenue: 1.0, expenses: 1.0 },
      pessimistic: { revenue: 0.8, expenses: 1.1 }
    };
    const defaultAssumptions = {
      growthRate: 5,
      seasonalityFactor: 10,
      inflationRate: 4.5,
      marketExpansion: 15
    };
    
    setCustomMultipliers(defaultMultipliers);
    setAssumptions(defaultAssumptions);
    
    onScenarioChange({
      scenario: activeScenario,
      multipliers: defaultMultipliers?.[activeScenario],
      assumptions: defaultAssumptions
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-base">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Simulador de Cenários</h2>
          <p className="text-sm text-muted-foreground">
            Configure diferentes cenários para projeções financeiras
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          onClick={resetToDefaults}
        >
          Restaurar Padrões
        </Button>
      </div>
      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scenarios?.map((scenario) => (
          <button
            key={scenario?.id}
            onClick={() => handleScenarioSelect(scenario?.id)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              hover:shadow-medium hover-elevation
              ${activeScenario === scenario?.id
                ? `border-primary ${scenario?.bgColor} shadow-medium`
                : 'border-border bg-card hover:border-primary/30'
              }
            `}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${activeScenario === scenario?.id ? scenario?.bgColor : 'bg-muted'}
              `}>
                <Icon
                  name={scenario?.icon}
                  size={20}
                  color={activeScenario === scenario?.id ? `var(--color-${scenario?.color?.split('-')?.[1]})` : 'var(--color-text-secondary)'}
                />
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${activeScenario === scenario?.id ? scenario?.color : 'text-foreground'}`}>
                  {scenario?.name}
                </h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              {scenario?.description}
            </p>
          </button>
        ))}
      </div>
      {/* Multipliers Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Multiplicadores do Cenário</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Multiplicador de Receita
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="3.0"
                  value={customMultipliers?.[activeScenario]?.revenue || 1.0}
                  onChange={(e) => handleMultiplierChange(activeScenario, 'revenue', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {((customMultipliers?.[activeScenario]?.revenue || 1.0) * 100 - 100)?.toFixed(0)}%
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Multiplicador de Despesas
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="3.0"
                  value={customMultipliers?.[activeScenario]?.expenses || 1.0}
                  onChange={(e) => handleMultiplierChange(activeScenario, 'expenses', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {((customMultipliers?.[activeScenario]?.expenses || 1.0) * 100 - 100)?.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Premissas de Negócio</h3>
          
          <div className="space-y-3">
            {assumptionFields?.map((field) => (
              <div key={field?.key}>
                <Input
                  label={field?.label}
                  description={field?.description}
                  type="number"
                  step={field?.step}
                  min={field?.min}
                  max={field?.max}
                  value={assumptions?.[field?.key]}
                  onChange={(e) => handleAssumptionChange(field?.key, e?.target?.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Impact Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Resumo do Impacto</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Receita:</span>
            <span className={`ml-2 font-medium ${
              customMultipliers?.[activeScenario]?.revenue > 1 ? 'text-success' : 
              customMultipliers?.[activeScenario]?.revenue < 1 ? 'text-error' : 'text-foreground'
            }`}>
              {((customMultipliers?.[activeScenario]?.revenue || 1.0) * 100 - 100)?.toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Despesas:</span>
            <span className={`ml-2 font-medium ${
              customMultipliers?.[activeScenario]?.expenses > 1 ? 'text-error' : 
              customMultipliers?.[activeScenario]?.expenses < 1 ? 'text-success' : 'text-foreground'
            }`}>
              {((customMultipliers?.[activeScenario]?.expenses || 1.0) * 100 - 100)?.toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Crescimento:</span>
            <span className="ml-2 font-medium text-foreground">
              {assumptions?.growthRate}% a.a.
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Inflação:</span>
            <span className="ml-2 font-medium text-foreground">
              {assumptions?.inflationRate}% a.a.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;