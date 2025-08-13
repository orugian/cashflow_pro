import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReportConfiguration = ({ selectedReport, onGenerate, isGenerating }) => {
  const [config, setConfig] = useState({
    dateRange: 'current-month',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    accounts: 'all',
    categories: 'all',
    comparisonPeriod: 'previous-month',
    format: 'pdf',
    includeAttachments: true,
    groupBy: 'category',
    showDetails: true
  });

  const dateRangeOptions = [
    { value: 'current-month', label: 'Mês Atual' },
    { value: 'last-month', label: 'Mês Anterior' },
    { value: 'current-quarter', label: 'Trimestre Atual' },
    { value: 'last-quarter', label: 'Trimestre Anterior' },
    { value: 'current-year', label: 'Ano Atual' },
    { value: 'last-year', label: 'Ano Anterior' },
    { value: 'custom', label: 'Período Personalizado' }
  ];

  const accountOptions = [
    { value: 'all', label: 'Todas as Contas' },
    { value: 'bb-checking', label: 'Banco do Brasil - Conta Corrente' },
    { value: 'itau-savings', label: 'Itaú - Poupança' },
    { value: 'cash', label: 'Dinheiro em Espécie' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'revenue', label: 'Apenas Receitas' },
    { value: 'expenses', label: 'Apenas Despesas' },
    { value: 'operational', label: 'Despesas Operacionais' },
    { value: 'administrative', label: 'Despesas Administrativas' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'xlsx', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' }
  ];

  const groupByOptions = [
    { value: 'category', label: 'Por Categoria' },
    { value: 'vendor', label: 'Por Fornecedor' },
    { value: 'account', label: 'Por Conta' },
    { value: 'cost-center', label: 'Por Centro de Custo' },
    { value: 'month', label: 'Por Mês' }
  ];

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    onGenerate({
      reportType: selectedReport,
      config: config,
      timestamp: new Date()?.toISOString()
    });
  };

  if (!selectedReport) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FileText" size={48} color="var(--color-muted-foreground)" />
        <h3 className="text-lg font-medium text-foreground mt-4">
          Selecione um Relatório
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Escolha um tipo de relatório na barra lateral para configurar e gerar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Configuração do Relatório
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure os parâmetros para gerar o relatório
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Save"
              iconPosition="left"
              onClick={() => console.log('Save template')}
            >
              Salvar Template
            </Button>
            <Button
              variant="default"
              iconName="FileText"
              iconPosition="left"
              loading={isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        </div>
      </div>
      {/* Configuration Form */}
      <div className="p-6 space-y-6">
        {/* Date Range Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Select
            label="Período"
            options={dateRangeOptions}
            value={config?.dateRange}
            onChange={(value) => handleConfigChange('dateRange', value)}
          />
          
          {config?.dateRange === 'custom' && (
            <>
              <Input
                label="Data Inicial"
                type="date"
                value={config?.startDate}
                onChange={(e) => handleConfigChange('startDate', e?.target?.value)}
              />
              <Input
                label="Data Final"
                type="date"
                value={config?.endDate}
                onChange={(e) => handleConfigChange('endDate', e?.target?.value)}
              />
            </>
          )}
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Select
            label="Contas"
            description="Selecione as contas para incluir no relatório"
            options={accountOptions}
            value={config?.accounts}
            onChange={(value) => handleConfigChange('accounts', value)}
          />
          
          <Select
            label="Categorias"
            description="Filtre por categorias específicas"
            options={categoryOptions}
            value={config?.categories}
            onChange={(value) => handleConfigChange('categories', value)}
          />
        </div>

        {/* Report Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Select
            label="Formato de Saída"
            options={formatOptions}
            value={config?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
          
          <Select
            label="Agrupar Por"
            options={groupByOptions}
            value={config?.groupBy}
            onChange={(value) => handleConfigChange('groupBy', value)}
          />
          
          <Select
            label="Período de Comparação"
            options={[
              { value: 'none', label: 'Sem Comparação' },
              { value: 'previous-month', label: 'Mês Anterior' },
              { value: 'previous-quarter', label: 'Trimestre Anterior' },
              { value: 'previous-year', label: 'Ano Anterior' }
            ]}
            value={config?.comparisonPeriod}
            onChange={(value) => handleConfigChange('comparisonPeriod', value)}
          />
        </div>

        {/* Advanced Options */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Opções Avançadas</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="includeAttachments"
                checked={config?.includeAttachments}
                onChange={(e) => handleConfigChange('includeAttachments', e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <label htmlFor="includeAttachments" className="text-sm text-foreground">
                Incluir anexos no relatório
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showDetails"
                checked={config?.showDetails}
                onChange={(e) => handleConfigChange('showDetails', e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <label htmlFor="showDetails" className="text-sm text-foreground">
                Mostrar detalhes das transações
              </label>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Configurações Rápidas</h4>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig({
                ...config,
                dateRange: 'current-month',
                accounts: 'all',
                categories: 'all',
                format: 'pdf'
              })}
            >
              Relatório Mensal Completo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig({
                ...config,
                dateRange: 'current-quarter',
                accounts: 'all',
                categories: 'expenses',
                format: 'xlsx'
              })}
            >
              Análise de Despesas Trimestral
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig({
                ...config,
                dateRange: 'current-year',
                accounts: 'all',
                categories: 'all',
                format: 'pdf',
                comparisonPeriod: 'previous-year'
              })}
            >
              Comparativo Anual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfiguration;