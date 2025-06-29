import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePatients } from './PatientContext';

export type UserRole = 'Admin' | 'Patient';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  password: string;
  patientId?: string;
}

const USERS: User[] = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  changePassword: (patientId: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use specific localStorage keys to avoid conflicts
const AUTH_USER_STORAGE_KEY = 'dental-center-auth-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { patients, updatePatient } = usePatients();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Check admin users first
    const adminUser = USERS.find(u => u.email === email && u.password === password);
    if (adminUser) {
      setUser(adminUser);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(adminUser));
      return true;
    }
    
    // Check patient users
    const patient = patients.find(p => p.email === email && p.password === password && p.isActive);
    if (patient) {
      const patientUser: User = {
        id: patient.id,
        role: 'Patient',
        email: patient.email,
        password: patient.password,
        patientId: patient.id
      };
      setUser(patientUser);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(patientUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  };

  const changePassword = (patientId: string, newPassword: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      updatePatient(patientId, { ...patient, password: newPassword });
      
      // Update current user if they are the one changing password
      if (user && user.patientId === patientId) {
        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 