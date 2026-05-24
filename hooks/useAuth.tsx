'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAddress: (street: string, city: string, zip: string, country: string) => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  });
  const [error, setError] = useState<string | null>(null);

  // Restore session from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('rk_user');
      const savedToken = localStorage.getItem('rk_token');
      if (savedUser && savedToken) {
        setState({
          user: JSON.parse(savedUser),
          token: savedToken,
          isAuthenticated: true,
          loading: false
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data;
      localStorage.setItem('rk_user', JSON.stringify(user));
      localStorage.setItem('rk_token', token);

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return true;
    } catch (e: any) {
      setError(e.message || 'Incorrect credentials');
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user, token } = data;
      localStorage.setItem('rk_user', JSON.stringify(user));
      localStorage.setItem('rk_token', token);

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
      return true;
    } catch (e: any) {
      setError(e.message || 'Email already exists or invalid details');
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('rk_user');
    localStorage.removeItem('rk_token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    });
    setError(null);
  };

  const updateAddress = async (street: string, city: string, zip: string, country: string): Promise<boolean> => {
    if (!state.user) return false;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ 
          action: 'updateAddress', 
          email: state.user.email,
          address: { street, city, zip, country } 
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      const updatedUser = { ...state.user, address: { street, city, zip, country } };
      localStorage.setItem('rk_user', JSON.stringify(updatedUser));

      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false
      }));
      return true;
    } catch (e: any) {
      setError(e.message || 'Error updating address');
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateAddress, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
