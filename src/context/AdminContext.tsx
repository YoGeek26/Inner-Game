import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'editor';
  email: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  currentAdmin: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  // Mock admin login (in a real app, this would make an API call)
  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, only accept these credentials
    if (username === 'admin' && password === 'admin123') {
      const adminUser: AdminUser = {
        id: 'admin-1',
        username: 'admin',
        role: 'admin',
        email: 'admin@flirtplay.com'
      };
      
      setCurrentAdmin(adminUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      currentAdmin, 
      login, 
      logout 
    }}>
      {children}
    </AdminContext.Provider>
  );
};
