import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { format, addMonths, addDays, isWeekend, addWeeks, addQuarters, addYears, isSameDay } from 'date-fns';
import { loadAppState, saveAppState } from './persistence';
import { seedData } from './seed';

// Brazilian holidays calculation (simplified for 2025+)
const getBrazilianHolidays = (year) => {
  const holidays = [
    new Date(year, 0, 1),   // New Year
    new Date(year, 3, 21),  // Tiradentes
    new Date(year, 4, 1),   // Labor Day
    new Date(year, 8, 7),   // Independence Day
    new Date(year, 9, 12),  // Our Lady of Aparecida
    new Date(year, 10, 2),  // All Souls' Day
    new Date(year, 10, 15), // Proclamation of the Republic
    new Date(year, 11, 25), // Christmas
  ];
  
  // Add Easter-based holidays (simplified calculation)
  const easter = getEaster(year);
  holidays?.push(
    new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000), // Good Friday
    new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000), // Corpus Christi
  );
  
  return holidays;
};

const getEaster = (year) => {
  // Simplified Easter calculation
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  return new Date(year, n - 1, p + 1);
};

// Adjust date to next business day
const adjustToBusinessDay = (date) => {
  const year = date?.getFullYear();
  const holidays = getBrazilianHolidays(year);
  let adjustedDate = new Date(date);
  
  while (isWeekend(adjustedDate) || holidays?.some(holiday => isSameDay(holiday, adjustedDate))) {
    adjustedDate = addDays(adjustedDate, 1);
  }
  
  return adjustedDate;
};

