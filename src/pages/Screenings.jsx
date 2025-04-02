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

const Screenings = () => {
  const screeningMetrics = [
    { title: 'Total Screenings', value: 45, icon: 'stethoscope', color: 'bg-blue-100' },
    { title: 'Completed Screenings', value: 38, icon: 'check', color: 'bg-green-100' },
    { title: 'Pending Review', value: 5, icon: 'clock', color: 'bg-yellow-100' },
    { title: 'Action Required', value: 2, icon: 'alert', color: 'bg-red-100' },
  ];

  const screenings = [
    {
      id: 1,
      patient: 'John Doe',
      type: 'Mammogram',
      date: '2025-04-05',
      status: 'Completed',
      result: 'Normal'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      type: 'Biopsy',
      date: '2025-04-06',
      status: 'Pending Review',
      result: '-'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {screeningMetrics.map((metric, index) => (
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
          <TableCaption>Recent Screening Results</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {screenings.map((screening) => (
              <TableRow key={screening.id}>
                <TableCell>{screening.patient}</TableCell>
                <TableCell>{screening.type}</TableCell>
                <TableCell>{screening.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    screening.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {screening.status}
                  </span>
                </TableCell>
                <TableCell>{screening.result}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Screenings;
