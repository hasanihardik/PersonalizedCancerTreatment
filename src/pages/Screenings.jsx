import React, { useState, useEffect } from 'react';
import { useUserStateContext } from '../context/UserContext';
import { useUser } from '@clerk/clerk-react';
import { eq } from 'drizzle-orm';
import { db } from '../utils/dbConfig';
import { Records } from '../utils/schema'; // Switch to Records schema
import { MetricsCard } from '../components/MetricsCard';
import { Stethoscope, CheckCircle2, Clock, ListChecks, ClipboardList } from 'lucide-react'; // Updated icons
// Remove Table imports if not displaying a table of screenings anymore
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '../components/ui/table';

// Keywords to identify screening-related tasks (case-insensitive)
const SCREENING_KEYWORDS = ['screening', 'scan', 'mri', 'ct', 'imaging', 'biopsy', 'test', 'colonoscopy', 'mammogram', 'genetic testing'];

// Helper function to check if a task is screening-related
const isScreeningTask = (taskDescription) => {
  if (!taskDescription || typeof taskDescription !== 'string') return false;
  const lowerCaseDesc = taskDescription.toLowerCase();
  return SCREENING_KEYWORDS.some(keyword => lowerCaseDesc.includes(keyword));
};


const Screenings = () => {
  const [screeningTasks, setScreeningTasks] = useState([]);
  const [completedScreenings, setCompletedScreenings] = useState([]);
  const [pendingScreenings, setPendingScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUserStateContext();
  const { user } = useUser(); // Clerk user

  // Fetch and process Kanban data from Records
  useEffect(() => {
    const fetchScreeningData = async () => {
      if (!currentUser || !user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      setScreeningTasks([]);
      setCompletedScreenings([]);
      setPendingScreenings([]);

      console.log("Screenings: Fetching records for userId:", currentUser.id); // Log user ID

      try {
        const userRecords = await db.select()
          .from(Records)
          .where(eq(Records.userId, currentUser.id));

        let allIdentifiedScreenings = [];
        let allCompletedScreenings = [];
        let allPendingScreenings = [];

        userRecords.forEach(record => {
          if (record.kanbanRecords && record.kanbanRecords !== 'test') {
            try {
              const kanbanData = JSON.parse(record.kanbanRecords);
              const columns = kanbanData.columns || [];
              const tasks = kanbanData.tasks || [];

              // --- Extract Screening Tasks ---
              tasks.forEach(task => {
                const column = columns.find(col => col.id === task.columnId);
                if (isScreeningTask(task.content)) {
                  allIdentifiedScreenings.push(task.content);

                  const completedCategoryTasks = columns.find(col => col.title === "Completed")?.id;
                  if (task.columnId === completedCategoryTasks) {
                    allCompletedScreenings.push(task.content);
                  } else {
                    allPendingScreenings.push(task.content);
                  }
                }
              });

            } catch (parseError) {
              console.warn(`Failed to parse kanbanRecords for record ID ${record.id}:`, parseError);
            }
          }
        });

        // Remove duplicates
        setScreeningTasks([...new Set(allIdentifiedScreenings)]);
        setCompletedScreenings([...new Set(allCompletedScreenings)]);
        // Log fetched records
        console.log("Fetched user records for Screenings:", userRecords);

        userRecords.forEach(record => {
          console.log(`Processing record ID: ${record.id} for Screenings, Kanban Data:`, record.kanbanRecords); // Log raw kanban data
          if (record.kanbanRecords && record.kanbanRecords !== 'test') {
            try {
              const kanbanData = JSON.parse(record.kanbanRecords);
              console.log(`Parsed Kanban data for record ${record.id} (Screenings):`, kanbanData); // Log parsed data
              const completedTasksList = kanbanData['Completed'] || [];
              console.log(`Found completed tasks for record ${record.id} (Screenings):`, completedTasksList); // Log completed tasks

              // Iterate through all tasks in all columns to identify screenings
              Object.values(kanbanData).forEach(columnTasks => {
                if (Array.isArray(columnTasks)) {
                  columnTasks.forEach(task => {
                    if (isScreeningTask(task)) {
                      console.log(`Identified screening task: "${task}" in record ${record.id}`); // Log identified task
                      allIdentifiedScreenings.push(task); // Add to total identified

                      if (completedTasksList.includes(task)) {
                        allCompletedScreenings.push(task);
                      } else {
                        allPendingScreenings.push(task);
                      }
                    }
                  });
                }
              });

            } catch (parseError) {
              console.warn(`Failed to parse kanbanRecords for record ID ${record.id} (Screenings):`, parseError);
            }
          } else {
            console.log(`Skipping record ID: ${record.id} (Screenings) due to missing or 'test' kanbanRecords.`);
          }
        });

        // Remove duplicates
        setScreeningTasks([...new Set(allIdentifiedScreenings)]);
        setCompletedScreenings([...new Set(allCompletedScreenings)]);
        setPendingScreenings([...new Set(allPendingScreenings)]);

        // Log final state counts
        console.log("Final Screening Tasks Count:", [...new Set(allIdentifiedScreenings)].length);
        console.log("Final Completed Screenings Count:", [...new Set(allCompletedScreenings)].length);
        console.log("Final Pending Screenings Count:", [...new Set(allPendingScreenings)].length);


      } catch (err) {
        console.error("Failed to fetch or process screening data:", err);
        setError("Failed to load screening data from records.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreeningData();
  }, [currentUser, user]);

  // --- Calculate Metrics ---
  const totalScreenings = screeningTasks.length;
  const completedCount = completedScreenings.length;
  const pendingCount = pendingScreenings.length; // Use direct count

  const screeningMetrics = [
    { title: 'Total AI Identified Screenings', value: totalScreenings, icon: ClipboardList, color: 'bg-purple-100' },
    { title: 'Completed Screenings', value: completedCount, icon: CheckCircle2, color: 'bg-green-100' },
    { title: 'Pending/Scheduled Screenings', value: pendingCount, icon: ListChecks, color: 'bg-yellow-100' },
    // Add more relevant metrics if needed
  ];


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 bg-[#f5f5f5] dark:bg-[#13131a] min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">AI-Driven Screening Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Adjusted grid cols */}
        {screeningMetrics.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            className={metric.color}
            // subtitle="View Details" // Optional
            // onClick={() => console.log(`Clicked ${metric.title}`)}
          />
        ))}
      </div>

      {/* Loading and Error States */}
      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading screening data...</p>}
      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      {!isLoading && !error && totalScreenings === 0 && (
         <p className="text-center text-gray-500 dark:text-gray-400 py-10">No screening tasks identified in your records. Upload a report to generate a plan.</p>
      )}

      {/* Optional: Display Task Lists */}
      {!isLoading && !error && totalScreenings > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Screenings List */}
          <div className="bg-white dark:bg-[#1C2126] p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Pending/Scheduled Screenings</h2>
             {pendingScreenings.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                   {pendingScreenings.map((task, index) => (
                      <li key={index}>{task}</li>
                   ))}
                </ul>
             ) : (
                <p className="text-gray-500 dark:text-gray-400">All identified screening tasks are completed.</p>
             )}
          </div>

          {/* Completed Screenings List */}
          <div className="bg-white dark:bg-[#1C2126] p-4 rounded-lg shadow">
             <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Completed Screenings</h2>
             {completedScreenings.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                   {completedScreenings.map((task, index) => (
                      <li key={index}>{task}</li>
                   ))}
                </ul>
             ) : (
                <p className="text-gray-500 dark:text-gray-400">No screening tasks have been completed yet.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenings;
