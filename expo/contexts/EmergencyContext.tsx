import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'insurance' | 'personal' | 'local';
}

const EMERGENCY_CONTACTS_STORAGE_KEY = 'traveho_emergency_contacts';

export const [EmergencyContext, useEmergency] = createContextHook(() => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveContacts();
    }
  }, [contacts]);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem(EMERGENCY_CONTACTS_STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContacts = async () => {
    try {
      await AsyncStorage.setItem(EMERGENCY_CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
    }
  };

  const addContact = (contact: EmergencyContact) => {
    setContacts(prev => [...prev, contact]);
  };

  const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
  };
});
