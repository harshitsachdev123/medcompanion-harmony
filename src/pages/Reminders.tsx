
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MedicationReminders from '@/components/medication/MedicationReminders';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { format, addDays, isSameDay } from 'date-fns';

const Reminders = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'all' | 'taken' | 'skipped' | 'pending'>('all');
  
  const { reminders } = useStore();
  
  // Navigation functions
  const goToPreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };
  
  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Filter reminders by date and filter option
  const filteredReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.date);
    const isSameSelectedDay = isSameDay(reminderDate, selectedDate);
    
    if (!isSameSelectedDay) {
      return false;
    }
    
    if (filter === 'all') {
      return true;
    } else if (filter === 'taken') {
      return reminder.taken;
    } else if (filter === 'skipped') {
      return reminder.skipped;
    } else if (filter === 'pending') {
      return !reminder.taken && !reminder.skipped;
    }
    
    return true;
  });
  
  const isToday = isSameDay(selectedDate, new Date());
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-med-blue-50 to-white">
      <Header />
      
      <PageTransition>
        <main className="flex-grow page-container">
          <section>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-med-gray-900">Medication Reminders</h1>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={goToToday}
                  disabled={isToday}
                  className="w-full sm:w-auto"
                >
                  Today
                </Button>
                
                <Select
                  value={filter}
                  onValueChange={(value) => setFilter(value as any)}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="taken">Taken</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-glass border border-white/20">
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 rounded-full hover:bg-med-gray-100 text-med-gray-600 transition-colors duration-200"
                  aria-label="Previous day"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center">
                  <Calendar size={20} className="text-med-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-med-gray-800">{formattedDate}</h2>
                </div>
                
                <button
                  onClick={goToNextDay}
                  className="p-2 rounded-full hover:bg-med-gray-100 text-med-gray-600 transition-colors duration-200"
                  aria-label="Next day"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <MedicationReminders 
              reminders={filteredReminders} 
              title={isToday ? "Today's Reminders" : `Reminders for ${format(selectedDate, 'MMM d')}`} 
            />
          </section>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Reminders;
