import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PatientView from './pages/PatientView';
import { PatientProvider } from './PatientContext';
import { IncidentProvider } from './IncidentContext';
import IncidentManagement from './pages/IncidentManagement';
import CalendarView from './pages/CalendarView';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;
  
  return (
    <nav className="nav-organic sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Organic Logo and Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="heading-primary text-2xl">
                  Dental Center Management
                </span>
                <span className="text-xs text-amber-600 font-medium tracking-wider">
                  DENTAL STUDIO
                </span>
              </div>
            </div>
          </div>

          {/* Organic Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`nav-link-organic px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-amber-100 text-amber-800 shadow-md' 
                  : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                <span>Overview</span>
              </span>
            </Link>
            
            {user.role === 'Admin' && (
              <>
                <Link 
                  to="/admin" 
                  className={`nav-link-organic px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/admin') 
                      ? 'bg-amber-100 text-amber-800 shadow-md' 
                      : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Patients</span>
                  </span>
                </Link>
                <Link 
                  to="/incidents" 
                  className={`nav-link-organic px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/incidents') 
                      ? 'bg-amber-100 text-amber-800 shadow-md' 
                      : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Sessions</span>
                  </span>
                </Link>
                <Link 
                  to="/calendar" 
                  className={`nav-link-organic px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/calendar') 
                      ? 'bg-amber-100 text-amber-800 shadow-md' 
                      : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Schedule</span>
                  </span>
                </Link>
              </>
            )}
            
            {user.role === 'Patient' && (
              <Link 
                to="/me" 
                className={`nav-link-organic px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive('/me') 
                    ? 'bg-amber-100 text-amber-800 shadow-md' 
                    : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Journey</span>
                </span>
              </Link>
            )}
          </div>

          {/* Organic User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-gray-600">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center border-2 border-amber-300">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user.email.split('@')[0]}</div>
                <div className="text-xs text-amber-600 font-medium uppercase tracking-wider">{user.role}</div>
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="btn-secondary text-sm px-4 py-2"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Exit</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <PatientProvider>
      <AuthProvider>
        <IncidentProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
              <Navbar />
              <main className="fade-in">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute />}> {/* Any logged-in user */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/me" element={<PatientView />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Admin']} />}> {/* Admin only */}
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/incidents" element={<IncidentManagement />} />
                    <Route path="/calendar" element={<CalendarView />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </Router>
        </IncidentProvider>
      </AuthProvider>
    </PatientProvider>
  );
}

export default App;
