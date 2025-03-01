
import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Calendar, Info, Edit, Trash2 } from 'lucide-react';
import { Medication } from '@/types';
import { format } from 'date-fns';

interface MedicationCardProps {
  medication: Medication;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onEdit, 
  onDelete 
}) => {
  const { id, name, dosage, frequency, timeOfDay, instructions, startDate, endDate, color } = medication;
  
  const formattedStartDate = format(new Date(startDate), 'MMM d, yyyy');
  const formattedEndDate = endDate ? format(new Date(endDate), 'MMM d, yyyy') : 'Ongoing';
  const formattedTimeOfDay = timeOfDay.join(', ');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden relative"
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
              <Pill size={20} style={{ color: color }} />
            </div>
            <h3 className="ml-2 text-lg font-semibold text-med-gray-800">{name}</h3>
          </div>
          <span className="pill bg-med-blue-100 text-med-blue-700">{dosage}</span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-med-gray-600">
            <Clock size={16} className="mr-2" />
            <span className="text-sm">{formattedTimeOfDay}</span>
          </div>
          
          <div className="flex items-center text-med-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">{formattedStartDate} – {formattedEndDate}</span>
          </div>
          
          {instructions && (
            <div className="flex items-start text-med-gray-600 mt-2">
              <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{instructions}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(id)}
            className="p-2 rounded-full hover:bg-med-gray-100 text-med-gray-600 transition-colors duration-200"
            aria-label="Edit medication"
          >
            <Edit size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(id)}
            className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-200"
            aria-label="Delete medication"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationCard;
