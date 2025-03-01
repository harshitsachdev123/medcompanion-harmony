
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, User, Bell, Edit, Trash2, Phone, Mail, HeartHandshake } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { Caregiver } from '@/types';
import { toast } from '@/components/ui/use-toast';

const CaregiverSettings = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [caregiverToEdit, setCaregiverToEdit] = useState<Caregiver | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    notifyOnMissed: true,
    notifyOnLow: true,
  });
  
  const { user, addCaregiver, updateCaregiver, deleteCaregiver } = useStore();
  
  const handleOpenForm = () => {
    setCaregiverToEdit(undefined);
    setFormData({
      name: '',
      phone: '',
      email: '',
      relationship: '',
      notifyOnMissed: true,
      notifyOnLow: true,
    });
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCaregiverToEdit(undefined);
  };
  
  const handleEditCaregiver = (caregiver: Caregiver) => {
    setCaregiverToEdit(caregiver);
    setFormData({
      name: caregiver.name,
      phone: caregiver.phone,
      email: caregiver.email,
      relationship: caregiver.relationship,
      notifyOnMissed: caregiver.notifyOnMissed,
      notifyOnLow: caregiver.notifyOnLow,
    });
    setIsFormOpen(true);
  };
  
  const handleDeleteCaregiver = (id: string) => {
    const caregiver = user.caregivers.find(c => c.id === id);
    if (caregiver) {
      deleteCaregiver(id);
      toast({
        title: "Caregiver removed",
        description: `${caregiver.name} has been removed from your caregivers.`,
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const caregiverData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      relationship: formData.relationship,
      notifyOnMissed: formData.notifyOnMissed,
      notifyOnLow: formData.notifyOnLow,
    };
    
    if (caregiverToEdit) {
      updateCaregiver(caregiverToEdit.id, caregiverData);
      toast({
        title: "Caregiver updated",
        description: `${caregiverData.name}'s information has been updated.`,
      });
    } else {
      addCaregiver(caregiverData);
      toast({
        title: "Caregiver added",
        description: `${caregiverData.name} has been added as a caregiver.`,
      });
    }
    
    handleCloseForm();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const isFormValid = formData.name && (formData.phone || formData.email);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-med-blue-50 to-white">
      <Header />
      
      <PageTransition>
        <main className="flex-grow page-container">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-med-gray-900">Caregiver Settings</h1>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button onClick={handleOpenForm} className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Caregiver</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-glass border border-white/20 mb-8">
              <div className="flex items-center mb-4">
                <HeartHandshake size={24} className="text-med-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-med-gray-800">About Caregivers</h2>
              </div>
              
              <p className="text-med-gray-600 mb-2">
                Caregivers are family members, friends, or healthcare professionals who help monitor your medication schedule.
              </p>
              <p className="text-med-gray-600">
                They can receive alerts when you miss medications or when your supply is running low.
              </p>
            </div>
            
            {user.caregivers.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center shadow-glass border border-white/20">
                <h3 className="text-xl font-medium text-med-gray-800 mb-2">No caregivers added yet</h3>
                <p className="text-med-gray-600 mb-4">Add a caregiver to help monitor your medication schedule.</p>
                <Button onClick={handleOpenForm} className="mt-2">
                  <Plus size={16} className="mr-1" />
                  Add Your First Caregiver
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.caregivers.map(caregiver => (
                  <motion.div
                    key={caregiver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-med-blue-100">
                          <User size={20} className="text-med-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-med-gray-800">{caregiver.name}</h3>
                          <p className="text-sm text-med-gray-600">{caregiver.relationship}</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditCaregiver(caregiver)}
                          className="p-2 rounded-full hover:bg-med-gray-100 text-med-gray-600 transition-colors duration-200"
                          aria-label="Edit caregiver"
                        >
                          <Edit size={18} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteCaregiver(caregiver.id)}
                          className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-200"
                          aria-label="Delete caregiver"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {caregiver.phone && (
                        <div className="flex items-center text-med-gray-600">
                          <Phone size={16} className="mr-2" />
                          <span className="text-sm">{caregiver.phone}</span>
                        </div>
                      )}
                      
                      {caregiver.email && (
                        <div className="flex items-center text-med-gray-600">
                          <Mail size={16} className="mr-2" />
                          <span className="text-sm">{caregiver.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-med-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-med-gray-700">
                          <Bell size={16} className="mr-2" />
                          <span className="text-sm">Notify on missed doses</span>
                        </div>
                        <Switch
                          checked={caregiver.notifyOnMissed}
                          onCheckedChange={(checked) => {
                            updateCaregiver(caregiver.id, { notifyOnMissed: checked });
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-med-gray-700">
                          <Bell size={16} className="mr-2" />
                          <span className="text-sm">Notify on low supply</span>
                        </div>
                        <Switch
                          checked={caregiver.notifyOnLow}
                          onCheckedChange={(checked) => {
                            updateCaregiver(caregiver.id, { notifyOnLow: checked });
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </PageTransition>
      
      <Footer />
      
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {caregiverToEdit ? 'Edit Caregiver' : 'Add New Caregiver'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitForm} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter caregiver's name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                name="relationship"
                placeholder="E.g., Family Member, Friend, Nurse"
                value={formData.relationship}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnMissed" className="flex-grow">
                  Notify when I miss a dose
                </Label>
                <Switch
                  id="notifyOnMissed"
                  checked={formData.notifyOnMissed}
                  onCheckedChange={(checked) => handleSwitchChange('notifyOnMissed', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnLow" className="flex-grow">
                  Notify when medication supply is low
                </Label>
                <Switch
                  id="notifyOnLow"
                  checked={formData.notifyOnLow}
                  onCheckedChange={(checked) => handleSwitchChange('notifyOnLow', checked)}
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseForm}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid}
                className="w-full sm:w-auto"
              >
                {caregiverToEdit ? 'Update' : 'Add'} Caregiver
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaregiverSettings;
