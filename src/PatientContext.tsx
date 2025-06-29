import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
  email: string;
  password: string;
  isActive: boolean;
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    dob: '1990-05-10',
    contact: '1234567890',
    healthInfo: 'No allergies',
    email: 'john@entnt.in',
    password: 'patient123',
    isActive: true,
  },
];

interface PatientContextType {
  patients: Patient[];
  addPatient: (p: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, p: Omit<Patient, 'id'>) => void;
  deletePatient: (id: string) => void;
  getPatientByEmail: (email: string) => Patient | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Use specific localStorage keys to avoid conflicts
const PATIENTS_STORAGE_KEY = 'dental-center-patients';

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (stored) {
        const parsedPatients = JSON.parse(stored);
        if (Array.isArray(parsedPatients)) {
          setPatients(parsedPatients);
        } else {
          setPatients(MOCK_PATIENTS);
          localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(MOCK_PATIENTS));
        }
      } else {
        setPatients(MOCK_PATIENTS);
        localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(MOCK_PATIENTS));
      }
    } catch (error) {
      setPatients(MOCK_PATIENTS);
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(MOCK_PATIENTS));
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever patients change (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
      } catch (error) {
        // Handle error silently
      }
    }
  }, [patients, isInitialized]);

  const addPatient = (p: Omit<Patient, 'id'>) => {
    const newPatient = { ...p, id: 'p' + Date.now() };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, p: Omit<Patient, 'id'>) => {
    setPatients(prev => prev.map(pt => (pt.id === id ? { ...pt, ...p } : pt)));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(pt => pt.id !== id));
  };

  const getPatientByEmail = (email: string) => {
    return patients.find(p => p.email === email);
  };

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, getPatientByEmail }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatients must be used within PatientProvider');
  return ctx;
}; 