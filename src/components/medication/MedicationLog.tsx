
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, CalendarDays, BarChart2 } from 'lucide-react';
import { Reminder } from '@/types';

interface MedicationLogProps {
  reminders: Reminder[];
}

const MedicationLog: React.FC<MedicationLogProps> = ({ reminders }) => {
  // Calculate adherence rate
  const totalReminders = reminders.length;
  const takenReminders = reminders.filter(r => r.taken).length;
  const adherenceRate = totalReminders > 0 
    ? Math.round((takenReminders / totalReminders) * 100) 
    : 0;
  
  // Filter by status
  const takenMedications = reminders.filter(r => r.taken);
  const skippedMedications = reminders.filter(r => r.skipped);
  const pendingMedications = reminders.filter(r => !r.taken && !r.skipped);
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-glass border border-white/20">
      <div className="flex items-center">
        <BarChart2 className="text-med-blue-500 mr-2" size={20} />
        <h3 className="text-xl font-semibold text-med-gray-800">Medication Adherence</h3>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5 flex flex-col items-center"
        >
          <div className="rounded-full p-3 bg-green-100">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h4 className="text-lg font-medium mt-3 text-med-gray-800">Taken</h4>
          <span className="text-3xl font-bold mt-1 text-green-600">{takenReminders}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-5 flex flex-col items-center"
        >
          <div className="rounded-full p-3 bg-med-gray-100">
            <XCircle size={24} className="text-med-gray-600" />
          </div>
          <h4 className="text-lg font-medium mt-3 text-med-gray-800">Skipped</h4>
          <span className="text-3xl font-bold mt-1 text-med-gray-600">{skippedMedications.length}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-5 flex flex-col items-center"
        >
          <div className="rounded-full p-3 bg-med-blue-100">
            <Clock size={24} className="text-med-blue-600" />
          </div>
          <h4 className="text-lg font-medium mt-3 text-med-gray-800">Pending</h4>
          <span className="text-3xl font-bold mt-1 text-med-blue-600">{pendingMedications.length}</span>
        </motion.div>
      </div>
      
      <div className="mt-6">
        <div className="bg-med-gray-100 rounded-full h-3">
          <motion.div 
            className="h-full rounded-full bg-med-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${adherenceRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-med-gray-600 text-sm">Adherence Rate</span>
          <span className="text-med-blue-600 font-medium">{adherenceRate}%</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center text-med-gray-600 text-sm">
          <CalendarDays size={14} className="mr-1" />
          <span>Past 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default MedicationLog;
