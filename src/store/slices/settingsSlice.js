import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState?.settings,
  reducers: {
    setActiveScope: (state, action) => {
      state.activeScope = action?.payload;
    },

    setActiveCompanyId: (state, action) => {
      state.activeCompanyId = action?.payload;
    },

    updateTheme: (state, action) => {
      state.theme = action?.payload;
    },

    updateDensity: (state, action) => {
      state.density = action?.payload;
    },

    updateLanguage: (state, action) => {
      state.language = action?.payload;
    },

    updateColors: (state, action) => {
      Object.assign(state?.colors, action?.payload);
    },

    updateNotifications: (state, action) => {
      Object.assign(state?.notifications, action?.payload);
    },

    updateAccessibility: (state, action) => {
      Object.assign(state?.accessibility, action?.payload);
    },

    updateTaxes: (state, action) => {
      Object.assign(state?.taxes, action?.payload);
    },

    updateBackup: (state, action) => {
      Object.assign(state?.backup, action?.payload);
    },

    resetSettings: (state) => {
      return initialState?.settings;
    },
  },
});

export const {
  setActiveScope,
  setActiveCompanyId,
  updateTheme,
  updateDensity,
  updateLanguage,
  updateColors,
  updateNotifications,
  updateAccessibility,
  updateTaxes,
  updateBackup,
  resetSettings,
} = settingsSlice?.actions;

export default settingsSlice?.reducer;