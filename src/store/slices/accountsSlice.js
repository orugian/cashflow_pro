import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: initialState?.accounts,
  reducers: {
    addAccount: (state, action) => {
      const newAccount = {
        ...action?.payload,
        id: `acc-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.items?.push(newAccount);
    },
    
    updateAccount: (state, action) => {
      const { id, ...updates } = action?.payload;
      const account = state?.items?.find(a => a?.id === id);
      if (account) {
        Object.assign(account, updates, { updatedAt: new Date()?.toISOString() });
      }
    },
    
    deleteAccount: (state, action) => {
      state.items = state?.items?.filter(a => a?.id !== action?.payload);
    },
    
    updateAccountBalance: (state, action) => {
      const { accountId, amount, type } = action?.payload;
      const account = state?.items?.find(a => a?.id === accountId);
      if (account) {
        const multiplier = type === 'entry' ? 1 : -1;
        account.currentBalance += amount * multiplier;
        account.updatedAt = new Date()?.toISOString();
      }
    },
  },
});

export const { addAccount, updateAccount, deleteAccount, updateAccountBalance } = accountsSlice?.actions;
export default accountsSlice?.reducer;