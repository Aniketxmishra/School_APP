import React, { createContext, useContext, useState } from 'react';
import permissionService from '../services/permissionService';

// Single source of truth — re-exported for backward compatibility
export { USER_ROLES } from '../../constants/app';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = (userData, permissions = null) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Set permissions in permission service
    if (permissions) {
      permissionService.setUserPermissions(userData, permissions);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Clear permissions from permission service
    permissionService.clearPermissions();
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    permissionService,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};