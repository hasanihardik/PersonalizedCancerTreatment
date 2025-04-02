import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const useMetricsData = (metrics) => {
  const navigate = useNavigate();
  return [
    {
      title: "Pending Specialist Consultations",
      subtitle: "View Pending",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/appointments"),
    },
    {
      title: "Current Treatment Progress",
      subtitle: "Progress Overview",
      value: `${metrics.completedScreenings} of ${metrics.totalScreenings}`,
      icon: IconCircleDashedCheck,
      onClick: () => navigate("/treatment-progress"),
    },
    {
      title: "Total Patient Records",
      subtitle: "Access Records",
      value: metrics.totalFolders,
      icon: IconFolder,
      onClick: () => navigate("/medical-records"),
    },
    {
      title: "Overall Screenings Conducted",
      subtitle: "Total Screenings",
      value: metrics.totalScreenings,
      icon: IconUserScan,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Completed Screenings Summary",
      subtitle: "Review Completed",
      value: metrics.completedScreenings,
      icon: IconCircleDashedCheck,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Pending Screenings for Review",
      subtitle: "Awaiting Review",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Overdue Screenings Needing Action",
      subtitle: "Action Required",
      value: metrics.overdueScreenings,
      icon: IconAlertCircle,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Upcoming Screenings Scheduled",
      subtitle: "Upcoming Appointments",
      value: metrics.upcomingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings"),
    },
    {
      title: "Monitoring Tasks in Progress",
      subtitle: "Monitoring Tasks",
      value: metrics.monitoringTasks,
      icon: IconAlertCircle,
      onClick: () => navigate("/monitoring"),
    },
    {
      title: "Follow-up Appointments Required",
      subtitle: "Required Follow-ups",
      value: metrics.followUpsRequired,
      icon: IconAlertCircle,
      onClick: () => navigate("/appointments"),
    },
  ];
};

export const promptDataStructure = ({ analysisResult }) => {
  const prompt = `Your role is to develop a comprehensive treatment plan based on the analysis results provided: ${analysisResult}. The treatment plan should encompass the following columns:

  - To Do: Initiate essential tasks critical to the patient's care.
  - In Progress: Monitor tasks currently underway, ensuring adherence to established treatment protocols.
  - Completed: Document tasks that have been successfully finalized and are no longer active.
  - Follow-Up: Outline tasks necessitating future actions or assessments following the initial treatment phase.
  - Monitoring: Conduct continuous observations and evaluations critical to patient safety and the efficacy of the treatment plan.
  - Overdue: Identify tasks that have surpassed their designated deadlines and require immediate attention for resolution.
  - Upcoming: Highlight tasks scheduled for the near future to ensure proactive management and continuity of care.
  
  Each task must include a precise description pertinent to the patient's treatment journey, categorized accurately according to its current status.
  
  Please ensure the output adheres to the following structure for seamless front-end integration. The JSON string must be valid and presented without quotations, just the pure structure below:
  
  {
    "columns": [
      { "id": "todo", "title": "To Do" },
      { "id": "doing", "title": "In Progress" },
      { "id": "done", "title": "Completed" },
      { "id": "followup", "title": "Follow-Up" },
      { "id": "monitoring", "title": "Monitoring" },
      { "id": "overdue", "title": "Overdue" },
      { "id": "upcoming", "title": "Upcoming" }
    ],
    "tasks": [
      { "id": "1", "columnId": "todo", "content": "Perform a comprehensive patient assessment, including thorough history-taking and physical examination." },
      { "id": "2", "columnId": "todo", "content": "Order essential laboratory tests and diagnostic imaging to facilitate accurate diagnosis." },
      { "id": "3", "columnId": "doing", "content": "Administer prescribed pharmacological therapies while closely evaluating patient responses." },
      { "id": "4", "columnId": "doing", "content": "Facilitate educational sessions for patients regarding treatment protocols and anticipated outcomes." },
      { "id": "5", "columnId": "done", "content": "Finalize discharge planning, ensuring all follow-up appointments are scheduled appropriately." },
      { "id": "6", "columnId": "followup", "content": "Schedule a follow-up consultation to evaluate the effectiveness and any adjustments needed for the treatment plan." },
      { "id": "7", "columnId": "followup", "content": "Review laboratory results in detail and make necessary adjustments to the treatment regimen as required." },
      { "id": "8", "columnId": "monitoring", "content": "Continuously monitor vital signs, documenting any deviations from expected physiological ranges." },
      { "id": "9", "columnId": "monitoring", "content": "Assess and document potential adverse reactions to medications, reporting findings to the healthcare team promptly." },
      { "id": "10", "columnId": "overdue", "content": "Reassess any delayed laboratory tests that require immediate resolution." },
      { "id": "11", "columnId": "overdue", "content": "Follow up on overdue medication refills that have not been addressed, ensuring patient compliance." },
      { "id": "12", "columnId": "upcoming", "content": "Plan and schedule the next patient review meeting to discuss ongoing treatment." },
      { "id": "13", "columnId": "upcoming", "content": "Prepare for the next scheduled imaging tests required for further diagnostic evaluations." }
    ]
  }
  `;

  return prompt;
};

export function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
