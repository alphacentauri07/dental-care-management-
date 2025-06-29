import React, { useState } from 'react';
import { Patient } from '../PatientContext';

interface PatientFormProps {
  initialValues?: Omit<Patient, 'id'>;
  onSubmit: (values: Omit<Patient, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const defaultValues = {
  name: '',
  dob: '',
  contact: '',
  healthInfo: '',
  email: '',
  password: '',
  isActive: true,
};

const PatientForm: React.FC<PatientFormProps> = ({ initialValues, onSubmit, onCancel, submitLabel }) => {
  const [values, setValues] = useState<Omit<Patient, 'id'>>(initialValues || defaultValues);
  const [confirmPassword, setConfirmPassword] = useState(initialValues?.password || '');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues(v => ({ ...v, [name]: checked }));
    } else {
      setValues(v => ({ ...v, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!values.name || !values.dob || !values.contact || !values.email || !values.password) {
      setError('Name, DOB, Contact, Email, and Password are required.');
      return;
    }

    if (values.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (values.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Full Name *
          </label>
          <input 
            name="name" 
            value={values.name} 
            onChange={handleChange} 
            className="input-field" 
            placeholder="Enter full name"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Date of Birth *
          </label>
          <input 
            name="dob" 
            type="date" 
            value={values.dob} 
            onChange={handleChange} 
            className="input-field" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Contact Number *
          </label>
          <input 
            name="contact" 
            value={values.contact} 
            onChange={handleChange} 
            className="input-field" 
            placeholder="Enter contact number"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input 
            name="email" 
            type="email" 
            value={values.email} 
            onChange={handleChange} 
            className="input-field" 
            placeholder="patient@example.com"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Password *
          </label>
          <input 
            name="password" 
            type="password" 
            value={values.password} 
            onChange={handleChange} 
            className="input-field" 
            placeholder="Set initial password"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Confirm Password *
          </label>
          <input 
            name="confirmPassword" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="input-field" 
            placeholder="Confirm password"
            required 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2">
          Health Information
        </label>
        <textarea 
          name="healthInfo" 
          value={values.healthInfo} 
          onChange={handleChange} 
          className="input-field" 
          rows={3}
          placeholder="Allergies, medical conditions, etc."
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <input 
          name="isActive" 
          type="checkbox" 
          checked={values.isActive} 
          onChange={handleChange} 
          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Account Active (Patient can login)
        </label>
      </div>
      
      <div className="flex gap-4">
        <button 
          type="submit" 
          className="btn-primary px-6 py-3"
        >
          {submitLabel || 'Save Patient'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-secondary px-6 py-3"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PatientForm; 