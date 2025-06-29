import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface IncidentFile {
  name: string;
  url: string;
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  treatment?: string;
  nextDate?: string;
  files: IncidentFile[];
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Toothache',
    description: 'Upper molar pain',
    comments: 'Sensitive to cold',
    appointmentDate: '2025-07-01T10:00:00',
    cost: 80,
    status: 'Completed',
    treatment: 'Root canal treatment',
    nextDate: '2025-08-01T10:00:00',
    files: [
      { name: 'invoice.pdf', url: 'data:application/pdf;base64,mock-base64-data' },
      { name: 'xray.png', url: 'data:image/png;base64,mock-base64-data' }
    ]
  },
];

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (i: Omit<Incident, 'id'>) => void;
  updateIncident: (id: string, i: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  getIncidentsByPatient: (patientId: string) => Incident[];
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

// Use specific localStorage keys to avoid conflicts
const INCIDENTS_STORAGE_KEY = 'dental-center-incidents';

export const IncidentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      if (stored) {
        const parsedIncidents = JSON.parse(stored);
        if (Array.isArray(parsedIncidents)) {
          setIncidents(parsedIncidents);
        } else {
          setIncidents(MOCK_INCIDENTS);
          localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(MOCK_INCIDENTS));
        }
      } else {
        setIncidents(MOCK_INCIDENTS);
        localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(MOCK_INCIDENTS));
      }
    } catch (error) {
      setIncidents(MOCK_INCIDENTS);
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(MOCK_INCIDENTS));
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever incidents change (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
      } catch (error) {
        // Handle error silently
      }
    }
  }, [incidents, isInitialized]);

  const addIncident = (i: Omit<Incident, 'id'>) => {
    const newIncident = { ...i, id: 'i' + Date.now() };
    setIncidents(prev => [...prev, newIncident]);
  };

  const updateIncident = (id: string, i: Partial<Incident>) => {
    setIncidents(prev => prev.map(inc => (inc.id === id ? { ...inc, ...i } : inc)));
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const getIncidentsByPatient = (patientId: string) => {
    return incidents.filter(inc => inc.patientId === patientId);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident, updateIncident, deleteIncident, getIncidentsByPatient }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const ctx = useContext(IncidentContext);
  if (!ctx) throw new Error('useIncidents must be used within IncidentProvider');
  return ctx;
}; 