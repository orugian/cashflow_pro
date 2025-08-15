import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: initialState?.alerts,
  reducers: {
    addAlert: (state, action) => {
      const newAlert = {
        ...action?.payload,
        id: `alert-${Date.now()}`,
        read: false,
        createdAt: new Date()?.toISOString(),
      };
      state?.items?.push(newAlert);
    },
    
    markAlertAsRead: (state, action) => {
      const alert = state?.items?.find(a => a?.id === action?.payload);
      if (alert) {
        alert.read = true;
        alert.readAt = new Date()?.toISOString();
      }
    },
    
    markAllAlertsAsRead: (state) => {
      const now = new Date()?.toISOString();
      state?.items?.forEach(alert => {
        if (!alert?.read) {
          alert.read = true;
          alert.readAt = now;
        }
      });
    },
    
    dismissAlert: (state, action) => {
      state.items = state?.items?.filter(a => a?.id !== action?.payload);
    },
    
    clearAllAlerts: (state) => {
      state.items = [];
    },
    
    generateSystemAlerts: (state, action) => {
      const { accounts, transactions, budgets, activeScope, activeCompanyId } = action?.payload;
      const now = new Date()?.toISOString();
      
      // Clear existing system-generated alerts
      state.items = state?.items?.filter(alert => alert?.type !== 'system');
      
      // Generate negative balance alerts
      const relevantAccounts = activeScope === 'global' 
        ? accounts 
        : accounts?.filter(acc => acc?.companyId === activeCompanyId);
        
      relevantAccounts?.forEach(account => {
        if (account?.currentBalance < 0) {
          state?.items?.push({
            id: `alert-neg-balance-${account?.id}-${Date.now()}`,
            type: 'system',
            severity: 'high',
            title: 'Saldo Negativo',
            message: `Conta ${account?.bank} ${account?.number} está com saldo negativo`,
            companyId: account?.companyId,
            metadata: { accountId: account?.id, balance: account?.currentBalance },
            read: false,
            createdAt: now,
          });
        }
      });
      
      // Generate overdue payment alerts
      const overdueTransactions = transactions?.filter(t => 
        t?.status !== 'paid' && 
        t?.status !== 'canceled' &&
        new Date(t.dueDate) < new Date()
      );
      
      if (overdueTransactions?.length > 0) {
        state?.items?.push({
          id: `alert-overdue-${Date.now()}`,
          type: 'system',
          severity: 'medium',
          title: 'Pagamentos em Atraso',
          message: `${overdueTransactions?.length} transações em atraso`,
          companyId: activeCompanyId,
          metadata: { overdueCount: overdueTransactions?.length },
          read: false,
          createdAt: now,
        });
      }
      
      // Generate budget exceeded alerts
      budgets?.forEach(budget => {
        const thresholdAmount = budget?.amountPlanned * (budget?.alertThreshold / 100);
        if (budget?.amountActual > thresholdAmount) {
          state?.items?.push({
            id: `alert-budget-${budget?.id}-${Date.now()}`,
            type: 'system',
            severity: 'medium',
            title: 'Orçamento Excedido',
            message: `Orçamento da categoria excedeu ${budget?.alertThreshold}% do planejado`,
            companyId: budget?.companyId,
            metadata: { 
              budgetId: budget?.id, 
              planned: budget?.amountPlanned,
              actual: budget?.amountActual,
              threshold: budget?.alertThreshold,
            },
            read: false,
            createdAt: now,
          });
        }
      });
    },
  },
});

export const {
  addAlert,
  markAlertAsRead,
  markAllAlertsAsRead,
  dismissAlert,
  clearAllAlerts,
  generateSystemAlerts,
} = alertsSlice?.actions;

export default alertsSlice?.reducer;