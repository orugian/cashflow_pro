import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const companiesSlice = createSlice({
  name: 'companies',
  initialState: initialState?.companies,
  reducers: {
    addCompany: (state, action) => {
      const newCompany = {
        ...action?.payload,
        id: `company-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.items?.push(newCompany);
    },
    
    updateCompany: (state, action) => {
      const { id, ...updates } = action?.payload;
      const company = state?.items?.find(c => c?.id === id);
      if (company) {
        Object.assign(company, updates, { updatedAt: new Date()?.toISOString() });
      }
    },
    
    deleteCompany: (state, action) => {
      state.items = state?.items?.filter(c => c?.id !== action?.payload);
    },
    
    setActiveCompanyId: (state, action) => {
      // This will be handled in settings slice
      // but kept here for backward compatibility
    },
  },
});

export const { addCompany, updateCompany, deleteCompany, setActiveCompanyId } = companiesSlice?.actions;
export default companiesSlice?.reducer;