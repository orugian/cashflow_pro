import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from './persistence';
import companiesReducer from './slices/companiesSlice';
import accountsReducer from './slices/accountsSlice';
import categoriesReducer from './slices/categoriesSlice';
import vendorsCustomersReducer from './slices/vendorsCustomersSlice';
import costCentersReducer from './slices/costCentersSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetsReducer from './slices/budgetsSlice';
import settingsReducer from './slices/settingsSlice';
import usersReducer from './slices/usersSlice';
import alertsReducer from './slices/alertsSlice';

let saveTimer;

const store = configureStore({
  reducer: {
    companies: companiesReducer,
    accounts: accountsReducer,
    categories: categoriesReducer,
    vendorsCustomers: vendorsCustomersReducer,
    costCenters: costCentersReducer,
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    settings: settingsReducer,
    users: usersReducer,
    alerts: alertsReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/FLUSH', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

// Debounced save function
const debouncedSave = (state) => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => saveState(state));
    } else {
      setTimeout(() => saveState(state), 0);
    }
  }, 500);
};

// Subscribe to store changes for persistence
store?.subscribe(() => {
  debouncedSave(store?.getState());
});

// Cross-tab synchronization
window.addEventListener('storage', (e) => {
  if (e?.key && e?.key?.startsWith('cfp:v1')) {
    try {
      const newState = loadState();
      if (newState) {
        store?.dispatch({ type: 'state/mergeExternal', payload: newState });
      }
    } catch (error) {
      console.error('Error loading external state:', error);
    }
  }
});

export default store;