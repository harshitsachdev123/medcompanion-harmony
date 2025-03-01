
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  instructions: string;
  startDate: Date;
  endDate?: Date | null;
  color: string;
  image?: string;
  prescriber?: string;
  pharmacy?: string;
}

export interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string;
  date: string;
  taken: boolean;
  skipped: boolean;
  lateBy?: number; // Minutes
}

export interface Caregiver {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  notifyOnMissed: boolean;
  notifyOnLow: boolean;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'as-needed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredPharmacy?: string;
  caregivers: Caregiver[];
}
