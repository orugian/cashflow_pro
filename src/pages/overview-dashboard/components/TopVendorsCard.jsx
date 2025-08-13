import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopVendorsCard = ({ onClick }) => {
  const topVendors = [
    {
      id: '1',
      name: 'Google Ads Brasil',
      amount: 8420.50,
      percentage: 32.1,
      change: '+15.2%',
      changeType: 'positive',
      avatar: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=40&h=40&fit=crop&crop=face',
      category: 'Marketing Digital',
      lastPayment: '2025-08-10',
      transactions: 12
    },
    {
      id: '2',
      name: 'AWS Brasil',
      amount: 6850.00,
      percentage: 26.1,
      change: '+8.7%',
      changeType: 'positive',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=face',
      category: 'Infraestrutura TI',
      lastPayment: '2025-08-12',
      transactions: 8
    },
    {
      id: '3',
      name: 'Fornecedor ABC Ltda',
      amount: 5200.00,
      percentage: 19.8,
      change: '-3.2%',
      changeType: 'negative',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      category: 'Fornecedores',
      lastPayment: '2025-08-08',
      transactions: 6
    },
    {
      id: '4',
      name: 'Microsoft Brasil',
      amount: 3680.25,
      percentage: 14.0,
      change: '+5.1%',
      changeType: 'positive',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      category: 'Software',
      lastPayment: '2025-08-11',
      transactions: 4
    },
    {
      id: '5',
      name: 'Consultoria XYZ',
      amount: 2100.00,
      percentage: 8.0,
      change: '-12.5%',
      changeType: 'negative',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      category: 'Serviços',
      lastPayment: '2025-08-05',
      transactions: 3
    }
  ];

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
      month: '2-digit'
    });
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
            Top 5 Fornecedores
          </h2>
          <p className="text-sm text-muted-foreground">
            Maiores pagamentos do mês atual
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Users" size={20} color="var(--color-primary)" />
        </div>
      </div>
      {/* Vendors List */}
      <div className="space-y-4">
        {topVendors?.map((vendor, index) => (
          <div key={vendor?.id} className="flex items-center space-x-4">
            {/* Rank */}
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </div>

            {/* Vendor Avatar */}
            <div className="relative">
              <Image
                src={vendor?.avatar}
                alt={vendor?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
            </div>

            {/* Vendor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {vendor?.name}
                </h3>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(vendor?.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {vendor?.category}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Último: {formatDate(vendor?.lastPayment)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {vendor?.transactions} pagamentos
                  </span>
                  <div className={`flex items-center space-x-1 ${getChangeColor(vendor?.changeType)}`}>
                    <Icon 
                      name={getChangeIcon(vendor?.changeType)} 
                      size={12} 
                      color="currentColor" 
                    />
                    <span className="text-xs font-medium">
                      {vendor?.change}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${vendor?.percentage}%` }}
                  ></div>
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
            Total dos 5 fornecedores
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(topVendors?.reduce((sum, vendor) => sum + vendor?.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopVendorsCard;