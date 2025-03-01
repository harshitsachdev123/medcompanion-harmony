import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medication, Reminder, Caregiver, User } from '@/types';
import { format } from 'date-fns';
import { medicationAPI, reminderAPI, userAPI } from './supabase';

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample medications for demonstration - will be removed when database is connected
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

// Generate sample reminders based on medications - will be removed when database is connected
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

// Sample user for demonstration - will be removed when database is connected
const sampleUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '555-123-4567',
  preferredPharmacy: 'MedPlus Pharmacy',
  isLoggedIn: false,
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
  isLoading: boolean;
  error: string | null;
  
  // Data loading
  loadInitialData: () => Promise<void>;
  
  // Medication actions
  addMedication: (medication: Omit<Medication, 'id'>) => Promise<void>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  
  // Reminder actions
  markReminderAsTaken: (id: string) => Promise<void>;
  markReminderAsSkipped: (id: string) => Promise<void>;
  
  // Caregiver actions
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => Promise<void>;
  updateCaregiver: (id: string, caregiver: Partial<Caregiver>) => Promise<void>;
  deleteCaregiver: (id: string) => Promise<void>;
  
  // User actions
  updateUser: (user: Partial<User>) => Promise<void>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Omit<User, 'id' | 'isLoggedIn' | 'caregivers'>) => Promise<void>;
  logout: () => Promise<void>;
}

export const useStore = create<MedicationStore>()(
  persist(
    (set, get) => ({
      medications: sampleMedications,
      reminders: generateSampleReminders(sampleMedications),
      user: sampleUser,
      isLoading: false,
      error: null,
      
      // Data loading
      loadInitialData: async () => {
        set({ isLoading: true, error: null });
        try {
          // Try to get current user
          const user = await userAPI.getCurrentUser();
          
          if (user) {
            // User is logged in, load their data
            const medications = await medicationAPI.getAll();
            const reminders = await reminderAPI.getAll();
            
            set({ 
              medications, 
              reminders, 
              user: { ...user, isLoggedIn: true }, 
              isLoading: false 
            });
          } else {
            // Use demo data if not logged in
            set({ 
              medications: sampleMedications, 
              reminders: generateSampleReminders(sampleMedications), 
              user: { ...sampleUser, isLoggedIn: false },
              isLoading: false 
            });
          }
        } catch (error) {
          console.error("Failed to load initial data:", error);
          set({ 
            error: "Failed to load data. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      // Medication actions
      addMedication: async (medication) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Add to database if logged in
            const newMedication = await medicationAPI.add(medication);
            set((state) => ({ 
              medications: [...state.medications, newMedication],
              isLoading: false
            }));
          } else {
            // Use local storage if not logged in
            const newMedication = { 
              ...medication, 
              id: `med-${generateId()}` 
            };
            set((state) => ({ 
              medications: [...state.medications, newMedication],
              isLoading: false
            }));
          }
        } catch (error) {
          console.error("Failed to add medication:", error);
          set({ 
            error: "Failed to add medication. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      updateMedication: async (id, medication) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Update in database if logged in
            await medicationAPI.update(id, medication);
          }
          
          // Update in local state
          set((state) => ({
            medications: state.medications.map((med) =>
              med.id === id ? { ...med, ...medication } : med
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to update medication:", error);
          set({ 
            error: "Failed to update medication. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      deleteMedication: async (id) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Delete from database if logged in
            await medicationAPI.delete(id);
          }
          
          // Delete from local state
          set((state) => ({
            medications: state.medications.filter((med) => med.id !== id),
            reminders: state.reminders.filter((reminder) => reminder.medicationId !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to delete medication:", error);
          set({ 
            error: "Failed to delete medication. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      // Reminder actions
      markReminderAsTaken: async (id) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Update in database if logged in
            await reminderAPI.markAsTaken(id);
          }
          
          // Update in local state
          set((state) => ({
            reminders: state.reminders.map((reminder) =>
              reminder.id === id ? { ...reminder, taken: true, skipped: false } : reminder
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to mark reminder as taken:", error);
          set({ 
            error: "Failed to update reminder. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      markReminderAsSkipped: async (id) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Update in database if logged in
            await reminderAPI.markAsSkipped(id);
          }
          
          // Update in local state
          set((state) => ({
            reminders: state.reminders.map((reminder) =>
              reminder.id === id ? { ...reminder, taken: false, skipped: true } : reminder
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to mark reminder as skipped:", error);
          set({ 
            error: "Failed to update reminder. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      // Caregiver actions
      addCaregiver: async (caregiver) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Add to database if logged in
            const newCaregiver = await userAPI.addCaregiver(caregiver);
            set((state) => ({ 
              user: { 
                ...state.user, 
                caregivers: [...state.user.caregivers, newCaregiver] 
              },
              isLoading: false
            }));
          } else {
            // Use local storage if not logged in
            const newCaregiver = { 
              ...caregiver, 
              id: `caregiver-${generateId()}` 
            };
            set((state) => ({ 
              user: { 
                ...state.user, 
                caregivers: [...state.user.caregivers, newCaregiver] 
              },
              isLoading: false
            }));
          }
        } catch (error) {
          console.error("Failed to add caregiver:", error);
          set({ 
            error: "Failed to add caregiver. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      updateCaregiver: async (id, caregiver) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Update in database if logged in
            await userAPI.updateCaregiver(id, caregiver);
          }
          
          // Update in local state
          set((state) => ({
            user: {
              ...state.user,
              caregivers: state.user.caregivers.map((c) =>
                c.id === id ? { ...c, ...caregiver } : c
              ),
            },
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to update caregiver:", error);
          set({ 
            error: "Failed to update caregiver. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      deleteCaregiver: async (id) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Delete from database if logged in
            await userAPI.deleteCaregiver(id);
          }
          
          // Delete from local state
          set((state) => ({
            user: {
              ...state.user,
              caregivers: state.user.caregivers.filter((c) => c.id !== id),
            },
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to delete caregiver:", error);
          set({ 
            error: "Failed to delete caregiver. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      // User actions
      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            // Update in database if logged in
            await userAPI.updateUser(userData);
          }
          
          // Update in local state
          set((state) => ({
            user: {
              ...state.user,
              ...userData,
            },
            isLoading: false
          }));
        } catch (error) {
          console.error("Failed to update user:", error);
          set({ 
            error: "Failed to update user. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      // Auth actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await userAPI.login(email, password);
          
          // Load user data after login
          const user = await userAPI.getCurrentUser();
          const medications = await medicationAPI.getAll();
          const reminders = await reminderAPI.getAll();
          
          set({ 
            user: { ...user, isLoggedIn: true },
            medications,
            reminders,
            isLoading: false 
          });
        } catch (error) {
          console.error("Login failed:", error);
          set({ 
            error: "Login failed. Please check your credentials and try again.", 
            isLoading: false 
          });
        }
      },
      
      signup: async (email, password, userData) => {
        set({ isLoading: true, error: null });
        try {
          await userAPI.signup(email, password, userData);
          
          // Auto login after signup
          await get().login(email, password);
        } catch (error) {
          console.error("Signup failed:", error);
          set({ 
            error: "Signup failed. Please try again.", 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          if (get().user.isLoggedIn) {
            await userAPI.logout();
          }
          
          // Reset to demo data
          set({ 
            user: { ...sampleUser, isLoggedIn: false },
            medications: sampleMedications,
            reminders: generateSampleReminders(sampleMedications),
            isLoading: false 
          });
        } catch (error) {
          console.error("Logout failed:", error);
          set({ 
            error: "Logout failed. Please try again.", 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'medication-store',
    }
  )
);
