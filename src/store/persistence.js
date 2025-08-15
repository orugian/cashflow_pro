const APP_STATE_VERSION = 1;
const STORAGE_KEY = `cfp:v${APP_STATE_VERSION}`;

// Migrations for version compatibility
const migrations = {
  0: (state) => {
    // Migration from unversioned to version 1
    return {
      ...state,
      version: 1,
      migratedAt: new Date()?.toISOString(),
    };
  },
};

const migrate = (raw, fromVersion) => {
  let currentState = { ...raw };
  
  for (let version = fromVersion; version < APP_STATE_VERSION; version++) {
    if (migrations?.[version]) {
      currentState = migrations?.[version](currentState);
    }
  }
  
  return currentState;
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    
    const state = JSON.parse(serializedState);
    const storedVersion = state?.version || 0;
    
    if (storedVersion < APP_STATE_VERSION) {
      return migrate(state, storedVersion);
    }
    
    return state;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    // Only save serializable slices, omit large UI caches
    const serializableState = {
      companies: state?.companies,
      accounts: state?.accounts,
      categories: state?.categories,
      vendorsCustomers: state?.vendorsCustomers,
      costCenters: state?.costCenters,
      transactions: state?.transactions,
      budgets: state?.budgets,
      settings: state?.settings,
      users: state?.users,
      alerts: state?.alerts,
      version: APP_STATE_VERSION,
      lastSaved: new Date()?.toISOString(),
    };
    
    const serializedState = JSON.stringify(serializableState);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};