import React, { useEffect, useState } from "react";
import { isJSON, useMetricsData } from "../lib/utils";
import { MetricsCard } from "./MetricsCard";
import { useUserStateContext } from "../context/UserContext";

const DisplayInfo = () => {
  const { records, currentUser } = useUserStateContext();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    totalScreenings: 0,
    personalScreenings: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
    completedScreenings: 0,
    upcomingScreenings: 0,
    followUpsRequired: 0,
    monitoringTasks: 0,
  });

  useEffect(() => {
    if (currentUser) {
      try {
        const totalFolders = records.length;
        let totalScreenings = 0;
        let completedScreenings = 0;
        let pendingScreenings = 0;
        let overdueScreenings = 0;
        let upcomingScreenings = 0;
        let followUpsRequired = 0;
        let monitoringTasks = 0;

        records.forEach((record) => {
          if (record.kanbanRecords) {
            try {
              let kanban;
              if (isJSON(record.kanbanRecords)) {
                kanban = JSON.parse(record.kanbanRecords);
              } else {
                kanban = undefined;
              }
              totalScreenings += kanban?.tasks?.length || 0;
              completedScreenings +=
                kanban?.tasks.filter((task) => task.columnId === "done")
                  .length || 0;
              pendingScreenings +=
                kanban?.tasks?.filter((task) => task.columnId === "doing")
                  .length || 0;
              overdueScreenings +=
                kanban?.tasks?.filter((task) => task.columnId === "overdue")
                  .length || 0;
              upcomingScreenings +=
                kanban?.tasks.filter((task) => task.columnId === "upcoming")
                  .length || 0;
              followUpsRequired +=
                kanban?.tasks.filter((task) => task.columnId === "followup")
                  .length || 0;
              monitoringTasks +=
                kanban?.tasks.filter((task) => task.columnId === "monitoring")
                  .length || 0;
            } catch (error) {
              console.error("Failed to parse kanbanRecords:", error);
            }
          }
        });

        setMetrics({
          totalFolders,
          totalScreenings,
          completedScreenings,
          pendingScreenings,
          overdueScreenings,
          upcomingScreenings,
          followUpsRequired,
          monitoringTasks,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [records, currentUser]);

  const metricsData = useMetricsData(metrics);

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        {metricsData.slice(0, 2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>
      <div className="mt-[9px] grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {metricsData.slice(2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default DisplayInfo;
