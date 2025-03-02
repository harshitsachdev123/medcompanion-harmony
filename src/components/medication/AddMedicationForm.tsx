
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check, Calendar as CalendarIcon } from 'lucide-react';
import { Medication } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddMedicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medication: Omit<Medication, 'id'>) => void;
  medicationToEdit?: Medication;
}

const colorOptions = [
  '#2E74FF', // Blue
  '#38C6D2', // Teal
  '#FF5C5C', // Red
  '#FFB13D', // Orange
  '#A86FE1', // Purple
  '#4FCC87', // Green
];

const timeOfDayOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as-needed', label: 'As Needed' },
];

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  medicationToEdit,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [color, setColor] = useState(colorOptions[0]);
  const [prescriber, setPrescriber] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  
  useEffect(() => {
    if (medicationToEdit) {
      setName(medicationToEdit.name);
      setDosage(medicationToEdit.dosage);
      setFrequency(medicationToEdit.frequency);
      setTimeOfDay(medicationToEdit.timeOfDay);
      setInstructions(medicationToEdit.instructions);
      setStartDate(new Date(medicationToEdit.startDate));
      setEndDate(medicationToEdit.endDate ? new Date(medicationToEdit.endDate) : null);
      setColor(medicationToEdit.color);
      setPrescriber(medicationToEdit.prescriber || '');
      setPharmacy(medicationToEdit.pharmacy || '');
    } else {
      resetForm();
    }
  }, [medicationToEdit, isOpen]);
  
  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('daily');
    setTimeOfDay([]);
    setInstructions('');
    setStartDate(new Date());
    setEndDate(null);
    setColor(colorOptions[0]);
    setPrescriber('');
    setPharmacy('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMedication: Omit<Medication, 'id'> = {
      name,
      dosage,
      frequency,
      timeOfDay,
      instructions,
      startDate,
      endDate,
      color,
      prescriber,
      pharmacy,
    };
    
    onSubmit(newMedication);
    onClose();
    resetForm();
  };
  
  const toggleTimeOfDay = (value: string) => {
    setTimeOfDay(
      timeOfDay.includes(value)
        ? timeOfDay.filter((item) => item !== value)
        : [...timeOfDay, value]
    );
  };
  
  const isFormValid = name && dosage && frequency && timeOfDay.length > 0 && startDate;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {medicationToEdit ? 'Edit Medication' : 'Add New Medication'}
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-130px)]">
            <div className="p-6 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medication Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter medication name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="Enter dosage (e.g., 10mg)"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFrequency(option.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all
                          ${frequency === option.value
                            ? 'bg-med-blue-500 text-white'
                            : 'bg-med-gray-100 text-med-gray-700 hover:bg-med-gray-200'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Time of Day</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeOfDayOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleTimeOfDay(option.value)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex justify-between items-center
                          ${timeOfDay.includes(option.value)
                            ? 'bg-med-blue-500 text-white'
                            : 'bg-med-gray-100 text-med-gray-700 hover:bg-med-gray-200'
                          }`}
                      >
                        {option.label}
                        {timeOfDay.includes(option.value) && (
                          <Check size={16} className="ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate as Date}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Medication Color</Label>
                  <div className="flex space-x-2">
                    {colorOptions.map((colorOption) => (
                      <button
                        key={colorOption}
                        type="button"
                        onClick={() => setColor(colorOption)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          color === colorOption ? 'ring-2 ring-offset-2 ring-med-blue-500' : ''
                        }`}
                        style={{ backgroundColor: colorOption }}
                        aria-label={`Select color ${colorOption}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Special instructions for taking this medication"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prescriber">Prescriber (Optional)</Label>
                    <Input
                      id="prescriber"
                      placeholder="Doctor's name"
                      value={prescriber}
                      onChange={(e) => setPrescriber(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy">Pharmacy (Optional)</Label>
                    <Input
                      id="pharmacy"
                      placeholder="Pharmacy name"
                      value={pharmacy}
                      onChange={(e) => setPharmacy(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Add some padding at the bottom to ensure content isn't hidden behind the fixed footer */}
                <div className="h-4"></div>
              </form>
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="p-6 pt-4 border-t bg-background sticky bottom-0 left-0 right-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={!isFormValid}
            className="w-full sm:w-auto"
          >
            {medicationToEdit ? 'Update' : 'Add'} Medication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationForm;
