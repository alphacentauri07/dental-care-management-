import React, { useState } from 'react';
import { useIncidents } from '../IncidentContext';
import { usePatients } from '../PatientContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const CalendarView: React.FC = () => {
  const { incidents } = useIncidents();
  const { patients } = usePatients();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getIncidentsForDate = (date: Date) => {
    return incidents.filter(inc => isSameDay(new Date(inc.appointmentDate), date));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="text-xl font-semibold px-4 py-2">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 bg-white border rounded-lg overflow-hidden">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center font-semibold bg-gray-100">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayIncidents = getIncidentsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-2 border cursor-pointer ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${isSelected ? 'bg-blue-100 border-blue-500' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayIncidents.slice(0, 2).map(inc => (
                  <div
                    key={inc.id}
                    className={`text-xs p-1 rounded truncate ${
                      inc.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      inc.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                    title={`${getPatientName(inc.patientId)} - ${inc.title}`}
                  >
                    {getPatientName(inc.patientId)} - {inc.title}
                  </div>
                ))}
                {dayIncidents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayIncidents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Appointments for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          {getIncidentsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500">No appointments scheduled for this date.</p>
          ) : (
            <div className="space-y-3">
              {getIncidentsForDate(selectedDate).map(inc => (
                <div key={inc.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{inc.title}</h4>
                      <p className="text-gray-600">Patient: {getPatientName(inc.patientId)}</p>
                      <p className="text-gray-600">Time: {format(new Date(inc.appointmentDate), 'h:mm a')}</p>
                      <p className="text-gray-600">Status: <span className={`px-2 py-1 rounded text-xs ${
                        inc.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        inc.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{inc.status}</span></p>
                      {inc.description && <p className="mt-1">{inc.description}</p>}
                      {inc.cost && <p className="mt-1 font-medium">Cost: ${inc.cost}</p>}
                      {inc.treatment && <p className="mt-1">Treatment: {inc.treatment}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView; 