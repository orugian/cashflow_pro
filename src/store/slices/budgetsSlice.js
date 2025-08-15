import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState: initialState?.budgets,
  reducers: {
    addBudget: (state, action) => {
      const newBudget = {
        ...action?.payload,
        id: `budget-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.items?.push(newBudget);
    },

    editBudget: (state, action) => {
      const { id, ...updates } = action?.payload;
      const budget = state?.items?.find(b => b?.id === id);
      if (budget) {
        Object.assign(budget, updates, {
          updatedAt: new Date()?.toISOString(),
        });
      }
    },

    deleteBudget: (state, action) => {
      state.items = state?.items?.filter(b => b?.id !== action?.payload);
    },

    updateBudgetActual: (state, action) => {
      const { companyId, categoryId, month, actualAmount } = action?.payload;
      const budget = state?.items?.find(b => 
        b?.companyId === companyId && 
        b?.categoryId === categoryId && 
        b?.month === month
      );
      
      if (budget) {
        budget.amountActual = actualAmount;
        budget.updatedAt = new Date()?.toISOString();
      }
    },

    copyBudgetFromPreviousMonth: (state, action) => {
      const { companyId, fromMonth, toMonth } = action?.payload;
      
      const previousBudgets = state?.items?.filter(b => 
        b?.companyId === companyId && b?.month === fromMonth
      );

      previousBudgets?.forEach(prevBudget => {
        // Check if budget already exists for target month
        const existingBudget = state?.items?.find(b => 
          b?.companyId === companyId && 
          b?.categoryId === prevBudget?.categoryId && 
          b?.month === toMonth
        );

        if (!existingBudget) {
          const newBudget = {
            ...prevBudget,
            id: `budget-${Date.now()}-${prevBudget?.categoryId}`,
            month: toMonth,
            amountActual: 0, // Reset actual amount
            createdAt: new Date()?.toISOString(),
            updatedAt: new Date()?.toISOString(),
          };
          state?.items?.push(newBudget);
        }
      });
    },
  },
});

export const {
  addBudget,
  editBudget,
  deleteBudget,
  updateBudgetActual,
  copyBudgetFromPreviousMonth,
} = budgetsSlice?.actions;

export default budgetsSlice?.reducer;