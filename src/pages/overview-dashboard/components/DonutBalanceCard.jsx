import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { 
  selectScopedAccounts, 
  selectScopedTransactions,
  selectActiveScope 
} from '../../../store/selectors';

const DonutBalanceCard = () => {
  const scopedAccounts = useSelector(selectScopedAccounts);
  const scopedTransactions = useSelector(selectScopedTransactions);
  const activeScope = useSelector(selectActiveScope);

  const balanceData = useMemo(() => {
    // Calculate current balance from accounts
    const saldoAtual = scopedAccounts?.reduce((sum, account) => sum + (account?.currentBalance || 0), 0);

    // Get current month start and end
    const now = new Date();
    const currentMonth = format(now, 'yyyy-MM');
    
    // Filter transactions for current month (planned and confirmed)
    const currentMonthTransactions = scopedTransactions?.filter(transaction => {
      const transactionMonth = format(new Date(transaction?.competenciaDate || transaction?.dueDate), 'yyyy-MM');
      return transactionMonth === currentMonth && 
             (transaction?.status === 'planned' || transaction?.status === 'confirmed') &&
             !transaction?.transferPairId; // Exclude transfers
    }) || [];

    // Calculate projected entries and exits for current month
    const projectedEntries = currentMonthTransactions
      ?.filter(t => t?.type === 'entry')
      ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

    const projectedExits = currentMonthTransactions
      ?.filter(t => t?.type === 'exit')
      ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

    const saldoProjetadoMes = saldoAtual + projectedEntries - projectedExits;

    return {
      saldoAtual,
      saldoProjetadoMes,
      projectedEntries,
      projectedExits,
      difference: saldoProjetadoMes - saldoAtual
    };
  }, [scopedAccounts, scopedTransactions]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const chartData = [
    {
      name: 'Saldo Atual',
      value: Math.max(balanceData?.saldoAtual, 0),
      color: '#059669'
    },
    {
      name: 'Projeção',
      value: Math.max(balanceData?.difference, 0),
      color: balanceData?.difference >= 0 ? '#0891B2' : '#DC2626'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-primary">{formatCurrency(data?.value)}</p>
        </div>
      );
    }
    return null;
  };

  const totalValue = chartData?.reduce((sum, item) => sum + item?.value, 0);

  return (
    <div className="bg-card border border-border rounded-lg shadow-base p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Saldo Atual vs Projetado
        </h3>
        <p className="text-sm text-muted-foreground">
          {activeScope === 'global' ? 'Comparativo consolidado do mês vigente' : 'Comparativo do saldo no mês vigente'}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {/* Chart */}
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Values */}
        <div className="flex-1 ml-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span className="text-sm text-muted-foreground">Saldo Atual</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(balanceData?.saldoAtual)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${balanceData?.difference >= 0 ? 'bg-cyan-600' : 'bg-red-600'}`}></div>
                <span className="text-sm text-muted-foreground">Saldo Projetado</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(balanceData?.saldoProjetadoMes)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Variação</span>
              <span className={`font-semibold ${balanceData?.difference >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {balanceData?.difference >= 0 ? '+' : ''}{formatCurrency(balanceData?.difference)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Entradas Previstas</p>
          <p className="text-sm font-medium text-emerald-600">
            {formatCurrency(balanceData?.projectedEntries)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Saídas Previstas</p>
          <p className="text-sm font-medium text-red-600">
            {formatCurrency(balanceData?.projectedExits)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonutBalanceCard;