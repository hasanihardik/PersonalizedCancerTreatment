import React, { useState } from 'react';
    import { Button } from '../ui/button';
    import { Input } from '../ui/input'; // Assuming you have an Input component
    import { Label } from '../ui/label'; // Assuming you have a Label component
    import { Textarea } from '../ui/textarea'; // Assuming you have a Textarea component
    import { X } from 'lucide-react';

    const AppointmentModal = ({ isOpen, onClose, onSubmit, loading }) => {
      const [patientName, setPatientName] = useState('');
      const [appointmentType, setAppointmentType] = useState('');
      const [appointmentDate, setAppointmentDate] = useState('');
      const [doctorName, setDoctorName] = useState('');
      const [notes, setNotes] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
          patientName,
          appointmentType,
          appointmentDate, // Ensure this is formatted correctly (e.g., YYYY-MM-DD HH:MM)
          doctorName,
          notes,
        });
      };

      if (!isOpen) return null;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-[#1C2126]">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Schedule New Appointment
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="patientName" className="dark:text-gray-300">Patient Name</Label>
                <Input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="appointmentType" className="dark:text-gray-300">Appointment Type</Label>
                <Input
                  id="appointmentType"
                  type="text"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  placeholder="e.g., Follow-up, Consultation"
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="appointmentDate" className="dark:text-gray-300">Date & Time</Label>
                <Input
                  id="appointmentDate"
                  type="datetime-local" // Use datetime-local for date and time input
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
               <div>
                <Label htmlFor="doctorName" className="dark:text-gray-300">Doctor Name</Label>
                <Input
                  id="doctorName"
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="dark:text-gray-300">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                  {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    // Assuming you have Input, Label, Textarea components in ui folder
    // If not, create basic ones or use standard HTML elements styled with Tailwind
    export { AppointmentModal };
