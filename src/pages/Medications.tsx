
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Pill } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MedicationCard from '@/components/medication/MedicationCard';
import AddMedicationForm from '@/components/medication/AddMedicationForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { Medication } from '@/types';
import { toast } from '@/components/ui/use-toast';

const Medications = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | undefined>(undefined);
  
  const { 
    medications, 
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
  
  // Filter medications by search term
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.prescriber?.toLowerCase().includes(search.toLowerCase()) ||
    med.pharmacy?.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-med-blue-50 to-white">
      <Header />
      
      <PageTransition>
        <main className="flex-grow page-container">
          <section>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-med-gray-900">All Medications</h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-med-gray-500" size={18} />
                  <Input
                    placeholder="Search medications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button onClick={handleOpenForm} className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Medication</span>
                </Button>
              </div>
            </div>
            
            {filteredMedications.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center shadow-glass border border-white/20">
                {search ? (
                  <>
                    <h3 className="text-xl font-medium text-med-gray-800 mb-2">No results found</h3>
                    <p className="text-med-gray-600 mb-4">Try a different search term or add a new medication.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium text-med-gray-800 mb-2">No medications added yet</h3>
                    <p className="text-med-gray-600 mb-4">Add your first medication to get started.</p>
                  </>
                )}
                <Button onClick={handleOpenForm} className="mt-2">
                  <Plus size={16} className="mr-1" />
                  Add New Medication
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredMedications.map(medication => (
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

export default Medications;
