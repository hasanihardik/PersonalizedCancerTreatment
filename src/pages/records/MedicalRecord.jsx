import { IconCirclePlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import RecordCard from "./components/RecordCard";
import CreateRecordModal from "./components/CreateRecordModal";
import { useNavigate } from "react-router-dom";
import { useUserStateContext } from "../../context/UserContext";
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";

const MedicalRecord = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useUser();
  const { deleteRecord, records, fetchUserRecords, createRecord, currentUser } =
    useUserStateContext();

  useEffect(() => {
    if (currentUser) {
      fetchUserRecords(user.emailAddresses[0].emailAddress);
    }
  }, [currentUser]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setError("");
    setIsModalOpen(true);
  };

  const createFolder = async (foldername) => {
    setLoading(true);
    setError("");

    try {
      if (currentUser) {
        const newRecord = await createRecord({
          userId: currentUser.id,
          recordName: foldername,
          analysisResults: "test",
          kanbanRecords: "test",
          createdBy: user.emailAddresses[0].emailAddress,
        });
        if (newRecord) {
          fetchUserRecords(user.emailAddresses[0].emailAddress);
          handleCloseModal();
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = records.filter(
      (record) => record.recordName === name,
    );
    navigate(`/medical-records/${name}`, { state: filteredRecords[0] });
  };

  const {
    data,
    error: deleteError,
    fetchData,
    loading: deleteLoading,
  } = useFetch(deleteRecord);

  return (
    <div className="flex flex-wrap gap-[26px] bg-[#f5f5f5] dark:bg-[#13131a]">
      {deleteLoading && (
        <BarLoader className="mb-4" width={"100%"} color="36d7b7" />
      )}
      {/* Folder Creation Button */}
      {true && (
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#1c1c24] dark:text-white dark:hover:bg-neutral-800"
          onClick={handleOpenModal}
        >
          <IconCirclePlus className="text-[#1ec070] dark:text-[#1dc071]" />
          Create Record
        </button>
      )}

      {/* Folder Creation Modal with Context Loading/Error as Props */}
      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createFolder}
        loading={loading}
        error={error}
      />
      {/* Records List */}
      <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {records.map((record, index) => (
          <RecordCard
            key={index}
            handleDeleteRecord={fetchData}
            loading={deleteLoading}
            record={record}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default MedicalRecord;
