import React, { useState } from 'react';
import { useIncidents, Incident } from '../IncidentContext';
import { usePatients } from '../PatientContext';
import IncidentForm from '../components/IncidentForm';
import { format } from 'date-fns';

const IncidentManagement: React.FC = () => {
  const { incidents, addIncident, updateIncident, deleteIncident } = useIncidents();
  const { patients } = usePatients();
  const [editing, setEditing] = useState<Incident | null>(null);
  const [adding, setAdding] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Appointment Management</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => { setAdding(true); setEditing(null); }}
      >
        + Add Appointment
      </button>
      {(adding || editing) && (
        <div className="mb-6">
          <IncidentForm
            initialValues={editing ? { 
              patientId: editing.patientId,
              title: editing.title,
              description: editing.description,
              comments: editing.comments,
              appointmentDate: editing.appointmentDate,
              cost: editing.cost,
              status: editing.status,
              treatment: editing.treatment,
              nextDate: editing.nextDate,
              files: editing.files
            } : undefined}
            onSubmit={values => {
              if (editing) {
                updateIncident(editing.id, values);
                setEditing(null);
              } else {
                addIncident(values);
                setAdding(false);
              }
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
            submitLabel={editing ? 'Update' : 'Add'}
          />
        </div>
      )}
      <div className="grid gap-4">
        {incidents.map(inc => (
          <div key={inc.id} className="border rounded p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{inc.title}</h3>
                <p className="text-gray-600">Patient: {getPatientName(inc.patientId)}</p>
                <p className="text-gray-600">Date: {format(new Date(inc.appointmentDate), 'PPP p')}</p>
                <p className="text-gray-600">Status: <span className={`px-2 py-1 rounded text-xs ${
                  inc.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  inc.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{inc.status}</span></p>
                {inc.description && <p className="mt-2">{inc.description}</p>}
                {inc.comments && <p className="mt-1 text-sm text-gray-500">Comments: {inc.comments}</p>}
                {inc.cost && <p className="mt-1 font-medium">Cost: ${inc.cost}</p>}
                {inc.treatment && <p className="mt-1">Treatment: {inc.treatment}</p>}
                {inc.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {inc.files.map((file, index) => (
                        <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                          {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => { setEditing(inc); setAdding(false); }}>Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => deleteIncident(inc.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentManagement; 