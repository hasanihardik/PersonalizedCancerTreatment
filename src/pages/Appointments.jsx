import React, { useState, useEffect } from 'react';
import { useUserStateContext } from '../context/UserContext';
import { useUser } from '@clerk/clerk-react';
import { eq } from 'drizzle-orm';
import { db } from '../utils/dbConfig';
import { AppointmentsTable } from '../utils/schema';
import { Plus, CalendarDays, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/utils';

// Updated Calendar component with proper icons and styling
const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("p-3", className)}
    classNames={{
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-slate-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-slate-400",
      row: "flex w-full mt-2",
      cell: cn(
        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 dark:[&:has([aria-selected])]:bg-slate-800",
        props.mode === "range"
          ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
          : "[&:has([aria-selected])]:rounded-md"
      ),
      day: cn(
        "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
      ),
      day_range_start: "day-range-start",
      day_range_end: "day-range-end",
      day_selected:
        "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900",
      day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
      day_outside: "text-slate-500 opacity-50 dark:text-slate-400",
      day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
      day_range_middle:
        "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
      day_hidden: "invisible",
      ...classNames,
    }}
    components={{
      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
    }}
    {...props}
  />
);

// MetricsCard component
const MetricsCard = ({ title, value, icon: Icon, className, subtitle, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className={`p-4 rounded-lg shadow flex flex-col cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
        <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
    </div>
  );
};

// AppointmentModal component (placeholder - implement your actual modal)
const AppointmentModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentType: '',
    appointmentDate: '',
    doctorName: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#1C2126] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Schedule New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-[#13131a] dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Appointment Type</label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-[#13131a] dark:border-gray-700"
                required
              >
                <option value="">Select Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-[#13131a] dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-[#13131a] dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-[#13131a] dark:border-gray-700"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Appointments = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useUserStateContext();
  const { user } = useUser();

  // Fetch appointments from DB on component mount and when currentUser changes
  useEffect(() => {
    const fetchAppointments = async () => {
      // Ensure user info is available before fetching
      if (!currentUser || !user || !currentUser.id) {
        console.log("User info not ready, skipping fetch");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await db.select()
          .from(AppointmentsTable)
          .where(eq(AppointmentsTable.userId, currentUser.id))
          .orderBy(AppointmentsTable.appointmentDateTime);

        // Format date for display
        const formattedResult = result.map(app => ({
          ...app,
          displayDate: app.appointmentDateTime ? new Date(app.appointmentDateTime).toLocaleString() : 'N/A'
        }));
        setAppointments(formattedResult);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser, user]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  }

  const handleScheduleAppointment = async (appointmentData) => {
    if (!currentUser || !user || !currentUser.id || !user.primaryEmailAddress) {
      setError("User information is not available. Please ensure you are logged in.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data for insertion
      const dataToInsert = {
        userId: currentUser.id,
        patientName: appointmentData.patientName,
        appointmentType: appointmentData.appointmentType,
        appointmentDateTime: appointmentData.appointmentDate, // Already in ISO format from datetime-local
        doctorName: appointmentData.doctorName,
        notes: appointmentData.notes,
        status: 'Scheduled', // Default status
        createdBy: user.primaryEmailAddress.emailAddress,
      };

      const result = await db.insert(AppointmentsTable)
        .values(dataToInsert)
        .returning(); // Get the newly inserted record

      if (result && result.length > 0) {
        // Format date for display before adding to state
        const newAppointment = {
          ...result[0],
          displayDate: result[0].appointmentDateTime ? new Date(result[0].appointmentDateTime).toLocaleString() : 'N/A'
        };
        setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))); // Add and re-sort
        handleCloseModal();
      } else {
        throw new Error("Failed to save appointment to database.");
      }
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
      setError("Failed to schedule appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics based on appointments data
  const metrics = [
    { title: 'UPCOMING APPOINTMENTS', value: appointments.filter(a => a.status === 'Scheduled' || a.status === 'Confirmed').length, icon: CalendarDays, color: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'PENDING CONFIRMATIONS', value: appointments.filter(a => a.status === 'Scheduled').length, icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { title: 'COMPLETED APPOINTMENTS', value: appointments.filter(a => a.status === 'Completed').length, icon: CheckCircle2, color: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'CANCELLED APPOINTMENTS', value: appointments.filter(a => a.status === 'Cancelled').length, icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 bg-[#f5f5f5] dark:bg-[#13131a] min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Appointments</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-[#1C2126] rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</h3>
                <span className="p-2 rounded-full bg-opacity-20">
                  {React.createElement(metric.icon, { className: "h-5 w-5 text-primary" })}
                </span>
              </div>
              <p className="text-3xl font-bold mt-2">{metric.value}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">View Details</p>
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-[#1C2126] p-4 rounded-lg shadow">
            <div className="p-2">
              <h2 className="text-lg font-medium mb-4 text-center">April 2025</h2>
              <div className="grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                  <div key={i} className="text-center text-sm font-medium">{day}</div>
                ))}
                {/* Sample calendar days */}
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i - 1; // Adjust for month start position
                  if (dayNum < 0 || dayNum >= 30) {
                    return <div key={i} className="h-8 w-full flex items-center justify-center text-gray-400">
                      {dayNum < 0 ? 31 + dayNum : dayNum - 29}
                    </div>;
                  }
                  return (
                    <div 
                      key={i} 
                      className={`h-8 w-full flex items-center justify-center cursor-pointer rounded-full 
                        ${dayNum + 1 === 2 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {dayNum + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleOpenModal}
              className="w-full mt-4 p-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 rounded-md text-white flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-[#1C2126] rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Patient</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-3 text-sm">{appointment.patientName}</td>
                        <td className="px-4 py-3 text-sm">{appointment.appointmentType}</td>
                        <td className="px-4 py-3 text-sm">{appointment.displayDate}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{appointment.doctorName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        {isLoading ? "Loading appointments..." : "No appointments found."}
                      </td>
                    </tr>
                  )}
                  {/* Example appointment for the UI */}
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-3 text-sm">John Doe</td>
                    <td className="px-4 py-3 text-sm">Check-up</td>
                    <td className="px-4 py-3 text-sm">4/4/2025, 4:31:00 PM</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Scheduled
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">Dr. Smith</td>
                  </tr>
                </tbody>
                <caption className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  Upcoming Appointments
                </caption>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for scheduling new appointments */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleScheduleAppointment}
        loading={isLoading}
      />
      
      {/* Error message display */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Appointments;