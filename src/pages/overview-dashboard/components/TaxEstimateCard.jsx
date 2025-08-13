import React from 'react';
import Icon from '../../../components/AppIcon';

const TaxEstimateCard = ({ onClick }) => {
  const taxData = {
    regime: 'Simples Nacional - Anexo IV',
    currentMonth: {
      revenue: 85420.50,
      taxRate: 4.5,
      estimatedTax: 3844.23,
      dueDate: '2025-09-20',
      status: 'pending'
    },
    nextMonth: {
      projectedRevenue: 92000.00,
      taxRate: 4.5,
      projectedTax: 4140.00,
      dueDate: '2025-10-20'
    },
    yearToDate: {
      totalRevenue: 654320.75,
      totalTax: 29444.43,
      averageRate: 4.5,
      paidTax: 25600.20,
      pendingTax: 3844.23
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(taxData?.currentMonth?.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue <= 5 && daysUntilDue >= 0;

  const getStatusColor = () => {
    if (isOverdue) return 'text-error';
    if (isUrgent) return 'text-warning';
    return 'text-success';
  };

  const getStatusBgColor = () => {
    if (isOverdue) return 'bg-error/10 border-error/20';
    if (isUrgent) return 'bg-warning/10 border-warning/20';
    return 'bg-success/10 border-success/20';
  };

  const getStatusLabel = () => {
    if (isOverdue) return 'Em atraso';
    if (isUrgent) return 'Vence em breve';
    return 'Em dia';
  };

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
            Estimativa de Impostos
          </h2>
          <p className="text-sm text-muted-foreground">
            {taxData?.regime}
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Calculator" size={20} color="var(--color-primary)" />
        </div>
      </div>
      {/* Current Month Tax */}
      <div className={`border rounded-lg p-4 mb-4 ${getStatusBgColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-sm text-foreground">
              Imposto Agosto/2025
            </h3>
            <p className="text-xs text-muted-foreground">
              Vencimento: {formatDate(taxData?.currentMonth?.dueDate)}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOverdue ? 'bg-error text-error-foreground' :
            isUrgent ? 'bg-warning text-warning-foreground': 'bg-success text-success-foreground'
          }`}>
            {getStatusLabel()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Receita Bruta</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(taxData?.currentMonth?.revenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Imposto ({taxData?.currentMonth?.taxRate}%)
            </p>
            <p className={`text-sm font-semibold ${getStatusColor()}`}>
              {formatCurrency(taxData?.currentMonth?.estimatedTax)}
            </p>
          </div>
        </div>

        {(isOverdue || isUrgent) && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              <Icon 
                name={isOverdue ? "AlertCircle" : "Clock"} 
                size={14} 
                color="currentColor" 
              />
              <span className="text-xs font-medium">
                {isOverdue 
                  ? `Venceu há ${Math.abs(daysUntilDue)} dias`
                  : `Vence em ${daysUntilDue} dias`
                }
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Next Month Projection */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-sm text-foreground mb-3">
          Projeção Setembro/2025
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Receita Projetada</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(taxData?.nextMonth?.projectedRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Imposto Estimado ({taxData?.nextMonth?.taxRate}%)
            </p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(taxData?.nextMonth?.projectedTax)}
            </p>
          </div>
        </div>
      </div>
      {/* Year to Date Summary */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-foreground">
          Resumo Anual (Jan-Ago 2025)
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Receita Total</p>
            <p className="font-semibold text-foreground">
              {formatCurrency(taxData?.yearToDate?.totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Imposto Total</p>
            <p className="font-semibold text-foreground">
              {formatCurrency(taxData?.yearToDate?.totalTax)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Já Pago</p>
            <p className="font-semibold text-success">
              {formatCurrency(taxData?.yearToDate?.paidTax)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Pendente</p>
            <p className={`font-semibold ${getStatusColor()}`}>
              {formatCurrency(taxData?.yearToDate?.pendingTax)}
            </p>
          </div>
        </div>

        {/* Tax Rate Indicator */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Alíquota Média Efetiva
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-primary">
              {taxData?.yearToDate?.averageRate}%
            </span>
            <Icon name="TrendingUp" size={12} color="var(--color-success)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxEstimateCard;