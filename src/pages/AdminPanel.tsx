import React, { useState } from 'react';
import { usePatients, Patient } from '../PatientContext';
import PatientForm from '../components/PatientForm';

const AdminPanel: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [editing, setEditing] = useState<Patient | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="heading-primary text-4xl mb-3">
          Patient Management
        </h1>
        <p className="text-amber-700 font-medium">Manage patient accounts and information</p>
      </div>

      {/* Add Patient Button */}
      <div className="flex justify-center">
        <button
          className="btn-primary px-8 py-4 text-lg font-semibold"
          onClick={() => { setAdding(true); setEditing(null); }}
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Patient</span>
          </span>
        </button>
      </div>

      {/* Patient Form */}
      {(adding || editing) && (
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="heading-secondary text-2xl mb-2">
              {editing ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <p className="text-gray-600">
              {editing ? 'Update patient information and login credentials' : 'Create a new patient account with login credentials'}
            </p>
          </div>
          <PatientForm
            initialValues={editing ? { 
              name: editing.name, 
              dob: editing.dob, 
              contact: editing.contact, 
              healthInfo: editing.healthInfo,
              email: editing.email,
              password: editing.password,
              isActive: editing.isActive
            } : undefined}
            onSubmit={values => {
              if (editing) {
                updatePatient(editing.id, values);
                setEditing(null);
              } else {
                addPatient(values);
                setAdding(false);
              }
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
            submitLabel={editing ? 'Update Patient' : 'Create Patient'}
          />
        </div>
      )}

      {/* Patients Table */}
      <div className="card p-6">
        <div className="mb-6">
          <h2 className="heading-secondary text-xl mb-2">Patient Directory</h2>
          <p className="text-gray-600">Total Patients: {patients.length}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-amber-200">
                <th className="text-left p-4 font-semibold text-amber-700">Name</th>
                <th className="text-left p-4 font-semibold text-amber-700">Email</th>
                <th className="text-left p-4 font-semibold text-amber-700">Contact</th>
                <th className="text-left p-4 font-semibold text-amber-700">Status</th>
                <th className="text-left p-4 font-semibold text-amber-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-800">{patient.name}</div>
                      <div className="text-sm text-gray-500">DOB: {patient.dob}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700">{patient.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700">{patient.contact}</div>
                  </td>
                  <td className="p-4">
                    <span className={`status-badge ${patient.isActive ? 'status-completed' : 'status-cancelled'}`}>
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        className="btn-secondary px-3 py-1 text-sm"
                        onClick={() => { setEditing(patient); setAdding(false); }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-danger px-3 py-1 text-sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
                            deletePatient(patient.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {patients.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No patients found. Add your first patient to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 