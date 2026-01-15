import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// --- CORE TABLES ---

// Event Table: Stores information about each event/venue
export const events = pgTable("event", {
  id: serial("id").primaryKey(),
  
  // Basic Event Details
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(), // Links to a user/owner (Hardcoded 'demo-user' for now)
  
  // Seats.io Integration Field
  // Stores the key returned by Seats.io when a chart is created for this event.
  seatsioEventKey: varchar("seatsio_event_key", { length: 256 }), 
  
  // Timestamps
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// --- EXAMPLE/OPTIONAL TABLES (from a typical T3 Turbo setup) ---
// I've included a basic "Post" table as a common T3 scaffold element.
export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  
  // Timestamps
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// --- ADDITIONAL TABLES (Optional, based on your previous actions file) ---
// These are not strictly necessary but included if you want a complete replica of the system logic.


export const guests = pgTable("guest", {
    id: serial("id").primaryKey(),
    eventId: serial("event_id").notNull().references(() => events.id),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
});

export const resources = pgTable("resource", {
    id: serial("id").primaryKey(),
    eventId: serial("event_id").notNull().references(() => events.id),
    name: varchar("name", { length: 256 }).notNull(),
    costPerUnit: varchar("cost_per_unit", { length: 256 }).notNull(),
});

export const tasks = pgTable("task", {
    id: serial("id").primaryKey(),
    eventId: serial("event_id").notNull().references(() => events.id),
    description: text("description").notNull(),
    assignedTo: varchar("assigned_to", { length: 256 }),
    status: varchar("status", { length: 50 }).default('todo'),
});
