import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const costCentersSlice = createSlice({
  name: 'costCenters',
  initialState: initialState?.costCenters,
  reducers: {
    addCostCenter: (state, action) => {
      const newCostCenter = {
        ...action?.payload,
        id: `cost-center-${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.items?.push(newCostCenter);
    },

    editCostCenter: (state, action) => {
      const { id, ...updates } = action?.payload;
      const costCenter = state?.items?.find(cc => cc?.id === id);
      if (costCenter) {
        Object.assign(costCenter, updates, {
          updatedAt: new Date()?.toISOString(),
        });
      }
    },

    deleteCostCenter: (state, action) => {
      state.items = state?.items?.filter(cc => cc?.id !== action?.payload);
    },

    toggleCostCenterStatus: (state, action) => {
      const costCenter = state?.items?.find(cc => cc?.id === action?.payload);
      if (costCenter) {
        costCenter.active = !costCenter?.active;
        costCenter.updatedAt = new Date()?.toISOString();
      }
    },
  },
});

export const {
  addCostCenter,
  editCostCenter,
  deleteCostCenter,
  toggleCostCenterStatus,
} = costCentersSlice?.actions;

export default costCentersSlice?.reducer;