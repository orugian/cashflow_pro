import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportPreview = ({ reportData, isGenerating, onExport, onSchedule }) => {
  const [previewMode, setPreviewMode] = useState('table');

  // Mock report data structure
  const mockReportData = {
    title: 'Fluxo de Caixa Mensal - Agosto 2025',
    subtitle: 'Tech Solutions Ltda - CNPJ: 12.345.678/0001-90',
    generatedAt: '2025-08-13T19:52:49.480681',
    period: {
      start: '2025-08-01',
      end: '2025-08-31'
    },
    summary: {
      totalRevenue: 125000.00,
      totalExpenses: 87500.00,
      netCashFlow: 37500.00,
      transactionCount: 156
    },
    data: [
      {
        category: 'Receitas de Vendas',
        type: 'revenue',
        amount: 95000.00,
        percentage: 76.0,
        transactions: 45,
        change: 12.5
      },
      {
        category: 'Receitas de Serviços',
        type: 'revenue',
        amount: 30000.00,
        percentage: 24.0,
        transactions: 12,
        change: -5.2
      },
      {
        category: 'Despesas Operacionais',
        type: 'expense',
        amount: -45000.00,
        percentage: 51.4,
        transactions: 67,
        change: 8.3
      },
      {
        category: 'Despesas Administrativas',
        type: 'expense',
        amount: -25000.00,
        percentage: 28.6,
        transactions: 23,
        change: -2.1
      },
      {
        category: 'Impostos e Taxas',
        type: 'expense',
        amount: -17500.00,
        percentage: 20.0,
        transactions: 9,
        change: 15.7
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(Math.abs(amount));
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isGenerating) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground">Gerando Relatório</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Processando dados e formatando o relatório...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData && !mockReportData) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FileX" size={48} color="var(--color-muted-foreground)" />
        <h3 className="text-lg font-medium text-foreground mt-4">
          Nenhum Relatório Gerado
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Configure e gere um relatório para visualizar os dados aqui
        </p>
      </div>
    );
  }

  const data = reportData || mockReportData;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Visualização do Relatório
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Gerado em {formatDate(data?.generatedAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('table')}
                className={`
                  px-3 py-1 rounded text-sm transition-colors
                  ${previewMode === 'table' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="Table" size={16} className="mr-1" />
                Tabela
              </button>
              <button
                onClick={() => setPreviewMode('chart')}
                className={`
                  px-3 py-1 rounded text-sm transition-colors
                  ${previewMode === 'chart' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="BarChart3" size={16} className="mr-1" />
                Gráfico
              </button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              iconName="Calendar"
              iconPosition="left"
              onClick={onSchedule}
            >
              Agendar
            </Button>
            
            <Button
              variant="outline"
              iconName="Share"
              iconPosition="left"
              onClick={() => console.log('Share report')}
            >
              Compartilhar
            </Button>
            
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              onClick={onExport}
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
      {/* Report Content */}
      <div className="p-6">
        {/* Report Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">{data?.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{data?.subtitle}</p>
          <p className="text-sm text-muted-foreground">
            Período: {new Date(data.period.start)?.toLocaleDateString('pt-BR')} a {new Date(data.period.end)?.toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success font-medium">Total de Receitas</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(data?.summary?.totalRevenue)}
                </p>
              </div>
              <Icon name="TrendingUp" size={24} color="var(--color-success)" />
            </div>
          </div>

          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-error font-medium">Total de Despesas</p>
                <p className="text-2xl font-bold text-error">
                  {formatCurrency(data?.summary?.totalExpenses)}
                </p>
              </div>
              <Icon name="TrendingDown" size={24} color="var(--color-error)" />
            </div>
          </div>

          <div className={`
            ${data?.summary?.netCashFlow >= 0 
              ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
            } border rounded-lg p-4
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`
                  text-sm font-medium
                  ${data?.summary?.netCashFlow >= 0 ? 'text-success' : 'text-error'}
                `}>
                  Fluxo Líquido
                </p>
                <p className={`
                  text-2xl font-bold
                  ${data?.summary?.netCashFlow >= 0 ? 'text-success' : 'text-error'}
                `}>
                  {formatCurrency(data?.summary?.netCashFlow)}
                </p>
              </div>
              <Icon 
                name={data?.summary?.netCashFlow >= 0 ? "Plus" : "Minus"} 
                size={24} 
                color={data?.summary?.netCashFlow >= 0 ? 'var(--color-success)' : 'var(--color-error)'} 
              />
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary font-medium">Transações</p>
                <p className="text-2xl font-bold text-primary">
                  {data?.summary?.transactionCount}
                </p>
              </div>
              <Icon name="Receipt" size={24} color="var(--color-primary)" />
            </div>
          </div>
        </div>

        {/* Data Table/Chart */}
        {previewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    % do Total
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    Transações
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    Variação
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((item, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-3 h-3 rounded-full
                          ${item?.type === 'revenue' ? 'bg-success' : 'bg-error'}
                        `}></div>
                        <span className="text-sm text-foreground">{item?.category}</span>
                      </div>
                    </td>
                    <td className={`
                      px-4 py-3 text-right text-sm font-medium
                      ${item?.type === 'revenue' ? 'text-success' : 'text-error'}
                    `}>
                      {formatCurrency(item?.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                      {item?.percentage?.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                      {item?.transactions}
                    </td>
                    <td className={`
                      px-4 py-3 text-right text-sm font-medium
                      ${item?.change >= 0 ? 'text-success' : 'text-error'}
                    `}>
                      {formatPercentage(item?.change)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Icon name="BarChart3" size={48} color="var(--color-muted-foreground)" />
            <h4 className="text-lg font-medium text-foreground mt-4">
              Visualização em Gráfico
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              A visualização em gráfico será implementada com Recharts
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>CashFlow Pro - Relatório gerado automaticamente</span>
          <span>Página 1 de 1</span>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;