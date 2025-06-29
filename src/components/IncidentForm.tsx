import React, { useState } from 'react';
import { Incident, IncidentFile } from '../IncidentContext';
import { usePatients } from '../PatientContext';

interface IncidentFormProps {
  initialValues?: Omit<Incident, 'id'>;
  onSubmit: (values: Omit<Incident, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const defaultValues = {
  patientId: '',
  title: '',
  description: '',
  comments: '',
  appointmentDate: '',
  cost: undefined,
  status: 'Scheduled' as const,
  treatment: '',
  nextDate: '',
  files: [] as IncidentFile[],
};

const IncidentForm: React.FC<IncidentFormProps> = ({ initialValues, onSubmit, onCancel, submitLabel }) => {
  const { patients } = usePatients();
  const [values, setValues] = useState<Omit<Incident, 'id'>>(initialValues || defaultValues);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: IncidentFile = {
          name: file.name,
          url: reader.result as string,
        };
        setValues(v => ({ ...v, files: [...v.files, newFile] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setValues(v => ({ ...v, files: v.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.patientId || !values.title || !values.appointmentDate) {
      setError('Patient, Title, and Appointment Date are required.');
      return;
    }
    setError('');
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block font-medium">Patient</label>
        <select name="patientId" value={values.patientId} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
          <option value="">Select Patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Title</label>
        <input name="title" value={values.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea name="description" value={values.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Comments</label>
        <textarea name="comments" value={values.comments} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Appointment Date</label>
        <input name="appointmentDate" type="datetime-local" value={values.appointmentDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label className="block font-medium">Status</label>
        <select name="status" value={values.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {values.status === 'Completed' && (
        <>
          <div>
            <label className="block font-medium">Cost</label>
            <input name="cost" type="number" value={values.cost || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Treatment</label>
            <textarea name="treatment" value={values.treatment} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Next Appointment</label>
            <input name="nextDate" type="datetime-local" value={values.nextDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        </>
      )}
      <div>
        <label className="block font-medium">Files</label>
        <input type="file" multiple onChange={handleFileUpload} className="w-full border px-3 py-2 rounded" />
        {values.files.length > 0 && (
          <div className="mt-2">
            {values.files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <span className="text-sm">{file.name}</span>
                <button type="button" onClick={() => removeFile(index)} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{submitLabel || 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
};

export default IncidentForm; 