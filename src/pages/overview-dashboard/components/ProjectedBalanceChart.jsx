import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, addMonths } from 'date-fns';
import { 
  selectScopedTransactions, 
  selectScopedAccounts, 
  selectActiveScope,
} from '../../../store/selectors';

const ProjectedBalanceChart = () => {
  const scopedTransactions = useSelector(selectScopedTransactions);
  const scopedAccounts = useSelector(selectScopedAccounts);
  const activeScope = useSelector(selectActiveScope);

  // Calculate current balance
  const currentBalance = useMemo(() => {
    return scopedAccounts?.reduce((sum, account) => sum + (account?.currentBalance || 0), 0) || 0;
  }, [scopedAccounts]);

  // Generate projected balance data for up to 10 years
  const chartData = useMemo(() => {
    const data = [];
    const startDate = new Date();
    const endDate = addMonths(startDate, 120); // 10 years
    let runningBalance = currentBalance;
    
    // Create monthly buckets
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const monthKey = format(currentDate, 'yyyy-MM');
      
      // Get confirmed and planned transactions for this month
      const monthTransactions = scopedTransactions?.filter(transaction => {
        const transactionDate = new Date(transaction?.competenciaDate || transaction?.dueDate);
        return format(transactionDate, 'yyyy-MM') === monthKey &&
               (transaction?.status === 'confirmed' || transaction?.status === 'paid');
      }) || [];
      
      // Calculate net change for the month (excluding transfers)
      const monthlyChange = // Exclude transfers from projections
      monthTransactions?.filter(t => !t?.transferPairId)?.reduce((sum, transaction) => {
          const multiplier = transaction?.type === 'entry' ? 1 : -1;
          return sum + (transaction?.amount * multiplier);
        }, 0);
      
      runningBalance += monthlyChange;
      
      data?.push({
        month: format(currentDate, 'MMM yyyy'),
        monthShort: format(currentDate, 'MMM/yy'),
        balance: runningBalance,
        change: monthlyChange,
        transactionCount: monthTransactions?.length || 0,
      });
      
      currentDate = addMonths(currentDate, 1);
    }
    
    return data?.slice(0, 24); // Show next 24 months
  }, [scopedTransactions, currentBalance]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            Saldo Projetado: {formatCurrency(data?.balance)}
          </p>
          <p className="text-sm text-muted-foreground">
            Variação: {data?.change >= 0 ? '+' : ''}{formatCurrency(data?.change)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data?.transactionCount} transação(ões)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-base p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Projeção de Saldo
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeScope === 'global' ?'Evolução consolidada dos próximos 24 meses' :'Evolução do saldo nos próximos 24 meses'
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(currentBalance)}
          </p>
          <p className="text-sm text-muted-foreground">Saldo Atual</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="monthShort" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000)?.toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000)?.toFixed(0)}k`;
                return value?.toLocaleString('pt-BR');
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "rgb(59, 130, 246)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Saldo Projetado</span>
        </div>
        <div className="text-xs text-muted-foreground">
          * Baseado em transações confirmadas e planejadas
        </div>
      </div>
    </div>
  );
};

export default ProjectedBalanceChart;