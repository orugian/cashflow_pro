import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState?.categories,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        ...action?.payload,
        id: `cat-${Date.now()}`,
        active: true,
      };
      state?.items?.push(newCategory);
    },
    
    updateCategory: (state, action) => {
      const { id, ...updates } = action?.payload;
      const category = state?.items?.find(c => c?.id === id);
      if (category) {
        Object.assign(category, updates);
      }
    },
    
    deleteCategory: (state, action) => {
      // Soft delete - mark as inactive
      const category = state?.items?.find(c => c?.id === action?.payload);
      if (category) {
        category.active = false;
      }
    },
    
    reorderCategories: (state, action) => {
      // Handle category reordering for UI
      state.items = action?.payload;
    },
  },
});

export const { addCategory, updateCategory, deleteCategory, reorderCategories } = categoriesSlice?.actions;
export default categoriesSlice?.reducer;