import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const vendorsCustomersSlice = createSlice({
  name: 'vendorsCustomers',
  initialState: initialState?.vendorsCustomers,
  reducers: {
    addVendor: (state, action) => {
      const newVendor = {
        ...action?.payload,
        id: `vendor-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.vendors?.push(newVendor);
    },

    editVendor: (state, action) => {
      const { id, ...updates } = action?.payload;
      const vendor = state?.vendors?.find(v => v?.id === id);
      if (vendor) {
        Object.assign(vendor, updates, {
          updatedAt: new Date()?.toISOString(),
        });
      }
    },

    deleteVendor: (state, action) => {
      state.vendors = state?.vendors?.filter(v => v?.id !== action?.payload);
    },

    addCustomer: (state, action) => {
      const newCustomer = {
        ...action?.payload,
        id: `customer-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.customers?.push(newCustomer);
    },

    editCustomer: (state, action) => {
      const { id, ...updates } = action?.payload;
      const customer = state?.customers?.find(c => c?.id === id);
      if (customer) {
        Object.assign(customer, updates, {
          updatedAt: new Date()?.toISOString(),
        });
      }
    },

    deleteCustomer: (state, action) => {
      state.customers = state?.customers?.filter(c => c?.id !== action?.payload);
    },
  },
});

export const {
  addVendor,
  editVendor,
  deleteVendor,
  addCustomer,
  editCustomer,
  deleteCustomer,
} = vendorsCustomersSlice?.actions;

export default vendorsCustomersSlice?.reducer;