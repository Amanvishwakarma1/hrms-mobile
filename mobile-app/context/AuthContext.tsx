import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSecureItem } from '@/utils/storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSecureItem('userToken'),
      getSecureItem('userProfile')
    ]).then(([token, profileStr]) => {
      if (token && profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          setUser({ token, ...profile });
        } catch (e) {
          setUser({ token });
        }
      }
      setIsLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);