import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectSettings = (state) => state?.settings;
export const selectCompanies = (state) => state?.companies?.items;
export const selectAccounts = (state) => state?.accounts?.items;
export const selectTransactions = (state) => state?.transactions?.items;
export const selectCategories = (state) => state?.categories?.items;
export const selectVendors = (state) => state?.vendorsCustomers?.vendors;
export const selectCustomers = (state) => state?.vendorsCustomers?.customers;
export const selectBudgets = (state) => state?.budgets?.items;
export const selectUsers = (state) => state?.users?.items;
export const selectCurrentUser = (state) => state?.users?.currentUser;
export const selectAlerts = (state) => state?.alerts?.items;

// Settings selectors
export const selectActiveScope = (state) => state?.settings?.activeScope;
export const selectActiveCompanyId = (state) => state?.settings?.activeCompanyId;

// Permission selector
export const selectCanEdit = createSelector(
  [selectCurrentUser],
  (currentUser) => {
    return currentUser?.role === 'admin';
  }
);

// Scoped company selectors
export const selectScopedCompanies = createSelector(
  [selectCompanies, selectActiveScope, selectActiveCompanyId],
  (companies, activeScope, activeCompanyId) => {
    if (activeScope === 'global') {
      return companies?.filter(company => company?.active);
    }
    return companies?.filter(company => company?.id === activeCompanyId && company?.active);
  }
);

// Scoped accounts selector
export const selectScopedAccounts = createSelector(
  [selectAccounts, selectActiveScope, selectActiveCompanyId, selectScopedCompanies],
  (accounts, activeScope, activeCompanyId, scopedCompanies) => {
    if (activeScope === 'global') {
      const companyIds = scopedCompanies?.map(c => c?.id);
      return accounts?.filter(account => 
        companyIds?.includes(account?.companyId) && account?.status === 'active'
      );
    }
    return accounts?.filter(account => 
      account?.companyId === activeCompanyId && account?.status === 'active'
    );
  }
);

// Scoped transactions selector  
export const selectScopedTransactions = createSelector(
  [selectTransactions, selectActiveScope, selectActiveCompanyId, selectScopedCompanies],
  (transactions, activeScope, activeCompanyId, scopedCompanies) => {
    if (activeScope === 'global') {
      const companyIds = scopedCompanies?.map(c => c?.id);
      return transactions?.filter(transaction => companyIds?.includes(transaction?.companyId));
    }
    return transactions?.filter(transaction => transaction?.companyId === activeCompanyId);
  }
);

// Scoped budgets selector
export const selectScopedBudgets = createSelector(
  [selectBudgets, selectActiveScope, selectActiveCompanyId, selectScopedCompanies],
  (budgets, activeScope, activeCompanyId, scopedCompanies) => {
    if (activeScope === 'global') {
      const companyIds = scopedCompanies?.map(c => c?.id);
      return budgets?.filter(budget => companyIds?.includes(budget?.companyId));
    }
    return budgets?.filter(budget => budget?.companyId === activeCompanyId);
  }
);

// Consolidated KPIs selector (excludes transfers from calculations)
export const selectConsolidatedKPIs = createSelector(
  [selectScopedAccounts, selectScopedTransactions],
  (accounts, transactions) => {
    // Calculate total balance
    const totalBalance = accounts?.reduce((sum, account) => sum + (account?.currentBalance || 0), 0);
    
    // Filter out transfers for KPI calculations
    const nonTransferTransactions = transactions?.filter(t => t?.type !== 'transfer');
    
    // Calculate total income and expenses (paid only)
    const paidTransactions = nonTransferTransactions?.filter(t => t?.status === 'paid');
    
    const totalIncome = paidTransactions?.filter(t => t?.type === 'entry')?.reduce((sum, t) => sum + (t?.amount || 0), 0);
    
    const totalExpenses = paidTransactions?.filter(t => t?.type === 'exit')?.reduce((sum, t) => sum + (t?.amount || 0), 0);
    
    const netCashFlow = totalIncome - totalExpenses;
    
    // Calculate average burn rate (last 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo?.setMonth(threeMonthsAgo?.getMonth() - 3);
    
    const recentExpenses = paidTransactions?.filter(t => t?.type === 'exit' && new Date(t.paidDate) >= threeMonthsAgo)?.reduce((sum, t) => sum + (t?.amount || 0), 0);
    
    const burnRate = recentExpenses / 3;
    
    // Calculate runway in months
    const runway = burnRate > 0 ? totalBalance / burnRate : Infinity;
    
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netCashFlow,
      burnRate,
      runway,
    };
  }
);

