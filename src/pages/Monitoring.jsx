import React from 'react';
import { MetricsCard } from '../components/MetricsCard';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const Monitoring = () => {
  const monitoringMetrics = [
    { title: 'Active Monitoring', value: 8, icon: 'activity', color: 'bg-blue-100' },
    { title: 'Stable Patients', value: 6, icon: 'check', color: 'bg-green-100' },
    { title: 'Critical Alerts', value: 1, icon: 'alert', color: 'bg-red-100' },
    { title: 'Pending Follow-ups', value: 3, icon: 'clock', color: 'bg-yellow-100' },
  ];

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      condition: 'Post-Treatment',
      lastCheck: '2025-04-04',
      status: 'Stable',
      nextAppointment: '2025-04-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      condition: 'High Risk',
      lastCheck: '2025-04-05',
      status: 'Critical',
      nextAppointment: '2025-04-06'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monitoringMetrics.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            className={metric.color}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-[#1C2126] rounded-lg shadow">
        <Table>
          <TableCaption>Patient Monitoring Overview</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Appointment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.lastCheck}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    patient.status === 'Stable' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>{patient.nextAppointment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Monitoring;
