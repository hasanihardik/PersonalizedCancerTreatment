import React from "react";
import KanbanBoard from "../components/kanban-board/KanbanBoard";
import { useLocation } from "react-router-dom";

const ScreeningSchedule = () => {
  const state = useLocation();
  return (
    <div className="scrollable w-full">
      <KanbanBoard state={state} />
    </div>
  );
};

export default ScreeningSchedule;
