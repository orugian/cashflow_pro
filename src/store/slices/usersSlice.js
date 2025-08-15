import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../seed';

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState?.users,
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action?.payload,
        id: `user-${Date.now()}`,
        active: true,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
      };
      state?.items?.push(newUser);
    },
    
    updateUser: (state, action) => {
      const { id, ...updates } = action?.payload;
      const user = state?.items?.find(u => u?.id === id);
      if (user) {
        Object.assign(user, updates, { updatedAt: new Date()?.toISOString() });
      }
    },
    
    deleteUser: (state, action) => {
      // Soft delete - mark as inactive
      const user = state?.items?.find(u => u?.id === action?.payload);
      if (user) {
        user.active = false;
        user.updatedAt = new Date()?.toISOString();
      }
    },
    
    setCurrentUser: (state, action) => {
      state.currentUser = action?.payload;
    },
    
    updateCurrentUser: (state, action) => {
      if (state?.currentUser) {
        Object.assign(state?.currentUser, action?.payload, { 
          updatedAt: new Date()?.toISOString(),
        });
        
        // Also update in items array
        const userInItems = state?.items?.find(u => u?.id === state?.currentUser?.id);
        if (userInItems) {
          Object.assign(userInItems, action?.payload, { 
            updatedAt: new Date()?.toISOString(),
          });
        }
      }
    },
    
    updateUserPermissions: (state, action) => {
      const { userId, permissions } = action?.payload;
      const user = state?.items?.find(u => u?.id === userId);
      if (user) {
        user.permissions = { ...user?.permissions, ...permissions };
        user.updatedAt = new Date()?.toISOString();
        
        // Update currentUser if it's the same user
        if (state?.currentUser?.id === userId) {
          state.currentUser.permissions = { ...state?.currentUser?.permissions, ...permissions };
        }
      }
    },
    
    recordUserLogin: (state, action) => {
      const { userId } = action?.payload;
      const user = state?.items?.find(u => u?.id === userId);
      if (user) {
        user.lastLogin = new Date()?.toISOString();
      }
      
      if (state?.currentUser?.id === userId) {
        state.currentUser.lastLogin = new Date()?.toISOString();
      }
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  updateCurrentUser,
  updateUserPermissions,
  recordUserLogin,
} = usersSlice?.actions;

export default usersSlice?.reducer;