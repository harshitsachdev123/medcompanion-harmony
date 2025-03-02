
import { createClient } from '@supabase/supabase-js';
import { Medication, Reminder, Caregiver, User } from '@/types';

// Initialize Supabase client with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock client when credentials are placeholders
const isMockMode = supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key');

export const supabase = isMockMode 
  ? {
      from: () => ({
        select: () => ({
          data: [],
          error: null,
          eq: () => ({
            data: [],
            error: null,
            select: () => ({ data: [], error: null }),
            single: () => ({ data: {}, error: null }),
          }),
          single: () => ({ data: {}, error: null }),
        }),
        insert: () => ({
          data: [],
          error: null,
          select: () => ({ data: [{ id: 'mock-id' }], error: null }),
        }),
        update: () => ({
          data: [],
          error: null,
          eq: () => ({
            data: [],
            error: null,
            select: () => ({ data: [{ id: 'mock-id' }], error: null }),
          }),
        }),
        delete: () => ({
          data: null,
          error: null,
          eq: () => ({ data: null, error: null }),
        }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
        signUp: () => Promise.resolve({ data: { user: { id: 'mock-id' } }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
    }
  : createClient(supabaseUrl, supabaseKey);

// Medication API
export const medicationAPI = {
  async getAll() {
    if (isMockMode) return [];
    
    const { data, error } = await supabase
      .from('medications')
      .select('*');
    
    if (error) throw error;
    return data as Medication[];
  },
  
  async add(medication: Omit<Medication, 'id'>) {
    const { data, error } = await supabase
      .from('medications')
      .insert([medication])
      .select();
    
    if (error) throw error;
    return data[0] as Medication;
  },
  
  async update(id: string, medication: Partial<Medication>) {
    const { data, error } = await supabase
      .from('medications')
      .update(medication)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as Medication;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Reminder API
export const reminderAPI = {
  async getAll() {
    if (isMockMode) return [];
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*');
    
    if (error) throw error;
    return data as Reminder[];
  },
  
  async markAsTaken(id: string) {
    const { data, error } = await supabase
      .from('reminders')
      .update({ taken: true, skipped: false })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as Reminder;
  },
  
  async markAsSkipped(id: string) {
    const { data, error } = await supabase
      .from('reminders')
      .update({ taken: false, skipped: true })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as Reminder;
  }
};

// User and Caregiver API
export const userAPI = {
  async getCurrentUser() {
    if (isMockMode) return null;
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get the user profile
    const { data, error } = await supabase
      .from('users')
      .select('*, caregivers(*)')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data as User;
  },
  
  async updateUser(userData: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', user.id)
      .select();
    
    if (error) throw error;
    return data[0] as User;
  },
  
  async addCaregiver(caregiver: Omit<Caregiver, 'id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('caregivers')
      .insert([{ ...caregiver, userId: user.id }])
      .select();
    
    if (error) throw error;
    return data[0] as Caregiver;
  },
  
  async updateCaregiver(id: string, caregiver: Partial<Caregiver>) {
    const { data, error } = await supabase
      .from('caregivers')
      .update(caregiver)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as Caregiver;
  },
  
  async deleteCaregiver(id: string) {
    const { error } = await supabase
      .from('caregivers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Authentication methods
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  async signup(email: string, password: string, userData: Omit<User, 'id' | 'isLoggedIn' | 'caregivers'>) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id, 
          email,
          name: userData.name,
          phone: userData.phone,
          preferredPharmacy: userData.preferredPharmacy,
          caregivers: [],
        }]);
      
      if (profileError) throw profileError;
    }
    
    return authData;
  },
  
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
};