const useStore = create(
  subscribeWithSelector(
    immer((set, get) => ({
      // Current state
      currentCompanyId: null,
      globalView: false,
      currentUser: null,
      
      // Data
      companies: [],
      accounts: [],
      transactions: [],
      categories: [],
      vendors: [],
      customers: [],
      budgets: [],
      users: [],
      alerts: [],
      recurrences: [],
      systemPreferences: {},
      
      // UI State
      loading: false,
      filters: {
        transactions: {},
        accounts: {},
        categories: {},
      },
      
      // Initialize store
      initialize: async () => {
        set((state) => {
          state.loading = true;
        });
        
        try {
          // Try to load existing data
          const savedData = await loadAppState();
          
          if (savedData && Object.keys(savedData)?.length > 0) {
            // Load existing data
            set((state) => {
              Object.assign(state, savedData);
              state.currentCompanyId = savedData?.companies?.[0]?.id || null;
              state.currentUser = savedData?.users?.[0] || null;
              state.loading = false;
            });
          } else {
            // Initialize with seed data
            set((state) => {
              Object.assign(state, seedData);
              state.currentCompanyId = seedData?.companies?.[0]?.id;
              state.currentUser = seedData?.users?.[0];
              state.loading = false;
            });
            
            // Save initial data
            await saveAppState(get());
          }
        } catch (error) {
          console.error('Failed to initialize store:', error);
          // Fallback to seed data
          set((state) => {
            Object.assign(state, seedData);
            state.currentCompanyId = seedData?.companies?.[0]?.id;
            state.currentUser = seedData?.users?.[0];
            state.loading = false;
          });
        }
      },
      
      // Company management
      setCurrentCompany: (companyId) => {
        set((state) => {
          state.currentCompanyId = companyId;
          state.globalView = false;
        });
      },
      
      toggleGlobalView: () => {
        set((state) => {
          state.globalView = !state?.globalView;
          if (state?.globalView) {
            state.currentCompanyId = null;
          } else {
            state.currentCompanyId = state?.companies?.[0]?.id || null;
          }
        });
      },
      
      // User management
      setCurrentUser: (user) => {
        set((state) => {
          state.currentUser = user;
        });
      },
      
      // Permission checks
      canPerformAction: (action) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        if (currentUser?.role === 'admin') return true;
        
        const permissionMap = {
          'create': false,
          'edit': false,
          'delete': false,
          'view': true,
          'export': currentUser?.permissions?.canExportData || false,
          'manage_categories': currentUser?.permissions?.canManageCategories || false,
          'manage_vendors': currentUser?.permissions?.canManageVendors || false,
          'manage_customers': currentUser?.permissions?.canManageCustomers || false,
        };
        
        return permissionMap?.[action] || false;
      },
      
      // Selectors
      getActiveCompanies: () => {
        const { companies } = get();
        return companies?.filter(company => company?.active);
      },
      
      getCurrentCompany: () => {
        const { companies, currentCompanyId } = get();
        return companies?.find(company => company?.id === currentCompanyId) || null;
      },
      
      getCompanyAccounts: (companyId) => {
        const { accounts, currentCompanyId, globalView } = get();
        const targetCompanyId = companyId || currentCompanyId;
        
        if (globalView) {
          return accounts?.filter(account => account?.status === 'active');
        }
        
        return accounts?.filter(account => 
          account?.companyId === targetCompanyId && account?.status === 'active'
        );
      },
      
      getCompanyTransactions: (companyId) => {
        const { transactions, currentCompanyId, globalView } = get();
        const targetCompanyId = companyId || currentCompanyId;
        
        if (globalView) {
          return transactions;
        }
        
        return transactions?.filter(transaction => 
          transaction?.companyId === targetCompanyId
        );
      },
      
      getConsolidatedBalance: () => {
        const { accounts, globalView, currentCompanyId } = get();
        
        const relevantAccounts = globalView 
          ? accounts 
          : accounts?.filter(acc => acc?.companyId === currentCompanyId);
          
        return relevantAccounts?.reduce((total, account) => total + account?.currentBalance, 0);
      },
      
      // CRUD Operations - Companies
      createCompany: (companyData) => {
        if (!get()?.canPerformAction('create')) return;
        
        const newCompany = {
          ...companyData,
          id: `company-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => {
          state?.companies?.push(newCompany);
        });
        
        saveAppState(get());
        return newCompany;
      },
      
      updateCompany: (id, updates) => {
        if (!get()?.canPerformAction('edit')) return;
        
        set((state) => {
          const company = state?.companies?.find(c => c?.id === id);
          if (company) {
            Object.assign(company, updates, { updatedAt: new Date() });
          }
        });
        
        saveAppState(get());
      },
      
      deleteCompany: (id) => {
        if (!get()?.canPerformAction('delete')) return;
        
        set((state) => {
          state.companies = state?.companies?.filter(c => c?.id !== id);
          // Also remove related data
          state.accounts = state?.accounts?.filter(a => a?.companyId !== id);
          state.transactions = state?.transactions?.filter(t => t?.companyId !== id);
          state.budgets = state?.budgets?.filter(b => b?.companyId !== id);
        });
        
        saveAppState(get());
      },
      
      // CRUD Operations - Accounts
      createAccount: (accountData) => {
        if (!get()?.canPerformAction('create')) return;
        
        const newAccount = {
          ...accountData,
          id: `acc-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => {
          state?.accounts?.push(newAccount);
        });
        
        saveAppState(get());
        return newAccount;
      },
      
      updateAccount: (id, updates) => {
        if (!get()?.canPerformAction('edit')) return;
        
        set((state) => {
          const account = state?.accounts?.find(a => a?.id === id);
          if (account) {
            Object.assign(account, updates, { updatedAt: new Date() });
          }
        });
        
        saveAppState(get());
      },
      
      deleteAccount: (id) => {
        if (!get()?.canPerformAction('delete')) return;
        
        set((state) => {
          state.accounts = state?.accounts?.filter(a => a?.id !== id);
          // Also remove related transactions
          state.transactions = state?.transactions?.filter(t => t?.accountId !== id);
        });
        
        saveAppState(get());
      },
      
      // CRUD Operations - Transactions
      createTransaction: (transactionData) => {
        if (!get()?.canPerformAction('create')) return;
        
        const newTransaction = {
          ...transactionData,
          id: `trans-${Date.now()}`,
          dueDate: adjustToBusinessDay(transactionData?.dueDate),
          createdAt: new Date(),
          updatedAt: new Date(),
          audit: { 
            createdBy: get()?.currentUser?.id, 
            updatedBy: get()?.currentUser?.id 
          }
        };
        
        set((state) => {
          state?.transactions?.push(newTransaction);
          
          // Update account balance if paid
          if (newTransaction?.status === 'paid' && newTransaction?.paidDate) {
            const account = state?.accounts?.find(a => a?.id === newTransaction?.accountId);
            if (account) {
              const multiplier = newTransaction?.type === 'entry' ? 1 : -1;
              account.currentBalance += newTransaction?.amount * multiplier;
            }
          }
        });
        
        saveAppState(get());
        return newTransaction;
      },
      
      updateTransaction: (id, updates) => {
        if (!get()?.canPerformAction('edit')) return;
        
        set((state) => {
          const transaction = state?.transactions?.find(t => t?.id === id);
          if (transaction) {
            const oldStatus = transaction?.status;
            const oldAmount = transaction?.amount;
            
            Object.assign(transaction, updates, { 
              updatedAt: new Date(),
              audit: { 
                ...transaction?.audit, 
                updatedBy: get()?.currentUser?.id 
              }
            });
            
            // Update account balance if status changed
            if (oldStatus !== transaction?.status) {
              const account = state?.accounts?.find(a => a?.id === transaction?.accountId);
              if (account) {
                const multiplier = transaction?.type === 'entry' ? 1 : -1;
                
                // Revert old transaction if it was paid
                if (oldStatus === 'paid') {
                  account.currentBalance -= oldAmount * multiplier;
                }
                
                // Apply new transaction if it's paid
                if (transaction?.status === 'paid' && transaction?.paidDate) {
                  account.currentBalance += transaction?.amount * multiplier;
                }
              }
            }
          }
        });
        
        saveAppState(get());
      },
      
      deleteTransaction: (id) => {
        if (!get()?.canPerformAction('delete')) return;
        
        set((state) => {
          const transaction = state?.transactions?.find(t => t?.id === id);
          if (transaction && transaction?.status === 'paid') {
            // Revert balance change
            const account = state?.accounts?.find(a => a?.id === transaction?.accountId);
            if (account) {
              const multiplier = transaction?.type === 'entry' ? 1 : -1;
              account.currentBalance -= transaction?.amount * multiplier;
            }
          }
          
          state.transactions = state?.transactions?.filter(t => t?.id !== id);
        });
        
        saveAppState(get());
      },
      
      // Transfer operations
      createTransfer: (fromAccountId, toAccountId, amount, description, dueDate) => {
        if (!get()?.canPerformAction('create')) return;
        
        const transferId = `transfer-${Date.now()}`;
        const companyId = get()?.currentCompanyId;
        
        const exitTransaction = {
          id: `trans-exit-${Date.now()}`,
          companyId,
          accountId: fromAccountId,
          type: 'transfer',
          categoryId: null,
          competenciaDate: new Date(),
          dueDate: adjustToBusinessDay(dueDate),
          amount,
          status: 'confirmed',
          paymentMethod: 'ted',
          notes: description,
          reciprocalId: `trans-entry-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          audit: { 
            createdBy: get()?.currentUser?.id, 
            updatedBy: get()?.currentUser?.id 
          }
        };
        
        const entryTransaction = {
          id: `trans-entry-${Date.now()}`,
          companyId,
          accountId: toAccountId,
          type: 'transfer',
          categoryId: null,
          competenciaDate: new Date(),
          dueDate: adjustToBusinessDay(dueDate),
          amount,
          status: 'confirmed',
          paymentMethod: 'ted',
          notes: description,
          reciprocalId: exitTransaction?.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          audit: { 
            createdBy: get()?.currentUser?.id, 
            updatedBy: get()?.currentUser?.id 
          }
        };
        
        set((state) => {
          state?.transactions?.push(exitTransaction, entryTransaction);
          
          // Update balances immediately for transfers
          const fromAccount = state?.accounts?.find(a => a?.id === fromAccountId);
          const toAccount = state?.accounts?.find(a => a?.id === toAccountId);
          
          if (fromAccount) fromAccount.currentBalance -= amount;
          if (toAccount) toAccount.currentBalance += amount;
        });
        
        saveAppState(get());
        return [exitTransaction, entryTransaction];
      },
      
      // Recurrence engine
      createRecurrence: (recurrenceData) => {
        if (!get()?.canPerformAction('create')) return;
        
        const newRecurrence = {
          ...recurrenceData,
          id: `rec-${Date.now()}`,
          active: true,
          lastGenerated: null,
          nextGeneration: new Date(),
        };
        
        set((state) => {
          state?.recurrences?.push(newRecurrence);
        });
        
        saveAppState(get());
        return newRecurrence;
      },
      
      generateRecurringTransactions: () => {
        const { recurrences, transactions } = get();
        const today = new Date();
        let generatedCount = 0;
        
        recurrences?.forEach((recurrence) => {
          if (!recurrence?.active || recurrence?.nextGeneration > today) return;
          
          // Find template transaction
          const template = transactions?.find(t => t?.recurrenceId === recurrence?.id);
          if (!template) return;
          
          let nextDate = new Date(recurrence.nextGeneration);
          const maxGenerations = 12; // Safety limit
          let generations = 0;
          
          while (nextDate <= today && generations < maxGenerations) {
            // Check if we've reached the end conditions
            if (recurrence?.endDate && nextDate > recurrence?.endDate) break;
            if (recurrence?.occurrences && generations >= recurrence?.occurrences) break;
            
            // Generate new transaction
            const newTransaction = {
              ...template,
              id: `trans-rec-${Date.now()}-${generations}`,
              competenciaDate: nextDate,
              dueDate: adjustToBusinessDay(nextDate),
              status: 'planned',
              paidDate: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            set((state) => {
              state?.transactions?.push(newTransaction);
            });
            
            generatedCount++;
            generations++;
            
            // Calculate next occurrence
            switch (recurrence?.frequency) {
              case 'daily':
                nextDate = addDays(nextDate, 1);
                break;
              case 'weekly':
                nextDate = addWeeks(nextDate, 1);
                break;
              case 'monthly':
                nextDate = addMonths(nextDate, 1);
                break;
              case 'quarterly':
                nextDate = addQuarters(nextDate, 1);
                break;
              case 'semiannual':
                nextDate = addMonths(nextDate, 6);
                break;
              case 'annual':
                nextDate = addYears(nextDate, 1);
                break;
              default:
                break;
            }
          }
          
          // Update recurrence
          set((state) => {
            const rec = state?.recurrences?.find(r => r?.id === recurrence?.id);
            if (rec) {
              rec.lastGenerated = today;
              rec.nextGeneration = nextDate;
              
              // Deactivate if reached end
              if ((recurrence?.endDate && nextDate > recurrence?.endDate) ||
                  (recurrence?.occurrences && generations >= recurrence?.occurrences)) {
                rec.active = false;
              }
            }
          });
        });
        
        if (generatedCount > 0) {
          saveAppState(get());
        }
        
        return generatedCount;
      },
      
      // Budget operations
      createBudget: (budgetData) => {
        if (!get()?.canPerformAction('create')) return;
        
        const newBudget = {
          ...budgetData,
          id: `budget-${Date.now()}`,
          amountActual: 0, // Will be calculated
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => {
          state?.budgets?.push(newBudget);
        });
        
        saveAppState(get());
        return newBudget;
      },
      
      updateBudget: (id, updates) => {
        if (!get()?.canPerformAction('edit')) return;
        
        set((state) => {
          const budget = state?.budgets?.find(b => b?.id === id);
          if (budget) {
            Object.assign(budget, updates, { updatedAt: new Date() });
          }
        });
        
        saveAppState(get());
      },
      
      calculateBudgetActuals: () => {
        const { budgets, transactions } = get();
        
        budgets?.forEach((budget) => {
          const monthTransactions = transactions?.filter(t => 
            t?.companyId === budget?.companyId &&
            t?.categoryId === budget?.categoryId &&
            format(new Date(t.competenciaDate), 'yyyy-MM') === budget?.month &&
            t?.status === 'paid'
          );
          
          const actual = monthTransactions?.reduce((sum, t) => sum + t?.amount, 0);
          
          set((state) => {
            const b = state?.budgets?.find(b => b?.id === budget?.id);
            if (b) b.amountActual = actual;
          });
        });
        
        saveAppState(get());
      },
      
      // Alert system
      createAlert: (alertData) => {
        const newAlert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          read: false,
          createdAt: new Date(),
        };
        
        set((state) => {
          state?.alerts?.push(newAlert);
        });
        
        saveAppState(get());
        return newAlert;
      },
      
      markAlertAsRead: (id) => {
        set((state) => {
          const alert = state?.alerts?.find(a => a?.id === id);
          if (alert) alert.read = true;
        });
        
        saveAppState(get());
      },
      
      checkForAlerts: () => {
        const { accounts, transactions, budgets, globalView, currentCompanyId } = get();
        const alerts = [];
        
        // Check for negative balance projections
        const relevantAccounts = globalView 
          ? accounts 
          : accounts?.filter(acc => acc?.companyId === currentCompanyId);
          
        relevantAccounts?.forEach(account => {
          const futureTransactions = transactions?.filter(t => 
            t?.accountId === account?.id &&
            t?.status === 'planned' &&
            new Date(t.dueDate) <= addDays(new Date(), 7)
          );
          
          const projectedBalance = futureTransactions?.reduce((balance, t) => {
            const multiplier = t?.type === 'entry' ? 1 : -1;
            return balance + (t?.amount * multiplier);
          }, account?.currentBalance);
          
          if (projectedBalance < 0) {
            alerts?.push({
              type: 'negative-balance',
              title: 'Saldo Negativo Projetado',
              message: `Conta ${account?.bank} ${account?.number} pode ficar negativa em 7 dias`,
              severity: 'high',
              companyId: account?.companyId,
              metadata: { accountId: account?.id, projectedBalance }
            });
          }
        });
        
        // Check for overdue transactions
        const overdue = transactions?.filter(t => 
          t?.status !== 'paid' && 
          t?.status !== 'canceled' &&
          new Date(t.dueDate) < new Date()
        );
        
        if (overdue?.length > 0) {
          alerts?.push({
            type: 'overdue-payment',
            title: 'Pagamentos em Atraso',
            message: `${overdue?.length} transações em atraso`,
            severity: 'medium',
            companyId: currentCompanyId,
            metadata: { overdueCount: overdue?.length }
          });
        }
        
        // Check budget overruns
        budgets?.forEach(budget => {
          if (budget?.amountActual > budget?.amountPlanned * (budget?.alertThreshold / 100)) {
            alerts?.push({
              type: 'budget-exceeded',
              title: 'Orçamento Estourado',
              message: `Orçamento da categoria excedeu ${budget?.alertThreshold}%`,
              severity: 'medium',
              companyId: budget?.companyId,
              metadata: { budgetId: budget?.id }
            });
          }
        });
        
        // Add new alerts
        alerts?.forEach(alertData => {
          get()?.createAlert(alertData);
        });
        
        return alerts?.length;
      },
      
      // System preferences
      updateSystemPreferences: (updates) => {
        set((state) => {
          Object.assign(state?.systemPreferences, updates);
        });
        
        saveAppState(get());
      },
      
      // Export/Import functionality
      exportData: (companyId = null) => {
        if (!get()?.canPerformAction('export')) return null;
        
        const state = get();
        
        if (companyId) {
          return {
            company: state?.companies?.find(c => c?.id === companyId),
            accounts: state?.accounts?.filter(a => a?.companyId === companyId),
            transactions: state?.transactions?.filter(t => t?.companyId === companyId),
            budgets: state?.budgets?.filter(b => b?.companyId === companyId),
            version: '1.0.0',
            exportedAt: new Date()?.toISOString(),
          };
        } else {
          return {
            ...state,
            version: '1.0.0',
            exportedAt: new Date()?.toISOString(),
          };
        }
      },
      
      importData: (data) => {
        if (!get()?.canPerformAction('create')) return;
        
        set((state) => {
          // Merge imported data
          if (data?.companies) state.companies = [...state?.companies, ...data?.companies];
          if (data?.accounts) state.accounts = [...state?.accounts, ...data?.accounts];
          if (data?.transactions) state.transactions = [...state?.transactions, ...data?.transactions];
          if (data?.budgets) state.budgets = [...state?.budgets, ...data?.budgets];
          if (data?.categories) state.categories = [...state?.categories, ...data?.categories];
          if (data?.vendors) state.vendors = [...state?.vendors, ...data?.vendors];
          if (data?.customers) state.customers = [...state?.customers, ...data?.customers];
        });
        
        saveAppState(get());
      },
      
      // Filters
      setFilter: (filterType, filters) => {
        set((state) => {
          state.filters[filterType] = { ...state?.filters?.[filterType], ...filters };
        });
      },
      
      clearFilters: (filterType) => {
        set((state) => {
          state.filters[filterType] = {};
        });
      },
    }))
  )
);

// Initialize store on module load
useStore?.getState()?.initialize();

export default useStore;