import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const AlertsIndicator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const dropdownRef = useRef(null);

  // Mock alerts data - in real app this would come from context/API
  useEffect(() => {
    const mockAlerts = [
      {
        id: '1',
        type: 'warning',
        title: 'Vencimento Próximo',
        message: 'Fatura da Energia Elétrica vence em 2 dias',
        timestamp: '2025-08-13T17:30:00Z',
        read: false,
        actionUrl: '/transaction-management?filter=due-soon'
      },
      {
        id: '2',
        type: 'error',
        title: 'Saldo Negativo',
        message: 'Conta Corrente Banco do Brasil está com saldo negativo',
        timestamp: '2025-08-13T16:45:00Z',
        read: false,
        actionUrl: '/overview-dashboard?account=bb-checking'
      },
      {
        id: '3',
        type: 'success',
        title: 'Pagamento Confirmado',
        message: 'Transferência para fornecedor processada com sucesso',
        timestamp: '2025-08-13T15:20:00Z',
        read: true,
        actionUrl: '/transaction-management?id=tx-12345'
      },
      {
        id: '4',
        type: 'info',
        title: 'Relatório Disponível',
        message: 'Relatório mensal de fluxo de caixa está pronto',
        timestamp: '2025-08-13T14:10:00Z',
        read: true,
        actionUrl: '/reports-center?report=monthly-cashflow'
      },
      {
        id: '5',
        type: 'warning',
        title: 'Meta de Receita',
        message: 'Receita do mês está 15% abaixo da meta estabelecida',
        timestamp: '2025-08-13T12:00:00Z',
        read: false,
        actionUrl: '/analytics-forecasting?view=revenue-tracking'
      }
    ];
    
    setAlerts(mockAlerts);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = alerts?.filter(alert => !alert?.read)?.length;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'success':
        return 'CheckCircle';
      case 'info':
        return 'Info';
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
      case 'success':
        return 'text-success';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error/10';
      case 'warning':
        return 'bg-warning/10';
      case 'success':
        return 'bg-success/10';
      case 'info':
        return 'bg-primary/10';
      default:
        return 'bg-muted';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      return date?.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const handleAlertClick = (alert) => {
    // Mark as read
    setAlerts(prev => prev?.map(a => 
      a?.id === alert?.id ? { ...a, read: true } : a
    ));
    
    // Navigate to action URL (in real app, use router)
    console.log('Navigate to:', alert?.actionUrl);
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev?.map(alert => ({ ...alert, read: true })));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg
          transition-all duration-200 ease-smooth
          hover:bg-muted hover-elevation
          ${isOpen ? 'bg-muted shadow-medium' : 'bg-transparent'}
        `}
      >
        <Icon 
          name="Bell" 
          size={20} 
          color={unreadCount > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
        />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="
            absolute -top-1 -right-1 
            w-5 h-5 bg-error text-error-foreground
            rounded-full flex items-center justify-center
            text-xs font-medium
            animate-pulse-feedback
          ">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2 w-96
          bg-popover border border-border rounded-lg shadow-pronounced
          z-200 max-h-96 overflow-hidden
        ">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="font-medium text-sm text-popover-foreground">
                Notificações
              </h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 
                  ? `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`
                  : 'Todas as notificações foram lidas'
                }
              </p>
            </div>
            
            {alerts?.length > 0 && (
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={clearAllAlerts}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Icon name="X" size={14} color="var(--color-text-secondary)" />
                </button>
              </div>
            )}
          </div>

          {/* Alerts List */}
          <div className="max-h-80 overflow-y-auto">
            {alerts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Icon name="Bell" size={32} color="var(--color-muted-foreground)" />
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhuma notificação
                </p>
                <p className="text-xs text-muted-foreground">
                  Você está em dia com tudo!
                </p>
              </div>
            ) : (
              alerts?.map((alert) => (
                <button
                  key={alert?.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`
                    w-full flex items-start space-x-3 px-4 py-3
                    transition-colors duration-200
                    hover:bg-muted border-l-2
                    ${alert?.read 
                      ? 'border-l-transparent opacity-60' :'border-l-primary bg-primary/5'
                    }
                  `}
                >
                  {/* Alert Icon */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${getAlertBgColor(alert?.type)}
                  `}>
                    <Icon 
                      name={getAlertIcon(alert?.type)} 
                      size={16} 
                      color={`var(--color-${alert?.type === 'info' ? 'primary' : alert?.type})`} 
                    />
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className={`
                        text-sm font-medium truncate
                        ${alert?.read ? 'text-muted-foreground' : 'text-popover-foreground'}
                      `}>
                        {alert?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatTimestamp(alert?.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`
                      text-xs mt-1 line-clamp-2
                      ${alert?.read ? 'text-muted-foreground' : 'text-muted-foreground'}
                    `}>
                      {alert?.message}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {!alert?.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {alerts?.length > 0 && (
            <div className="px-4 py-2 border-t border-border">
              <button className="
                w-full text-center text-sm text-primary hover:text-primary/80
                transition-colors duration-200 py-1
              ">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsIndicator;