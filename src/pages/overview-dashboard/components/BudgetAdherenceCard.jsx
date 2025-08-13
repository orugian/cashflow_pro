import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetAdherenceCard = ({ onClick }) => {
  const budgetData = [
    {
      id: '1',
      category: 'Marketing Digital',
      budgeted: 20000,
      actual: 15420.50,
      percentage: 77.1,
      status: 'good',
      remaining: 4579.50,
      trend: 'stable'
    },
    {
      id: '2',
      category: 'Fornecedores',
      budgeted: 15000,
      actual: 12850.00,
      percentage: 85.7,
      status: 'warning',
      remaining: 2150.00,
      trend: 'increasing'
    },
    {
      id: '3',
      category: 'Salários',
      budgeted: 12000,
      actual: 11200.00,
      percentage: 93.3,
      status: 'critical',
      remaining: 800.00,
      trend: 'stable'
    },
    {
      id: '4',
      category: 'Infraestrutura TI',
      budgeted: 10000,
      actual: 8950.75,
      percentage: 89.5,
      status: 'warning',
      remaining: 1049.25,
      trend: 'increasing'
    },
    {
      id: '5',
      category: 'Administrativo',
      budgeted: 8000,
      actual: 5680.25,
      percentage: 71.0,
      status: 'good',
      remaining: 2319.75,
      trend: 'decreasing'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'critical':
        return 'bg-error';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'good':
        return 'Dentro do orçamento';
      case 'warning':
        return 'Atenção necessária';
      case 'critical':
        return 'Limite crítico';
      default:
        return 'Indefinido';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'TrendingUp';
      case 'decreasing':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'text-error';
      case 'decreasing':
        return 'text-success';
      case 'stable':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const totalBudgeted = budgetData?.reduce((sum, item) => sum + item?.budgeted, 0);
  const totalActual = budgetData?.reduce((sum, item) => sum + item?.actual, 0);
  const overallPercentage = (totalActual / totalBudgeted) * 100;

  return (
    <div 
      className={`
        bg-card border border-border rounded-lg p-6 shadow-base
        transition-all duration-200 ease-smooth hover-elevation
        ${onClick ? 'cursor-pointer hover:border-primary/20' : ''}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Aderência ao Orçamento
          </h2>
          <p className="text-sm text-muted-foreground">
            Comparativo mensal por categoria
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} color="var(--color-primary)" />
        </div>
      </div>
      {/* Overall Summary */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Resumo Geral
          </span>
          <span className={`text-sm font-semibold ${overallPercentage > 90 ? 'text-error' : overallPercentage > 75 ? 'text-warning' : 'text-success'}`}>
            {overallPercentage?.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              overallPercentage > 90 ? 'bg-error' : 
              overallPercentage > 75 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Gasto: {formatCurrency(totalActual)}</span>
          <span>Orçado: {formatCurrency(totalBudgeted)}</span>
        </div>
      </div>
      {/* Budget Categories */}
      <div className="space-y-4">
        {budgetData?.map((item) => (
          <div key={item?.id} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sm text-foreground">
                  {item?.category}
                </h3>
                <div className={`flex items-center space-x-1 ${getTrendColor(item?.trend)}`}>
                  <Icon 
                    name={getTrendIcon(item?.trend)} 
                    size={12} 
                    color="currentColor" 
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-foreground">
                  {item?.percentage?.toFixed(1)}%
                </span>
                <div className={`w-2 h-2 rounded-full ${getStatusBgColor(item?.status)}`}></div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStatusBgColor(item?.status)}`}
                style={{ width: `${Math.min(item?.percentage, 100)}%` }}
              ></div>
            </div>

            {/* Category Details */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  Gasto: {formatCurrency(item?.actual)}
                </span>
                <span className="text-muted-foreground">
                  Restante: {formatCurrency(item?.remaining)}
                </span>
              </div>
              <span className={`font-medium ${getStatusColor(item?.status)}`}>
                {getStatusLabel(item?.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Dentro do limite</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Atenção</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span>Crítico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAdherenceCard;