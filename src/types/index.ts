// Core types for Behörden Navigator.
// Procedures are the central entity — everything else hangs off them.

export type Language = 'en' | 'de';

export type ProcedureStatus = 'not_started' | 'in_progress' | 'completed';

export type StepStatus = 'pending' | 'done' | 'skipped';

// A Behörde procedure — e.g. Anmeldung, Aufenthaltstitel, Steuernummer
export interface Procedure {
  id: string;
  slug: string;
  title_en: string;
  title_de: string;
  summary_en: string;
  summary_de: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_days: number;
  steps: ProcedureStep[];
  required_documents: Document[];
  office_type: string;   // which type of Amt handles this
  bundesland_notes?: string;
  updated_at: string;
}

// A single step within a procedure
export interface ProcedureStep {
  id: string;
  order: number;
  title_en: string;
  title_de: string;
  description_en: string;
  description_de: string;
  tip_en?: string;
  tip_de?: string;
  required_documents: string[];  // document IDs needed at this step
}

// A document required for a procedure
export interface Document {
  id: string;
  name_en: string;
  name_de: string;
  description_en?: string;
  description_de?: string;
  format?: string;   // e.g. "Original + 1 copy", "PDF"
  where_to_get?: string;
}

// User's progress through a procedure
export interface UserProgress {
  procedure_id: string;
  status: ProcedureStatus;
  completed_steps: string[];   // step IDs
  started_at: string;
  updated_at: string;
  notes?: string;
}

// An office (Amt/Behörde) location
export interface Office {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  booking_url?: string;
  hours?: OfficeHours[];
}

export interface OfficeHours {
  day: string;
  open: string;
  close: string;
}

// A chat message in the AI assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}