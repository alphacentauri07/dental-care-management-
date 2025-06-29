import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { usePatients } from '../PatientContext';
import { useIncidents } from '../IncidentContext';
import { format } from 'date-fns';

const PatientView: React.FC = () => {
  const { user, changePassword } = useAuth();
  const { patients } = usePatients();
  const { incidents } = useIncidents();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!user || user.role !== 'Patient') {
    return <div>Access denied</div>;
  }

  const patient = patients.find(p => p.id === user.patientId);
  const patientIncidents = incidents.filter(inc => inc.patientId === user.patientId);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  // Calculate total spending
  const totalSpent = patientIncidents
    .filter(inc => inc.status === 'Completed' && inc.cost)
    .reduce((sum, inc) => sum + (Number(inc.cost) || 0), 0);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordData.currentPassword !== patient.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    // Change password
    changePassword(patient.id, passwordData.newPassword);
    setPasswordSuccess('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="heading-primary text-4xl mb-3">
          My Patient Profile
        </h1>
        <p className="text-amber-700 font-medium">Welcome back, {patient.name}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-amber-600">{patientIncidents.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Treatments</p>
              <p className="text-3xl font-bold text-green-600">
                {patientIncidents.filter(inc => inc.status === 'Completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-secondary text-2xl">Personal Information</h2>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">{patient.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <p className="text-gray-800">{patient.dob}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Contact Number
                </label>
                <p className="text-gray-800">{patient.contact}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <p className="text-gray-800">{patient.email}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Health Information
                </label>
                <p className="text-gray-800">{patient.healthInfo || 'No health information recorded.'}</p>
              </div>
            </div>
          </div>

          {/* Treatment History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-secondary text-2xl">Treatment History</h2>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            {patientIncidents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No treatment history found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patientIncidents.map(inc => (
                  <div key={inc.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{inc.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(inc.appointmentDate), 'PPP')}
                      </p>
                      {inc.cost && (
                        <p className="text-sm text-purple-600 font-medium">
                          Cost: {formatCurrency(Number(inc.cost))}
                        </p>
                      )}
                    </div>
                    <div className="status-badge status-completed">
                      {inc.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-secondary text-lg">Account Status</h3>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`status-badge ${patient.isActive ? 'status-completed' : 'status-cancelled'}`}>
                  {patient.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions:</span>
                <span className="font-semibold text-gray-800">{patientIncidents.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-semibold text-purple-600">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-secondary text-lg">Security</h3>
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-secondary w-full"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {passwordSuccess}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="input-field"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="input-field"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="input-field"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary flex-1">
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientView; 