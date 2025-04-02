    import React, { useState, useEffect } from 'react';
    import { useUserStateContext } from '../context/UserContext';
    import { useUser } from '@clerk/clerk-react';
    import { eq } from 'drizzle-orm';
    import { db } from '../utils/dbConfig';
    import { Records } from '../utils/schema'; // Only need Records schema now
    import { MetricsCard } from '../components/MetricsCard';
    import { Activity, CheckCircle2, ListChecks, ClipboardList } from 'lucide-react'; // Updated icons
    // Remove chart imports if not used, or keep if adapting charts later
    // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
    // Remove table imports if timeline is removed
    // import {
    //   Table,
    //   TableBody,
    //   TableCaption,
    //   TableCell,
    //   TableHead,
    //   TableHeader,
    //   TableRow,
    // } from '../components/ui/table';

    // Define colors for charts if used
    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    const Monitoring = () => {
      const [monitoringTasks, setMonitoringTasks] = useState([]);
      const [completedTasks, setCompletedTasks] = useState([]);
      const [pendingTasks, setPendingTasks] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const { currentUser } = useUserStateContext();
      const { user } = useUser(); // Clerk user

      // Fetch and process Kanban data from Records
      useEffect(() => {
        const fetchMonitoringData = async () => {
          if (!currentUser || !user) {
            setIsLoading(false);
            return;
          }
          setIsLoading(true);
          setError(null);
          setMonitoringTasks([]);
          setCompletedTasks([]);
          setPendingTasks([]);

          console.log("Monitoring: Fetching records for userId:", currentUser.id); // Log user ID

          try {
            const userRecords = await db.select()
              .from(Records)
              .where(eq(Records.userId, currentUser.id));

            let allMonitoringTasks = [];
            let allCompletedTasks = [];
            let allPendingTasks = [];

            userRecords.forEach(record => {
              if (record.kanbanRecords && record.kanbanRecords !== 'test') {
                try {
                  const kanbanData = JSON.parse(record.kanbanRecords);
                  const columns = kanbanData.columns || [];
                  const tasks = kanbanData.tasks || [];

                  // --- Extract Monitoring Tasks ---
                  const monitoringTasks = tasks.filter(task => {
                    const column = columns.find(col => col.id === task.columnId);
                    return column && column.title === "Monitoring";
                  });
                  allMonitoringTasks = allMonitoringTasks.concat(monitoringTasks.map(task => task.content)); // Store task content

                  // --- Identify Completed vs. Pending Monitoring Tasks ---
                  const completedCategoryTasks = columns.find(col => col.title === "Completed")?.id;
                  const completedTasks = tasks.filter(task => task.columnId === completedCategoryTasks);

                  monitoringTasks.forEach(task => {
                    if (completedTasks.find(completedTask => completedTask.id === task.id)) {
                      allCompletedTasks.push(task.content); // Store task content
                    } else {
                      allPendingTasks.push(task.content); // Store task content
                    }
                  });

                  // Alternative: Check if monitoring tasks exist in other columns like 'To Do', 'In Progress'
                  // const toDoTasks = kanbanData['To Do'] || [];
                  // const inProgressTasks = kanbanData['In Progress'] || [];
                  // monitoringCategoryTasks.forEach(task => {
                  //    if (completedCategoryTasks.includes(task)) {
                  //        allCompletedTasks.push(task);
                  //    } else if (toDoTasks.includes(task) || inProgressTasks.includes(task)) {
                  //        allPendingTasks.push(task);
                  //    }
                  //    // Handle tasks that might be *only* in 'Monitoring' if that's a status itself
                  // });


                } catch (parseError) {
                  console.warn(`Failed to parse kanbanRecords for record ID ${record.id}:`, parseError);
                  // Optionally set a partial error state
                }
              }
            });

            // Remove duplicates if a task appears in multiple records (though unlikely for monitoring tasks?)
            setMonitoringTasks([...new Set(allMonitoringTasks)]);
            setCompletedTasks([...new Set(allCompletedTasks)]);
            // Log fetched records
            console.log("Fetched user records:", userRecords);

            userRecords.forEach(record => {
              console.log(`Processing record ID: ${record.id}, Kanban Data:`, record.kanbanRecords); // Log raw kanban data
              if (record.kanbanRecords && record.kanbanRecords !== 'test') {
                try {
                  const kanbanData = JSON.parse(record.kanbanRecords);
                  console.log(`Parsed Kanban data for record ${record.id}:`, kanbanData); // Log parsed data

                  // --- Extract Monitoring Tasks ---
                  const monitoringCategoryTasks = kanbanData['Monitoring'] || [];
                  console.log(`Found monitoring tasks for record ${record.id}:`, monitoringCategoryTasks); // Log extracted tasks
                  allMonitoringTasks = allMonitoringTasks.concat(monitoringCategoryTasks);

                  // --- Identify Completed vs. Pending Monitoring Tasks ---
                  const completedCategoryTasks = kanbanData['Completed'] || [];
                  console.log(`Found completed tasks for record ${record.id}:`, completedCategoryTasks); // Log completed tasks

                  monitoringCategoryTasks.forEach(task => {
                    if (completedCategoryTasks.includes(task)) {
                      allCompletedTasks.push(task);
                    } else {
                      allPendingTasks.push(task);
                    }
                  });

                } catch (parseError) {
                  console.warn(`Failed to parse kanbanRecords for record ID ${record.id}:`, parseError);
                  // Optionally set a partial error state
                }
              } else {
                 console.log(`Skipping record ID: ${record.id} due to missing or 'test' kanbanRecords.`);
              }
            });

            // Remove duplicates if a task appears in multiple records (though unlikely for monitoring tasks?)
            setMonitoringTasks([...new Set(allMonitoringTasks)]);
            setCompletedTasks([...new Set(allCompletedTasks)]);
            setPendingTasks([...new Set(allPendingTasks)]);

            // Log final state counts
            console.log("Final Monitoring Tasks Count:", [...new Set(allMonitoringTasks)].length);
            console.log("Final Completed Tasks Count:", [...new Set(allCompletedTasks)].length);
            console.log("Final Pending Tasks Count:", [...new Set(allPendingTasks)].length);


          } catch (err) {
            console.error("Failed to fetch or process monitoring data:", err);
            setError("Failed to load monitoring data from records.");
          } finally {
            setIsLoading(false);
          }
        };

        fetchMonitoringData();
      }, [currentUser, user]); // Rerun if user context changes

      // --- Calculate Metrics ---
      const totalMonitoring = monitoringTasks.length;
      const completedMonitoring = completedTasks.length;
      // Ensure pending calculation is accurate based on how tasks were categorized
      const pendingMonitoring = totalMonitoring - completedMonitoring; // Or use allPendingTasks.length if calculated directly

      const monitoringMetrics = [
        { title: 'Total Monitoring Tasks', value: totalMonitoring, icon: ClipboardList, color: 'bg-blue-100' },
        { title: 'Completed Tasks', value: completedMonitoring, icon: CheckCircle2, color: 'bg-green-100' },
        { title: 'Pending/Ongoing Tasks', value: pendingMonitoring, icon: ListChecks, color: 'bg-yellow-100' },
        // Add more relevant metrics if needed
      ];

      // --- Prepare Chart Data (Optional - Adapt or Remove) ---
      // Example: Pie chart for completed vs pending
      const monitoringStatusChartData = [
          { name: 'Completed', value: completedMonitoring },
          { name: 'Pending/Ongoing', value: pendingMonitoring },
      ];


      return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 bg-[#f5f5f5] dark:bg-[#13131a] min-h-screen">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">AI-Driven Monitoring Overview</h1>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Adjusted grid cols */}
            {monitoringMetrics.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                className={metric.color}
                // subtitle="View Details" // Optional: Add click handler later if needed
                // onClick={() => console.log(`Clicked ${metric.title}`)}
              />
            ))}
          </div>

          {/* Loading and Error States */}
          {isLoading && <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading monitoring data...</p>}
          {error && <p className="text-red-500 text-center py-10">{error}</p>}

          {!isLoading && !error && totalMonitoring === 0 && (
             <p className="text-center text-gray-500 dark:text-gray-400 py-10">No monitoring tasks found in your records. Upload a report to generate a plan.</p>
          )}

          {/* Optional: Display Charts or Task Lists */}
          {!isLoading && !error && totalMonitoring > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {/* Example: Displaying Pending Tasks List */}
              <div className="bg-white dark:bg-[#1C2126] p-4 rounded-lg shadow">
                 <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Pending/Ongoing Monitoring Tasks</h2>
                 {pendingTasks.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                       {pendingTasks.map((task, index) => (
                          <li key={index}>{task}</li>
                       ))}
                    </ul>
                 ) : (
                    <p className="text-gray-500 dark:text-gray-400">All monitoring tasks are completed.</p>
                 )}
              </div>

              {/* Example: Displaying Completed Tasks List */}
              <div className="bg-white dark:bg-[#1C2126] p-4 rounded-lg shadow">
                 <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Completed Monitoring Tasks</h2>
                 {completedTasks.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                       {completedTasks.map((task, index) => (
                          <li key={index}>{task}</li>
                       ))}
                    </ul>
                 ) : (
                    <p className="text-gray-500 dark:text-gray-400">No monitoring tasks have been completed yet.</p>
                 )}
              </div>

              {/* Add Charts here if desired, using monitoringStatusChartData or similar */}

            </div>
          )}
        </div>
      );
    };

    export default Monitoring;
