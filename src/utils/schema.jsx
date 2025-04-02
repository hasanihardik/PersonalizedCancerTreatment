import {
  integer,
  varchar,
  pgTable,
  serial,
  text,
  boolean,
  timestamp, // Add timestamp import
} from "drizzle-orm/pg-core";

// users schema
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  age: integer("age").notNull(),
  location: varchar("location").notNull(),
  isOnBoarded: boolean("is_onboarded").default(false),
  createdBy: varchar("created_by").notNull(),
});

// records schema
export const Records = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  recordName: varchar("record_name").notNull(),
  analysisResults: varchar("analysis_result"),
  kanbanRecords: varchar("kanban_records").notNull(),
  createdBy: varchar("created_by").notNull(),
});

// appointments schema
export const AppointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id") // Link to the user who created/owns the appointment
    .references(() => Users.id)
    .notNull(),
  patientName: varchar("patient_name").notNull(),
  appointmentType: varchar("appointment_type").notNull(),
  appointmentDateTime: timestamp("appointment_date_time", { mode: 'string' }).notNull(), // Store as timestamp
  doctorName: varchar("doctor_name").notNull(),
  notes: text("notes"),
  status: varchar("status", { enum: ["Scheduled", "Confirmed", "Completed", "Cancelled"] }).default("Scheduled").notNull(),
  createdBy: varchar("created_by").notNull(), // Email of the user who scheduled it
});

// screenings schema
export const ScreeningsTable = pgTable("screenings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id") // Link to the user associated with the screening
    .references(() => Users.id)
    .notNull(),
  patientName: varchar("patient_name").notNull(), // Or link to a Patients table if one exists
  screeningType: varchar("screening_type").notNull(), // e.g., Mammogram, Biopsy, Colonoscopy
  screeningDate: timestamp("screening_date", { mode: 'string' }).notNull(),
  status: varchar("status", { enum: ["Scheduled", "Completed", "Pending Review", "Action Required", "Cancelled"] }).default("Scheduled").notNull(),
  resultSummary: text("result_summary"), // Brief summary of results
  doctorName: varchar("doctor_name"), // Doctor who ordered or reviewed
  recordId: integer("record_id") // Optional link back to a specific medical record
    .references(() => Records.id),
  createdBy: varchar("created_by").notNull(), // Email of the user who logged it
});
