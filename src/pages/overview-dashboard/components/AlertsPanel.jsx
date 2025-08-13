import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const [alerts] = useState([
    {
      id: '1',
      type: 'warning',
      title: 'Vencimentos Próximos',
      message: '3 faturas vencem nos próximos 2 dias',
      count: 3,
      priority: 'high',
      actionLabel: 'Ver Faturas',
      actionUrl: '/transaction-management?filter=due-soon'
    },
    {
      id: '2',
      type: 'error',
      title: 'Saldo Negativo Projetado',
      message: 'Conta BB ficará negativa em 5 dias',
      priority: 'critical',
      actionLabel: 'Ver Projeção',
      actionUrl: '/analytics-forecasting?account=bb-checking'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Orçamento Excedido',
      message: 'Marketing ultrapassou 15% do orçamento mensal',
      priority: 'medium',
      actionLabel: 'Ver Categoria',
      actionUrl: '/analytics-forecasting?category=marketing'
    },
    {
      id: '4',
      type: 'info',
      title: 'Meta de Receita',
      message: 'Faltam R$ 12.500 para atingir a meta mensal',
      priority: 'low',
      actionLabel: 'Ver Dashboard',
      actionUrl: '/analytics-forecasting?view=revenue'
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      case 'success':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error/10 border-error/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      case 'success':
        return 'bg-success/10 border-success/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: { label: 'Crítico', color: 'bg-error text-error-foreground' },
      high: { label: 'Alto', color: 'bg-warning text-warning-foreground' },
      medium: { label: 'Médio', color: 'bg-primary text-primary-foreground' },
      low: { label: 'Baixo', color: 'bg-muted text-muted-foreground' }
    };
    
    return badges?.[priority] || badges?.low;
  };

  const handleAlertAction = (actionUrl) => {
    // In real app, this would use router navigation
    console.log('Navigate to:', actionUrl);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-base">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
          <h2 className="text-lg font-semibold text-foreground">Alertas</h2>
          {alerts?.length > 0 && (
            <div className="w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {alerts?.length}
            </div>
          )}
        </div>
        
        <Button variant="ghost" iconName="Settings" iconSize={16}>
          Configurar
        </Button>
      </div>
      {/* Alerts List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Nenhum alerta ativo
            </p>
            <p className="text-xs text-muted-foreground">
              Tudo está funcionando perfeitamente!
            </p>
          </div>
        ) : (
          alerts?.map((alert) => {
            const priorityBadge = getPriorityBadge(alert?.priority);
            
            return (
              <div
                key={alert?.id}
                className={`
                  border rounded-lg p-4 transition-all duration-200 hover-elevation
                  ${getAlertBgColor(alert?.type)}
                `}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getAlertIcon(alert?.type)} 
                      size={16} 
                      color={`var(--color-${alert?.type === 'info' ? 'primary' : alert?.type})`} 
                    />
                    <h3 className="font-medium text-sm text-foreground">
                      {alert?.title}
                    </h3>
                    {alert?.count && (
                      <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {alert?.count}
                      </div>
                    )}
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadge?.color}`}>
                    {priorityBadge?.label}
                  </div>
                </div>
                {/* Alert Message */}
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {alert?.message}
                </p>
                {/* Alert Action */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAlertAction(alert?.actionUrl)}
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={14}
                  >
                    {alert?.actionLabel}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Footer */}
      {alerts?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            fullWidth
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
            onClick={() => handleAlertAction('/alerts')}
          >
            Ver Todos os Alertas
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;