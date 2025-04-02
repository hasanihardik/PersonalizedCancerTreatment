import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";
import { db } from "../utils/dbConfig";
import { Users, Records } from "../utils/schema";
import { eq } from "drizzle-orm";

const UserStateContext = createContext();

export const UserStateContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleError = (err, customMessage = "An error occurred") => {
    console.error(`${customMessage}: ${err.message}`);
  };

  const fetchUserByEmail = useCallback(async (email) => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();
      setCurrentUser(result.length > 0 ? result[0] : "user-not-found");
    } catch (err) {
      handleError(err);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    const existingUsers = await db
      .select()
      .from(Users)
      .where(eq(Users.username, userData.username))
      .execute();

    const isUsernameTaken = existingUsers.some(
      (user) => user.createdBy !== userData.createdBy,
    );
    if (isUsernameTaken) {
      throw new Error("Username is already taken. Please choose another.");
    }

    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning()
        .execute();

      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      setCurrentUser(newUser[0]);
      return newUser[0];
    } catch (err) {
      handleError(err, err.message || "Failed to create user");
    }
  }, []);

  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (err) {
      handleError(err, "Failed to fetch user records");
    }
  }, []);

  const createRecord = useCallback(async (recordData) => {
    const existingRecords = await db
      .select()
      .from(Records)
      .where(eq(Records.createdBy, recordData.createdBy))
      .execute();

    const isRecordExist = existingRecords.some(
      (record) => record.recordName === recordData.recordName,
    );
    if (isRecordExist) {
      throw new Error("Record name is already taken. Please choose another.");
    }
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (err) {
      handleError(err, "Failed to create record");
    }
  }, []);

  const updateRecord = useCallback(async (recordData) => {
    try {
      const { documentID, ...dataToUpdate } = recordData;
      await db
        .update(Records)
        .set(dataToUpdate)
        .where(eq(Records.id, documentID))
        .returning();
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === documentID ? { ...record, ...dataToUpdate } : record,
        ),
      );
    } catch (err) {
      handleError(err, "Failed to update record");
    }
  }, []);

  const deleteRecord = useCallback(async (recordID) => {
    try {
      await db.delete(Records).where(eq(Records.id, recordID));
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordID),
      );
    } catch (err) {
      handleError(err, "Failed to delete record");
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      users,
      records,
      currentUser,
      fetchUserByEmail,
      createUser,
      fetchUserRecords,
      createRecord,
      updateRecord,
      deleteRecord,
    }),
    [users, records, currentUser],
  );

  return (
    <UserStateContext.Provider value={contextValue}>
      {children}
    </UserStateContext.Provider>
  );
};

export const useUserStateContext = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error(
      "useUserStateContext must be used within a UserStateContextProvider",
    );
  }
  return context;
};
