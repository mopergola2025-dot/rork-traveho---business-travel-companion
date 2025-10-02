import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface Document {
  id: string;
  name: string;
  type: 'flight' | 'hotel' | 'passport' | 'visa' | 'boarding' | 'insurance' | 'vaccination' | 'other';
  uploadDate: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location?: string;
  attendees: string[];
  friendAttendees: string[];
  description?: string;
  hasRecording?: boolean;
  hasSummary?: boolean;
}

export interface BusinessCard {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  scannedDate: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdDate: string;
  category: 'meeting' | 'document' | 'travel' | 'general';
}

export interface MyBusinessCard {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
}

const DOCUMENTS_STORAGE_KEY = 'traveho_documents';
const MEETINGS_STORAGE_KEY = 'traveho_meetings';
const BUSINESS_CARDS_STORAGE_KEY = 'traveho_business_cards';
const TODOS_STORAGE_KEY = 'traveho_todos';
const MY_BUSINESS_CARD_STORAGE_KEY = 'traveho_my_business_card';

export const [DocumentsContext, useDocuments] = createContextHook(() => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [myBusinessCard, setMyBusinessCard] = useState<MyBusinessCard>({
    name: 'John Doe',
    company: 'Tech Solutions Inc.',
    position: 'Senior Product Manager',
    email: 'john.doe@techsolutions.com',
    phone: '+1-555-0789',
    website: 'www.techsolutions.com',
    address: 'San Francisco, CA',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [documents, meetings, businessCards, todos, myBusinessCard]);

  const loadData = async () => {
    try {
      const [storedDocs, storedMeetings, storedCards, storedTodos, storedMyCard] = await Promise.all([
        AsyncStorage.getItem(DOCUMENTS_STORAGE_KEY),
        AsyncStorage.getItem(MEETINGS_STORAGE_KEY),
        AsyncStorage.getItem(BUSINESS_CARDS_STORAGE_KEY),
        AsyncStorage.getItem(TODOS_STORAGE_KEY),
        AsyncStorage.getItem(MY_BUSINESS_CARD_STORAGE_KEY),
      ]);

      if (storedDocs) setDocuments(JSON.parse(storedDocs));
      if (storedMeetings) setMeetings(JSON.parse(storedMeetings));
      if (storedCards) setBusinessCards(JSON.parse(storedCards));
      if (storedTodos) setTodos(JSON.parse(storedTodos));
      if (storedMyCard) setMyBusinessCard(JSON.parse(storedMyCard));
    } catch (error) {
      console.error('Error loading documents data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents)),
        AsyncStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings)),
        AsyncStorage.setItem(BUSINESS_CARDS_STORAGE_KEY, JSON.stringify(businessCards)),
        AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos)),
        AsyncStorage.setItem(MY_BUSINESS_CARD_STORAGE_KEY, JSON.stringify(myBusinessCard)),
      ]);
    } catch (error) {
      console.error('Error saving documents data:', error);
    }
  };

  const addDocument = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [...prev, meeting]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const addBusinessCard = (card: BusinessCard) => {
    setBusinessCards(prev => [...prev, card]);
  };

  const updateBusinessCard = (id: string, updates: Partial<BusinessCard>) => {
    setBusinessCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteBusinessCard = (id: string) => {
    setBusinessCards(prev => prev.filter(c => c.id !== id));
  };

  const addTodo = (todo: TodoItem) => {
    setTodos(prev => [todo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateMyBusinessCard = (updates: Partial<MyBusinessCard>) => {
    setMyBusinessCard(prev => ({ ...prev, ...updates }));
  };

  return {
    documents,
    meetings,
    businessCards,
    todos,
    myBusinessCard,
    isLoading,
    addDocument,
    deleteDocument,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addBusinessCard,
    updateBusinessCard,
    deleteBusinessCard,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    updateMyBusinessCard,
  };
});
