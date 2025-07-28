
"use client";

import { useRouter } from 'next/navigation';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    avatar?: string | null;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('userId');
            router.push('/auth/signin');
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
          localStorage.removeItem('userId');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [router]);

  const login = (userData: User) => {
    localStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
