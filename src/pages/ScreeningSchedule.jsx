import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserStateContext } from '../context/UserContext';
import { useUser } from '@clerk/clerk-react';
import { eq } from 'drizzle-orm';
import { db } from '../utils/dbConfig';
import { Records } from '../utils/schema';
import KanbanBoard from "../components/kanban-board/KanbanBoard";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";

const ScreeningSchedule = () => {
  const location = useLocation();
  const { currentUser } = useUserStateContext();
  const { user } = useUser();

  const [userRecords, setUserRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [kanbanData, setKanbanData] = useState(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isLoadingKanban, setIsLoadingKanban] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch all user records for the dropdown
  useEffect(() => {
    const fetchRecords = async () => {
      if (!currentUser || !user) return;
      setIsLoadingRecords(true);
      setError(null);
      try {
        const records = await db.select({
            id: Records.id,
            recordName: Records.recordName,
            kanbanRecords: Records.kanbanRecords
          })
          .from(Records)
          .where(eq(Records.userId, currentUser.id));
        setUserRecords(records);

        // Load selectedRecordId from localStorage on initial load
        const storedRecordId = localStorage.getItem('selectedRecordId');
        if (storedRecordId) {
          setSelectedRecordId(storedRecordId);
        }

        if (location.state && typeof location.state === 'object') {
            const stateString = JSON.stringify(location.state);
            const matchingRecord = records.find(r => r.kanbanRecords === stateString);
            if (matchingRecord) {
                setSelectedRecordId(matchingRecord.id.toString());
                setKanbanData(location.state);
            }
        }

      } catch (err) {
        console.error("Failed to fetch records:", err);
        setError("Failed to load records list.");
      } finally {
        setIsLoadingRecords(false);
      }
    };
    fetchRecords();
  }, [currentUser, user, location.state]);

  // 2. Load Kanban data when a record is selected from dropdown
  useEffect(() => {
    const loadKanbanForSelectedRecord = () => {
      if (!selectedRecordId) {
        setKanbanData(null);
        return;
      }

      if (kanbanData && userRecords.find(r => r.id.toString() === selectedRecordId)?.kanbanRecords === JSON.stringify(kanbanData)) {
          console.log("Kanban data already loaded from navigation state.");
          return;
      }

      setIsLoadingKanban(true);
      setError(null);
      const selectedRecord = userRecords.find(r => r.id.toString() === selectedRecordId);

      if (selectedRecord && selectedRecord.kanbanRecords && selectedRecord.kanbanRecords !== 'test') {
        try {
          const parsedData = JSON.parse(selectedRecord.kanbanRecords);
          setKanbanData(parsedData);
          console.log(`Loaded Kanban for record ID: ${selectedRecordId}`);
        } catch (parseError) {
          console.error(`Failed to parse Kanban data for record ${selectedRecordId}:`, parseError);
          setError(`Failed to parse treatment plan data for ${selectedRecord.recordName}. It might be corrupted.`);
          setKanbanData(null);
        }
      } else {
        setError(selectedRecord ? `No valid treatment plan data found for ${selectedRecord.recordName}. Please process the report first.` : "Selected record not found.");
        setKanbanData(null);
      }
      setIsLoadingKanban(false);
    };

    loadKanbanForSelectedRecord();
  }, [selectedRecordId, userRecords]);

  const handleRecordSelect = (value) => {
    setSelectedRecordId(value);
    localStorage.setItem('selectedRecordId', value); // Save to localStorage

    if (kanbanData && location.state) {
        const selectedRecord = userRecords.find(r => r.id.toString() === value);
        if (selectedRecord?.kanbanRecords !== JSON.stringify(location.state)) {
            setKanbanData(null);
        }
    }
  };

  const handleReset = () => {
    localStorage.removeItem('selectedRecordId'); // Remove from localStorage
    setSelectedRecordId(null);
    setKanbanData(null);
    setError(null);
  };

  return (
    <div className="px-6 py-4 space-y-6 bg-[#13131a] min-h-screen">
      <h1 className="text-2xl font-semibold text-white">Treatment Plan Board</h1>

      <div className="space-y-2">
        <div className="text-white">
          Select Medical Record
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <CustomSelect
              value={selectedRecordId || ""}
              onChange={(e) => handleRecordSelect(e.target.value)}
              disabled={isLoadingRecords}
              placeholder="Select a record..."
              options={userRecords.map((record) => ({
                value: record.id.toString(),
                label: record.recordName,
              }))}
            />
          </div>

          <Button 
            variant="outline" 
            onClick={handleReset} 
            disabled={!selectedRecordId} 
            className="h-10 px-4 py-2 min-w-[120px] bg-transparent border border-gray-600 text-white hover:bg-gray-800"
          >
            Clear View
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}
      
      {isLoadingKanban && (
        <div className="text-center text-gray-400 py-10">
          Loading treatment plan...
        </div>
      )}

      {/* Kanban Board with horizontal scrolling */}
      {!isLoadingKanban && selectedRecordId && kanbanData && (
        <div className="w-full overflow-x-auto">
          <div className="min-w-max pb-4">
            <KanbanBoard initialData={kanbanData} recordId={selectedRecordId} />
          </div>
        </div>
      )}
      
      {!isLoadingKanban && selectedRecordId && !kanbanData && !error && (
        <div className="text-center text-gray-400 py-10">
          Select a record with a processed treatment plan to view the board.
        </div>
      )}

      {!selectedRecordId && !error && (
        <div className="text-center text-gray-400 py-10">
          Please select a medical record to view its treatment plan.
        </div>
      )}
    </div>
  );
};

export default ScreeningSchedule;
