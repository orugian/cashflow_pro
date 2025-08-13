import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  changeType, 
  icon, 
  onClick, 
  loading = false,
  trend = null 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'neutral':
        return 'text-muted-foreground';
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
      case 'neutral':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-base">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-24 h-4 bg-muted rounded"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
          </div>
          <div className="w-32 h-8 bg-muted rounded mb-2"></div>
          <div className="w-20 h-4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={16} color="var(--color-primary)" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-2xl font-semibold text-foreground mb-1">
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>

      {/* Change Indicator */}
      {change && (
        <div className={`flex items-center space-x-1 ${getChangeColor(changeType)}`}>
          <Icon 
            name={getChangeIcon(changeType)} 
            size={14} 
            color="currentColor" 
          />
          <span className="text-sm font-medium">{change}</span>
          {trend && (
            <span className="text-xs text-muted-foreground ml-2">
              vs mês anterior
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;