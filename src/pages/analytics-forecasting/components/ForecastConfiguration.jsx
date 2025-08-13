import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ForecastConfiguration = ({ onConfigChange }) => {
  const [config, setConfig] = useState({
    forecastMethod: 'hybrid',
    historicalPeriods: 12,
    seasonalAdjustment: true,
    holidayAdjustment: true,
    growthAssumptions: {
      revenue: 5.0,
      expenses: 3.5,
      inflation: 4.2
    },
    riskFactors: {
      marketVolatility: 15,
      competitionImpact: 10,
      economicUncertainty: 20
    },
    confidenceLevel: 80
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const forecastMethods = [
    { value: 'historical', label: 'Histórico', description: 'Baseado apenas em dados históricos' },
    { value: 'trend', label: 'Tendência', description: 'Análise de tendências lineares' },
    { value: 'seasonal', label: 'Sazonal', description: 'Considera padrões sazonais' },
    { value: 'hybrid', label: 'Híbrido', description: 'Combina múltiplas metodologias' }
  ];

  const confidenceLevels = [
    { value: 70, label: '70% - Conservador' },
    { value: 80, label: '80% - Moderado' },
    { value: 90, label: '90% - Confiante' },
    { value: 95, label: '95% - Muito Confiante' }
  ];

  const brazilianHolidays = [
    { name: 'Carnaval', impact: 'negative', description: 'Redução de atividade comercial' },
    { name: 'Páscoa', impact: 'positive', description: 'Aumento nas vendas de varejo' },
    { name: 'Festa Junina', impact: 'neutral', description: 'Impacto regional variável' },
    { name: 'Black Friday', impact: 'positive', description: 'Pico de vendas no varejo' },
    { name: 'Natal', impact: 'positive', description: 'Aumento significativo nas vendas' }
  ];

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleNestedConfigChange = (parent, key, value) => {
    const newConfig = {
      ...config,
      [parent]: {
        ...config?.[parent],
        [key]: parseFloat(value) || 0
      }
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const resetToDefaults = () => {
    const defaultConfig = {
      forecastMethod: 'hybrid',
      historicalPeriods: 12,
      seasonalAdjustment: true,
      holidayAdjustment: true,
      growthAssumptions: {
        revenue: 5.0,
        expenses: 3.5,
        inflation: 4.2
      },
      riskFactors: {
        marketVolatility: 15,
        competitionImpact: 10,
        economicUncertainty: 20
      },
      confidenceLevel: 80
    };
    setConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-base">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Configuração de Previsão</h2>
          <p className="text-sm text-muted-foreground">
            Ajuste os parâmetros para otimizar as projeções
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={resetToDefaults}
          >
            Restaurar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </Button>
        </div>
      </div>
      {/* Basic Configuration */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Método de Previsão"
            description="Metodologia para cálculo das projeções"
            options={forecastMethods}
            value={config?.forecastMethod}
            onChange={(value) => handleConfigChange('forecastMethod', value)}
          />

          <Input
            label="Períodos Históricos"
            description="Meses de histórico para análise"
            type="number"
            min="3"
            max="60"
            value={config?.historicalPeriods}
            onChange={(e) => handleConfigChange('historicalPeriods', parseInt(e?.target?.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Checkbox
              label="Ajuste Sazonal"
              description="Considera variações sazonais nos cálculos"
              checked={config?.seasonalAdjustment}
              onChange={(e) => handleConfigChange('seasonalAdjustment', e?.target?.checked)}
            />
          </div>

          <div className="space-y-3">
            <Checkbox
              label="Ajuste de Feriados"
              description="Considera impacto de feriados brasileiros"
              checked={config?.holidayAdjustment}
              onChange={(e) => handleConfigChange('holidayAdjustment', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Expanded Configuration */}
      {isExpanded && (
        <div className="space-y-6 pt-6 border-t border-border">
          {/* Growth Assumptions */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Premissas de Crescimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Crescimento de Receita (%)"
                description="Taxa anual esperada"
                type="number"
                step="0.1"
                min="-50"
                max="100"
                value={config?.growthAssumptions?.revenue}
                onChange={(e) => handleNestedConfigChange('growthAssumptions', 'revenue', e?.target?.value)}
              />

              <Input
                label="Crescimento de Despesas (%)"
                description="Taxa anual esperada"
                type="number"
                step="0.1"
                min="-50"
                max="100"
                value={config?.growthAssumptions?.expenses}
                onChange={(e) => handleNestedConfigChange('growthAssumptions', 'expenses', e?.target?.value)}
              />

              <Input
                label="Taxa de Inflação (%)"
                description="Impacto inflacionário"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={config?.growthAssumptions?.inflation}
                onChange={(e) => handleNestedConfigChange('growthAssumptions', 'inflation', e?.target?.value)}
              />
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Fatores de Risco</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Volatilidade de Mercado (%)"
                description="Incerteza do mercado"
                type="number"
                step="1"
                min="0"
                max="100"
                value={config?.riskFactors?.marketVolatility}
                onChange={(e) => handleNestedConfigChange('riskFactors', 'marketVolatility', e?.target?.value)}
              />

              <Input
                label="Impacto da Concorrência (%)"
                description="Pressão competitiva"
                type="number"
                step="1"
                min="0"
                max="100"
                value={config?.riskFactors?.competitionImpact}
                onChange={(e) => handleNestedConfigChange('riskFactors', 'competitionImpact', e?.target?.value)}
              />

              <Input
                label="Incerteza Econômica (%)"
                description="Instabilidade econômica"
                type="number"
                step="1"
                min="0"
                max="100"
                value={config?.riskFactors?.economicUncertainty}
                onChange={(e) => handleNestedConfigChange('riskFactors', 'economicUncertainty', e?.target?.value)}
              />
            </div>
          </div>

          {/* Holiday Impact Configuration */}
          {config?.holidayAdjustment && (
            <div>
              <h3 className="font-medium text-foreground mb-4">Impacto de Feriados Brasileiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brazilianHolidays?.map((holiday, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{holiday?.name}</span>
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${holiday?.impact === 'positive' ? 'bg-success/10 text-success' :
                          holiday?.impact === 'negative'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'}
                      `}>
                        {holiday?.impact === 'positive' ? 'Positivo' :
                         holiday?.impact === 'negative' ? 'Negativo' : 'Neutro'}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{holiday?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Level */}
          <div>
            <Select
              label="Nível de Confiança"
              description="Intervalo de confiança para as projeções"
              options={confidenceLevels}
              value={config?.confidenceLevel}
              onChange={(value) => handleConfigChange('confidenceLevel', value)}
            />
          </div>
        </div>
      )}
      {/* Configuration Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Método:</span>
            <span className="ml-2 font-medium text-foreground">
              {forecastMethods?.find(m => m?.value === config?.forecastMethod)?.label}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Histórico:</span>
            <span className="ml-2 font-medium text-foreground">
              {config?.historicalPeriods} meses
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Confiança:</span>
            <span className="ml-2 font-medium text-foreground">
              {config?.confidenceLevel}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Ajustes:</span>
            <span className="ml-2 font-medium text-foreground">
              {[config?.seasonalAdjustment && 'Sazonal', config?.holidayAdjustment && 'Feriados']?.filter(Boolean)?.join(', ') || 'Nenhum'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastConfiguration;