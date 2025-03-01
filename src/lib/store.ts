
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medication, Reminder, Caregiver, User } from '@/types';
import { format } from 'date-fns';

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample medications for demonstration
const sampleMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin',
    dosage: '10mg',
    frequency: 'daily',
    timeOfDay: ['evening'],
    instructions: 'Take with food',
    startDate: new Date(),
    color: '#2E74FF',
    prescriber: 'Dr. Smith',
    pharmacy: 'MedPlus Pharmacy',
  },
  {
    id: 'med-2',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'daily',
    timeOfDay: ['morning', 'evening'],
    instructions: 'Take with a full glass of water',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    color: '#38C6D2',
    prescriber: 'Dr. Johnson',
    pharmacy: 'HealthCare Pharmacy',
  },
  {
    id: 'med-3',
    name: 'Lisinopril',
    dosage: '5mg',
    frequency: 'daily',
    timeOfDay: ['morning'],
    instructions: 'Take on an empty stomach',
    startDate: new Date(),
    color: '#FF5C5C',
    prescriber: 'Dr. Williams',
    pharmacy: 'City Drugs',
  }
];

// Generate sample reminders based on medications
const generateSampleReminders = (medications: Medication[]): Reminder[] => {
  const reminders: Reminder[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');
  
  medications.forEach(med => {
    if (med.timeOfDay.includes('morning')) {
      reminders.push({
        id: `reminder-${generateId()}`,
        medicationId: med.id,
        medicationName: med.name,
        time: '08:00',
        date: today,
        taken: Math.random() > 0.5,
        skipped: false,
      });
    }
    
    if (med.timeOfDay.includes('afternoon')) {
      reminders.push({
        id: `reminder-${generateId()}`,
        medicationId: med.id,
        medicationName: med.name,
        time: '13:00',
        date: today,
        taken: Math.random() > 0.5,
        skipped: false,
      });
    }
    
    if (med.timeOfDay.includes('evening')) {
      reminders.push({
        id: `reminder-${generateId()}`,
        medicationId: med.id,
        medicationName: med.name,
        time: '18:00',
        date: today,
        taken: false,
        skipped: false,
      });
    }
    
    if (med.timeOfDay.includes('night')) {
      reminders.push({
        id: `reminder-${generateId()}`,
        medicationId: med.id,
        medicationName: med.name,
        time: '22:00',
        date: today,
        taken: false,
        skipped: false,
      });
    }
  });
  
  return reminders;
};

// Sample user for demonstration
const sampleUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '555-123-4567',
  preferredPharmacy: 'MedPlus Pharmacy',
  caregivers: [
    {
      id: 'caregiver-1',
      name: 'Jamie Smith',
      phone: '555-987-6543',
      email: 'jamie@example.com',
      relationship: 'Family Member',
      notifyOnMissed: true,
      notifyOnLow: true,
    }
  ]
};

interface MedicationStore {
  medications: Medication[];
  reminders: Reminder[];
  user: User;
  
  // Medication actions
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  
  // Reminder actions
  markReminderAsTaken: (id: string) => void;
  markReminderAsSkipped: (id: string) => void;
  
  // Caregiver actions
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => void;
  updateCaregiver: (id: string, caregiver: Partial<Caregiver>) => void;
  deleteCaregiver: (id: string) => void;
  
  // User actions
  updateUser: (user: Partial<User>) => void;
}

export const useStore = create<MedicationStore>()(
  persist(
    (set) => ({
      medications: sampleMedications,
      reminders: generateSampleReminders(sampleMedications),
      user: sampleUser,
      
      // Medication actions
      addMedication: (medication) => 
        set((state) => {
          const newMedication = { 
            ...medication, 
            id: `med-${generateId()}` 
          };
          return { medications: [...state.medications, newMedication] };
        }),
        
      updateMedication: (id, medication) =>
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, ...medication } : med
          ),
        })),
        
      deleteMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((med) => med.id !== id),
          reminders: state.reminders.filter((reminder) => reminder.medicationId !== id),
        })),
      
      // Reminder actions
      markReminderAsTaken: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, taken: true, skipped: false } : reminder
          ),
        })),
        
      markReminderAsSkipped: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, taken: false, skipped: true } : reminder
          ),
        })),
      
      // Caregiver actions
      addCaregiver: (caregiver) =>
        set((state) => {
          const newCaregiver = { 
            ...caregiver, 
            id: `caregiver-${generateId()}` 
          };
          return { 
            user: { 
              ...state.user, 
              caregivers: [...state.user.caregivers, newCaregiver] 
            } 
          };
        }),
        
      updateCaregiver: (id, caregiver) =>
        set((state) => ({
          user: {
            ...state.user,
            caregivers: state.user.caregivers.map((c) =>
              c.id === id ? { ...c, ...caregiver } : c
            ),
          },
        })),
        
      deleteCaregiver: (id) =>
        set((state) => ({
          user: {
            ...state.user,
            caregivers: state.user.caregivers.filter((c) => c.id !== id),
          },
        })),
      
      // User actions
      updateUser: (userData) =>
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
          },
        })),
    }),
    {
      name: 'medication-store',
    }
  )
);