// Get current company
export const selectCurrentCompany = createSelector(
  [selectCompanies, selectActiveCompanyId],
  (companies, activeCompanyId) => {
    return companies?.find(company => company?.id === activeCompanyId) || null;
  }
);

// Get accounts for specific company
export const selectAccountsByCompany = createSelector(
  [selectAccounts, (state, companyId) => companyId],
  (accounts, companyId) => {
    return accounts?.filter(account => 
      account?.companyId === companyId && account?.status === 'active'
    );
  }
);

// Get transactions for specific company
export const selectTransactionsByCompany = createSelector(
  [selectTransactions, (state, companyId) => companyId],
  (transactions, companyId) => {
    return transactions?.filter(transaction => transaction?.companyId === companyId);
  }
);

// Vendor/Customer selectors by company
export const selectVendorsByCompany = createSelector(
  [selectVendors, (state, companyId) => companyId],
  (vendors, companyId) => {
    return vendors?.filter(vendor => vendor?.companyId === companyId && vendor?.active);
  }
);

export const selectCustomersByCompany = createSelector(
  [selectCustomers, (state, companyId) => companyId],  
  (customers, companyId) => {
    return customers?.filter(customer => customer?.companyId === companyId && customer?.active);
  }
);

// Budget calculations
export const selectBudgetAdherence = createSelector(
  [selectScopedBudgets],
  (budgets) => {
    const totalPlanned = budgets?.reduce((sum, budget) => sum + (budget?.amountPlanned || 0), 0);
    const totalActual = budgets?.reduce((sum, budget) => sum + (budget?.amountActual || 0), 0);
    
    const adherencePercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    
    return {
      totalPlanned,
      totalActual,
      adherencePercentage,
      variance: totalActual - totalPlanned,
    };
  }
);

// Top categories by spending
export const selectTopCategories = createSelector(
  [selectScopedTransactions, selectCategories],
  (transactions, categories) => {
    const categorySpending = {};
    
    transactions?.filter(t => t?.status === 'paid' && t?.type === 'exit')?.forEach(transaction => {
        const categoryId = transaction?.categoryId;
        if (categoryId) {
          categorySpending[categoryId] = (categorySpending?.[categoryId] || 0) + transaction?.amount;
        }
      });
    
    return Object.entries(categorySpending)?.map(([categoryId, amount]) => ({
        category: categories?.find(c => c?.id === categoryId),
        amount,
      }))?.sort((a, b) => b?.amount - a?.amount)?.slice(0, 5);
  }
);

// Top vendors by spending
export const selectTopVendors = createSelector(
  [selectScopedTransactions, selectVendors],
  (transactions, vendors) => {
    const vendorSpending = {};
    
    transactions?.filter(t => t?.status === 'paid' && t?.type === 'exit' && t?.vendorId)?.forEach(transaction => {
        const vendorId = transaction?.vendorId;
        vendorSpending[vendorId] = (vendorSpending?.[vendorId] || 0) + transaction?.amount;
      });
    
    return Object.entries(vendorSpending)?.map(([vendorId, amount]) => ({
        vendor: vendors?.find(v => v?.id === vendorId),
        amount,
      }))?.sort((a, b) => b?.amount - a?.amount)?.slice(0, 5);
  }
);