import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, TrendingDown, Calendar, Target } from 'lucide-react';
import useStore from '../../state/store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Icon from '../AppIcon';


const AlertsIndicator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, markAlertAsRead, checkForAlerts } = useStore();
  
  // Filter unread alerts
  const unreadAlerts = alerts?.filter(alert => !alert?.read) || [];
  
  // Check for new alerts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkForAlerts();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [checkForAlerts]);
  
  const getAlertIcon = (type) => {
    switch (type) {
      case 'negative-balance':
        return TrendingDown;
      case 'overdue-payment':
        return Calendar;
      case 'budget-exceeded':
        return Target;
      case 'goal-achieved':
        return Target;
      default:
        return AlertTriangle;
    }
  };
  
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const handleAlertClick = (alert) => {
    markAlertAsRead(alert?.id);
    // Handle navigation to relevant section
    // This could be implemented with react-router or other navigation logic
  };
  
  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring
          ${unreadAlerts?.length > 0 ? 
            'text-warning hover:text-warning/80 hover:bg-warning/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
        `}
      >
        <Bell className="h-5 w-5" />
        
        {/* Notification Badge */}
        {unreadAlerts?.length > 0 && (
          <span className="
            absolute -top-1 -right-1 
            h-5 w-5 rounded-full 
            bg-error text-error-foreground
            text-xs font-medium
            flex items-center justify-center
            animate-pulse
          ">
            {unreadAlerts?.length > 9 ? '9+' : unreadAlerts?.length}
          </span>
        )}
      </button>
      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 z-50">
          <div className="bg-popover border border-border rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-muted/50">
              <h3 className="font-medium text-foreground">
                Alertas e Notificações
              </h3>
              {unreadAlerts?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {unreadAlerts?.length} não lidas
                </p>
              )}
            </div>
            
            {/* Alerts List */}
            <div className="max-h-80 overflow-y-auto">
              {alerts?.length > 0 ? (
                alerts?.slice(0, 10)?.map((alert) => {
                  const Icon = getAlertIcon(alert?.type);
                  const colorClass = getAlertColor(alert?.severity);
                  
                  return (
                    <div
                      key={alert?.id}
                      onClick={() => handleAlertClick(alert)}
                      className={`
                        px-4 py-3 border-b border-border last:border-b-0
                        cursor-pointer transition-colors
                        hover:bg-muted/50
                        ${alert?.read ? 'opacity-60' : 'bg-primary/5'}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-4 w-4 mt-0.5 ${colorClass}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground mb-1">
                            {alert?.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {alert?.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(alert.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                        {!alert?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum alerta no momento
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {alerts?.length > 10 && (
              <div className="px-4 py-3 border-t border-border bg-muted/50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to alerts page
                  }}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Ver todos os alertas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AlertsIndicator;