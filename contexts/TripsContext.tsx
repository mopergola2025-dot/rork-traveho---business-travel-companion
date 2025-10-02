import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface Meeting {
  id: string;
  title: string;
  time: string;
  attendees: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: 'flight' | 'meeting' | 'hotel' | 'transport' | 'meal';
  location?: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'current' | 'completed';
  flightNumber?: string;
  hotel?: string;
  purpose: string;
  imageUrl: string;
  hasNotifications?: boolean;
  meetings?: Meeting[];
  itinerary?: ItineraryItem[];
}

const TRIPS_STORAGE_KEY = 'traveho_trips';

export const [TripsContext, useTrips] = createContextHook(() => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTrips();
    }
  }, [trips]);

  const loadTrips = async () => {
    try {
      const stored = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (stored) {
        const parsedTrips = JSON.parse(stored);
        setTrips(parsedTrips);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrips = async () => {
    try {
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const addTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => trip.id === id ? { ...trip, ...updates } : trip));
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const updateTripStatuses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTrips(prevTrips => {
      return prevTrips
        .map(trip => {
          const startDate = new Date(trip.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(trip.endDate);
          endDate.setHours(23, 59, 59, 999);

          let newStatus: Trip['status'] = trip.status;

          if (today >= startDate && today <= endDate) {
            newStatus = 'current';
          } else if (today < startDate) {
            newStatus = 'upcoming';
          } else {
            newStatus = 'completed';
          }

          return { ...trip, status: newStatus };
        })
        .filter(trip => trip.status !== 'completed');
    });
  };

  return {
    trips,
    isLoading,
    addTrip,
    updateTrip,
    deleteTrip,
    updateTripStatuses,
  };
});
