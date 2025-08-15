import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, subMonths, endOfMonth } from 'date-fns';
import Icon from '../../../components/AppIcon';
import { 
  selectScopedTransactions, 
  selectSettings,
} from '../../../store/selectors';

const TaxEstimateCard = ({ onClick }) => {
  const scopedTransactions = useSelector(selectScopedTransactions);
  const settings = useSelector(selectSettings);

  // Calculate last month's revenue for tax estimation
  const taxEstimate = useMemo(() => {
    const lastMonth = subMonths(new Date(), 1);
    const lastMonthKey = format(lastMonth, 'yyyy-MM');
    
    // Get paid revenue transactions from last month
    const lastMonthRevenue = scopedTransactions
      ?.filter(transaction => {
        const transactionDate = new Date(transaction?.competenciaDate || transaction?.paidDate);
        return format(transactionDate, 'yyyy-MM') === lastMonthKey &&
               transaction?.type === 'entry' &&
               transaction?.status === 'paid';
      })
      ?.reduce((sum, transaction) => sum + (transaction?.amount || 0), 0) || 0;
    
    // Calculate estimated tax based on settings
    const effectiveRate = settings?.taxes?.effectiveRate || 0.1755; // Default 17.55% for Simples Nacional
    const estimatedTax = lastMonthRevenue * effectiveRate;
    
    // Get the last day of current month
    const currentMonthEnd = endOfMonth(new Date());
    const dueDate = format(currentMonthEnd, 'dd/MM/yyyy');
    
    return {
      lastMonthRevenue,
      estimatedTax,
      effectiveRate,
      dueDate,
    };
  }, [scopedTransactions, settings]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(value);
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg shadow-base p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-error/10 rounded-lg">
            <Icon 
              name="Receipt" 
              size={20} 
              color="rgb(239, 68, 68)" 
            />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Estimativa de Impostos</h3>
            <p className="text-sm text-muted-foreground">
              Simples Nacional
            </p>
          </div>
        </div>
      </div>

      {/* Tax Amount */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-error mb-1">
          {formatCurrency(taxEstimate?.estimatedTax)}
        </p>
        <p className="text-sm text-muted-foreground">
          Baseado em {formatCurrency(taxEstimate?.lastMonthRevenue)} de faturamento
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Taxa Efetiva:</span>
          <span className="font-medium text-foreground">
            {formatPercentage(taxEstimate?.effectiveRate)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Vencimento:</span>
          <span className="font-medium text-foreground">
            {taxEstimate?.dueDate}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span className="text-sm text-warning font-medium">
            Pendente
          </span>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          Configurar →
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          * Estimativa baseada no faturamento do último mês completo.
          Confirme os valores nas configurações de impostos.
        </p>
      </div>
    </div>
  );
};

export default TaxEstimateCard;