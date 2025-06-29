import React from 'react';
import { useIncidents } from '../IncidentContext';
import { usePatients } from '../PatientContext';
import { useAuth } from '../AuthContext';
import { format, isAfter, startOfToday } from 'date-fns';

const Dashboard: React.FC = () => {
  const { incidents } = useIncidents();
  const { patients } = usePatients();
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  // Helper function to format revenue properly
  const formatRevenue = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Filter incidents based on user role
  const userIncidents = user?.role === 'Patient' 
    ? incidents.filter(inc => inc.patientId === user.patientId)
    : incidents;

  // Next 10 appointments
  const upcomingAppointments = userIncidents
    .filter(inc => inc.status === 'Scheduled' && isAfter(new Date(inc.appointmentDate), startOfToday()))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  // Admin-only data
  const patientAppointmentCounts = patients.map(patient => ({
    ...patient,
    appointmentCount: incidents.filter(inc => inc.patientId === patient.id).length
  })).sort((a, b) => b.appointmentCount - a.appointmentCount).slice(0, 5);

  const completedTreatments = userIncidents.filter(inc => inc.status === 'Completed').length;
  const pendingTreatments = userIncidents.filter(inc => inc.status === 'Scheduled').length;

  const totalRevenue = userIncidents
    .filter(inc => inc.status === 'Completed' && inc.cost)
    .reduce((sum, inc) => {
      const cost = Number(inc.cost) || 0;
      return sum + cost;
    }, 0);

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return {
      month: format(date, 'MMM yyyy'),
      revenue: userIncidents
        .filter(inc => {
          const incDate = new Date(inc.appointmentDate);
          return inc.status === 'Completed' && 
                 inc.cost && 
                 incDate.getMonth() === month && 
                 incDate.getFullYear() === year;
        })
        .reduce((sum, inc) => {
          const cost = Number(inc.cost) || 0;
          return sum + cost;
        }, 0)
    };
  }).reverse();

  // Patient view - organic design
  if (user?.role === 'Patient') {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-10">
        {/* Organic Header */}
        <div className="text-center hand-drawn-border">
          <h1 className="heading-primary text-5xl mb-4">
            Welcome back, {user.email.split('@')[0]}!
          </h1>
          <p className="text-lg text-amber-700 font-medium">Your dental wellness journey continues</p>
        </div>

        {/* Organic KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card card-hover organic-shape p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">My Sessions</p>
                <p className="text-4xl font-bold text-amber-800">{userIncidents.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total appointments</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card card-hover organic-shape p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Completed</p>
                <p className="text-4xl font-bold text-green-800">{completedTreatments}</p>
                <p className="text-xs text-gray-500 mt-1">Successful treatments</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="card card-hover organic-shape p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700 uppercase tracking-wider mb-2">Upcoming</p>
                <p className="text-4xl font-bold text-orange-800">{pendingTreatments}</p>
                <p className="text-xs text-gray-500 mt-1">Scheduled sessions</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Appointments Section */}
        <div className="card organic-shape p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-secondary text-2xl mb-2">My Upcoming Sessions</h2>
              <p className="text-amber-700 font-medium">Your next dental wellness appointments</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 font-medium">No upcoming sessions</p>
              <p className="text-sm text-gray-500 mt-2">Your next appointment will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map(inc => (
                <div key={inc.id} className="flex items-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-6 shadow-sm"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{inc.title}</h4>
                    <p className="text-amber-700 font-medium">
                      {format(new Date(inc.appointmentDate), 'EEEE, MMMM do, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(inc.appointmentDate), 'h:mm a')}
                    </p>
                  </div>
                  <div className="status-badge status-scheduled">
                    {inc.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin view - organic design
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      {/* Organic Header */}
      <div className="text-center hand-drawn-border">
        <h1 className="heading-primary text-5xl mb-4">
          Studio Overview
        </h1>
        <p className="text-lg text-amber-700 font-medium">Crafting beautiful smiles, one patient at a time</p>
      </div>

      {/* Organic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="card card-hover organic-shape p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">Total Patients</p>
              <p className="text-4xl font-bold text-amber-800">{patients.length}</p>
              <p className="text-xs text-gray-500 mt-1">Registered clients</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover organic-shape p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Completed</p>
              <p className="text-4xl font-bold text-green-800">{completedTreatments}</p>
              <p className="text-xs text-gray-500 mt-1">Successful sessions</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover organic-shape p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700 uppercase tracking-wider mb-2">Pending</p>
              <p className="text-4xl font-bold text-orange-800">{pendingTreatments}</p>
              <p className="text-xs text-gray-500 mt-1">Scheduled sessions</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card card-hover organic-shape p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2">Revenue</p>
              <p className="text-4xl font-bold text-purple-800">{formatRevenue(totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total earnings</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Organic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Top Patients */}
        <div className="card organic-shape p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-secondary text-2xl mb-2">Top Patients</h2>
              <p className="text-amber-700 font-medium">Most active clients</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            {patientAppointmentCounts.map((patient, index) => (
              <div key={patient.id} className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{patient.name}</h4>
                  <p className="text-sm text-amber-700">{patient.contact}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-800">{patient.appointmentCount}</p>
                  <p className="text-xs text-gray-500">sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card organic-shape p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-secondary text-2xl mb-2">Revenue Trend</h2>
              <p className="text-amber-700 font-medium">Monthly earnings overview</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={month.month} className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{month.month}</h4>
                  <p className="text-sm text-purple-700">Monthly earnings</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-800">{formatRevenue(month.revenue)}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card organic-shape p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-secondary text-2xl mb-2">Recent Sessions</h2>
            <p className="text-amber-700 font-medium">Latest patient appointments</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          {upcomingAppointments.slice(0, 5).map(inc => (
            <div key={inc.id} className="flex items-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mr-6 shadow-sm"></div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">{inc.title}</h4>
                <p className="text-amber-700 font-medium">{getPatientName(inc.patientId)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(inc.appointmentDate), 'EEEE, MMMM do, yyyy - h:mm a')}
                </p>
              </div>
              <div className="status-badge status-scheduled">
                {inc.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 