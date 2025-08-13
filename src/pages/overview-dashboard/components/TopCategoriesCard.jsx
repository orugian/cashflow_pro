import React from 'react';
import Icon from '../../../components/AppIcon';

const TopCategoriesCard = ({ onClick }) => {
  const topCategories = [
    {
      id: '1',
      name: 'Marketing Digital',
      amount: 15420.50,
      percentage: 28.5,
      change: '+12.3%',
      changeType: 'positive',
      color: '#1E3A8A',
      transactions: 23
    },
    {
      id: '2',
      name: 'Fornecedores',
      amount: 12850.00,
      percentage: 23.8,
      change: '-5.2%',
      changeType: 'negative',
      color: '#DC2626',
      transactions: 18
    },
    {
      id: '3',
      name: 'Salários e Encargos',
      amount: 11200.00,
      percentage: 20.7,
      change: '+2.1%',
      changeType: 'positive',
      color: '#059669',
      transactions: 12
    },
    {
      id: '4',
      name: 'Infraestrutura TI',
      amount: 8950.75,
      percentage: 16.6,
      change: '+8.7%',
      changeType: 'positive',
      color: '#D97706',
      transactions: 15
    },
    {
      id: '5',
      name: 'Despesas Administrativas',
      amount: 5680.25,
      percentage: 10.4,
      change: '-1.8%',
      changeType: 'negative',
      color: '#7C3AED',
      transactions: 9
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
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
            Top 5 Categorias
          </h2>
          <p className="text-sm text-muted-foreground">
            Maiores gastos do mês atual
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="PieChart" size={20} color="var(--color-primary)" />
        </div>
      </div>
      {/* Categories List */}
      <div className="space-y-4">
        {topCategories?.map((category, index) => (
          <div key={category?.id} className="flex items-center space-x-4">
            {/* Rank & Color Indicator */}
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground">
                {index + 1}
              </div>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category?.color }}
              ></div>
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {category?.name}
                </h3>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(category?.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${category?.percentage}%`,
                        backgroundColor: category?.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category?.percentage}%
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {category?.transactions} transações
                  </span>
                  <div className={`flex items-center space-x-1 ${getChangeColor(category?.changeType)}`}>
                    <Icon 
                      name={getChangeIcon(category?.changeType)} 
                      size={12} 
                      color="currentColor" 
                    />
                    <span className="text-xs font-medium">
                      {category?.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Total das 5 categorias
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(topCategories?.reduce((sum, cat) => sum + cat?.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopCategoriesCard;