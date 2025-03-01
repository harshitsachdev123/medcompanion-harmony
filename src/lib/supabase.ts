
import { createClient } from '@supabase/supabase-js';
import { Medication, Reminder, Caregiver, User } from '@/types';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Medication API
export const medicationAPI = {
  async getAll() {
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
