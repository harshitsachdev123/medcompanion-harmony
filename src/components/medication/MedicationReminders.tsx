
import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Check, X, Bell } from 'lucide-react';
import { Reminder } from '@/types';
import { useStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';

interface MedicationRemindersProps {
  reminders: Reminder[];
  title?: string;
}

const MedicationReminders: React.FC<MedicationRemindersProps> = ({ 
  reminders,
  title = "Today's Reminders" 
}) => {
  const { markReminderAsTaken, markReminderAsSkipped } = useStore();
  
  const handleMarkAsTaken = (id: string, name: string) => {
    markReminderAsTaken(id);
    toast({
      title: "Medication taken",
      description: `${name} has been marked as taken.`,
    });
  };
  
  const handleMarkAsSkipped = (id: string, name: string) => {
    markReminderAsSkipped(id);
    toast({
      title: "Medication skipped",
      description: `${name} has been marked as skipped.`,
    });
  };
  
  if (reminders.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-glass border border-white/20">
        <div className="flex items-center justify-center">
          <Bell className="text-med-gray-400 mr-2" size={20} />
          <h3 className="text-xl font-semibold text-med-gray-800">{title}</h3>
        </div>
        <div className="mt-4 text-center text-med-gray-500">
          <p>No medication reminders for now.</p>
          <p className="mt-2">Enjoy your day!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-glass border border-white/20">
      <div className="flex items-center">
        <Bell className="text-med-blue-500 mr-2" size={20} />
        <h3 className="text-xl font-semibold text-med-gray-800">{title}</h3>
      </div>
      
      <div className="mt-4 space-y-3">
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex justify-between items-center border
              ${reminder.taken 
                ? 'bg-green-50 border-green-200' 
                : reminder.skipped
                ? 'bg-med-gray-100 border-med-gray-200'
                : 'bg-white border-med-gray-200'
              }`}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-med-blue-100">
                <Pill size={16} className="text-med-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-med-gray-800">{reminder.medicationName}</h4>
                <div className="flex items-center mt-1 text-med-gray-500 text-sm">
                  <Clock size={14} className="mr-1" />
                  <span>{reminder.time}</span>
                </div>
              </div>
            </div>
            
            {!reminder.taken && !reminder.skipped ? (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMarkAsTaken(reminder.id, reminder.medicationName)}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                  aria-label="Mark as taken"
                >
                  <Check size={18} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMarkAsSkipped(reminder.id, reminder.medicationName)}
                  className="p-2 rounded-full bg-med-gray-100 text-med-gray-600 hover:bg-med-gray-200 transition-colors duration-200"
                  aria-label="Mark as skipped"
                >
                  <X size={18} />
                </motion.button>
              </div>
            ) : reminder.taken ? (
              <span className="pill bg-green-100 text-green-700">Taken</span>
            ) : (
              <span className="pill bg-med-gray-200 text-med-gray-700">Skipped</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MedicationReminders;
