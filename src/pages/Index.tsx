
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, PlusCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MedicationReminders from '@/components/medication/MedicationReminders';
import MedicationLog from '@/components/medication/MedicationLog';
import MedicationCard from '@/components/medication/MedicationCard';
import AddMedicationForm from '@/components/medication/AddMedicationForm';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';
import { Medication } from '@/types';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | undefined>(undefined);
  
  const { 
    medications, 
    reminders, 
    addMedication, 
    updateMedication,
    deleteMedication 
  } = useStore();
  
  const handleAddMedication = (medication: Omit<Medication, 'id'>) => {
    if (medicationToEdit) {
      updateMedication(medicationToEdit.id, medication);
      toast({
        title: "Medication updated",
        description: `${medication.name} has been updated.`,
      });
    } else {
      addMedication(medication);
      toast({
        title: "Medication added",
        description: `${medication.name} has been added to your medications.`,
      });
    }
    setMedicationToEdit(undefined);
  };
  
  const handleEditMedication = (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      setMedicationToEdit(medication);
      setIsFormOpen(true);
    }
  };
  
  const handleDeleteMedication = (id: string) => {
    const medication = medications.find(med => med.id === id);
    if (medication) {
      deleteMedication(id);
      toast({
        title: "Medication deleted",
        description: `${medication.name} has been removed from your medications.`,
        variant: "destructive",
      });
    }
  };
  
  const handleOpenForm = () => {
    setMedicationToEdit(undefined);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setMedicationToEdit(undefined);
  };
  
  // Get reminders for today that aren't taken or skipped
  const upcomingReminders = reminders.filter(reminder => !reminder.taken && !reminder.skipped);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-med-blue-50 to-white">
      <Header />
      
      <PageTransition>
        <main className="flex-grow page-container">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-med-gray-900">MedCompanion</h1>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button onClick={handleOpenForm} className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Medication</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MedicationReminders reminders={upcomingReminders} />
              </div>
              
              <div className="lg:col-span-1">
                <MedicationLog reminders={reminders} />
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Clock size={24} className="text-med-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-med-gray-800">Your Medications</h2>
              </div>
              
              <Button variant="ghost" onClick={handleOpenForm} className="text-med-blue-600 hover:text-med-blue-700 hover:bg-med-blue-50">
                <PlusCircle size={18} className="mr-1" />
                Add New
              </Button>
            </div>
            
            {medications.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center shadow-glass border border-white/20">
                <h3 className="text-xl font-medium text-med-gray-800 mb-2">No medications added yet</h3>
                <p className="text-med-gray-600 mb-4">Add your first medication to get started.</p>
                <Button onClick={handleOpenForm} className="mt-2">
                  <Plus size={16} className="mr-1" />
                  Add Your First Medication
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {medications.map(medication => (
                  <MedicationCard 
                    key={medication.id} 
                    medication={medication} 
                    onEdit={handleEditMedication}
                    onDelete={handleDeleteMedication}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </PageTransition>
      
      <Footer />
      
      <AddMedicationForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleAddMedication}
        medicationToEdit={medicationToEdit}
      />
    </div>
  );
};

export default Index;
