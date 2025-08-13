// Storage versioning and migration utilities
const STORAGE_VERSION = '1.0.0';
const STORAGE_KEY_PREFIX = 'cashflow_app_';

export const getStorageKey = (companyId = 'global') => {
  return `${STORAGE_KEY_PREFIX}${companyId}`;
};

const getVersionKey = (companyId = 'global') => {
  return `${STORAGE_KEY_PREFIX}version_${companyId}`;
};

// Data migrations for version compatibility
const migrations = {
  '0.0.0': (data) => {
    // Migration from unversioned to 1.0.0
    return {
      ...data,
      version: '1.0.0',
      migratedAt: new Date()?.toISOString(),
    };
  }
};

const runMigrations = (data, fromVersion = '0.0.0') => {
  let migratedData = { ...data };
  
  Object.keys(migrations)?.sort()?.forEach(version => {
      if (version > fromVersion) {
        migratedData = migrations?.[version](migratedData);
      }
    });
  
  return migratedData;
};

export const loadAppState = async () => {
  try {
    const globalKey = getStorageKey('global');
    const versionKey = getVersionKey('global');
    
    const storedData = localStorage.getItem(globalKey);
    const storedVersion = localStorage.getItem(versionKey) || '0.0.0';
    
    if (!storedData) {
      return null;
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Run migrations if needed
    if (storedVersion !== STORAGE_VERSION) {
      console.log(`Migrating data from version ${storedVersion} to ${STORAGE_VERSION}`);
      let migratedData = runMigrations(parsedData, storedVersion);
      
      // Save migrated data
      await saveAppState(migratedData);
      
      return migratedData;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to load app state:', error);
    return null;
  }
};

export const saveAppState = async (state) => {
  try {
    const globalKey = getStorageKey('global');
    const versionKey = getVersionKey('global');
    
    // Add metadata
    const dataToSave = {
      ...state,
      version: STORAGE_VERSION,
      lastSaved: new Date()?.toISOString(),
    };
    
    // Save main data
    localStorage.setItem(globalKey, JSON.stringify(dataToSave));
    localStorage.setItem(versionKey, STORAGE_VERSION);
    
    // Also save per-company backups
    if (state?.companies) {
      state?.companies?.forEach(company => {
        const companyData = {
          company,
          accounts: state?.accounts?.filter(a => a?.companyId === company?.id) || [],
          transactions: state?.transactions?.filter(t => t?.companyId === company?.id) || [],
          budgets: state?.budgets?.filter(b => b?.companyId === company?.id) || [],
          vendors: state?.vendors?.filter(v => v?.companyId === company?.id) || [],
          customers: state?.customers?.filter(c => c?.companyId === company?.id) || [],
          version: STORAGE_VERSION,
          savedAt: new Date()?.toISOString(),
        };
        
        localStorage.setItem(
          getStorageKey(company?.id), 
          JSON.stringify(companyData)
        );
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save app state:', error);
    
    // Try to save essential data only if full save fails
    try {
      const essentialData = {
        companies: state?.companies || [],
        currentCompanyId: state?.currentCompanyId,
        currentUser: state?.currentUser,
        systemPreferences: state?.systemPreferences || {},
        version: STORAGE_VERSION,
        lastSaved: new Date()?.toISOString(),
      };
      
      localStorage.setItem(
        getStorageKey('essential'), 
        JSON.stringify(essentialData)
      );
      
      return false;
    } catch (essentialError) {
      console.error('Failed to save essential data:', essentialError);
      return false;
    }
  }
};

export const exportCompanyData = (companyId) => {
  try {
    const companyKey = getStorageKey(companyId);
    const companyData = localStorage.getItem(companyKey);
    
    if (companyData) {
      return JSON.parse(companyData);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to export company data:', error);
    return null;
  }
};

export const importCompanyData = async (companyData) => {
  try {
    if (!companyData?.company || !companyData?.company?.id) {
      throw new Error('Invalid company data format');
    }
    
    const companyKey = getStorageKey(companyData?.company?.id);
    localStorage.setItem(companyKey, JSON.stringify({
      ...companyData,
      importedAt: new Date()?.toISOString(),
    }));
    
    return true;
  } catch (error) {
    console.error('Failed to import company data:', error);
    return false;
  }
};

export const clearStorageData = (companyId = null) => {
  try {
    if (companyId) {
      localStorage.removeItem(getStorageKey(companyId));
      localStorage.removeItem(getVersionKey(companyId));
    } else {
      // Clear all app data
      Object.keys(localStorage)?.forEach(key => {
        if (key?.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to clear storage data:', error);
    return false;
  }
};

export const getStorageInfo = () => {
  try {
    const info = {
      globalDataSize: 0,
      companyDataSizes: {},
      totalSize: 0,
      version: STORAGE_VERSION,
    };
    
    Object.keys(localStorage)?.forEach(key => {
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const size = localStorage.getItem(key)?.length || 0;
        info.totalSize += size;
        
        if (key === getStorageKey('global')) {
          info.globalDataSize = size;
        } else if (key?.includes('company-')) {
          const companyId = key?.replace(getStorageKey(''), '');
          info.companyDataSizes[companyId] = size;
        }
      }
    });
    
    return info;
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return null;
  }
};

// Validation functions
export const validateStorageData = (data) => {
  const errors = [];
  
  if (!data) {
    errors?.push('No data provided');
    return errors;
  }
  
  // Required fields
  const requiredFields = ['companies', 'accounts', 'transactions', 'categories'];
  requiredFields?.forEach(field => {
    if (!data?.[field] || !Array.isArray(data?.[field])) {
      errors?.push(`Missing or invalid ${field} array`);
    }
  });
  
  // Validate data structure
  if (data?.companies) {
    data?.companies?.forEach((company, index) => {
      if (!company?.id || !company?.cnpj) {
        errors?.push(`Company ${index}: Missing required fields (id, cnpj)`);
      }
    });
  }
  
  if (data?.accounts) {
    data?.accounts?.forEach((account, index) => {
      if (!account?.id || !account?.companyId || !account?.bank) {
        errors?.push(`Account ${index}: Missing required fields (id, companyId, bank)`);
      }
    });
  }
  
  if (data?.transactions) {
    data?.transactions?.forEach((transaction, index) => {
      if (!transaction?.id || !transaction?.companyId || !transaction?.accountId) {
        errors?.push(`Transaction ${index}: Missing required fields (id, companyId, accountId)`);
      }
    });
  }
  
  return errors;
};

export default {
  loadAppState,
  saveAppState,
  exportCompanyData,
  importCompanyData,
  clearStorageData,
  getStorageInfo,
  validateStorageData,
  getStorageKey,
};